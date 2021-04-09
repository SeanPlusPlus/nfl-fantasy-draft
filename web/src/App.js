import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3001/api'

function App() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        API + '/prospects',
      );
      setData(result.data.data);
    };
    fetchData();
  }, []);

  function handleChange(event) {
    const name = event.target.value;
    setSelected({selected: {name}})
  }

  async function postData(selected) {
    const { data } = await axios.post(
      API + '/selected',
      selected.selected
    )
    setSelected(data)
  }

  function handleSubmit(event) {
    postData(selected)
    event.preventDefault();
  }

  return (
    <div className="App container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prospects-select">Prospects</label>
          <select className="form-control" id="prospects-select" onChange={handleChange}>
          <option defaultValue> -- select an option -- </option>
            {data.map((item) => (
              <option key={item.name} value={item.name}>{item.name} - {item.position} - {item.school}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        <hr />
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </form>
    </div>
  );
}

export default App;
