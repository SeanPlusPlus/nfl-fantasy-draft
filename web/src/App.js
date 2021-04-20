import React, { useState, useEffect, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import axios from 'axios';
import _get from 'lodash/get';
import Prospects from './Prospects'
import Drafted from './Drafted'
import './App.css';

const API = 'http://localhost:3001/api'

function App() {
  const [data, setData] = useState([])
  const [selectedProspect, setSelectedProspect] = useState({})
  const [selectedOption, setSelectedOption] = useState([])
  const [disabled, setDisabled] = useState("disabled")
  const [drafted, setDrafted] = useState([])
  const ref = useRef()

  async function fetchData() {
    const result = await axios(
      API + '/prospects',
    );
    setData(result.data.prospects);
    setDrafted(result.data.drafted);
    setDisabled(false)
  }

  async function postData(selected) {
    const { data } = await axios.post(
      API + '/selected',
      selected.selected
    )

    if (selected.selected.value === data.received.value) {
      setDrafted(data.drafted)
      setData(data.prospects)
      setSelectedProspect(data)
      setDisabled(false)
      ref.current.focus()
      ref.current.clear()
    }
  }

  function handleChange(event) {
    if (event) {
      setSelectedOption(event)
      const value = event[0]
      setSelectedProspect({selected: {value}})
    }
  }

  function handleSubmit(event) {
    if (!_get(selectedProspect, 'selected.value')) {
      return
    }
  
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
      <div className="row">
        <div className="col">
          <form onSubmit={handleSubmit}>
            <fieldset disabled={disabled}>
              <div className="form-group">
                <h3>Prospects</h3>
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
          </form>
          <hr />
          <Drafted data={drafted} />
        </div>
        <div className="col">
          <Prospects data={data} />
        </div>
      </div>
    </div>
  );
}

export default App;
