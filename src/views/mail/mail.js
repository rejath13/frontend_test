import React, { useState, useEffect,useRef } from "react";
import {
  Row,
  Col,
  Tabs,
  Table,
  Button,
  Form,
  Pagination,
  OverlayTrigger,
  Tooltip,
  Modal,
  Card,
} from "react-bootstrap";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy, usePagination } from "react-table";
import RichTextEditor from "react-rte";
import "./mail.css";
import { API_URL } from "../../config/constant";

import PostRequest from "../../services/PostRequest";
import { showAlert } from "../../services/alert";
import Moment from "moment";
import CkClassicEditor from "../../components/CK-Editor/CkClassicEditor";



const AttachmentsPreview = ({name,file,onDelete}) => {

    return(
        <Card style={{ width: '14rem', margin : 10 }}>
            {file && <Card.Img height={100} width={100}  variant="top" src={file}/>}
            <Card.Body style={{padding : 5}}>
            <Card.Text>
                {name}
            </Card.Text>
             <Button onClick={onDelete} size="sm" variant="primary">Remove</Button>
            </Card.Body>
        </Card>

    )
}


function DynamicTable({ columns, data, fromNumber, toNumber, totalCount }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { sortBy, pageIndex },
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
      initialState: { pageIndex: 0 },
      // manualPagination: true,
      pageCount: Math.ceil(totalCount / 10),
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <BTable striped bordered hover responsive {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ whiteSpace: "normal" }}
                  className={column.className}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <span className="feather icon-arrow-down text-muted float-right mt-1" />
                      ) : (
                        <span className="feather icon-arrow-up text-muted float-right mt-1" />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps({
                        className: cell.column.className,
                      })}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <Row className="justify-content-between mt-3">
        <Col sm={12} md={4}>
          <span className="d-flex align-items-center">
            Page{" "}
            <strong>
              {" "}
              {pageIndex + 1} of {pageOptions.length}{" "}
            </strong>{" "}
            | Go to page:{" "}
            <input
              type="number"
              className="form-control ml-2"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>
        </Col>
        <Col sm={12} md={4}>
          <span>
            {fromNumber} - {toNumber} of {totalCount} items
          </span>
        </Col>
        <Col sm={12} md={4}>
          <Pagination className="justify-content-end">
            <Pagination.First
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </>
  );
}

