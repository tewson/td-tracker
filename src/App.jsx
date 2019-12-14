import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";
import startOfYear from "date-fns/startOfYear";
import endOfYear from "date-fns/endOfYear";

import { TDSelector } from "./td-selector/TDSelector.jsx";
import { Calendar } from "./calendar/Calendar.jsx";

export const App = () => {
  const [selectedTD, setSelectedTD] = useState();
  const [activities, setActivities] = useState();

  useEffect(() => {
    const currentDate = new Date();
    const fetchDebates = async () => {
      const {
        data: { results: debates }
      } = await axios.get("https://api.oireachtas.ie/v1/debates", {
        params: {
          date_start: format(startOfYear(currentDate), "yyyy-MM-dd"),
          date_end: format(endOfYear(currentDate), "yyyy-MM-dd"),
          member_id: selectedTD.uri
        }
      });

      setActivities({
        ...activities,
        debates
      });
    };

    if (selectedTD) {
      fetchDebates();
    }
  }, [selectedTD]);

  const handleTDSelect = td => {
    setSelectedTD(td);
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">TD Tracker</h1>
        <TDSelector onSelect={handleTDSelect} />
        {selectedTD && activities && <Calendar activities={activities} />}
      </div>
    </section>
  );
};
