import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3001/api'

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        API + '/prospects',
      );
      setData(result.data.data);
    };
    fetchData();
  }, []);

  return (
    <div className="App container">
      <h1>Prospects</h1>
      <hr />
      {data.map((item) => (
        <li key={item.name}>{item.name}</li>
      ))}
    </div>
  );
}

export default App;
