import React, { Component } from 'react';
import './index.css';

class App extends Component {
  constructor() {
    super();

    let timer;

    this.state = {
      sessionLength: 25,
      breakLength: 5,
      displayTime: '25:00',
      remainingTime: 1500,
      isRunning: false,
      mode: 'session'
    }

    this.handleChange = this.handleChange.bind(this);
    this.ticker = this.ticker.bind(this);
  }

  handleChange(event) {
    const { sessionLength, breakLength, mode } = this.state;
    const target = event.target;
    const value = target.value;
    const name = target.name;
    
    if (name === 'sessionLength') {
      this.setState({
        sessionLength: value,
        displayTime: value + ':00',
       /* remainingTime: value * 60,*/
        mode: 'session',
      });
    } else {
      this.setState({
        breakLength: value,
        mode: 'break',
      });
    }
  }

  startCountDown() {
    const { isRunning } = this.state;
    this.ticker();
    this.setState({
      isRunning: true
    });
  }

  ticker() {
    const { sessionLength, breakLength, remainingTime } = this.state;
    const now = Date.now();
    const then = now + (sessionLength * 60) * 1000;

    this.timer = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      let displayMinutes = Math.floor(secondsLeft / 60);
      let displaySeconds = secondsLeft % 60;
      
      if (secondsLeft < 0) {
        clearInterval(this.timer);
        this.setState({
          isRunning: false
        })
      } else {
        this.setState({
          remainingTime: secondsLeft,
          displayTime: displayMinutes + ':' + displaySeconds
        });       
      }
    }, 1000)

  }

  render() {
    const { sessionLength, breakLength, displayTime, isRunning } = this.state;

    return (
      <div className="App">
        <h4 className="pomodoro-clock">Pomodoro Clock</h4>
        <div className="time-controls">
          <form>
            Session length
              <input
                type="text"
                name="sessionLength"
                value={sessionLength}
                onChange={this.handleChange} /><br/>
            Break length
              <input
              type="text"
              name="breakLength"
              value={breakLength}
              onChange={this.handleChange}/> 
          </form>
        </div>

        <div className="display-time">
          <h2 className="time-left">Time left</h2>
          <h1>{ displayTime }</h1>
          {(isRunning === false) ? <button type="button" onClick={() => this.startCountDown()}>Start</button>
            : <button type="button" onClick={() => this.onPause()}>Pause</button>}
          <button type="button" onClick={() => this.resetClock()}>Reset</button>
        </div>
      </div>
    );
  }
}

export default App;
