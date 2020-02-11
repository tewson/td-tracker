import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import dailMembers from "../data/dail/32/members.json";

import { FAQModal } from "./FAQModal.jsx";
import { TDSelector } from "./td-selector/TDSelector.jsx";
import { ActivityCalendar } from "./calendar/ActivityCalendar.jsx";

const ActivityCalendarContainer = ({ tdMemberCode }) => {
  const td = dailMembers.results
    .map(result => result.member)
    .find(member => member.memberCode === tdMemberCode);

  if (!td) {
    return null;
  }

  return <ActivityCalendar td={td} />;
};

const App = () => {
  const [faqModalIsOpen, setFAQModalIsOpen] = useState(false);
  const [selectedTDMemberCode, setSelectedTDMemberCode] = useState();

  const handleTDSelect = td => {
    setSelectedTDMemberCode(td.memberCode);
  };

  const openFAQModal = () => {
    setFAQModalIsOpen(true);
  };
  const closeFAQModal = () => {
    setFAQModalIsOpen(false);
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">
            TD Tracker{" "}
            <button
              className="button is-text is-pulled-right"
              onClick={openFAQModal}
            >
              FAQ
            </button>
          </h1>
          <TDSelector onSelect={handleTDSelect} />
          {!selectedTDMemberCode && (
            <p>
              Search for a TD and view their attendance and contributions in
              2019.
            </p>
          )}
          {selectedTDMemberCode && (
            <ActivityCalendarContainer tdMemberCode={selectedTDMemberCode} />
          )}
        </div>
      </section>
      <FAQModal
        modalIsOpen={faqModalIsOpen}
        closeModal={closeFAQModal}
      ></FAQModal>
    </>
  );
};

export const HotExportedApp = hot(App);
