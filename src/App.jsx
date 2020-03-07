import React, { useState, useEffect } from "react";
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

import { AboutModal } from "./AboutModal.jsx";
import { fetchDailMembers } from "./members/api.js";
import { TDSelector } from "./members/TDSelector.jsx";
import { ActivityCalendar } from "./calendar/ActivityCalendar.jsx";

const SelectTD = () => {
  const history = useHistory();
  const { houseType, houseNumber, year, tdMemberCode } = useParams();
  const [dailMembers, setDailMembers] = useState([]);
  const [dailMembersIsLoading, setDailMembersIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const fetchedDailMembers = await fetchDailMembers(houseNumber);
      setDailMembers(fetchedDailMembers);
      setDailMembersIsLoading(false);
    })();
  }, [houseNumber]);

  const handleTDSelect = td => {
    history.push(`/${houseType}/${houseNumber}/${year}/${td.memberCode}`);
  };

  const td = dailMembers.find(member => member.memberCode === tdMemberCode);

  return (
    <>
      <TDSelector
        houseType={houseType}
        houseNumber={houseNumber}
        year={year}
        options={dailMembers}
        optionsLoading={dailMembersIsLoading}
        selectedTD={td}
        onChange={handleTDSelect}
      />
      {td ? (
        <ActivityCalendar td={td} />
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
