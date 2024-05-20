import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import moment from "moment";
import { Container, Row, Col, Navbar, Form, Modal ,Badge,OverlayTrigger,Tooltip,Table} from "react-bootstrap";

import { useFetchvehiclesQuery,useFetchcompanyQuery } from "../../store/api/securepath/securepathApi";
import VehicleTable from "../secure-path/components/VehicleTable";
import "./securepath.scss"
import VehicleHeader from "./components/VehicleHeader";
import BigSpinner from "../../components/Loader/BigSpinner";
import UpdateVehicleModal from "./components/VehicleModal";
import { useState,useMemo } from "react";
import VehicleAddModal from "./components/VehicleAddModal";
import { FaEye } from "react-icons/fa";
import VehicleLogModal from "./components/VehicleLogModal";
import { useEffect,memo } from "react";
import { useSelector } from "react-redux";

function SecureVehicles(props) {

  const {pagination,setPagination}=props

  // const pageindex=useSelector(state=>state)

  const MemoVehicleTable=memo(VehicleTable)
 
  const { data, isLoading } = useFetchvehiclesQuery(  
    { count: 5 },
    { refetchOnMountOrArgChange: true }
  );


  const company_data=useFetchcompanyQuery()
  const [showUpdateModal,SetshowUpdateModal]=useState([null,null])
  const [addModal,SetAddModal]=useState(false)
  const [logmodal,SetLogModal]=useState([null,null])

  const ShowUpdateModal=(data)=>SetshowUpdateModal([true,data])
  const CloseUpdateModal=()=>SetshowUpdateModal([false,null])

  const ShowLogModal=(data)=>SetLogModal([true,data])
  const CloseLogModal=()=>SetLogModal([false,null])

  const ShowAddModal=()=>SetAddModal(true)
  const CloseAddModal=()=>SetAddModal(false)

  const [columnFilters, setColumnFilters] = useState([]);
  const [filtering, SetFiltering] = useState("");
  // const [pagination, setPagination] = useState({
  //   pageIndex:0, //initial page index
  //   pageSize: 25, //default page size
  // });
  

  const chekcRegExpire=(date)=>{
    return date<=new Date()
  }

  const columns = [
    { size: 300,
      header: "COMPANY DETAILS",
      accessorKey: "company_name",
      accessorFn: (row) => row.secure_path.company_name,
      cell:(r)=>
      <Col >
      <Row className="pt-2">
        <strong onClick={()=>ShowUpdateModal(r.row.original)} className="pointer mb-2">{r?.row?.original?.secure_path?.company_name??""}</strong>
      </Row>
      
      <Row style={{marginLeft:"-28.2px"}}>
      <Col><Badge className='bg-warning label-text'>{`${r.row.original.secure_path?.bussiness_category.name}`.toUpperCase()}</Badge></Col>
      <Col><Badge className='bg-primary label-text'>{`${r.row.original.vehicle_status}`.toUpperCase()}</Badge></Col>
      <Col><Badge className={`label-text ${r.row.original.payment=='not paid'?'bg-danger':'bg-success'}`}>{`${r.row.original.payment}`.toUpperCase()}</Badge></Col>
      <Col className="pointer" onClick={()=>ShowLogModal(r.row.original.secure_vehicle_logs)}><FaEye size={16}/></Col>
      </Row>
      </Col>
    },
    {
      header: "VEHICLE TYPE",
      accessorKey: "vehicle_type",
      cell:(r)=><>{r.row.original?.vehicle_type.toUpperCase()}</>
    },
    {

      header:<Row>
      {
       `CNO/MAKE/YEAR COLOR/CATEGORY`.split(' ').map(i=><Col>{i}</Col>)
      }
     </Row>,
      accessorKey: "chassis_no",
      cell:(r)=>
      <div className="mx-4">
      <div className="my-2">{r.row.original.chassis_no}</div>
      <div className="my-2">{r.row.original.vehicle_make}</div>
      <div className="my-2">{r.row.original.vehicle_model_year}</div>
      <div className="my-2">{r.row.original.vehicle_color}</div>
      <div className="my-2">{r.row.original.vehicle_category}</div>
      </div>
    },
   
    {
      header: "EMIRATES",
      accessorKey: "emirates",
      cell:(r)=><>{r.row.original?.emirates.toUpperCase()}</>
    },
    {
      header: "vehicle category",
      accessorKey: "vehicle_category",
    },
    {
      header: "CODE/PLATE_NO",
      accessorKey: "plate_code",
      cell:(r)=>
      <>
      <div>{r.row.original.plate_code}</div>
      <div>{r.row.original.plate_number}</div>
      </>
    },
    {
      header:
      <Row>
       {
        `DEVICE/IMEI SIM_NO/SIM_SNO`.split(' ').map(i=><Col>{i}</Col>)
       }
      </Row>,
      accessorKey: "imei",
      cell:(r)=><>
      <div className="my-2">{`${r.row?.original?.device_model??"NO DEVICE"}`.toUpperCase()}</div>
      <div className="my-2">{r.row.original.imei}</div>
      <div className="my-2">{r.row.original.sim_no}</div>
      <div className="my-2">{r.row.original.sim_sno}</div>
      
      </>
    },
    {
      header: "Date of Installation",
      accessorKey: "doi",
      cell:(row)=><>{moment(row?.row?.original?.doi).format('DD-MM-YYYY')}</>
    },
    {
      header: "Certificate Expiry Date",
      accessorKey: "certi_exp",
      cell:(row)=><>{moment(row?.row?.original?.certi_exp).format('DD-MM-YYYY')}</>
    },
    {
      header: "sim no",
      accessorKey: "sim_no",
    },
    {
      header: "sim serail",
      accessorKey: "sim_sno",
    },
    {
      header: "Insurance Renewal Date",
      accessorKey:"ird",
      cell:(row)=><>{moment(row?.row?.original?.ird).format('DD-MM-YYYY')}</>
    },
    {
      header: "payment",
      accessorKey:"payment",
      filterFn: (row, columnId, filterValue) => { 

        if(filterValue=='all'){
          return true
        }
        return row.original.payment===filterValue
      }
    },
    {
      header: "vechicle status",
      accessorKey:"vehicle_status",
      filterFn: (row, columnId, filterValue) => { 

        if(filterValue=='all'){
          return true
        }
        return row.original.vehicle_status===filterValue
      }
        
      
    },
    {
      header: "REGISTRATION EXPIRY",
      accessorKey: "reg_exp",
      cell:(row)=>
      <>
      {chekcRegExpire(new Date(row?.row?.original?.reg_exp))?
      <div style={{color:'red'}}>{moment(row?.row?.original?.reg_exp).format("DD-MM-YYYY")}</div>:
      <div>{moment(row?.row?.original?.reg_exp).format("DD-MM-YYYY")}</div>
      }
      </>,
      filterFn: (row, columnId, filterValue) => {
        let day=new Date(row?.original?.reg_exp??null)
        let frm=new Date(filterValue?.one)
        let to=new Date(filterValue?.two) 
        return  (day>frm &&day<to)
      },
      
    },

  ]

  const table = useReactTable({
    data:  data||[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: {
        sim_no: false,
        sim_sno: false,
        payment:false,
        vehicle_status:false,
        vehicle_category:false,
      },
     },
     state: {
      globalFilter: filtering,
      columnFilters,
      pagination,
     },
    //  autoResetPage: false,
     onColumnFiltersChange: setColumnFilters,
     onGlobalFilterChange: SetFiltering,
     onPaginationChange: setPagination,
    
  
  });
 
  return (
    <>
      {isLoading || company_data.isLoading? (
        <><BigSpinner/></>
      ) : (
        <div className="main-row">
         <VehicleHeader
          setColumnFilters={setColumnFilters}
          columnFilters={columnFilters}
          ShowAddModal={ShowAddModal}
          table={table}
          />
         <div className="main-layout">
         {
 showUpdateModal[1]&&(<UpdateVehicleModal
    showUpdateModal={showUpdateModal[0]}
    CloseUpdateModal={CloseUpdateModal}
    data={showUpdateModal[1]}
    table={table}
    setPagination={setPagination}
    
    />)
}
{logmodal[1]&&
 <VehicleLogModal
 ShowLogModal={logmodal[0]}
 data={logmodal[1]}
 CloseLogModal={CloseLogModal}
/>
}

{
company_data?.data&&
 <VehicleAddModal
 company={company_data?.data}
 ShowAddModal={addModal}
 CloseAddModal={CloseAddModal}
 />
}

{table&&<MemoVehicleTable table={table}/>}
</div>
</div>
       
      )}
    </>
  );
}

export default SecureVehicles;








// <VehicleHeader setColumnFilters={setColumnFilters} table={table} columnFilters={columnFilters} ShowAddModal={ShowAddModal}/>

// {
//  showUpdateModal[1]&&(<UpdateVehicleModal
//     showUpdateModal={showUpdateModal[0]}
//     CloseUpdateModal={CloseUpdateModal}
//     data={showUpdateModal[1]}
//     table={table}
//     setPagination={setPagination}
//     />)
// }

// <VehicleAddModal
// company={company_data?.data}
// ShowAddModal={addModal}
// CloseAddModal={CloseAddModal}
// />

// {logmodal[1]&&
//  <VehicleLogModal
//  ShowLogModal={logmodal[0]}
//  data={logmodal[1]}
//  CloseLogModal={CloseLogModal}
// />
// }
// <div className="v-table-container">
//   {/* {table.getRowModel()&&(<VehicleTable table={table} />)} */}
  
// {table&&<VehicleTable table={table}/>}
// </div>