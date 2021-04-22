import React, { useState, useEffect, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import axios from 'axios';
import _get from 'lodash/get';
import Drafted from './Drafted'
import LeaderBoard from './LeaderBoard'
import './App.css';

const API = 'http://localhost:3001/api/'

const PRODUCTION = process.env.NODE_ENV === 'production'

function App() {
  // state
  const [prospects, setProspects] = useState([])
  const [leaderBoard, setLeaderBoard] = useState([])
  const [selectedProspect, setSelectedProspect] = useState('')
  const [selectedOption, setSelectedOption] = useState([])
  const [disabled, setDisabled] = useState("disabled")
  const [drafted, setDrafted] = useState([])

  const options = prospects.map((el) => { return el.name });
  
  const ref = useRef()

  async function fetchData() {
    const result = await axios(API);
    setProspects(result.data.prospects);
    setDrafted(result.data.drafted);
    setLeaderBoard(result.data.leaderBoard);
    setDisabled(false)
  }

  async function postData(selected) {
    const { data } = await axios.post(API, selected.selected)

    if (selected.selected.value === data.received.value) {
      setDrafted(data.drafted)
      setProspects(data.prospects)
      setLeaderBoard(data.leaderBoard);
      setSelectedProspect('')
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
    event.preventDefault()

    if (!_get(selectedProspect, 'selected.value')) {
      return
    }
    
    setDisabled("disabled")
    setSelectedOption([])
    postData(selectedProspect)
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App container">
      <div className="row">
        <div className="col border border-bottom-1 border-top-0 border-right-0 border-left-0">
          <h1>NFL 2021 Fantasy Draft</h1>
        </div>
      </div>
      <div className="row">
        {!PRODUCTION && (
          <div className="col border border-right-1 border-bottom-0 border-top-0 border-left-0">
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
                <button
                  disabled={disabled || !selectedOption.length}
                  type="submit"
                  className="btn btn-primary"
                >Submit</button>
              </fieldset>
            </form>
          </div>
        )}
        <div className="col border border-right-1 border-bottom-0 border-top-0 border-left-0">
          <Drafted data={drafted} />
        </div>
        <div className="col">
          <LeaderBoard data={leaderBoard} />
        </div>
      </div>
    </div>
  );
}

export default App;
