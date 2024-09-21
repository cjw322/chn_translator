import './SegmentList.css';
import React from 'react';

const SegmentList = ({ segments, translations }) => {
  var segmentList = []
  segments.forEach(segment => {
    segmentList.push(<Segment
      segment={segment}
      translations={translations}
    />)
  });

  return (
    <div className="segment-list">
      {segmentList}
    </div>
  )
}

const Segment = ({ segment, translations }) => {
  var characterList = [];
  var isColored = true;
  segment.forEach(characterInfo => {
    if (!(characterInfo[0] in translations)) {
      isColored = false;
    }
    characterList.push(<Character
      characterInfo={characterInfo}
      translations={translations}
    />)
  });
  return (
    <div className={isColored ? "segment colored-segment" : "segment"}>
      {characterList}
    </div>
  )
}

const Character = ({ characterInfo, translations }) => {
  const character = characterInfo[0]
  const index = characterInfo[1]
  const pinyin = character in translations ? translations[character][0] : " "
  return (
    <div className="character-with-pinyin">
      <p className="pinyin">{pinyin}</p>
      {character in translations && <p className="character" id={"char" + index}>{character}</p>}
      {!(character in translations) && <p className="character">{character}</p>}
    </div>
  );
}

export default SegmentList;