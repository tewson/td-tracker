import React, { useState } from "react";
import classNames from "classnames";

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

const TDSelectorResult = ({ result, onSelect }) => {
  const handleResultClickEvent = () => {
    onSelect(result);
  };

  return (
    <a href="#" className="dropdown-item" onClick={handleResultClickEvent}>
      {result.fullName}
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
