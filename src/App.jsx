import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import { FAQModal } from "./FAQModal.jsx";
import { TDSelector } from "./td-selector/TDSelector.jsx";
import { ActivityCalendar } from "./calendar/ActivityCalendar.jsx";

const App = () => {
  const [faqModalIsOpen, setFAQModalIsOpen] = useState(false);
  const [selectedTD, setSelectedTD] = useState();

  const handleTDSelect = td => {
    setSelectedTD(td);
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
          {!selectedTD && (
            <p>
              Search for a TD and view their attendance and contributions in
              2019.
            </p>
          )}
          {selectedTD && <ActivityCalendar td={selectedTD} />}
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
