// concurrency-testing.test.js
// Advanced concurrency and race condition testing with sophisticated scenarios

import assert from 'assert'
import sinon from 'sinon'

// Advanced concurrency classes for testing
class ConcurrentBank {
  constructor() {
    this.accounts = new Map()
    this.transactionLog = []
    this.locks = new Map()
  }

  async transfer(fromId, toId, amount) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
    
    // Acquire locks in consistent order to prevent deadlock
    const lockId = [Math.min(fromId, toId), Math.max(fromId, toId)].join('-')
    while (this.locks.has(lockId)) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    this.locks.set(lockId, true)

    try {
      const fromAccount = this.accounts.get(fromId) || { balance: 0 }
      const toAccount = this.accounts.get(toId) || { balance: 0 }

      if (fromAccount.balance < amount) {
        throw new Error(`Insufficient funds in account ${fromId}`)
      }

      // Update balances
      fromAccount.balance -= amount
      toAccount.balance += amount

      this.accounts.set(fromId, { ...fromAccount })
      this.accounts.set(toId, { ...toAccount })

      const transaction = {
        id: Math.random().toString(36).substr(2, 9),
        fromId,
        toId,
        amount,
        timestamp: Date.now(),
        type: 'transfer'
      }

      this.transactionLog.push(transaction)
      return transaction

    } finally {
      // Release lock
      this.locks.delete(lockId)
    }
  }

  async deposit(accountId, amount) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 30))
    
    const account = this.accounts.get(accountId) || { balance: 0 }
    account.balance += amount
    this.accounts.set(accountId, account)

    const transaction = {
      id: Math.random().toString(36).substr(2, 9),
      accountId,
      amount,
      timestamp: Date.now(),
      type: 'deposit'
    }

    this.transactionLog.push(transaction)
    return transaction
  }

  getBalance(accountId) {
    return this.accounts.get(accountId)?.balance || 0
  }

  getTransactions(accountId) {
    return this.transactionLog.filter(tx => 
      tx.fromId === accountId || tx.toId === accountId || tx.accountId === accountId
    )
  }
}

class TicketingSystem {
  constructor(totalTickets = 100) {
    this.availableTickets = totalTickets
    this.reservations = new Map()
    this.sales = []
    this.lockHeld = false
  }

  async reserveTicket(userId, ticketId) {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    
    // Critical section - avoid race condition
    while (this.lockHeld) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    this.lockHeld = true

    try {
      if (this.availableTickets <= 0) {
        throw new Error('No tickets available')
      }

      if (this.reservations.has(ticketId)) {
        throw new Error(`Ticket ${ticketId} already reserved`)
      }

      this.availableTickets--
      this.reservations.set(ticketId, {
        userId,
        ticketId,
        timestamp: Date.now(),
        status: 'reserved'
      })

      return {
        success: true,
        ticketId,
        reservationId: Math.random().toString(36).substr(2, 9)
      }
    } finally {
      this.lockHeld = false
    }
  }

  async confirmPurchase(reservationId, paymentDetails) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 80))
    
    // Find reservation
    let reservation = null
    for (const [ticketId, res] of this.reservations) {
      if (res.reservationId === reservationId) {
        reservation = res
        break
      }
    }

    if (!reservation) {
      throw new Error('Reservation not found')
    }

    // Simulate payment processing
    if (Math.random() < 0.1) { // 10% failure rate
      throw new Error('Payment failed')
    }

    // Confirm sale
    reservation.status = 'sold'
    reservation.paidAt = Date.now()
    reservation.paymentDetails = paymentDetails

    this.sales.push({
      ...reservation,
      saleId: Math.random().toString(36).substr(2, 9)
    })

    return {
      success: true,
      saleId: reservation.saleId,
      ticketId: reservation.ticketId
    }
  }

  getAvailableCount() {
    return this.availableTickets
  }

  getReservations(userId) {
    return Array.from(this.reservations.values()).filter(res => res.userId === userId)
  }
}

class MessageQueue {
  constructor() {
    this.messages = []
    this.subscribers = new Map()
    this.processing = false
  }

