import SecurePath from "./SecurePath"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState,memo } from "react";
import CompanyDetails from "./components/CompanyDetails";
import OwnerDetails from "./components/OwnerDetails";
import {
  useFetchSecurepathQuery,
  useFetchcategoryQuery,
} from "../../store/api/securepath/securepathApi";
import { OverlayTrigger,Tooltip } from "react-bootstrap";
import "./securepath.scss"
function SecurePathWrapper() {
  const { data, isLoading, isError,isSuccess } = useFetchSecurepathQuery(
    { count: 5 },
    { refetchOnMountOrArgChange: true }
  );
  const bussiness_category = useFetchcategoryQuery();

  const [UpdateFields, setUpdatedField] = useState({ current: {} });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20, 
  });
  const handleShowUpdateModal = () => setShowUpdateModal(true);

  const columns = [
    {
      header: "COMPANY NAME",
      accessorKey: "company_name",
      filterFn: (row, columnId, filterValue) =>row.original.company_name===filterValue,
      cell: (props) => (
        <CompanyDetails
          name={props.getValue()}
          type={props.row.original.type}
          status={props.row.original.status}
          count={props.row.original.vehicleCount}
          registration_status={props.row.original.registration_status}
          row={props.row.original}
          // UpdateFields={UpdateFields}
          setUpdatedField={setUpdatedField}
          handleShowUpdateModal={handleShowUpdateModal}
        />
      ),
    },
    {
      header: "TL/TF.NO",
      accessorKey: "trade_license_no",
      cell: (r) => (
        <>
         <OverlayTrigger
              placement='top'
              overlay={<Tooltip id={`tooltip-top`}>Trade License No</Tooltip>}
            >
             <div   className="my-4 pointer">{r.row.original?.trade_license_no??""}</div>
         </OverlayTrigger>
         <OverlayTrigger
              placement='top'
              overlay={<Tooltip id={`tooltip-top`}>Traffic File No</Tooltip>}
            >
              <div className="my-4 pointer">{r.row.original?.traffic_file_no??""}</div>
         </OverlayTrigger>
          
          
        </>
      ),
    },
    {
      header: "TRAFFIC FILE NO",
      accessorKey: "traffic_file_no",
    },
    {
      header: "BUSSINIESS CATEGORY",
      cell: (r) => <div>{r.getValue()}</div>,
      accessorFn: (row) => row.bussiness_category.name,
      // accessorKey: "company_business_category",
      accessorKey: "bussiness_category_name",
      filterFn: (row, columnId, filterValue) => {
        if (filterValue == "all-bussiness") {
          return true;
        }
        return row.original.bussiness_category.name === filterValue;
      },
      // cell:(p)=><>{p.row.original.bussiness_category.name}</>
    },
    {
      header: "OWNER DETAILS",
      accessorKey: "company_owner_name",
      cell: (props) => (
        <OwnerDetails
          name={props.getValue()}
          phone={props.row?.original?.phone??""}
          email={props.row?.original?.email??""}
        />
      ),
    },
    {
      header: "ADDRESS",
      accessorKey: "address",
      cell: (props) => (
        <div className="adress">
          {`${props.getValue()??""}`.replace(/.{24}\S*\s+/g, "$&@")
            .split(/\s+@/)
            .map((i) => (
              <p className="my-1">{i}</p>
            ))}
  
          {props.row.original.zip_code}
        </div>
      ),
    },
    {
      header: "EMAIL",
      accessorKey: "email",
    },
    {
      header: "PHONE",
      accessorKey: "phone",
    },
    {
      header: "ZIP CODE",
      accessorKey: "zip_code",
    },
    {
      header: "REMARK",
      accessorKey: "remarks",
      cell: (props) => (
        <div className="adress">
         {
          props.getValue()==''?"no remarks":
          <>
           {props
            .getValue()
            .replace(/.{10}\S*\s+/g, "$&@")
            .split(/\s+@/)
            .map((i) => (
              <p className="my-1">{i}</p>
            ))}
          </>
         }
        </div>)
    
    },
    {
      accessorKey: "type",
      filterFn: (row, columnId, filterValue) => {
        if (filterValue == "all-type") {
          return true;
        }
        return row.original.type === filterValue;
      },
    },
    {
      // header: "status",
      accessorKey: "status",
  
      filterFn: (row, columnId, filterValue) => {
        if (filterValue == "all-status") {
          return true;
        }
        return row.original.status === filterValue;
      },
    },
  ];

  return (
    <>
  <SecurePath
    setShowUpdateModal={setShowUpdateModal}
    columns={columns}
    UpdateFields={UpdateFields}
    showUpdateModal={showUpdateModal}
    data={data}
    isLoading={isLoading}
    isError={isError}
    isSuccess={isSuccess}
    bussiness_category={bussiness_category}
    pagination={pagination}
    setPagination={setPagination}
    />
    </>
  )
}

export default SecurePathWrapper