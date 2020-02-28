import React, { useState } from "react";
import { useParams } from "react-router-dom";

import dailMembers from "../../data/dail/32/members.json";

const normalizeString = name =>
  name
    .toLocaleLowerCase("en-IE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const searchTD = keyword => {
  if (!keyword) {
    return [];
  }

  return dailMembers.results
    .map(result => result.member)
    .filter(member =>
      normalizeString(member.fullName).includes(normalizeString(keyword))
    );
};

const TDSelectorResult = ({ result, highlightedText, onSelect }) => {
  const handleResultClickEvent = () => {
    onSelect(result);
  };

  const highlightStartIndex = normalizeString(result.fullName).indexOf(
    normalizeString(highlightedText)
  );
  const highlightEndIndex = highlightStartIndex + highlightedText.length;

  const content = (
    <>
      {result.fullName.substring(0, highlightStartIndex)}
      <strong>
        {result.fullName.substring(highlightStartIndex, highlightEndIndex)}
      </strong>
      {result.fullName.substring(highlightEndIndex)}
    </>
  );

  return (
    <button
      className="button is-text dropdown-item"
      onClick={handleResultClickEvent}
    >
      {content}
    </button>
  );
};

export const TDSelector = ({ onSelect, keyword: initialKeyword = "" }) => {
  const { houseType, houseNumber, year } = useParams();
  const [keyword, setKeyword] = useState(initialKeyword);
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
      <div className="columns is-mobile">
        <div className="column">
          <div className="td-selector-filter">
            <label className="label" htmlFor="house-type">
              House
            </label>
            <div className="select is-fullwidth">
              <select id="house-type" value={houseType} disabled>
                <option value="dail">Dáil</option>
              </select>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="td-selector-filter">
            <label className="label" htmlFor="house-term">
              Term
            </label>
            <div className="select is-fullwidth">
              <select id="house-term" value={houseNumber} disabled>
                <option value="32">32</option>
              </select>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="td-selector-filter">
            <label className="label" htmlFor="year">
              Year
            </label>
            <div className="select is-fullwidth">
              <select id="year" value={year} disabled>
                <option value="2019">2019</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label" htmlFor="td-name">
          Name
        </label>
        <div className="control">
          <input
            id="td-name"
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
