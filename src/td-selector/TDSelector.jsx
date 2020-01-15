import React, { useState } from "react";

import dailMembers from "./dail-32.json";

const searchTD = keyword => {
  if (!keyword) {
    return [];
  }

  return dailMembers.results
    .map(result => result.member)
    .filter(member =>
      member.fullName.toLowerCase().includes(keyword.toLowerCase())
    );
};

const TDSelectorResult = ({ result, highlightedText, onSelect }) => {
  const handleResultClickEvent = () => {
    onSelect(result);
  };

  const highlightStartIndex = result.fullName
    .toLowerCase()
    .indexOf(highlightedText.toLowerCase());
  const highlightEndIndex = highlightStartIndex + highlightedText.length;

  const content = [
    result.fullName.substring(0, highlightStartIndex),
    <strong>
      {result.fullName.substring(highlightStartIndex, highlightEndIndex)}
    </strong>,
    result.fullName.substring(highlightEndIndex)
  ];

  return (
    <button
      className="button is-text dropdown-item"
      onClick={handleResultClickEvent}
    >
      {content}
    </button>
  );
};

export const TDSelector = ({ onSelect }) => {
  const [keyword, setKeyword] = useState("");
  const [searchTDResults, setSearchTDResults] = useState([]);

  const handleKeywordChangeEvent = ({ target: { value } }) => {
    setKeyword(value);
    setSearchTDResults(searchTD(value));
  };

  const handleTDSelect = selectedTD => {
    setKeyword(selectedTD.fullName);
    setSearchTDResults([]);
    onSelect(selectedTD);
  };

  return (
    <>
      <div className="field">
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Search TDs..."
            value={keyword}
            onChange={handleKeywordChangeEvent}
          />
        </div>
      </div>
      {searchTDResults.length > 0 && (
        <div className="dropdown is-active">
          <div className="dropdown-menu">
            <div className="dropdown-content">
              {searchTDResults.map(result => (
                <TDSelectorResult
                  key={result.uri}
                  result={result}
                  highlightedText={keyword}
                  onSelect={handleTDSelect}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
