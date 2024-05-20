import "../Table.scss"

import Table from "react-bootstrap/Table";


import { Badge, Pagination,Row } from "react-bootstrap";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

function VehicleTable({ table }) {
  return (
    <>
      <table class="rwd-table">

      

          <thead>
            {table.getHeaderGroups().map((headgroup) => (
              <tr key={headgroup.id}>
                {headgroup.headers.map((header) => (
                  <th key={header.id}>
                   
                   {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                   
                  </th>
                ))}
              </tr>
            ))}
          </thead>


          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} >
                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
                   </td>
                ))}
              </tr>
            ))}
          </tbody>
      </table>
    <Pagination className="my-4">
    <Pagination.First onClick={() => {table.setPageIndex(0); window.scrollTo(0, 0)}} />
    <Pagination.Prev
      onClick={() =>{ table.previousPage(); window.scrollTo(0, 0)}}
      disabled={!table.getCanPreviousPage()}
    />
    <Pagination.Item>
      <strong>
        {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </strong>
    </Pagination.Item>

    <Pagination.Next
      onClick={() =>{ table.nextPage(); window.scrollTo(0, 0)}}
      disabled={!table.getCanNextPage()}
    />
    <Pagination.Last
      onClick={() =>{ table.setPageIndex(table.getPageCount() - 1); window.scrollTo(0, 0)}}
    />
  </Pagination>
  </>
  )
  

}

export default VehicleTable;



















{/* <>
<p>COUNT:{table.getFilteredRowModel().rows.length}</p>
<div class="row s-table">
  <Table bordered hover striped>
    <thead>
      {table.getHeaderGroups().map((headgroup) => (
        <tr key={headgroup.id}>
          {headgroup.headers.map((header) => (
            <th key={header.id}>
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody className="s-table-body">
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="s-table-row">
          {row.getVisibleCells().map((cell) => (
           cell.column.id =="company_name"?
           <>
           <td key={cell.id} className="" style={{width:'12rem',margin:'1rem'}}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
           
           </>:
          cell.column.id=="reg_exp"?<>
          
          <td key={cell.id} className="s-table-td" style={{paddingTop:"1rem"}}>
               {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          
          </>:( <>
           
            <td key={cell.id} className="s-table-td" >
               {flexRender(cell.column.columnDef.cell, cell.getContext())}
             </td>
            </>)
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
</div>
<div class="row s-footer">
  <Pagination>
    <Pagination.First onClick={() => {table.setPageIndex(0); window.scrollTo(0, 0)}} />
    <Pagination.Prev
      onClick={() =>{ table.previousPage(); window.scrollTo(0, 0)}}
      disabled={!table.getCanPreviousPage()}
    />
    <Pagination.Item>
      <strong>
        {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </strong>
    </Pagination.Item>

    <Pagination.Next
      onClick={() =>{ table.nextPage(); window.scrollTo(0, 0)}}
      disabled={!table.getCanNextPage()}
    />
    <Pagination.Last
      onClick={() =>{ table.setPageIndex(table.getPageCount() - 1); window.scrollTo(0, 0)}}
    />
  </Pagination>
</div>
</> */}