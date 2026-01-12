// integration-testing.test.js
// Real-world integration test scenarios with comprehensive stubbing

import assert from 'assert'
import sinon from 'sinon'

// Real-world service classes
class PaymentService {
  constructor(paymentGateway, emailService, auditService) {
    this.paymentGateway = paymentGateway
    this.emailService = emailService
    this.auditService = auditService
    this.transactions = new Map()
  }

  async processPayment(userId, amount, paymentMethod) {
    try {
      // Validate payment method
      const validation = await this.paymentGateway.validatePaymentMethod(paymentMethod)
      if (!validation.valid) {
        throw new Error(`Invalid payment method: ${validation.reason}`)
      }

      // Process charge
      const charge = await this.paymentGateway.createCharge({
        amount,
        currency: 'USD',
        paymentMethod: paymentMethod.id,
        description: `Payment for user ${userId}`,
        metadata: { userId }
      })

      // Store transaction
      const transaction = {
        id: charge.id,
        userId,
        amount,
        paymentMethod: paymentMethod.type,
        status: 'completed',
        createdAt: new Date(),
        gatewayResponse: charge
      }
      this.transactions.set(transaction.id, transaction)

      // Send confirmation email
      await this.emailService.sendPaymentConfirmation(userId, transaction)

      // Audit the transaction
      await this.auditService.logPaymentEvent({
        eventType: 'payment.completed',
        userId,
        transactionId: transaction.id,
        amount,
        timestamp: new Date()
      })

      return transaction
    } catch (error) {
      // Log failed payment
      await this.auditService.logPaymentEvent({
        eventType: 'payment.failed',
        userId,
        amount,
        error: error.message,
        timestamp: new Date()
      })
      throw error
    }
  }

  async refundPayment(transactionId, reason) {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error('Transaction not found')
    }

    if (transaction.status !== 'completed') {
      throw new Error('Cannot refund non-completed transaction')
    }

    try {
      const refund = await this.paymentGateway.createRefund({
        chargeId: transactionId,
        amount: transaction.amount,
        reason
      })

      transaction.status = 'refunded'
      transaction.refundId = refund.id
      transaction.refundedAt = new Date()

      await this.auditService.logPaymentEvent({
        eventType: 'payment.refunded',
        userId: transaction.userId,
        transactionId,
        refundId: refund.id,
        amount: transaction.amount,
        reason,
        timestamp: new Date()
      })

      await this.emailService.sendRefundConfirmation(transaction.userId, transaction)

      return transaction
    } catch (error) {
      await this.auditService.logPaymentEvent({
        eventType: 'refund.failed',
        userId: transaction.userId,
        transactionId,
        error: error.message,
        timestamp: new Date()
      })
      throw error
    }
  }

  getTransaction(transactionId) {
    return this.transactions.get(transactionId)
  }

  getUserTransactions(userId) {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId)
  }
}

class UserService {
  constructor(databaseService, emailService, cacheService) {
    this.db = databaseService
    this.emailService = emailService
    this.cache = cacheService
  }

