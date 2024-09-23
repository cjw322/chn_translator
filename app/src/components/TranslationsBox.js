import './TranslationsBox.css';
import React, { useState, useEffect } from 'react';

const TranslationsBox = ({ segment, pinyin_map }) => {
  const [mainPhrase, setMainPhrase] = useState("");
  const [definition, setDefinition] = useState("");
  const [tokenMap, setTokenMap] = useState(null);

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

      fetch('http://127.0.0.1:5000/tokenizeAndTranslateTokens/' + mainPhrase
      ).then(response => {
        return response.json()
      }).then(json => setTokenMap(json["token_translations_map"]))
    }
  }, [mainPhrase])

  return (
    <div className="translations-box" >
      <h3 className="segment-text">{mainPhrase} ({pinyin_map[mainPhrase]})</h3>
      <p className="segment-definition">{definition}</p>

      <h4 className="inner-translations-title">Inner Translations</h4>
      <div className="inner-translations-div">
        {JSON.stringify(tokenMap)}
      </div>
    </div>
  )
}

export default TranslationsBox;