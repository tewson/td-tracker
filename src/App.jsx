import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  useParams,
  useHistory
} from "react-router-dom";

import dailMembers from "../data/dail/32/members.json";

import { AboutModal } from "./AboutModal.jsx";
import { TDSelector } from "./td-selector/TDSelector.jsx";
import { ActivityCalendar } from "./calendar/ActivityCalendar.jsx";

const ActivityCalendarContainer = () => {
  const { tdMemberCode } = useParams();

  const td = dailMembers.results
    .map(result => result.member)
    .find(member => member.memberCode === tdMemberCode);

  if (!td) {
    return null;
  }

  return <ActivityCalendar td={td} />;
};

const SelectTD = () => {
  const history = useHistory();
  const { houseType, houseNumber, year, tdMemberCode } = useParams();

  const handleTDSelect = td => {
    history.push(`/${houseType}/${houseNumber}/${year}/${td.memberCode}`);
  };

  const td = dailMembers.results
    .map(result => result.member)
    .find(member => member.memberCode === tdMemberCode);

  const tdSelectorKeyword = td && td.fullName ? td.fullName : "";

  return (
    <>
      <TDSelector onSelect={handleTDSelect} keyword={tdSelectorKeyword} />
      {tdMemberCode ? (
        <ActivityCalendarContainer />
      ) : (
        <p>
          Search for a TD and view their attendance and contributions in 2019.
        </p>
      )}
    </>
  );
};

const App = () => {
  const [aboutModalIsOpen, setAboutModalIsOpen] = useState(false);

  const openAboutModal = () => {
    setAboutModalIsOpen(true);
  };
  const closeAboutModal = () => {
    setAboutModalIsOpen(false);
  };

  return (
    <Router>
      <section className="section">
        <div className="container">
          <h1 className="title">
            TD Tracker <span className="tag is-warning">BETA</span>
            <button
              className="button is-text is-pulled-right"
              onClick={openAboutModal}
            >
              About
            </button>
          </h1>
          <Switch>
            <Route exact path="/">
              <Redirect to="/dail/32/2019" />
            </Route>
            <Route path="/:houseType/:houseNumber/:year/:tdMemberCode?">
              <SelectTD />
            </Route>
          </Switch>
        </div>
      </section>
      <AboutModal
        modalIsOpen={aboutModalIsOpen}
        closeModal={closeAboutModal}
      ></AboutModal>
    </Router>
  );
};

export const HotExportedApp = hot(App);
