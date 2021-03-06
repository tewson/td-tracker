import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import "react-tabs/style/react-tabs.css";

import dailMembers from "../../data/dail/33/members.json";
import { TDSelector } from "../members/TDSelector.jsx";
import { AttendanceInputText } from "./AttendanceInputText.jsx";
import { AttendanceInputCalendar } from "./AttendanceInputCalendar.jsx";

const tdSelectorOptions = dailMembers.results.map(result => result.member);

const AttendanceInput = () => {
  const [selectedTD, setSelectedTD] = useState();

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">TD Attendance Input</h1>
        <TDSelector
          houseTerm="33"
          year="2020"
          options={tdSelectorOptions}
          onChange={({ td }) => setSelectedTD(td)}
        />
        {selectedTD && (
          <Tabs>
            <TabList>
              <Tab>Text input</Tab>
              <Tab>Calendar input</Tab>
            </TabList>

            <TabPanel>
              <AttendanceInputText td={selectedTD} />
            </TabPanel>
            <TabPanel>
              <AttendanceInputCalendar td={selectedTD} />
            </TabPanel>
          </Tabs>
        )}
      </div>
    </section>
  );
};

ReactDOM.render(<AttendanceInput />, document.getElementById("app"));
