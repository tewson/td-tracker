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

import { dailTermYearOptionsMap } from "./constants";
import { getNumberWithOrdinal } from "./utils.js";
import { AboutModal } from "./AboutModal.jsx";
import { fetchDailMembers } from "./members/api.js";
import { TDSelector } from "./members/TDSelector.jsx";
import { ActivityCalendar } from "./calendar/ActivityCalendar.jsx";

const SelectTD = () => {
  const history = useHistory();
  const { houseType, houseTerm, year, tdMemberCode } = useParams();
  const [dailMembers, setDailMembers] = useState([]);
  const [dailMembersIsLoading, setDailMembersIsLoading] = useState(true);
  const [currentTD, setCurrentTD] = useState(null);

  useEffect(() => {
    (async () => {
      setDailMembersIsLoading(true);
      const fetchedDailMembers = await fetchDailMembers(houseTerm);
      setDailMembers(fetchedDailMembers);
      setDailMembersIsLoading(false);
    })();
  }, [houseTerm]);

  const handleTDSelect = ({
    houseTerm: updatedHouseTerm,
    year: updatedYear,
    td
  }) => {
    const tdPathFragment = td ? `/${td.memberCode}` : "";
    const yearPathParam = dailTermYearOptionsMap[updatedHouseTerm].includes(
      updatedYear
    )
      ? updatedYear
      : dailTermYearOptionsMap[updatedHouseTerm][0];

    if (updatedHouseTerm !== houseTerm) {
      setDailMembersIsLoading(true);
      setDailMembers([]);
    }

    const targetPath = `/${houseType}/${updatedHouseTerm}/${yearPathParam}${tdPathFragment}`;
    history.push(targetPath);
  };

  if (!dailMembersIsLoading && dailMembers.length > 0) {
    if (tdMemberCode) {
      const matchedTDFromMemberCode = dailMembers.find(
        member => member.memberCode === tdMemberCode
      );

      if (matchedTDFromMemberCode) {
        if (
          !currentTD ||
          (currentTD &&
            currentTD.memberCode !== matchedTDFromMemberCode.memberCode)
        ) {
          setCurrentTD(matchedTDFromMemberCode);
        }
      } else {
        alert(
          `${currentTD.fullName} is not a member of the ${getNumberWithOrdinal(
            houseTerm
          )} Dáil. You will need to select another TD.`
        );
        return <Redirect to={`/${houseType}/${houseTerm}/${year}`} />;
      }
    } else if (currentTD) {
      setCurrentTD(null);
    }
  }

  return (
    <>
      <TDSelector
        houseType={houseType}
        houseTerm={houseTerm}
        year={year}
        options={dailMembers}
        optionsLoading={dailMembersIsLoading}
        selectedTD={currentTD}
        onChange={handleTDSelect}
      />
      {currentTD ? (
        !dailMembersIsLoading && (
          <ActivityCalendar
            houseType={houseType}
            houseTerm={houseTerm}
            year={year}
            td={currentTD}
          />
        )
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
            <span className="tag is-warning">BETA 3</span>
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
            <Route path="/:houseType/:houseTerm/:year/:tdMemberCode?">
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
