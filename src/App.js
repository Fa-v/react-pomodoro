import React, { Component } from 'react';
import './index.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <h4 className="pomodoro-clock">Pomodoro Clock</h4>
        <div className="time-controls">
          <form>
            Session length <input type="number" value="25" min="0" max="60"/>
            Break length <input type="number" value="5" min="0" max="20"/>
          </form>
        </div>

        <div className="display-time">
          <h2 className="time-left">Time left</h2>
          <h1>25:00</h1>
          <button type="button">Start</button>
          <button type="button">Reset</button>
        </div>
      </div>
    );
  }
}

export default App;
