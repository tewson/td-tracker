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

const TDSelectorResult = ({ result }) => {
  const handleResultClickEvent = () => {
    console.log(result);
  };

  return <li onClick={handleResultClickEvent}>{result}</li>;
};

export const TDSelector = () => {
  const [searchTDResults, setSearchTDResults] = useState([]);

  const handleKeywordChangeEvent = ({ target: { value } }) => {
    setSearchTDResults(searchTD(value));
  };

  return (
    <>
      <input type="text" onChange={handleKeywordChangeEvent} />
      <ul>
        {searchTDResults.map(result => (
          <TDSelectorResult key={result} result={result} />
        ))}
      </ul>
    </>
  );
};
