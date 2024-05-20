import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  Row,
  Col,
  Navbar,
  Form,
  Modal,
  Button,
  FormGroup,
} from "react-bootstrap";
import CsvDownloadButton from 'react-json-to-csv'
import { FaFileCsv } from "react-icons/fa";
// import { mkConfig, generateCsv, download } from 'export-to-csv'
// import { mkConfig, generateCsv, download } from "export-to-csv";
// import { mkConfig, generateCsv, download } from 'export-to-csv'
import { FaFilter, FaPlus } from "react-icons/fa";

import Select from "react-select";

import "../securevehicle.scss";

function VehicleHeader({
  setColumnFilters,
  columnFilters,
  table,
  ShowAddModal,
}) {



  // const csvConfig = mkConfig({
  //   fieldSeparator: ',',
  //   filename: 'sample', 
  //   decimalSeparator: '.',
  //   useKeysAsHeaders: true,
  // })
  
  const exportExcel = (rows) => {
    const rowData = rows.map((row) =>{
      let data={}
      Object.keys(row.original).forEach(key=>{

        if(key!='secure_path'&&
        key!='secure_vehicle_logs'&&
        key!='createdAt'&&
        key!='securePathId'&&
        key!='updatedAt'
      )
        {
            data[key]=row.original[key]
        }
      })
      return data
    })
    console.log(rowData)
    return rowData
  }

  const [startDate, setStartDate] = useState(new Date("2010-01-01"));
  const [endDate, setEndDate] = useState(new Date("2050-01-01"));
  const dateOneRef = useRef("");
  const dateTwoRef = useRef("");

  const [payment, setPayment] = useState({
    value: "all",
    label: "ALL",
  });
  const [status, setStatus] = useState({
    value: "all",
    label: "ALL",
  });

  return (
    <div className="container-v">
      <p>COUNT:<strong>{table.getFilteredRowModel().rows.length}</strong></p>
      <div className="header-side">
        <div className="v-select-row">
          <Form.Group controlId="category" className="mx-2">
            {/* <Form.Label>STATUS:</Form.Label> */}

            <div style={{ width: "7rem",fontSize:'14px' }}>
              <Select
                selectedValue={status}
                menuPlacement="auto"
                menuPosition="fixed"
                value={status}
                options={[
                  {
                    value: "all",
                    label: "ALL STATUS",
                  },
                  {
                    value: "active",
                    label: "ACTIVE",
                  },
                  {
                    value: "expired",
                    label: "EXPIRED",
                  },
                  {
                    value: "installed",
                    label: "INSTALLED",
                  },
                  {
                    value: 'not installed',
                    label: "NOT INSTALLED",
                  },
                  {
                    value: "certificate only",
                    label: "CERTIFICATE ONLY",
                  },
                  {
                    value: "removed",
                    label: "REMOVE",
                  },
                ]}
                onChange={setStatus}
                maxMenuHeight={200}
              />
            </div>
          </Form.Group>

          <Form.Group controlId="category" className="mr-4">
            {/* <Form.Label>PAYMENT:</Form.Label> */}

            <div style={{ width: "6rem",fontSize:'14px' }}>
              <Select
                selectedValue={payment}
                menuPlacement="auto"
                menuPosition="fixed"
                value={payment}
                options={[
                  {
                    value: "all",
                    label: "ALL PAYMENT",
                  },
                  {
                    value: "paid",
                    label: "PAID",
                  },
                  {
                    value: "not paid",
                    label: "NOT PAID",
                  },
                ]}
                onChange={setPayment}
                maxMenuHeight={300}
              />
            </div>
          </Form.Group>
        </div>

        <div style={{position:"relative"}}>
          <label style={{
            position:'absolute',
            fontSize:'13px',
            fontWeight:'400',
            top:'-20px',
            right:'280px'
            }}>REG EXPIRY DATE :</label>
        
        <div className="">
          <Col className="date-range-picker d-flex justify-content-between align-items-center ">
            <div className="dates">
              <input
                ref={dateOneRef}
                formd
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control inpt-date"
                type="date"
              />
            </div>
            <div className="date-separator-to"> To </div>
            <div className="dates">
              <input
                ref={dateTwoRef}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
                type="date"
              />
            </div>

            {columnFilters?.length > 0 ? (
              <>
                <Button
                  className="mt-sm-1"
                  variant="danger"
                  onClick={() => {
                    table.resetColumnFilters();
                    setPayment({
                      value: "all",
                      label: "ALL",
                    });

                    setStatus({
                      value: "all",
                      label: "ALL",
                    });
                    setStartDate(new Date("2010-01-01"));
                    setEndDate(new Date("2050-01-01"));
                    dateOneRef.current.value = "";
                    dateTwoRef.current.value = "";
                  }}
                >
                  <i
                    className="feather icon-refresh-cw"
                    style={{ margin: 0 }}
                  ></i>
                </Button>
              </>
            ) : (
              <>
                <Button
                  style={{
                    fontSize:'1em'
                  }}
                  className="mt-sm-1"
                  variant="dark"
                  onClick={() => {
                    setColumnFilters([
                      {
                        id: "vehicle_status",
                        value: status.value,
                      },
                      {
                        id: "payment",
                        value: payment.value,
                      },
                      {
                        id: "reg_exp",
                        value: {
                          one: startDate,
                          two: endDate,
                        },
                      },
                    ]);
                  }}
                >
                  APPLY
                </Button>
              </>
            )}
          </Col>
        </div>

        </div>
        <div className="">
          {" "}
          <Button onClick={ShowAddModal} className="btn-add">
            ADD <FaPlus />{" "}
          </Button>{" "}
          {/* <Button onClick={()=>exportExcel(table.getFilteredRowModel().rows)} className="btn-add">
            ADD <FaPlus />{" "}
          </Button>{" "} */}
          
         {
          localStorage.getItem('loginUserId')==1?<>
           <CsvDownloadButton 
           style={{ 
           height:'39%',
           borderRadius:'0.5em',
            display:"inline-block",
            cursor:"pointer","color":"#ffffff",
            fontSize:"1em",
            marginBottom:'2px',
            // fontWeight:"bold",
            padding:"2px 0px",
            // textDecoration:"none",
            // textShadow:"0px 1px 0px #9b14b3"
            }}
           
          className="btn-dark"
          data={exportExcel(table.getFilteredRowModel().rows)} 
          delimiter="," 
          filename='vehicle_details.csv'
          headers={[
          "id",
          "vehicle_type",
          "chassis_no",
          "vehicle_make",
          "vehicle_model_year",
          "vehicle_color",
          "emirates",
          "vehicle_category",
          "plate_code",
          "plate_number",
          "reg_exp",
          "device_model",
          "imei",
          "doi",
          "certi_exp",
          "sim_sno",
          "sim_no",
          "ird",
          "payment",
          "vehicle_status",
          ]}

          ><FaFileCsv size={30}/>
          </CsvDownloadButton>
          
          </>:<></>
         }
          {/* <CsvDownloadButton className="btn-dark" delimiter=',' filename='vehicle.csv' data={table.getFilteredRowModel().rows.map((row) => row.original)} /> */}
        </div>
      </div>
    </div>
  );
}

export default VehicleHeader;
