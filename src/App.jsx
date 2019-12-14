import React, { useState } from "react";

import { TDSelector } from "./td-selector/TDSelector.jsx";
import { Calendar } from "./calendar/Calendar.jsx";

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
      {selectedTD && <Calendar />}
    </>
  );
};
