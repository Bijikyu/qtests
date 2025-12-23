// React component for demo frontend with proper API calls to backend.
import React, { useState, useEffect } from 'react';

export default function App() {
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [calculations, setCalculations] = useState([]);

  useEffect(() => {
    // Call existing backend endpoints
    fetchHealth();
    fetchUsers();
    fetchCalculations();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch('/users', {
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
      const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'add',
          operands: [5, 3]
        }),
      });
      const data = await response.json();
      setCalculations([data]);
    } catch (error) {
      console.error('Failed to fetch calculation:', error);
    }
  };

  return React.createElement('div', null, 
    React.createElement('h1', null, 'QTests Demo Frontend'),
    React.createElement('div', null, `Health Status: ${health ? 'OK' : 'Checking...'}`),
    React.createElement('div', null, `Users Count: ${users.length}`),
    React.createElement('div', null, `Calculations: ${calculations.length}`)
  );
}