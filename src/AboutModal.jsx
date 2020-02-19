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
