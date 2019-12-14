import React, { useState } from "react";

import { TDSelector } from "./td-selector/TDSelector.jsx";

export const App = () => {
  const [selectedTD, setSelectedTD] = useState();
  const handleTDSelect = td => {
    setSelectedTD(td);
  };

  return (
    <>
      <h1>TD Tracker</h1>
      <TDSelector onSelect={handleTDSelect} />
      {selectedTD}
    </>
  );
};
