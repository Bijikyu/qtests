// React component for demo frontend with proper API calls to backend.
import React, { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Call existing backend endpoints
const loadData = async () => {
      setLoading(true);
      
      try {
        // Execute all requests independently to prevent cascade failures
        const [healthResult, usersResult, calculationsResult] = await Promise.allSettled([
          fetchHealth(),
          fetchUsers(),
          fetchCalculations()
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
        
        setErrors(newErrors);
      } catch (error) {
        setErrors(prev => ({ ...prev, general: 'Failed to load data' }));
        setHealth(null);
        setUsers([]);
        setCalculations([]);
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
        const { users, ...rest } = prev;
        return rest;
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

  return React.createElement('div', null, 
    React.createElement('h1', null, 'QTests Demo Frontend'),
    React.createElement('div', null, `Loading: ${loading ? 'Yes' : 'No'}`),
    React.createElement('div', null, `Health Status: ${health ? 'OK' : 'Failed'}`),
    React.createElement('div', null, `Users Count: ${users.length}`),
    React.createElement('div', null, `Calculations: ${calculations.length}`),
    Object.keys(errors).length > 0 && React.createElement('div', { style: { color: 'red' } }, 
      'Errors: ' + Object.values(errors).join(', ')
    )
  );
}