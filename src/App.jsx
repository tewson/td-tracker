import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import {
  BrowserRouter as Router,
  Link,
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
      <TDSelector
        houseType={houseType}
        houseNumber={houseNumber}
        year={year}
        onSelect={handleTDSelect}
        keyword={tdSelectorKeyword}
      />
      {tdMemberCode ? (
        <ActivityCalendarContainer />
      ) : (
        <p>Search for a TD and view their attendance and contributions.</p>
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
            <Link to="/">TD Tracker</Link>{" "}
            <span className="tag is-warning">BETA</span>
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
          <footer className="footer">
            <div className="content has-text-centered-desktop-only">
              Any data from the Oireachtas is licensed under the{" "}
              <a href="https://www.oireachtas.ie/en/open-data/license/">
                Oireachtas (Open Data) PSI Licence
              </a>
              , which incorporates the{" "}
              <a href="http://creativecommons.org/licenses/by/4.0/">
                Creative Commons Attribution 4.0 International Licence
              </a>
              .
            </div>
          </footer>
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
