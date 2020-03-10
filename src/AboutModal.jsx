import React from "react";

export const AboutModal = ({ modalIsOpen, closeModal }) => {
  if (!modalIsOpen) {
    return null;
  }

  return (
    <div className="modal about-modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">About</p>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <h4>What's New</h4>
            <h5 className="whats-new-version">
              1.0.0 Beta 3{" "}
              <span className="whats-new-version-date">(2020-03-10)</span>
            </h5>
            <ul>
              <li>We can now view data on members of the 33rd Dáil!</li>
              <li>
                Permissive licence statements were added to make it clear that
                both the code and the data is shareable and reuseable.
              </li>
              <li>The calendar now shows latest month first.</li>
              <li>There is now a link to the source of attendance data.</li>
            </ul>
            <p className="has-text-right">
              <a href="https://github.com/tewson/td-tracker/blob/master/CHANGELOG.md">
                View version history
              </a>
            </p>
            <h4>FAQ</h4>
            <h5>Where is the data from?</h5>
            <p>
              Contribution data comes from the{" "}
              <a href="https://api.oireachtas.ie/">Oireachtas Open Data APIs</a>
              . Attendance data comes from published{" "}
              <a href="https://www.oireachtas.ie/en/publications/?q=&date=&term=%2Fie%2Foireachtas%2Fhouse%2Fdail%2F32&fromDate=30%2F11%2F2019&toDate=01%2F12%2F2019&topic%5B%5D=record-of-attendance">
                records of attendance
              </a>
              .
            </p>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className="button" onClick={closeModal}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
};
