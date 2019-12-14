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

  return <li onClick={handleResultClickEvent}>{result}</li>;
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
    <>
      <input type="text" value={keyword} onChange={handleKeywordChangeEvent} />
      <ul>
        {searchTDResults.map(result => (
          <TDSelectorResult
            key={result}
            result={result}
            onSelect={handleTDSelect}
          />
        ))}
      </ul>
    </>
  );
};
