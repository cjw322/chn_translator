import './TranslationsBox.css';
import React, { useState, useEffect } from 'react';

const TranslationsBox = ({ segment, pinyin_map }) => {
  const [mainPhrase, setMainPhrase] = useState("");
  const [definition, setDefinition] = useState("");
  const [tokenMap, setTokenMap] = useState(null);
  const [translateChars, setTranslateChars] = useState(false);
  const [charTransMap, setCharTransMap] = useState(null);

  useEffect(() => {
    var phrase = "";
    segment.forEach(characterInfo => {
      phrase += characterInfo[0]
    })
    setMainPhrase(phrase)
  })

  // translate main phrase
  useEffect(() => {
    setTranslateChars(false)

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

  const translateCharacters = () => {
    setTranslateChars(true)

    fetch('http://127.0.0.1:5000/splitAndTranslateCharacters/' + mainPhrase
    ).then(response => {
      return response.json()
    }).then(json => setCharTransMap(json["char_translations_map"]))
  }

  return (
    <div className="translations-box" >
      <h3 className="segment-text">{mainPhrase} ({pinyin_map[mainPhrase]})</h3>
      <p className="segment-definition">{definition}</p>

      {tokenMap && Object.keys(tokenMap).length > 0 &&
        <div className="inner-translations-div">
          <h4 className="translations-title">Inner Translations</h4>
          <TranslationList translationsMap={tokenMap} />
        </div>
      }

      {!translateChars && <button className="show-char-trans-btn" onClick={() => translateCharacters()}>
        Show Each Character's Translations
      </button>}
      {translateChars && charTransMap && <div className="char-translations-div">
        <h4 className="translations-title">Character Translations</h4>
        <TranslationList translationsMap={charTransMap} />
      </div>}
    </div>
  )
}

const TranslationList = ({ translationsMap }) => {
  var listItems = []
  Object.keys(translationsMap).forEach(phrase => {
    listItems.push(<li>{phrase}: {translationsMap[phrase]}</li>)
  })

  return (
    <ul>
      {listItems}
    </ul>
  )
}

export default TranslationsBox;