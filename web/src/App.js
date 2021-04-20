import React, { useState, useEffect, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import axios from 'axios';
import './App.css';

const API = 'http://localhost:3001/api'

function App() {
  const [data, setData] = useState([]);
  const [selectedProspect, setSelectedProspect] = useState({});
  const [selectedOption, setSelectedOption] = useState([]);
  const [disabled, setDisabled] = useState("disabled")
  const ref = useRef();

  async function fetchData() {
    const result = await axios(
      API + '/prospects',
    );
    setData(result.data.data);
    setDisabled(false)
  }

  async function postData(selected) {
    const { data } = await axios.post(
      API + '/selected',
      selected.selected
    )
    setSelectedProspect(data)
    setDisabled(false)
    ref.current.focus()
    ref.current.clear()
  }

  function handleChange(event) {
    if (event) {
      setSelectedOption(event)
      const value = event[0]
      setSelectedProspect({selected: {value}})
    }
  }

  function handleSubmit(event) {
    setDisabled("disabled")
    setSelectedOption([])
    postData(selectedProspect)
    event.preventDefault()
  }

  useEffect(() => {
    fetchData();
  }, []);

  const options = data.map((el) => { return el.name });

  return (
    <div className="App container">
      <form onSubmit={handleSubmit}>
        <fieldset disabled={disabled}>
          <div className="form-group">
            <label htmlFor="prospects" id="prospects-label">Prospects</label>
            <Typeahead
              disabled={disabled}
              id="prospects"
              labelKey="name"
              onChange={handleChange}
              options={options}
              placeholder="Select"
              selected={selectedOption}
              ref={ref}
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </fieldset>
        <hr />
        <pre style={{marginTop: '500px'}}>{JSON.stringify(selectedProspect, null, 2)}</pre>
      </form>
    </div>
  );
}

export default App;