  async publish(topic, message) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20))
    
    const envelope = {
      id: Math.random().toString(36).substr(2, 9),
      topic,
      message,
      timestamp: Date.now(),
      delivered: false
    }

    this.messages.push(envelope)

    // Notify subscribers
    const topicSubscribers = this.subscribers.get(topic) || []
    const notifications = topicSubscribers.map(async subscriber => {
      try {
        await subscriber(envelope)
        return { subscriber, success: true }
      } catch (error) {
        return { subscriber, success: false, error: error.message }
      }
    })

    const results = await Promise.allSettled(notifications)
    return {
      messageId: envelope.id,
      deliveredTo: results.filter(r => r.value?.success).length,
      failedTo: results.filter(r => r.value?.success === false).length
    }
  }

  subscribe(topic, callback) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, [])
    }
    this.subscribers.get(topic).push(callback)
  }

  async processMessages() {
    if (this.processing) {
      throw new Error('Already processing messages')
    }

    this.processing = true
    const processedMessages = []

    try {
      while (this.messages.length > 0) {
        const message = this.messages.shift()
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, Math.random() * 30))
        
        message.delivered = true
        message.processedAt = Date.now()
        processedMessages.push(message)
      }
    } finally {
      this.processing = false
    }

    return processedMessages
  }

  getMessageCount() {
    return this.messages.length
  }

  getSubscriberCount(topic) {
    return this.subscribers.get(topic)?.length || 0
  }
}

class DistributedCache {
  constructor(nodes = 3) {
    this.nodes = Array.from({ length: nodes }, (_, i) => ({
      id: i + 1,
      data: new Map(),
      lastSync: Date.now()
    }))
    this.currentNode = 0
    this.syncInProgress = new Map()
  }

  async get(key) {
    const node = this.nodes[this.currentNode]
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
    
    // Simulate cache miss rate
    if (Math.random() < 0.3) { // 30% miss rate
      return null
    }

    return node.data.get(key)
  }

  async set(key, value, ttlMs = 300000) {
    const node = this.nodes[this.currentNode]
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 40))
    
    node.data.set(key, {
      value,
      timestamp: Date.now(),
      ttl: Date.now() + ttlMs
    })

    // Trigger async sync to other nodes
    this.syncToNodes(key, value, ttlMs)
    
    return true
  }

  async syncToNodes(key, value, ttlMs) {
    const syncId = Math.random().toString(36).substr(2, 9)
    this.syncInProgress.set(syncId, true)

    // Simulate async synchronization
    setTimeout(() => {
      this.nodes.forEach((node, index) => {
        if (index !== this.currentNode) {
          node.data.set(key, {
            value,
            timestamp: Date.now(),
            ttl: Date.now() + ttlMs
          })
          node.lastSync = Date.now()
        }
      })
      this.syncInProgress.delete(syncId)
    }, Math.random() * 200)

    return syncId
  }

  async invalidate(key) {
    const promises = this.nodes.map(async (node) => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 30))
      node.data.delete(key)
      node.lastSync = Date.now()
    })

    await Promise.all(promises)
    return true
  }

  getConsistencyStats() {
    const allKeys = new Set()
    this.nodes.forEach(node => {
      node.data.forEach((_, key) => allKeys.add(key))
    })

    const consistency = {}
    allKeys.forEach(key => {
      const values = this.nodes.map(node => node.data.get(key))
      const uniqueValues = new Set(values.map(v => v?.value))
      consistency[key] = {
        totalNodes: this.nodes.length,
        nodesWithKey: values.filter(v => v).length,
        uniqueValues: uniqueValues.size,
        isConsistent: uniqueValues.size === 1
      }
    })

    return consistency
  }
}

