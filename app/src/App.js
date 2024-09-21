import './App.css';
import React, { useState, useEffect } from 'react';
import SegmentList from './components/SegmentList.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      acceptingInput: true,
      translations: null,
      segments: [],
      tokens: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ inputText: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(JSON.stringify(this.state.inputText))

    fetch('http://127.0.0.1:5000/translate/' + this.state.inputText
    ).then(response => {
      return response.json()
    }).then(json => {
      this.setState({
        translations: json["translations"],
        segments: json["segments"],
        tokens: json["tokens"],
        acceptingInput: false
      })
    })
  }

  render() {
    // if (this.state.segments) {
    //   var items = this.state.segments.map((word, i) => {
    //     return <span key={i}>{word}</span>;
    //   });
    // } else {
    //   var items = []
    // }

    return (
      <div className="main-content">
        <div className="text-side">
          <h1>Chinese Text Annotator</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              <h3 className="translate-header">Enter Text to Translate</h3>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div className="annotated-text">
            <div className="annotated-text">
              <p>
                {/* {JSON.stringify(this.state.segments)}
                {JSON.stringify(this.state.tokens)} */}
                {JSON.stringify(this.state.translations)}
              </p>
            </div>
          </div>
        </div>

        <div className="translated-side">
          <div className="translated-text-box">
            {this.state.segments && this.state.translations != null && <SegmentList
              segments={this.state.segments}
              translations={this.state.translations}
            />}
          </div>
        </div>
      </div>
    );
  }
}


export default App;
