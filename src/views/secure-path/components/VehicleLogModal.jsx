import { Modal } from "react-bootstrap"
import Table from "react-bootstrap/Table";
import moment from "moment";
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
  } from "@tanstack/react-table";

function VehicleLogModal(props) {
const {ShowLogModal,CloseLogModal,data}=props
let nw_data=[...data].reverse()

const columns=[
    {
        header: "DATE",
        accessorKey: "date",
        // cell:p=>`${new Date(p.getValue()).toLocaleDateString()}`
        cell:p=>`${moment(p.getValue()).format('DD-MM-YYYY')}`
    },
    {
        header: "USER",
        accessorKey: "user",
        cell:p=>`${p.getValue()}`.toUpperCase()
    },
    {
        header: "FIELD",
        accessorKey: "key",
        cell:p=>`${p.getValue()}`.toUpperCase()
    },
    {
        header: "FROM",
        accessorKey: "frm",
        cell:p=>`${p.getValue()}`.toUpperCase()
    },
    {
        header: "TO",
        accessorKey: "to",
        cell:p=>`${p.getValue()}`.toUpperCase()
    },
]

const table = useReactTable({
    data:  nw_data||[],
    columns,
    getCoreRowModel: getCoreRowModel(),
})

  return (
    <Modal show={ShowLogModal} onHide={CloseLogModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>EDIT LOGS</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
        {
            data.length==0?<>
            NO EDIT LOGS
            </>:(<div>
            <Table
              bordered
              hover
              striped
            >
              <thead>
                {table?.getHeaderGroups().map((headgroup) => (
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
                  <tr key={row.id} className="s-table-row pointer">
                    {row.getVisibleCells().map((cell) => (  <>
                                <td>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                  </>))}   
                  </tr>
                ))}
              </tbody>
            </Table>
  </div>)
        }
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
  )
}

export default VehicleLogModal