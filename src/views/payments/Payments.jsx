import { useRef, useState } from "react";
import {
  useChangeStatusMutation,
  useGeneratePaymentsReportMutation,
  useGetPaymentsQuery,
} from "./../../store/api/payments/paymentApi";
import { Col, Form, InputGroup, Pagination } from "react-bootstrap";
import BigSpinner from "../../components/Loader/BigSpinner";
import PaymentFilter from "./components/PaymentFilter";
import PaymentForm from "./components/PaymentForm";
import PaymentModal from "./components/PaymentModal";
import PaymentCard from "./components/PaymentCard";
import "./payments.scss";
import PaymentMap from "./components/PaymentMap";
import { FaPlus } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa6";
import PaymentCollectedByInput from "./components/PaymentCollectedByInput";
import CsvDownloadButton from "react-json-to-csv";
import { useToasts } from "react-toast-notifications";
import { paymentReportHeaders } from "./paymenthelper";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { addToast } = useToasts();

  // =============== For Filter options
  const [filter, setFilter] = useState({});
  const handleFilter = (filterOptions) => {
    setFilter((prev) => ({ ...prev, ...filterOptions }));
    setShowModal(false);
  };

  const { data, isLoading, isError, isSuccess, error } = useGetPaymentsQuery({
    searchTerm,
    page: currentPage,
    filter,
  });
  const { data: payments, totalCount } = data || {};

  // setting number of pages for pagination
  const numberOfPages = [];
  for (let i = 1; i <= Math.ceil(totalCount / 20); i++) {
    numberOfPages.push(i - 1);
  }

  // for modal
  const [showModal, setShowModal] = useState(false);
  const [modalChildren, setModalChildren] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // function to open modal and set modal title and modal children to show in modal
  const openModal = (modalType, param = {}) => {
    setShowModal(true);
    switch (modalType) {
      case "filter":
        setModalChildren(
          <PaymentFilter
            setShowModal={setShowModal}
            currentFilter={filter}
            handleFilter={handleFilter}
          />
        );
        setModalTitle("Filter");
        break;
      case "add":
        setModalChildren(
          <PaymentForm type="add" setShowModal={setShowModal} />
        );
        setModalTitle("Add Payment");
        break;
      case "edit":
        setModalChildren(
          <PaymentForm
            type="edit"
            paymentData={param}
            setShowModal={setShowModal}
          />
        );
        setModalTitle("Edit Payment");
        break;
      case "collected":
        setModalChildren(
          <PaymentCollectedByInput
            paymentId={param}
            setShowModal={setShowModal}
          />
        );
        setModalTitle("Collected By :");
        break;
      case "report" : 
          setModalChildren(
            <div className="d-flex w-100 justify-content-end">
              <button className="btn btn-danger text-white" onClick={() => setShowModal(false)}>Cancel</button>
              <CsvDownloadButton data={param} filename="payment_report.csv" headers={paymentReportHeaders} delimiter="," className="btn btn-primary"/>
            </div>
          )
          setModalTitle("Click below button to download the report.");
          break;
      default:
        return null;
    }
  };


  // ================ For change status
  const [changeStatus] = useChangeStatusMutation();

  const handleChangeStatus = async (status, paymentId) => {
    if (status === "collected") {
      return openModal(status, paymentId);
    }
    try {
      await changeStatus({ status, paymentId });
    } catch (error) {
      console.log("Error in changing status", error);
    }
  };

  // ============== For Active Payment to display in Map
  const [activePayment, setActivePayment] = useState(null);

  const handleCardClick = (paymentData) => {
    if (!activePayment || paymentData?.id !== activePayment?.id) {
      setActivePayment({ id: paymentData?.id, data: paymentData });
    } else {
      setActivePayment(null);
    }
  };

  // =============== refresh function
  const handleRefresh = () => {
    setFilter(null);
    setSearchTerm("");
  };

  // =============== Report Generation
  const [generatePaymentsReport] = useGeneratePaymentsReportMutation();

  const handleGenerateReport = async () => {
    try {
      const response = await generatePaymentsReport({ filter });
      if (response?.data?.success && response?.data?.data) {
        openModal("report", response?.data?.data);
      } else {
        addToast(response?.data?.message || "Something went wrong", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.log("Error in generating reports", error);
      addToast(error?.response?.message || "Something went wrong", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <main className="payment-container d-flex flex-column w-100">
        {isLoading && (
          <div className="d-flex">
            <BigSpinner />
          </div>
        )}
        {isError && (
          <h3 className="text-center" style={{ fontSize: "18px" }}>
            {error?.message || "Something went wrong, please try again later."}
          </h3>
        )}
        <div className="section-container">
          {/* left payment cards */}
          <section className="left-container">
            <div className="d-flex justify-content-between">
              <div className="search-filter">
                {/* search */}
                <Form>
                  <Form.Row>
                    <Col xs={7}>
                      <Form.Control
                        size="sm"
                        placeholder="Company or contact name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e?.target?.value)}
                      />
                    </Col>
                    <Col xs={5}>
                      <InputGroup>
                        <InputGroup.Append>
                          {/* <button
                        className="add-btn text-capitalize btn btn-success"
                        type="button"
                        // onClick={search}
                      >
                        <i
                          className="feather icon-search"
                          style={{ margin: 0 }}
                        ></i>
                      </button> */}
                          <button
                            className="text-capitalize btn btn-warning btn-sm"
                            type="button"
                            onClick={() => openModal("filter")}
                            title="Filter"
                          >
                            <i
                              className="feather icon-filter"
                              style={{ margin: 0 }}
                            ></i>
                          </button>
                          <button
                            className="text-capitalize btn btn-danger btn-sm"
                            type="button"
                            onClick={() => handleRefresh()}
                            title="Refresh"
                          >
                            <i
                              className="feather icon-refresh-cw"
                              style={{ margin: 0 }}
                            ></i>
                          </button>
                          {/* add button */}
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => openModal("add")}
                            title="Add"
                          >
                            <FaPlus />
                          </button>
                          <button
                            type="button"
                            disabled={payments?.length === 0 || searchTerm}
                            onClick={() => handleGenerateReport()}
                            className="btn btn-sm btn-secondary"
                            title="Report"
                          >
                            <FaPrint />
                          </button>
                        </InputGroup.Append>
                      </InputGroup>
                    </Col>
                  </Form.Row>
                </Form>
              </div>
            </div>
            {isSuccess && (
              <>
                <small className="count">Count : {payments?.length}</small>
                {/* cards */}
                {payments && payments?.length === 0 ? (
                  <h6>No payments to display.</h6>
                ) : (
                  <div className="cards">
                    {payments.map((payment, index) => (
                      <PaymentCard
                        paymentData={payment}
                        handleEdit={openModal}
                        handleChangeStatus={handleChangeStatus}
                        key={payment.id}
                        handleCardClick={handleCardClick}
                        active={payment?.id === activePayment?.id}
                        index={index}
                        currentPage={currentPage}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {isSuccess && (
            <section className="right-container">
              <PaymentMap
                payments={payments}
                activePayment={activePayment}
                isLocation={false}
              />
            </section>
          )}
        </div>

        {isSuccess && (
          <Pagination className="pagination-container">
            <Pagination.First onClick={() => setCurrentPage(0)} />
            <Pagination.Prev
              onClick={() =>
                setCurrentPage(currentPage > 0 ? currentPage - 1 : currentPage)
              }
            />
            {numberOfPages?.map((page) => (
              <Pagination.Item onClick={() => setCurrentPage(page)} key={page}>
                {page + 1}{" "}
                {page == currentPage ? `of ${numberOfPages?.length}` : ""}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() =>
                setCurrentPage(
                  currentPage < numberOfPages?.length - 1
                    ? currentPage + 1
                    : currentPage
                )
              }
            />
            <Pagination.Last
              onClick={() => setCurrentPage(numberOfPages?.length - 1)}
            />
          </Pagination>
        )}
      </main>

      {/* Modal */}
      <PaymentModal
        title={modalTitle}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        {modalChildren}
      </PaymentModal>
    </>
  );
};

export default Payments;
