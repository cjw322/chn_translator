import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

// class App extends React.Component {

// render() {
//   return (
//     <div className="main-content">
//       <h1>Chinese Text Annotator</h1>

//       <div className="input-half">
//         <InputForm />
//       </div>
//       <div>
//         <p>
//           {this.props.translated}
//         </p>
//       </div>
//     </div>
//   );
// }
// }

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      res: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log('sending req to flask')
    console.log(JSON.stringify(this.state.value))
    fetch('/input', {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: this.state.value
      })
    }).then(response => {
      console.log(response)
      return response.json()
    }).then(json => {
      console.log = (json)
      this.setState({
        res: json[0]
      })
    })
  }

  render() {
    if (this.state.res) {
      const segList = this.state.res[0]
      const transDict = this.state.res[1]
      var items = { segList }.map((word, i) => {
        return <span key={i}>{word}</span>;
      });
    } else {
      var items = []
    }

    return (
      <div className="main-content">
        <h1>Chinese Text Annotator</h1>

        <div className="input-half">
          <form onSubmit={this.handleSubmit}>
            <label>
              Enter Text to Translate
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div>
          <p>
            {items}
          </p>
        </div>
      </div>
    );
  }
}


export default App;
