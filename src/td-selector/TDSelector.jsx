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
    )
    .map(member => member.fullName);
};

const TDSelectorResult = ({ result, onSelect }) => {
  const handleResultClickEvent = () => {
    onSelect(result);
  };

  return (
    <a href="#" className="dropdown-item" onClick={handleResultClickEvent}>
      {result}
    </a>
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
    setKeyword(selectedTD);
    setSearchTDResults([]);
    onSelect(selectedTD);
  };

  return (
    <div className={searchTDResults.length ? "dropdown is-active" : "dropdown"}>
      <input
        className="input"
        type="text"
        value={keyword}
        onChange={handleKeywordChangeEvent}
      />
      <div className="dropdown-menu">
        <div className="dropdown-content">
          {searchTDResults.map(result => (
            <TDSelectorResult
              key={result}
              result={result}
              onSelect={handleTDSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
