import './SegmentList.css';
import React from 'react';

const SegmentList = ({ segments, pinyin_map, onClick }) => {
  var segmentList = []
  segments.forEach(segment => {
    segmentList.push(<Segment
      segment={segment}
      pinyin_map={pinyin_map}
      onClick={onClick}
    />)
  });

  return (
    <div className="segment-list">
      {segmentList}
    </div>
  )
}

const Segment = ({ segment, pinyin_map, onClick }) => {
  var characterList = [];
  var isColored = true;
  const phrase = segment.map(s => s[0]).join("");
  var pinyin = phrase in pinyin_map ? pinyin_map[phrase].split(" ") : "";
  var count = 0;

  segment.forEach(characterInfo => {
    if (!(phrase in pinyin_map)) {
      isColored = false;
    }
    characterList.push(<Character
      characterInfo={characterInfo}
      pinyin={pinyin[count]}
    />)
    count++;
  });
  return (
    <button
      className={isColored ? "segment colored-segment" : "segment"}
      onClick={isColored ? () => onClick(segment) : () => { }}
    >
      {characterList}
    </button>
  )
}

const Character = ({ characterInfo, pinyin }) => {
  const character = characterInfo[0]
  const index = characterInfo[1]
  return (
    <div className="character-with-pinyin">
      <p className="pinyin">{pinyin}</p>
      {pinyin != "" && <p className="character" id={"char" + index}>{character}</p>}
      {pinyin == "" && <p className="character">{character}</p>}
    </div>
  );
}

export default SegmentList;