const Mail = () => {
  const authToken = localStorage.getItem("authToken");
  const [composeModal, setComposeModal] = useState(false);
  const [body, setBody] = useState(``);
  const [technicians, gettechnicians] = useState([]);

  const [activePerson, setActivePerson] = useState("");

  const [sandboxMails, setSandboxMails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);


  const formRef = useRef();


  const fileSelectedHandler = (event) => {
    const files = Array.from(event.target.files);

    const fileUrls = files.map((file) => ({
      file,
      url: file.type.includes("image") ? URL.createObjectURL(file) : null,
    }));

    setSelectedFiles([...selectedFiles, ...files]);
    setPreviewUrls([...previewUrls, ...fileUrls]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);

    const updatedUrls = [...previewUrls];
    updatedUrls.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setPreviewUrls(updatedUrls);
  };

  const toggleComposeModal = () => setComposeModal(!composeModal);

  const fetchtechnicians = async () => {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = API_URL + "technicians";

    const response = await fetch(url, options);

    const techs = await response.json();

    gettechnicians(techs.data);
  };

  const loadSandbox = async () => {
    try {
      setIsLoading(true);
      const mails = await PostRequest("/sales/sandbox");
      setSandboxMails(mails);
    } catch (error) {
      showAlert({ title: "Oops!", type: "error", text: error });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (technicians.length !== 0) {
      setActivePerson(technicians[0].technician_id);
    }
  }, [technicians]);

  const handlesSendMail = async (e) => {

    e.preventDefault();

    const data = new FormData(e.target);
    console.log(activePerson, technicians);
    const from = technicians.find((t) => t.technician_id == activePerson);
    console.log("from", from);

    data.append("from", from.technician_email);
    data.append("body", body.toString("html"));


    selectedFiles.map(f => {
        data.append("attachments", f);
    })

    try {
      const mailResponse = await PostRequest(
        "/sales/send-mail",
        data,
        "sendMailButton",
        true
      );

      showAlert({
        title: "Mail Sent!",
        type: "success",
        text: `Mail has been sent to ${mailResponse.mailTo}`,
      });

      formRef.current.reset();


    } catch (error) {
      console.log("Error", error);
      showAlert({ title: "Oops!", type: "error", text: error });
    } finally {
        setComposeModal(false)
    }
  };

  useEffect(() => {
    fetchtechnicians();
    loadSandbox();
  }, []);

  const columns = React.useMemo(() => [
    {
      Header: "Date",
      accessor: "createdAt",
      disableSortBy: false,
      Cell: ({ row }) => {
        return <span>{Moment(row.original.createdAt).format("LLL")}</span>;
      },
    },
    {
      Header: "Sales Person",
      accessor: "mailFrom",
      disableSortBy: true,
    },
    {
      Header: "To Address",
      accessor: "mailTo",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "mailSubject",
      disableSortBy: true,
    },
    {
      Header: "No. of Attachments",
      accessor: "mailAttachments",
      disableSortBy: true,
      Cell: ({ row }) => {
        try {
          var attachments = JSON.parse(row.original.mailAttachments);
          return (
            <span className="badge badge-primary"> {attachments.length} </span>
          );
        } catch (error) {
          console.log(error);
          return <span className="badge badge-primary"> 0</span>;
        }
      },
    },
  ]);

  return (
    <React.Fragment>
      <Modal
        show={composeModal}
        onHide={toggleComposeModal}
        backdrop="static"
        size="lg"
        className="mail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Compose Mail</Modal.Title>
        </Modal.Header>
        <form ref={formRef} onSubmit={(e) => handlesSendMail(e)}>
          <Modal.Body>
            <Row>
              <Col md="12">
                <Form.Group>
                  <Form.Control
                    controlId="sales_person_id"
                    onChange={(v) => setActivePerson(v.target.value)}
                    as="select"
                    defaultValue={activePerson}
                    name="sales_person_id"
                  >
                    {technicians &&
                      technicians.map((person) => (
                        <option
                          key={person.technician_id}
                          value={person.technician_id}
                        >
                          {person.technician_name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="12">
                <Form.Group>
                  <Form.Control
                    type="email"
                    name="to"
                    placeholder="To Address"
                  />
                </Form.Group>
              </Col>
              <Col md="12">
                <Form.Group>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="Subject"
                  />
                </Form.Group>
              </Col>
              <Col md="12">
                <Form.Group>
                  <Form.Label>Body</Form.Label>
                  <CkClassicEditor  
                    html={body}
                    onChange={ (  editor ) => {
                        const data = editor.getData();
                        setBody( data );
                    } }
                  />
                </Form.Group>
              </Col>
              <Col md="12">
                <Form.Group>
                  <Form.Label>Attachments</Form.Label>
                  <div className="custom-file">
                    <Form.Control
                      multiple
                      onChange={fileSelectedHandler}
                      type="file"
                      className="custom-file-input"
                      id="validatedCustomFile"
                    />
                    <Form.Label
                      className="custom-file-label"
                      htmlFor="validatedCustomFile"
                    >
                      Choose file...
                    </Form.Label>
                  </div>
                </Form.Group>

                {previewUrls.length > 0 && (
                  <div className="d-flex p-2">
                    {previewUrls.map((fileObj, index) => (
                      <React.Fragment key={fileObj.file.name}>
                        {fileObj.url && <AttachmentsPreview name={fileObj.file.name} file={fileObj.url} onDelete={ () => removeFile(index) }  /> }
                        {!fileObj.url && <AttachmentsPreview name={fileObj.file.name} file={false} onDelete={ () => removeFile(index) }  />}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" id="sendMailButton" type="submit">
              Send Mail
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Row>
        <Col className="text-end" md="12">
          <button
            className="text-capitalize btn btn-primary"
            type="button"
            onClick={toggleComposeModal}
            style={{ marginRight: "3px", padding: "10px 15px", float: "right" }}
          >
            <i
              className="fas fa-plus"
              style={{ margin: 0, fontSize: "16px" }}
            ></i>{" "}
            Compose
          </button>
        </Col>
        <Col>
          <Card>
            <Card.Body style={{ padding: "15px" }}>
              <DynamicTable
                columns={columns}
                data={sandboxMails}
                fromNumber={1}
                toNumber={10}
                totalCount={sandboxMails.length}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Mail;
