import React, { useState } from "react";

import { useSelector } from "react-redux";

import "./AdditionalFilters.scss";
import { Modal } from "react-bootstrap";

import PaymentVerifiedFilter from "./additional-filters-components/PaymentVerifiedFilter";
import MailSentStatusFilter from "./additional-filters-components/MailSentStatusFilter";
import PaymentStatusFilter from "./additional-filters-components/PaymentStatusFilter";
import AccountCreatedStatusFilter from "./additional-filters-components/AccountCreatedStatusFilter";
import SalesPersonFilter from "./additional-filters-components/SalesPersonFilter";
import ImplementationTypeFilter from "./additional-filters-components/ImplementationTypeFilter";
import DeletedStatusFilter from "./additional-filters-components/DeletedStatusFilter";
import JobStatusFilter from "./additional-filters-components/JobStatusFilter";

const AdditionalFilters = () => {
  //
  const { mainFilter } = useSelector((state) => state.jobsFilter);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Additional Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="additionalFilters">
          <div>
            <PaymentStatusFilter />
          </div>
          <div>
            <PaymentVerifiedFilter />
          </div>
          <div>
            <MailSentStatusFilter />
          </div>
          <div>
            <AccountCreatedStatusFilter />
          </div>
          <div>
            <SalesPersonFilter />
          </div>
          <div>
            <ImplementationTypeFilter />
          </div>
          <div>
            <JobStatusFilter />
          </div>

          {mainFilter === "pending" && (
            <div>
              <DeletedStatusFilter />
            </div>
          )}
        </section>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </>
  );
};

export default AdditionalFilters;
