import React from "react";

import {
  JobInfo,
  ScheduleInfo,
  CommentInfo,
  ScheduleStatusRow,
  ScheduleButtonRow,
} from "./info";

import "./ScheduleCard.scss";

const ScheduleCard = ({ schedule }) => {
  return (
    <article id="schedule-card">
      <section className="column1">
        <JobInfo schedule={schedule} />
      </section>
      <section className="column2">
        <ScheduleInfo schedule={schedule} />
      </section>
      <section className="column3">
        <CommentInfo schedule={schedule} />
      </section>
      <section className="column4">
        <ScheduleStatusRow schedule={schedule} />
        <ScheduleButtonRow schedule={schedule} />
      </section>
    </article>
  );
};

export default ScheduleCard;
