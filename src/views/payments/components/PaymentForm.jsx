import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import {
  emiratesOptions,
  fetchUserId,
  paymentOptions,
  paymentValidationSchema,
  statusOptions,
  invoiceOptions,
  collectedByOptions,
} from "../paymenthelper";
import { Formik } from "formik";
import { useToasts } from "react-toast-notifications";
import {
  useAddPaymentMutation,
  useEditPaymentMutation,
} from "../../../store/api/payments/paymentApi";
import PaymentAutoCompleteMap from "./PaymentAutoCompleteMap";
import PaymentRemarkInput from "./PaymentRemarkInput";

const PaymentForm = ({ type, paymentData, setShowModal }) => {
  const [remarks, setRemarks] = useState(
    type === "edit" ? paymentData?.remarks : []
  );
  const [currentRemark, setCurrentRemark] = useState("");
  const initialValues = {
    postedBy: fetchUserId(),
    companyName: paymentData?.companyName || "",
    contactName: paymentData?.contactName || "",
    contactNumber: paymentData?.contactNumber || "",
    status: paymentData?.status || "open",
    amount: paymentData?.amount || "",
    emirate: paymentData?.emirate || "Dubai (DU)",
    paymentType: paymentData?.paymentType || "cheque",
    originalInvoice: paymentData?.originalInvoice || "no",
    coordinate:
      paymentData?.latitude && paymentData?.longitude
        ? `${paymentData?.latitude}, ${paymentData?.longitude}`
        : "",
    note: paymentData?.note || "",
    location: paymentData?.location || "",
    collectedBy: paymentData?.collectedBy || "",
  };

  const [addPayment] = useAddPaymentMutation();
  const [editPayment] = useEditPaymentMutation();
  const { addToast } = useToasts();

  const onSubmitPayment = async (formData) => {
    let response;
    if (type === "add") {
      response = await addPayment(formData);
      return response;
    } else if (type === "edit") {
      formData = { ...formData, remarks: remarks };
      if (currentRemark && currentRemark?.remark) {
        formData.remarks = [currentRemark, ...formData.remarks];
      }
      response = await editPayment({
        paymentId: paymentData?.id,
        payment: formData,
      });
      return response;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentValidationSchema}
      onSubmit={(values) => {
        onSubmitPayment(values)
          .then((response) => {
            if (response?.data?.success) {
              addToast(response?.data?.message, {
                appearance: "success",
                autoDismiss: true,
              });
              setShowModal(false);
              // refetch();
            } else {
              addToast(response?.message || "Something went wrong", {
                appearance: "error",
                autoDismiss: true,
              });
            }
          })
          .catch((error) => {
            addToast(error?.data?.message || "Something went wrong", {
              appearance: "error",
              autoDismiss: true,
            });
          });
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="companyName">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={values.companyName}
                onChange={handleChange}
                isInvalid={errors.companyName && touched.companyName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.companyName}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="contactName">
              <Form.Label>Contact Name</Form.Label>
              <Form.Control
                type="text"
                name="contactName"
                value={values.contactName}
                onChange={handleChange}
                isInvalid={errors.contactName && touched.contactName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="contactNumber">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="tel"
                name="contactNumber"
                value={values.contactNumber}
                onChange={handleChange}
                isInvalid={errors.contactNumber && touched.contactNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactNumber}
              </Form.Control.Feedback>
            </Form.Group>
            {type === "edit" && (
              <>
                <Form.Group as={Col} controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={
                      type === "edit" ? paymentData?.status : "Open"
                    }
                    name="status"
                    onChange={handleChange}
                    isInvalid={errors.status && touched.status}
                  >
                    <option>Choose Status</option>
                    {statusOptions?.map((status) => (
                      <option value={status.value} key={status.value}>
                        {status.title}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.status}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="collectedBy">
                  <Form.Label>Collected By</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={
                      type === "edit" ? paymentData?.collectedBy : "MIDHUN"
                    }
                    name="collectedBy"
                    onChange={handleChange}
                    isInvalid={errors.collectedBy && touched.collectedBy}
                  >
                    <option value={""}>Choose Collected By</option>
                    {collectedByOptions?.map((user, index) => (
                      <option value={user} key={index}>
                        {user}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.collectedBy}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                isInvalid={errors.amount && touched.amount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="emirate">
              <Form.Label>Emirate</Form.Label>
              <Form.Control
                as="select"
                defaultValue={
                  type === "edit" ? paymentData?.emirate : "Dubai (DU)"
                }
                name="emirate"
                onChange={handleChange}
                isInvalid={errors.emirate && touched.emirate}
              >
                <option>Choose Emirate</option>
                {emiratesOptions?.map((emirate) => (
                  <option value={emirate.value} key={emirate.id}>
                    {emirate.value}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.emirate}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="paymentType">
              <Form.Label>Payment Type</Form.Label>
              <Form.Control
                as="select"
                defaultValue={
                  type === "edit" ? paymentData?.paymentType : "cheque"
                }
                name="paymentType"
                onChange={handleChange}
                isInvalid={errors.paymentType && touched.paymentType}
              >
                <option>Choose payment option</option>
                {paymentOptions?.map((payment) => (
                  <option value={payment.value} key={payment.value}>
                    {payment.title}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.paymentType}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="originalInvoice">
              <Form.Label>Original Invoice</Form.Label>
              <Form.Control
                as="select"
                defaultValue={
                  type === "edit" ? paymentData?.originalInvoice : "no"
                }
                name="originalInvoice"
                onChange={handleChange}
                isInvalid={errors.originalInvoice && touched.originalInvoice}
              >
                <option>Choose Invoice Type</option>
                {invoiceOptions?.map((invoice) => (
                  <option value={invoice.value} key={invoice.value}>
                    {invoice.title}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.originalInvoice}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>

          {/* Location coordinate map */}
          <PaymentAutoCompleteMap
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
          />
          <Form.Row>
            <Form.Group as={Col} controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                name="note"
                value={values?.note}
                onChange={handleChange}
                isInvalid={errors.note && touched.note}
              />
              <Form.Control.Feedback type="invalid">
                {errors.note}
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          {type === "edit" && (
          <PaymentRemarkInput
            remarks={remarks}
            setRemarks={setRemarks}
            currentRemark={currentRemark}
            setCurrentRemark={setCurrentRemark}
            type={type}
          />
          )}

          <Form.Row className="justify-content-end">
            <Form.Group as={Col} md="auto">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;
