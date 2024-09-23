import './App.css';
import React, { useState, useEffect } from 'react';
import SegmentList from './components/SegmentList.js';
import TranslationsBox from './components/TranslationsBox.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: "",
      acceptingInput: true,
      pinyin_map: null,
      segments: [],
      submitClicked: false,
      clickedSegment: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  handleChange(event) {
    this.setState({ submitClicked: false })
    this.setState({ inputText: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitClicked: true })

    fetch('http://127.0.0.1:5000/generateAnnotations/' + this.state.inputText
    ).then(response => {
      return response.json()
    }).then(json => {
      this.setState({
        pinyin_map: json["pinyin_map"],
        segments: json["segments"],
        acceptingInput: false
      })
    })
  }

  onClick(segment) {
    console.log("segment: ", segment)
    console.log(typeof (segment))
    this.setState({
      clickedSegment: segment
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
        <div className="translations-side">
          <h1>Chinese Text Annotator</h1>
          <form onSubmit={this.handleSubmit}>
            <label>
              <h3 className="translate-header">Enter Text to Translate</h3>
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <div className="translations-box-div">
            {this.state.clickedSegment && this.state.pinyin_map && <TranslationsBox
              segment={this.state.clickedSegment}
              pinyin_map={this.state.pinyin_map}
            />}
          </div>
        </div>

        <div className="text-side">
          <div className="text-box">
            {this.state.segments && this.state.pinyin_map && <SegmentList
              segments={this.state.segments}
              pinyin_map={this.state.pinyin_map}
              onClick={this.onClick}
            />}
            {this.state.submitClicked && !(this.state.segments && this.state.pinyin_map) && <p>Loading...</p>}
          </div>
        </div>
      </div>
    );
  }
}


export default App;
