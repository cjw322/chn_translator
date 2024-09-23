import React, { useState, useEffect } from 'react';

const TranslationsBox = ({ segment, pinyin_map, tokens }) => {
  const [mainPhrase, setMainPhrase] = useState("");
  const [definition, setDefinition] = useState("");

  var innerTranslations = [];
  var tokenTranslations = {};
  var startIndex = segment[0][1]
  const endIndex = segment[segment.length - 1][1]

  useEffect(() => {
    var phrase = "";
    segment.forEach(characterInfo => {
      phrase += characterInfo[0]
    })
    setMainPhrase(phrase)
  })

  // translate main phrase
  useEffect(() => {
    if (mainPhrase) {
      fetch('http://127.0.0.1:5000/translate/' + mainPhrase
      ).then(response => {
        return response.json()
      }).then(json => setDefinition(json["translation"]))
    }
  }, [mainPhrase])

  while (startIndex <= endIndex) {
    const tokenList = tokens[startIndex]
    console.log("start index: ", startIndex)
    tokenList?.forEach(token => {
      console.log("token: ", token)

      var translation = ""
      if (!(token in tokenTranslations)) {
        fetch('http://127.0.0.1:5000/translate/' + token
        ).then(response => {
          translation = JSON.stringify(response)
          console.log("translation: ", translation)
        })
        tokenTranslations[token] = translation
      }
    })

    startIndex++;
  }

  return (
    <div className="translations-box" >
      <h3 className="segment-text">{mainPhrase} ({pinyin_map[mainPhrase]})</h3>
      <p className="segment-definition">{definition}</p>

      <h4 className="inner-translations-title">Inner Translations</h4>
      <div className="inner-translations-div">
        {JSON.stringify(tokenTranslations)}
      </div>
    </div>
  )
}

export default TranslationsBox;