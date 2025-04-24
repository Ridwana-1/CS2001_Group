import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard'; // Make sure path is correct

const App = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [swipes, setSwipes] = useState([]);

  // Fetching data when component mounts
  useEffect(() => {
    fetch('http://localhost:3001/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));

    fetch('http://localhost:3001/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));

    fetch('http://localhost:3001/api/swipes')
      .then((response) => response.json())
      .then((data) => setSwipes(data))
      .catch((error) => console.error('Error fetching swipes:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <Dashboard users={users} products={products} swipes={swipes} />
    </div>
  );
};

export default App;