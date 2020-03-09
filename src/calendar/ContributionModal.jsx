import React from "react";
import format from "date-fns/format";

export const ContributionModal = ({ data, closeModal }) => {
  if (!data) {
    return null;
  }

  const { date, debates, votes } = data;
  const formattedDate = format(date, "yyyy-MM-dd");

  const DebateSection = () => {
    return (
      <>
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
      </>
    );
  };

  const VoteSection = () => {
    return (
      <>
        <h3>Votes</h3>
        <ul>
          {votes.map(vote => {
            const {
              uri,
              debate,
              voteId,
              house: { chamberType, committeeCode, houseCode, houseNo }
            } = vote;

            const voteIdForUrl = voteId.replace("vote_", "");

            const voteDebatePath =
              chamberType === "committee"
                ? `/${houseCode}/${houseNo}/${committeeCode}/${formattedDate}/${voteIdForUrl}`
                : `/${houseCode}/${houseNo}/${formattedDate}/${voteIdForUrl}`;

            return (
              <li key={uri}>
                <a
                  href={`https://www.oireachtas.ie/en/debates/vote${voteDebatePath}`}
                >
                  {debate.showAs}
                </a>
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <div className="modal contribution-modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Contributions {formattedDate}</p>
        </header>
        <section className="modal-card-body">
          <div className="content">
            {debates.length > 0 && <DebateSection />}
            {votes.length > 0 && <VoteSection />}
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
