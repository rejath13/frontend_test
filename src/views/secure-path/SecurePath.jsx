import "./securepath.scss";
import React, {useState ,useMemo} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import FilterModal from "./components/FilterModal";
import BigSpinner from "../../components/Loader/BigSpinner";
import AddModal from "./components/AddModal";
import UpdateModal from "./components/UpdateModal";
import SecurePathTable from "./components/SecurePathTable";
import SecurePathFooter from "./components/SecurePathFooter";
import SecureHeader from "./components/SecureHeader";


function SecurePath(props) {
  const {
    data,
    setShowUpdateModal,
    columns,
    UpdateFields,
    showUpdateModal,
    isError,
    isLoading,
    bussiness_category,
    setPagination,
    pagination
   }=props

  // const [newdata, setData] = React.useState([])
  const skipPageResetRef = React.useRef()
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filtering, SetFiltering] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  

  const handleCloseFilterModal = () => setShowFilterModal(false);
  const handleShowFilterModal = () => setShowFilterModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const column = useMemo(() =>columns||[], [columns]);

 

  const table = useReactTable({
    data:  data,
    columns:column,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    paginateExpandedRows:false,
    // autoResetGlobalFilter: false,
    // autoResetPage: false,
    // autoResetFilters: false,
    // autoResetSortBy: false,
    // autoResetPageIndex: skipPageResetRef.current,
    // autoResetPage: false,
    // autoResetExpanded: skipPageResetRef.current,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pageSize:20,
      pageIndex:0,
      columnVisibility: {
        zip_code: false,
        phone: false,
        email: false,
        type: false,
        status: false,
        traffic_file_no: false,
      },
      
    },
    state: {
      globalFilter: filtering,
      columnFilters,
      pagination,
    },
    onGlobalFilterChange: SetFiltering,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  return (
    <>
      {isLoading || isError ? (
        <>
          <BigSpinner />
        </>
      ) : (
        <>
          <div className="row"> 
           <div className="col">
              <div className="card">
             <div className="card-body">

              <div>
              <FilterModal
                table={table}
                handleCloseFilterModal={handleCloseFilterModal}
                showFilterModal={showFilterModal}
                setColumnFilters={setColumnFilters}
                bussiness_category={bussiness_category?.data ?? []}
              />
            </div>

            <div>
              <AddModal
                showAddModal={showAddModal}
                handleCloseAddModal={handleCloseAddModal}
                bussiness_category={bussiness_category?.data ?? []}
              />
            </div>

            <div>
              {UpdateFields.current.type && (
                <UpdateModal
                  showUpdateModal={showUpdateModal}
                  handleCloseUpdateModal={handleCloseUpdateModal}
                  UpdateFields={UpdateFields}
                  bussiness_category={bussiness_category?.data ?? []}
                />
              )}
            </div>

            

               <SecureHeader
                table={table}
                SetFiltering={SetFiltering}
                handleShowFilterModal={handleShowFilterModal}
                handleShowAddModal={handleShowAddModal}
                filtering={filtering}
                setColumnFilters={setColumnFilters}
               />
               {table&& <SecurePathTable table={table}/>}
               {table&& <SecurePathFooter table={table}/>}
               
           

                </div>
              </div>
           </div>
          </div>
        </>
      )}
    </>
  );
}

export default SecurePath;
