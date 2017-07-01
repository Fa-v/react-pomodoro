import React, { Component } from 'react';
import './index.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionLength: 25,
      breakLength: 5,
      displayTime: '25:00',
      remainingTime: 1500,
      isRunning: false,
      mode: 'Session',
      lastTimer: null,
      numberOfSessions: 1
    }

    this.handleChange = this.handleChange.bind(this);
    this.ticker = this.ticker.bind(this);
    this.onPause = this.onPause.bind(this);
  }

  handleChange(event) {
    const { sessionLength } = this.state;
    const target = event.target;
    const name = target.name;
    let value = parseInt(target.value, 10) > 60 ? '60'
      : parseInt(target.value, 10) <= 0 ? '1'
      : target.value;
    
    if (isNaN(value) && value !== '') {
      return;
    } else {
      this.setState({
        [name]: value,
        sessionNumber: name === 'numberOfSessions' ? value - 1 : 0,
        displayTime: name === 'sessionLength'
          ? (value === '' ? '0:00' : value + ':00')
          : sessionLength + ':00'
      });
    }
  }

  startCountDown() {
    this.ticker();
    this.setState({
      isRunning: true
    });
  }

  getSeconds() {
    const { lastTimer } = this.state;
    return lastTimer === null
      ? this.getSessionOrBreakLength()
      : lastTimer;
  }

  getSessionOrBreakLength() {
    const { sessionLength, breakLength, mode } = this.state;
    return mode === 'Session' ? sessionLength * 60 : breakLength * 60;
  }

  ticker() {
    const { mode, sessionLength, breakLength, sessionNumber } = this.state;
    let seconds = this.getSeconds();
    let now = Date.now();
    let then = now + seconds * 1000;

    if (sessionLength === '' || breakLength === '') {
      return;
    }

    this.timer = setInterval(() => {
      let secondsLeft = Math.round((then - Date.now()) / 1000);
      let displayMinutes = Math.floor(secondsLeft / 60);
      let displaySeconds = secondsLeft % 60;

      secondsLeft === 0
        ? this.initSessionOrBreakMode(mode, displayMinutes, displaySeconds, sessionNumber)
        : this.initTimer(secondsLeft, displayMinutes, displaySeconds);
    }, 1000);
  }

  initTimer(secondsLeft, displayMinutes, displaySeconds) {
    this.setState({
      remainingTime: secondsLeft,
      displayTime: displayMinutes + ':' + (displaySeconds < 10
        ? '0' + displaySeconds
        : displaySeconds)
    });
  }

  setNumberOfSessions(mode, sessionNumber) {
    if (mode === 'Break') {
      return sessionNumber === 0 ? '0' : sessionNumber - 1
    } else {
      return sessionNumber;
    }
  }
  
  initSessionOrBreakMode(mode, displayMinutes, displaySeconds, sessionNumber) {
    clearInterval(this.timer);

    if (mode === 'Break' && sessionNumber === 0) {
      this.resetClock();
      return;
    }

    this.setState({
      mode: mode === 'Session' ? 'Break' : 'Session',
      displayTime: displayMinutes + ':' + (displaySeconds < 10
        ? '0' + displaySeconds
        : displaySeconds),
      lastTimer: null,
      sessionNumber: this.setNumberOfSessions(mode, sessionNumber)
    });
    this.ticker();
  }

  resetClock() {
    clearInterval(this.timer);

    this.setState({
      sessionLength: 25,
      breakLength: 5,
      displayTime: '25:00',
      remainingTime: 1500,
      isRunning: false,
      mode: 'Session',
      lastTimer: null,
      numberOfSessions: 1
    });
  }

  onPause() {
    const { remainingTime } = this.state;
    
    clearInterval(this.timer);

    this.setState({
      isRunning: false,
      lastTimer: remainingTime
    });
  }

  render() {
    const { sessionLength, breakLength, displayTime, isRunning, mode, numberOfSessions } = this.state;
    let color = {
      sessionColor: '#2ecc71',
      breakColor: '#f1c40f'
    }
    return (
      <div className="App">
        <div className="time-controls">
          <h4>Pomodoro Clock</h4>
          <form>
            <div>
              <label>Session</label>
              <input
                type="text"
                name="sessionLength"
                value={sessionLength}
                onChange={this.handleChange} />
            </div>
            <div>
              <label>Break  </label>
              <input
              type="text"
              name="breakLength"
              value={breakLength}
              onChange={this.handleChange} />
            </div>
            <div>
              <label>Rounds </label>
              <input
              type="text"
              name="numberOfSessions"
              value={numberOfSessions}
              onChange={this.handleChange} />
            </div>
          </form>
        </div>

        <div className="display-time">
          <h2 className="time-left">{mode}</h2>
          {(mode === 'Session') ? <h1 style={{ color: '#2ecc71' }}>{displayTime}</h1>
            : <h1 style={{ color: '#f1c40f' }}>{displayTime}</h1>}
          {(isRunning === false) ? <button type="button" onClick={() => this.startCountDown()}>Start</button>
            : <button type="button" onClick={() => this.onPause()}>Pause</button>}
          <button type="button" onClick={() => this.resetClock()}>Reset</button>
        </div> 
      </div>
    );
  }
}

export default App;
