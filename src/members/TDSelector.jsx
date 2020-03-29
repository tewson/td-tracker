import React, { useState, useEffect } from "react";
import classnames from "classnames";
import Downshift from "downshift";

import { dailTermYearOptionsMap } from "../constants.js";

const normalizeString = name =>
  name
    .toLocaleLowerCase("en-IE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const TDSelectorResult = ({
  result,
  focused,
  highlightedText,
  ...downshiftProps
}) => {
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
    <a
      className={classnames("button is-text dropdown-item", {
        "has-background-grey-light": focused
      })}
      {...downshiftProps}
    >
      {content}
    </a>
  );
};

export const TDSelector = ({
  houseType,
  houseTerm,
  year,
  options,
  optionsLoading,
  selectedTD,
  onChange
}) => {
  const [keyword, setKeyword] = useState("");
  const [searchTDResults, setSearchTDResults] = useState([]);

  useEffect(() => {
    if (selectedTD) {
      setKeyword(selectedTD.fullName);
    } else {
      setKeyword("");
    }
  }, [selectedTD]);

  const searchTD = keyword => {
    if (!keyword) {
      return [];
    }

    return options.filter(member =>
      normalizeString(member.fullName).includes(normalizeString(keyword))
    );
  };

  const handleKeywordChangeEvent = ({ target: { value } }) => {
    setKeyword(value);
    setSearchTDResults(searchTD(value));
  };

  const handleHouseTermChange = ({ target: { value: houseTerm } }) => {
    onChange({
      houseTerm,
      year,
      td: selectedTD
    });
  };

  const handleYearChange = ({ target: { value: year } }) => {
    onChange({
      houseTerm,
      year,
      td: selectedTD
    });
  };

  const handleTDSelect = td => {
    if (td) {
      setKeyword(td.fullName);
      setSearchTDResults([]);
      onChange({
        houseTerm,
        year,
        td
      });
    }
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
              <select
                id="house-term"
                value={houseTerm}
                onChange={handleHouseTermChange}
              >
                <option value="32">32</option>
                <option value="33">33</option>
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
              <select id="year" value={year} onChange={handleYearChange}>
                {dailTermYearOptionsMap[houseTerm].map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <Downshift
        onChange={handleTDSelect}
        itemToString={item => (item ? item.fullName : "")}
      >
        {({
          getLabelProps,
          getInputProps,
          getItemProps,
          getMenuProps,
          highlightedIndex
        }) => {
          return (
            <div className="field">
              <label className="label" {...getLabelProps()}>
                Name
              </label>
              <div
                className={classnames("control", {
                  "is-loading": optionsLoading
                })}
              >
                <input
                  {...getInputProps({
                    onKeyDown: event => {
                      if (event.key === "Home" || event.key === "End") {
                        event.nativeEvent.preventDownshiftDefault = true;
                      }
                    }
                  })}
                  disabled={optionsLoading}
                  className="input"
                  type="text"
                  placeholder="Search TDs..."
                  value={keyword}
                  onChange={handleKeywordChangeEvent}
                />
              </div>
              {searchTDResults.length > 0 && (
                <div className="dropdown is-active">
                  <div className="dropdown-menu">
                    <div className="dropdown-content" {...getMenuProps()}>
                      {searchTDResults.map((result, index) => {
                        return (
                          <TDSelectorResult
                            {...getItemProps({
                              key: result.uri,
                              index,
                              item: result
                            })}
                            result={result}
                            focused={highlightedIndex === index}
                            highlightedText={keyword}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Downshift>
    </>
  );
};