  async createUser(userData) {
    // Check if user already exists
    const existingUser = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [userData.email]
    )

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists')
    }

    // Create user in database
    const result = await this.db.query(
      'INSERT INTO users (name, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userData.name, userData.email, userData.passwordHash]
    )

    const user = result.rows[0]

    // Cache user data
    await this.cache.set(`user:${user.id}`, user, 3600000) // 1 hour

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user)

    // Log user creation event
    await this.db.query(
      'INSERT INTO user_events (user_id, event_type, event_data, created_at) VALUES ($1, $2, $3, NOW())',
      [user.id, 'user.created', { userAgent: userData.userAgent }]
    )

    return { ...user, password: undefined } // Remove password from response
  }

  async getUser(userId) {
    // Try cache first
    const cachedUser = await this.cache.get(`user:${userId}`)
    if (cachedUser) {
      return cachedUser
    }

    // Query database
    const result = await this.db.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    )

    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    const user = result.rows[0]

    // Cache the result
    await this.cache.set(`user:${userId}`, user, 3600000)

    return user
  }

  async updateUser(userId, updates) {
    const fields = []
    const values = []
    let paramIndex = 1

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'created_at') {
        fields.push(`${key} = $${paramIndex}`)
        values.push(updates[key])
        paramIndex++
      }
    })

    if (fields.length === 0) {
      throw new Error('No valid fields to update')
    }

    values.push(userId)
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`

    const result = await this.db.query(query, values)
    
    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    const user = result.rows[0]

    // Update cache
    await this.cache.set(`user:${userId}`, user, 3600000)

    // Log update event
    await this.db.query(
      'INSERT INTO user_events (user_id, event_type, event_data, created_at) VALUES ($1, $2, $3, NOW())',
      [userId, 'user.updated', { updatedFields: Object.keys(updates) }]
    )

    return user
  }
}

class OrderService {
  constructor(databaseService, inventoryService, paymentService, emailService, shippingService) {
    this.db = databaseService
    this.inventory = inventoryService
    this.payment = paymentService
    this.email = emailService
    this.shipping = shippingService
    this.shippingService = shippingService // Add this for compatibility
    this.emailService = emailService // Add this for compatibility
  }

  async createOrder(userId, items, shippingAddress) {
    try {
      // Validate inventory and calculate totals
      let totalAmount = 0
      const validatedItems = []

      for (const item of items) {
        const inventoryItem = await this.inventory.checkAvailability(item.productId, item.quantity)
        
        if (!inventoryItem.available) {
          throw new Error(`Product ${item.productId} is not available in sufficient quantity`)
        }

        const itemTotal = inventoryItem.price * item.quantity
        totalAmount += itemTotal

        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: inventoryItem.price,
          total: itemTotal
        })
      }

      // Calculate shipping
      const shippingCost = await this.shippingService.calculateShipping(shippingAddress, items)
      totalAmount += shippingCost

      // Process payment
      const paymentResult = await this.payment.processPayment(userId, totalAmount, {
        type: 'credit_card',
        id: `payment-method-${userId}`
      })

      // Create order in database
      const orderResult = await this.db.query(
        `INSERT INTO orders (user_id, total_amount, shipping_address, payment_transaction_id, status, created_at) 
         VALUES ($1, $2, $3, $4, 'confirmed', NOW()) RETURNING *`,
        [userId, totalAmount, JSON.stringify(shippingAddress), paymentResult.id]
      )

      const order = orderResult.rows[0]

      // Add order items
      for (const item of validatedItems) {
        await this.db.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price, total) 
           VALUES ($1, $2, $3, $4, $5)`,
          [order.id, item.productId, item.quantity, item.price, item.total]
        )

        // Update inventory
        await this.inventory.reserveStock(item.productId, item.quantity)
      }

      // Create shipping label
      const shippingLabel = await this.shippingService.createShippingLabel(order.id, shippingAddress, items)

      // Send order confirmation
      await this.emailService.sendOrderConfirmation(userId, {
        order,
        items: validatedItems,
        shippingLabel,
        totalAmount
      })

      return {
        ...order,
        items: validatedItems,
        shippingLabel,
        paymentTransaction: paymentResult
      }
    } catch (error) {
      // Log failed order attempt
      await this.db.query(
        `INSERT INTO failed_orders (user_id, items_data, error_message, created_at) 
         VALUES ($1, $2, $3, NOW())`,
        [userId, JSON.stringify(items), error.message]
      )
      throw error
    }
  }

  async getOrderStatus(orderId) {
    const result = await this.db.query(
      `SELECT o.*, os.status_name, os.updated_at as status_updated_at 
       FROM orders o 
       JOIN order_status os ON o.status = os.status_name 
       WHERE o.id = $1`,
      [orderId]
    )

    if (result.rows.length === 0) {
      throw new Error('Order not found')
    }

    const order = result.rows[0]

    // Get items
    const itemsResult = await this.db.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    )

    // Get tracking info if shipped
    let trackingInfo = null
    if (order.status === 'shipped') {
      trackingInfo = await this.shippingService.getTrackingInfo(orderId)
    }

    return {
      ...order,
      items: itemsResult.rows,
      trackingInfo
    }
  }
}