// Advanced concurrency test suite
async function runConcurrencyTests() {
  console.log('Running advanced concurrency and race condition tests...\n')

  // Test 1: Bank transfer race conditions
  console.log('🏦 Test 1: Concurrent bank transfers')
  
  const bank = new ConcurrentBank()
  
  // Setup accounts
  bank.accounts.set('account1', { balance: 1000 })
  bank.accounts.set('account2', { balance: 500 })
  
  // Simulate concurrent transfers that could cause race conditions
  const transfers = [
    bank.transfer('account1', 'account2', 100),
    bank.transfer('account1', 'account2', 150),
    bank.transfer('account2', 'account1', 50),
    bank.transfer('account1', 'account2', 200)
  ]

  const transferResults = await Promise.allSettled(transfers)
  
  const successfulTransfers = transferResults.filter(r => r.status === 'fulfilled')
  const failedTransfers = transferResults.filter(r => r.status === 'rejected')
  
  console.log(`Successful transfers: ${successfulTransfers.length}`)
  console.log(`Failed transfers: ${failedTransfers.length}`)
  
  // Verify final balances
  const finalBalance1 = bank.getBalance('account1')
  const finalBalance2 = bank.getBalance('account2')
  const expectedBalance1 = 1000 - 100 - 150 - 200 + 50 // 600
  const expectedBalance2 = 500 + 100 + 150 + 200 - 50 // 900
  
  assert.strictEqual(finalBalance1, expectedBalance1, 'Account 1 balance should be correct')
  assert.strictEqual(finalBalance2, expectedBalance2, 'Account 2 balance should be correct')
  
  // Verify transaction log
  const allTransactions = bank.transactionLog
  assert.strictEqual(allTransactions.length, successfulTransfers.length, 'All successful transactions should be logged')
  
  console.log('✅ Bank transfer race condition test passed\n')

  // Test 2: Ticketing system concurrency
  console.log('🎫 Test 2: Ticketing system under load')
  
  const ticketSystem = new TicketingSystem(10) // Only 10 tickets available
  
  // Simulate many users trying to reserve tickets
  const reservationAttempts = Array.from({ length: 20 }, (_, i) => 
    ticketSystem.reserveTicket(`user-${i + 1}`, i + 1)
  )

  const reservationResults = await Promise.allSettled(reservationAttempts)
  
  const successfulReservations = reservationResults.filter(r => 
    r.status === 'fulfilled' && r.value?.success
  )
  const failedReservations = reservationResults.filter(r => 
    r.status === 'rejected' || (r.status === 'fulfilled' && !r.value?.success)
  )
  
  console.log(`Successful reservations: ${successfulReservations.length}`)
  console.log(`Failed reservations: ${failedReservations.length}`)
  console.log(`Available tickets: ${ticketSystem.getAvailableCount()}`)
  
  assert.strictEqual(successfulReservations.length, 10, 'Only 10 reservations should succeed')
  assert.strictEqual(ticketSystem.getAvailableCount(), 0, 'No tickets should be available')
  assert(failedReservations.length >= 10, 'At least 10 reservations should fail')
  
  console.log('✅ Ticketing system concurrency test passed\n')

  // Test 3: Message queue processing
  console.log('📨 Test 3: Concurrent message queue operations')
  
  const messageQueue = new MessageQueue()
  
  // Subscribe to topics
  const messagesReceived = {
    'topic1': [],
    'topic2': []
  }
  
  messageQueue.subscribe('topic1', (envelope) => {
    messagesReceived.topic1.push(envelope)
  })
  
  messageQueue.subscribe('topic2', (envelope) => {
    messagesReceived.topic2.push(envelope)
  })
  
  // Publish messages concurrently
  const publishPromises = [
    messageQueue.publish('topic1', { type: 'notification', content: 'Message 1' }),
    messageQueue.publish('topic1', { type: 'alert', content: 'Message 2' }),
    messageQueue.publish('topic2', { type: 'update', content: 'Message 3' }),
    messageQueue.publish('topic2', { type: 'info', content: 'Message 4' }),
    messageQueue.publish('topic1', { type: 'warning', content: 'Message 5' })
  ]

  const publishResults = await Promise.allSettled(publishPromises)
  const successfulPublishes = publishResults.filter(r => r.status === 'fulfilled')
  
  console.log(`Published messages: ${messageQueue.getMessageCount()}`)
  console.log(`Successful publishes: ${successfulPublishes.length}`)
  
  // Process messages
  const processedMessages = await messageQueue.processMessages()
  
  assert.strictEqual(processedMessages.length, 5, 'All messages should be processed')
  assert.strictEqual(messagesReceived.topic1.length, 3, 'Topic 1 should receive 3 messages')
  assert.strictEqual(messagesReceived.topic2.length, 2, 'Topic 2 should receive 2 messages')
  assert.strictEqual(messageQueue.getMessageCount(), 0, 'Queue should be empty after processing')
  
  console.log('✅ Message queue concurrency test passed\n')

  // Test 4: Distributed cache consistency
  console.log('💾 Test 4: Distributed cache consistency')
  
  const cache = new DistributedCache(3)
  
  // Set values from different "current nodes"
  cache.currentNode = 0
  await cache.set('key1', 'value1')
  
  cache.currentNode = 1
  await cache.set('key2', 'value2')
  
  cache.currentNode = 2
  await cache.set('key3', 'value3')
  
  // Wait for sync operations
  await new Promise(resolve => setTimeout(resolve, 250))
  
  // Verify consistency
  const stats = cache.getConsistencyStats()
  const consistentKeys = Object.values(stats).filter(s => s.isConsistent).length
  const totalKeys = Object.keys(stats).length
  
  console.log(`Consistent keys: ${consistentKeys}/${totalKeys}`)
  
  // Test concurrent writes
  cache.currentNode = 0
  const writePromises = [
    cache.set('shared1', 'node1-value'),
    cache.set('shared2', 'node1-value-2'),
    cache.set('shared3', 'node1-value-3')
  ]
  
  cache.currentNode = 1
  const writePromises2 = [
    cache.set('shared1', 'node2-value'),
    cache.set('shared2', 'node2-value-2'),
    cache.set('shared3', 'node2-value-3')
  ]
  
  await Promise.all([...writePromises, ...writePromises2])
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const finalStats = cache.getConsistencyStats()
  const inconsistencies = Object.values(finalStats).filter(s => !s.isConsistent)
  
  console.log(`Final consistent keys: ${totalKeys - inconsistencies.length}/${totalKeys}`)
  assert(inconsistencies.length > 0, 'Should detect inconsistencies from concurrent writes')
  
  console.log('✅ Distributed cache consistency test passed\n')

  // Test 5: Deadlock prevention
  console.log('🔒 Test 5: Deadlock prevention in transfers')
  
  const deadlockBank = new ConcurrentBank()
  
  // Setup accounts
  await deadlockBank.deposit('accountA', 500)
  await deadlockBank.deposit('accountB', 300)
  await deadlockBank.deposit('accountC', 200)
  
  // Simulate potential deadlock scenario
  const deadlockTransfers = [
    deadlockBank.transfer('accountA', 'accountB', 100), // A -> B
    deadlockBank.transfer('accountB', 'accountC', 50),  // B -> C
    deadlockBank.transfer('accountC', 'accountA', 25)   // C -> A
  ]
  
  const deadlockResults = await Promise.allSettled(deadlockTransfers)
  const successfulDeadlockTransfers = deadlockResults.filter(r => r.status === 'fulfilled')
  
  console.log(`Deadlock test transfers: ${successfulDeadlockTransfers.length}/3`)
  
  // Should complete all transfers without deadlock
  assert.strictEqual(successfulDeadlockTransfers.length, 3, 'All transfers should complete without deadlock')
  
  const finalA = deadlockBank.getBalance('accountA')
  const finalB = deadlockBank.getBalance('accountB')
  const finalC = deadlockBank.getBalance('accountC')
  
  const expectedA = 500 - 100 + 25 // 425
  const expectedB = 300 - 50 + 100 // 350
  const expectedC = 200 - 25 + 50 // 225
  
  assert.strictEqual(finalA, expectedA, 'Account A final balance should be correct')
  assert.strictEqual(finalB, expectedB, 'Account B final balance should be correct')
  assert.strictEqual(finalC, expectedC, 'Account C final balance should be correct')
  
  console.log('✅ Deadlock prevention test passed\n')

  // Test 6: Performance under concurrency
  console.log('⚡ Test 6: Performance measurement under concurrency')
  
  const perfBank = new ConcurrentBank()
  
  // Setup performance test
  await perfBank.deposit('perf-account', 10000)
  
  const concurrentOperations = Array.from({ length: 100 }, (_, i) => 
    perfBank.transfer('perf-account', 'target-account', 10 + i)
  )

  const startTime = Date.now()
  const concurrentResults = await Promise.allSettled(concurrentOperations)
  const endTime = Date.now()
  
  const successfulOps = concurrentResults.filter(r => r.status === 'fulfilled').length
  const failedOps = concurrentResults.filter(r => r.status === 'rejected').length
  const totalTime = endTime - startTime
  const avgTimePerOp = totalTime / concurrentOperations.length
  
  console.log(`Concurrent operations: ${concurrentOperations.length}`)
  console.log(`Successful: ${successfulOps}, Failed: ${failedOps}`)
  console.log(`Total time: ${totalTime}ms`)
  console.log(`Average time per operation: ${avgTimePerOp.toFixed(2)}ms`)
  
  assert.strictEqual(successfulOps, 100, 'All operations should succeed')
  assert(totalTime < 10000, 'Should complete within reasonable time')
  assert(avgTimePerOp < 100, 'Average time per operation should be reasonable')
  
  console.log('✅ Performance under concurrency test passed\n')

  console.log('🎉 All concurrency and race condition tests passed!')
  console.log('Concurrency scenarios tested: 6')
  
  return true
}

// Export for use in other test files
export {
  runConcurrencyTests,
  ConcurrentBank,
  TicketingSystem,
  MessageQueue,
  DistributedCache
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runConcurrencyTests().catch(console.error)
}