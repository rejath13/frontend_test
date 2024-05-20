import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { getSingleJob } from "../../../../../store/slices/jobs/jobSlice";
import {
  useSendMailMutation,
  useGetTraccarCredentialsQuery,
} from "../../../../../store/api/jobs/jobsApi";
import { closeModal } from "../../../../../store/slices/jobs/jobsModalSlice";
import { Oval } from "react-loader-spinner";
import { TbMail, TbMailOff } from "react-icons/tb";
import CryptoJS from "crypto-js";
import {
  mailGreeting,
  mailMainContent,
} from "../../../helpers/job-card-helper";
import "./SendMailContent.scss";

const SendMailContent = () => {
  //
  const dispatch = useDispatch();

  const [sendMail, { isLoading, isSuccess, isError }] = useSendMailMutation();

  const [showAlert, setShowAlert] = useState({
    alertError: isError,
    alertSuccess: isSuccess,
  });

  const { data } = useSelector((state) => state.jobsModal);

  if (data.jobId) {
    dispatch(getSingleJob(data.jobId));
  }
  const job = useSelector((state) => state.jobs.jobDetails);

  const initialMailContent = {
    toAddress: job?.salesPlus.customerEmail,
    ccAddress: ``,
    greeting: mailGreeting,
    mainContent: mailMainContent,
  };

  const [mailContent, setMailContent] = useState(initialMailContent);

  useEffect(() => {
    job ??
      setMailContent({
        ...mailContent,
        toAddress: job?.salesPlus.customerEmail,
      });
  }, []);
  const { data: encryptedData } = useGetTraccarCredentialsQuery(
    job.salesPlus?.traccarId
  );

  const decryptData = (dataToDecrypt) => {
    const secretKey = "locator@12345$";
    try {
      // Decrypt data using crypto-js
      const decryptedData = CryptoJS.AES.decrypt(
        dataToDecrypt,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (err) {
      console.log("err ", err);
    }
  };

  let mailContentValue = mailContent.mainContent;

  if (encryptedData) {
    mailContentValue =
      encryptedData &&
      mailContent.mainContent.replace(
        /\{{(\w+)\}}/g,
        (match, placeholder) => decryptData(encryptedData)[placeholder]
      );
  }

  useEffect(() => {
    if (isError) {
      setShowAlert({ ...showAlert, alertError: true });
    } else {
      setShowAlert({ ...showAlert, alertError: false });
    }
    if (isSuccess) {
      setShowAlert({ ...showAlert, alertSuccess: true });
    } else {
      setShowAlert({ ...showAlert, alertSuccess: false });
    }
  }, [isError, isSuccess]);

  const handleSendMail = async (jobId) => {
    // Encode newline characters before sending to the server
    const encodedFormData = Object.keys(mailContent).reduce((acc, key) => {
      acc[key] = encodeURIComponent(mailContent[key]);
      return acc;
    }, {});

    if (!mailContent.toAddress) {
      setMailContent({
        ...mailContent,
        toAddress: job?.salesPlus.customerEmail,
      });
    }

    const response = await sendMail({
      encryptedData,
      mailContent: encodedFormData,
    });
  };

  return (
    // The Modal Component is inside JobsModal. These will be injected into the modal when it is opened
    <>
      <Modal.Header closeButton>
        <Modal.Title>Send Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="send-mail-modal">
          {job.salesPlus?.traccarId && (
            <div className="mail-form-container">
              {isLoading && (
                <div className="loader-container">
                  <Oval
                    height={80}
                    width={80}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              )}
              <Form>
                <fieldset disabled={isLoading ? true : false}>
                  <div className="form-items">
                    <Form.Group controlId="formCustomerEmail">
                      <Form.Label>To:</Form.Label>
                      <Form.Control
                        type="text"
                        value={job?.salesPlus.customerEmail}
                        onChange={(e) =>
                          setMailContent({
                            ...mailContent,
                            toAddress: e.target.value,
                          })
                        }
                        // disabled
                        placeholder="Enter email"
                      />
                    </Form.Group>
                    <Form.Group controlId="formCopyEmail">
                      <Form.Label>CC:</Form.Label>
                      <Form.Control
                        type="text"
                        value={mailContent.ccAddress}
                        onChange={(e) =>
                          setMailContent({
                            ...mailContent,
                            ccAddress: e.target.value,
                          })
                        }
                        placeholder="Email CC:"
                      />
                    </Form.Group>
                    <Form.Group controlId="formMailGreetin">
                      <Form.Label>Mail Greeting</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        value={mailContent.greeting}
                        onChange={(e) =>
                          setMailContent({
                            ...mailContent,
                            greeting: e.target.value,
                          })
                        }
                        placeholder="Mail Greeting"
                      />
                    </Form.Group>
                    <Form.Group controlId="formMailContent">
                      <Form.Label>Mail Content</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={10}
                        value={mailContentValue}
                        onChange={(e) =>
                          setMailContent({
                            ...mailContent,
                            mainContent: e.target.value,
                          })
                        }
                        placeholder="Main content of mail"
                      />
                    </Form.Group>
                  </div>
                </fieldset>
              </Form>
            </div>
          )}
          {!job.salesPlus?.traccarId && (
            <div className="traccar-id-alert-container">
              <Alert variant="info" className="bg-light">
                <h6 className="text-danger text-center font-weight-bold">
                  Traccar Id not yet created. <br /> Please create Traccar User
                  to send mail
                </h6>
              </Alert>
            </div>
          )}
        </section>
      </Modal.Body>
      <Modal.Footer>
        {job?.salesPlus?.customerMailSent === "1" && (
          <div>
            <Alert variant="warning">
              Mail Already Sent - customer mail sent -{" "}
              {job?.salesPlus?.customerMailSent}
            </Alert>
          </div>
        )}
        {showAlert.alertError && (
          <Alert
            variant="danger"
            dismissible
            onClick={() => setShowAlert({ ...showAlert, alertError: false })}
          >
            Something went wrong! Please try again!
          </Alert>
        )}
        {showAlert.alertSuccess && (
          <Alert
            variant="success"
            dismissible
            onClick={() => setShowAlert({ ...showAlert, alertSuccess: false })}
          >
            Mail Sent Successfully !
          </Alert>
        )}
        <Button
          variant={!job.salesPlus?.traccarId ? "light" : "success"}
          disabled={!job.salesPlus?.traccarId ? true : false}
          onClick={() => handleSendMail(mailContent)}
          className="send-mail-button"
        >
          {isLoading ? "Sending" : "Send"}
          {!job.salesPlus?.traccarId ? (
            <TbMailOff className="icon" />
          ) : (
            <TbMail className="icon" />
          )}
        </Button>

        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
      </Modal.Footer>
    </>
  );
};

export default SendMailContent;
