// React component for demo frontend with proper API calls to backend.
import React, { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [calculatorHealth, setCalculatorHealth] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState(null);
  const [helloMessage, setHelloMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Call existing backend endpoints
const loadData = async () => {
      setLoading(true);
      
      try {
        // Execute all requests independently to prevent cascade failures
        const [healthResult, usersResult, calculationsResult, historyResult, statusResult, calculatorHealthResult, helloResult] = await Promise.allSettled([
          fetchHealth(),
          fetchUsers(),
          fetchCalculations(),
          fetchHistory(),
          fetchStatus(),
          fetchCalculatorHealth(),
          fetchHello()
        ]);
        
        // Process results and update state accordingly
        const newErrors = {};
        if (healthResult.status === 'rejected') {
          newErrors.health = 'Health check failed';
          setHealth(null);
        }
        if (usersResult.status === 'rejected') {
          newErrors.users = 'Failed to fetch users';
          setUsers([]);
        }
        if (calculationsResult.status === 'rejected') {
          newErrors.calculations = 'Failed to perform calculation';
          setCalculations([]);
        }
        if (historyResult.status === 'rejected') {
          newErrors.history = 'Failed to fetch history';
          setHistory([]);
        }
        if (statusResult.status === 'rejected') {
          newErrors.status = 'Failed to fetch status';
          setStatus(null);
        }
        if (calculatorHealthResult.status === 'rejected') {
          newErrors.calculatorHealth = 'Failed to fetch calculator health';
          setCalculatorHealth(null);
        }
        if (helloResult.status === 'rejected') {
          newErrors.hello = 'Failed to fetch hello message';
          setHelloMessage(null);
        }
        
        setErrors(newErrors);
      } catch (error) {
        setErrors(prev => ({ ...prev, general: 'Failed to load data' }));
        setHealth(null);
        setUsers([]);
        setCalculations([]);
        setHistory([]);
        setStatus(null);
        setCalculatorHealth(null);
        setHelloMessage(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealth(data);
      setErrors(prev => {
        const { health, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(null);
      setErrors(prev => ({ ...prev, health: 'Health check failed' }));
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || data);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.users;
        return newErrors;
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setErrors(prev => ({ ...prev, users: 'Failed to fetch users' }));
      throw error;
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setUsers([...users, data]);
      return data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  };

  const fetchCalculations = async () => {
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'add',
          operands: [5, 3]
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCalculations([data]);
      setErrors(prev => {
        const { calculations, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      console.error('Failed to fetch calculation:', error);
      setCalculations([]);
      setErrors(prev => ({ ...prev, calculations: 'Failed to perform calculation' }));
      throw error;
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHistory(data.history || []);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.history;
        return newErrors;
      });
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setHistory([]);
      setErrors(prev => ({ ...prev, history: 'Failed to fetch history' }));
      throw error;
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus(data);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.status;
        return newErrors;
      });
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setStatus(null);
      setErrors(prev => ({ ...prev, status: 'Failed to fetch status' }));
      throw error;
    }
  };

  const fetchCalculatorHealth = async () => {
    try {
      const response = await fetch('/api/calculator/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCalculatorHealth(data);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.calculatorHealth;
        return newErrors;
      });
    } catch (error) {
      console.error('Failed to fetch calculator health:', error);
      setCalculatorHealth(null);
      setErrors(prev => ({ ...prev, calculatorHealth: 'Failed to fetch calculator health' }));
      throw error;
    }
  };

  const fetchHello = async () => {
    try {
      const response = await fetch('/hello');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHelloMessage(data);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.hello;
        return newErrors;
      });
    } catch (error) {
      console.error('Failed to fetch hello:', error);
      setHelloMessage(null);
      setErrors(prev => ({ ...prev, hello: 'Failed to fetch hello message' }));
      throw error;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      setUsers(users.map(user => user.id === id ? data : user));
      return data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      setUsers(users.filter(user => user.id !== id));
      return data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      setErrors(prev => ({ ...prev, userDelete: 'Failed to delete user' }));
      throw error;
    }
  };

  const performBatchCalculations = async (operations) => {
    try {
      const response = await fetch('/api/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operations }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to perform batch calculations:', error);
      setErrors(prev => ({ ...prev, batch: 'Failed to perform batch calculations' }));
      throw error;
    }
  };

  const updateSettings = async (settings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      setErrors(prev => ({ ...prev, settings: 'Failed to update settings' }));
      throw error;
    }
  };

  return React.createElement('div', null, 
    React.createElement('h1', null, 'QTests Demo Frontend'),
    React.createElement('div', null, `Loading: ${loading ? 'Yes' : 'No'}`),
    React.createElement('div', null, `Health Status: ${health ? 'OK' : 'Failed'}`),
    React.createElement('div', null, `Calculator Health: ${calculatorHealth ? 'OK' : 'Failed'}`),
    React.createElement('div', null, `Users Count: ${users.length}`),
    React.createElement('div', null, `Calculations: ${calculations.length}`),
    React.createElement('div', null, `History Entries: ${history.length}`),
    React.createElement('div', null, `Service Status: ${status ? status.service : 'Unknown'}`),
    React.createElement('div', null, `Hello Message: ${helloMessage ? helloMessage.message : 'No message'}`),
    Object.keys(errors).length > 0 && React.createElement('div', { style: { color: 'red' } }, 
      'Errors: ' + Object.values(errors).join(', ')
    )
  );
}