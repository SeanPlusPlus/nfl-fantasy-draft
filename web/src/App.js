import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchMessage= async () => {
      const result = await axios(
        'http://localhost:3001',
      );
      setMessage(result.data.message);
    };
    fetchMessage();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          { message }
        </p>
      </header>
    </div>
  );
}

export default App;