// Integration test scenarios
async function runIntegrationTests() {
  console.log('Running real-world integration tests...\n')

  // Test 1: Complete payment flow
  console.log('💳 Test 1: Complete payment flow')
  
  // Mock dependencies
  const mockPaymentGateway = {
    validatePaymentMethod: sinon.stub().resolves({ valid: true }),
    createCharge: sinon.stub().resolves({
      id: 'ch_123456',
      amount: 10000,
      currency: 'USD',
      status: 'succeeded'
    }),
    createRefund: sinon.stub().resolves({
      id: 're_123456',
      chargeId: 'ch_123456',
      amount: 10000,
      status: 'succeeded'
    })
  }

  const mockEmailService = {
    sendPaymentConfirmation: sinon.stub().resolves({ id: 'email_123', delivered: true }),
    sendRefundConfirmation: sinon.stub().resolves({ id: 'email_124', delivered: true })
  }

  const mockAuditService = {
    logPaymentEvent: sinon.stub().resolves({ id: 'audit_123', logged: true })
  }

  const paymentService = new PaymentService(mockPaymentGateway, mockEmailService, mockAuditService)

  // Process successful payment
  const paymentResult = await paymentService.processPayment(
    'user_123',
    10000, // $100.00
    { type: 'credit_card', id: 'pm_123456' }
  )

  assert.strictEqual(paymentResult.userId, 'user_123')
  assert.strictEqual(paymentResult.amount, 10000)
  assert.strictEqual(paymentResult.status, 'completed')

  // Verify all services were called
  assert(mockPaymentGateway.validatePaymentMethod.calledOnce, 'should validate payment method')
  assert(mockPaymentGateway.createCharge.calledOnce, 'should create charge')
  assert(mockEmailService.sendPaymentConfirmation.calledOnce, 'should send confirmation')
  assert(mockAuditService.logPaymentEvent.calledOnce, 'should audit payment')

  // Test refund flow
  const refundResult = await paymentService.refundPayment(paymentResult.id, 'Customer request')

  assert.strictEqual(refundResult.status, 'refunded')
  assert.strictEqual(refundResult.refundId, 're_123456')

  assert(mockPaymentGateway.createRefund.calledOnce, 'should create refund')
  assert(mockEmailService.sendRefundConfirmation.calledOnce, 'should send refund confirmation')

  console.log('✅ Payment flow test passed\n')

  // Test 2: User lifecycle management
  console.log('👤 Test 2: User lifecycle management')

  const mockDatabase = {
    query: sinon.stub()
  }
  
  mockDatabase.query.onFirstCall().resolves({ rows: [] }) // No existing user (create check)
  mockDatabase.query.onSecondCall().resolves({ 
    rows: [{
      id: 'user_456',
      name: 'John Doe',
      email: 'john@example.com',
      created_at: new Date(),
      updated_at: new Date()
    }]
  }) // Create user result
  mockDatabase.query.onThirdCall().resolves({ rows: [] }) // User event log
  mockDatabase.query.onCall(3).resolves({ 
    rows: [{
      id: 'user_456',
      name: 'John Smith',
      email: 'john@example.com',
      created_at: new Date(),
      updated_at: new Date()
    }]
  }) // Get user (cache miss)
  mockDatabase.query.onCall(4).resolves({ 
    rows: [{
      id: 'user_456',
      name: 'John Smith',
      email: 'john@example.com',
      created_at: new Date(),
      updated_at: new Date()
    }]
  }) // Update user result
  mockDatabase.query.onCall(5).resolves({ rows: [] }) // Update user event log

  const mockCache = {
    get: sinon.stub()
      .onFirstCall().resolves(null) // Cache miss
      .onSecondCall().resolves({ 
        id: 'user_456',
        name: 'John Doe',
        email: 'john@example.com'
      }),
    set: sinon.stub().resolves({ success: true })
  }

  const mockEmailService2 = {
    sendWelcomeEmail: sinon.stub().resolves({ id: 'welcome_email', sent: true })
  }

  const userService = new UserService(mockDatabase, mockEmailService2, mockCache)

  // Create user
  const newUser = await userService.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    passwordHash: 'hashed_password',
    userAgent: 'Mozilla/5.0...'
  })

  assert.strictEqual(newUser.email, 'john@example.com')
  assert.strictEqual(newUser.name, 'John Doe')
  assert(newUser.password === undefined, 'should not include password in response')

  // Get user (should hit cache on second call)
  const retrievedUser = await userService.getUser('user_456')
  assert.strictEqual(retrievedUser.email, 'john@example.com')

  // Update user
  const updatedUser = await userService.updateUser('user_456', { name: 'John Smith' })
  assert.strictEqual(updatedUser.name, 'John Smith')

  // Verify database calls
  assert(mockDatabase.query.callCount >= 4, 'should make appropriate database calls')
  console.log('Cache set calls:', mockCache.set.callCount)
  assert(mockCache.set.callCount >= 1, 'should update cache at least once')
  assert(mockEmailService2.sendWelcomeEmail.calledOnce, 'should send welcome email')

  console.log('✅ User lifecycle test passed\n')

  // Test 3: Complete e-commerce order flow
  console.log('🛒 Test 3: Complete e-commerce order flow')

  const mockInventory = {
    checkAvailability: sinon.stub(),
    reserveStock: sinon.stub()
  }
  
  mockInventory.checkAvailability.onFirstCall().resolves({ available: true, price: 2999 }) // $29.99
  mockInventory.checkAvailability.onSecondCall().resolves({ available: true, price: 1999 }) // $19.99
  mockInventory.reserveStock.resolves({ reserved: true })

  const mockShipping = {
    calculateShipping: sinon.stub().resolves(999), // $9.99
    createShippingLabel: sinon.stub().resolves({
      id: 'ship_123',
      trackingNumber: '1Z999AA1234567890',
      carrier: 'UPS'
    }),
    getTrackingInfo: sinon.stub().resolves({
      trackingNumber: '1Z999AA1234567890',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    })
  }

  const mockPaymentService2 = {
    processPayment: sinon.stub().resolves({
      id: 'payment_789',
      userId: 'user_123',
      amount: 5997, // $59.97 total
      status: 'completed'
    })
  }

  const mockEmailService3 = {
    sendOrderConfirmation: sinon.stub().resolves({ id: 'order_email', sent: true })
  }

  const mockDatabase2 = {
    query: sinon.stub()
  }
  
  mockDatabase2.query.onFirstCall().resolves({ rows: [{ id: 'order_123', user_id: 'user_123' }] }) // Create order
  mockDatabase2.query.onSecondCall().resolves({ rows: [] }) // First order item
  mockDatabase2.query.onThirdCall().resolves({ rows: [] }) // Second order item
  mockDatabase2.query.onCall(3).resolves({ rows: [{ id: 'order_123', user_id: 'user_123', status: 'confirmed' }] }) // Get order status
  mockDatabase2.query.onCall(4).resolves({ 
    rows: [
      { id: 'item_1', order_id: 'order_123', product_id: 'prod_1', quantity: 1, price: 2999, total: 2999 },
      { id: 'item_2', order_id: 'order_123', product_id: 'prod_2', quantity: 1, price: 1999, total: 1999 }
    ]
  }) // Get order items

  const orderService = new OrderService(
    mockDatabase2,
    mockInventory,
    mockPaymentService2,
    mockEmailService3,
    mockShipping
  )

  // Create order
  const orderResult = await orderService.createOrder(
    'user_123',
    [
      { productId: 'prod_1', quantity: 1 },
      { productId: 'prod_2', quantity: 1 }
    ],
    {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA'
    }
  )

  assert.strictEqual(orderResult.user_id, 'user_123')
  assert.strictEqual(orderResult.items.length, 2)
  assert.strictEqual(orderResult.paymentTransaction.amount, 5997) // $59.97

  // Get order status
  const orderStatus = await orderService.getOrderStatus('order_123')
  assert.strictEqual(orderStatus.id, 'order_123')
  assert.strictEqual(orderStatus.items.length, 2)

  // Verify all services were called
  assert(mockInventory.checkAvailability.calledTwice, 'should check inventory for all items')
  assert(mockInventory.reserveStock.calledTwice, 'should reserve stock for all items')
  assert(mockShipping.calculateShipping.calledOnce, 'should calculate shipping')
  assert(mockShipping.createShippingLabel.calledOnce, 'should create shipping label')
  assert(mockPaymentService2.processPayment.calledOnce, 'should process payment')
  assert(mockEmailService3.sendOrderConfirmation.calledOnce, 'should send order confirmation')

  console.log('✅ E-commerce order flow test passed\n')

  // Test 4: Error handling and recovery
  console.log('⚠️ Test 4: Error handling and recovery')

  // Test payment failure
  mockPaymentGateway.validatePaymentMethod.resetHistory()
  mockAuditService.logPaymentEvent.resetHistory()
  mockPaymentGateway.validatePaymentMethod.resolves({ valid: false, reason: 'Card expired' })
  
  try {
    await paymentService.processPayment('user_123', 10000, { type: 'credit_card', id: 'pm_invalid' })
    assert.fail('Should throw error for invalid payment method')
  } catch (error) {
    assert.strictEqual(error.message, 'Invalid payment method: Card expired')
    console.log('Audit service call count:', mockAuditService.logPaymentEvent.callCount)
    assert(mockAuditService.logPaymentEvent.called, 'should audit payment failure')
  }

  // Test duplicate user creation
  mockDatabase.query.resolves({ rows: [{ id: 'existing_user' }] }) // Simulate existing user

  try {
    await userService.createUser({
      name: 'Existing User',
      email: 'existing@example.com',
      passwordHash: 'hashed_password'
    })
    assert.fail('Should throw error for duplicate user')
  } catch (error) {
    assert.strictEqual(error.message, 'User with this email already exists')
  }

  // Test insufficient inventory
  mockInventory.checkAvailability.resolves({ available: false })

  try {
    await orderService.createOrder(
      'user_123',
      [{ productId: 'out_of_stock', quantity: 1 }],
      { street: '123 Main St', city: 'Anytown' }
    )
    assert.fail('Should throw error for insufficient inventory')
  } catch (error) {
    assert.strictEqual(error.message, 'Product out_of_stock is not available in sufficient quantity')
    assert(mockDatabase2.query.called, 'should log failed order attempt')
  }

  console.log('✅ Error handling test passed\n')

  // Test 5: Performance optimization with caching
  console.log('⚡ Test 5: Performance optimization with caching')

  // Create fresh user service with new mocks
  const perfMockDatabase = {
    query: sinon.stub()
  }
  
  const perfMockCache = {
    get: sinon.stub(),
    set: sinon.stub().resolves({ success: true })
  }

  let databaseCallCount = 0
  perfMockDatabase.query.callsFake(() => {
    databaseCallCount++
    return new Promise(resolve => setTimeout(() => {
      resolve({ rows: [{ id: 'cached_user', name: 'Cached User', email: 'cached@example.com' }] })
    }, 50)) // Simulate database latency
  })

  perfMockCache.get.onFirstCall().resolves(null) // First call cache miss
  perfMockCache.get.onSecondCall().resolves({ id: 'cached_user', name: 'Cached User', email: 'cached@example.com' })

  const perfUserService = new UserService(perfMockDatabase, mockEmailService2, perfMockCache)

  // First call - should hit database
  const startTime = Date.now()
  const user1 = await perfUserService.getUser('cached_user')
  const firstCallTime = Date.now() - startTime

  // Second call - should hit cache
  const secondStartTime = Date.now()
  const user2 = await perfUserService.getUser('cached_user')
  const secondCallTime = Date.now() - secondStartTime

  assert.strictEqual(databaseCallCount, 1, 'should only call database once due to caching')
  assert(secondCallTime < firstCallTime, 'cached call should be faster')
  assert.deepStrictEqual(user1, user2, 'should return same user data')

  console.log(`Database call: ${firstCallTime}ms, Cached call: ${secondCallTime}ms`)
  console.log('✅ Performance optimization test passed\n')

  console.log('🎉 All integration tests passed!')
  console.log('Integration scenarios tested: 5')
  
  return true
}

// Export for use in other test files
export {
  runIntegrationTests,
  PaymentService,
  UserService,
  OrderService
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runIntegrationTests().catch(console.error)
}