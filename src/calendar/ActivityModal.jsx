import React from "react";
import format from "date-fns/format";

export const ActivityModal = ({ data, closeModal }) => {
  const { date, debates } = data;
  if (!debates) {
    return null;
  }

  const formattedDate = format(date, "yyyy-MM-dd");

  return (
    <div className="modal activity-modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Activities {formattedDate}</p>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <h3>Debates</h3>
            <ul>
              {debates
                .map(debate => {
                  const {
                    debateRecord: {
                      debateSections,
                      house: { chamberType, houseCode, committeeCode }
                    }
                  } = debate;

                  const chamber =
                    chamberType === "house" ? houseCode : committeeCode;

                  return debateSections.map(({ debateSection }) => {
                    const { uri, debateSectionId, showAs } = debateSection;

                    const debateSectionIdForUrl = debateSectionId.replace(
                      "dbsect_",
                      ""
                    );

                    return (
                      <li key={uri}>
                        <a
                          href={`https://www.oireachtas.ie/en/debates/debate/${chamber}/${formattedDate}/${debateSectionIdForUrl}`}
                        >
                          {showAs}
                        </a>
                      </li>
                    );
                  });
                })
                .flat(Infinity)}
            </ul>
          </div>
        </section>
        <footer className="modal-card-foot">
          <a className="button" onClick={closeModal}>
            Close
          </a>
        </footer>
      </div>
    </div>
  );
};