import { flexRender } from "@tanstack/react-table"
import Table from "react-bootstrap/Table";
import '../securepath.scss'
function SecurePathTable(props) {

const {table}=props
console.log("table rendered",table.getPaginationRowModel())
  return (
   <table className="sp-table">
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
        <tbody className="sp-table-body">
                      {table.getPaginationRowModel().rows.map((row) => (
                        <tr key={row.id} className="">
                          {row.getVisibleCells().map((cell) => ( 
                          <>
                             <td class="">
                               {flexRender(
                                 cell.column.columnDef.cell,
                                 cell.getContext()
                               )}
                             </td>
                           </>
                          ))}
                        </tr>
                      ))}
        </tbody>
  </table>
  )
}

export default SecurePathTable