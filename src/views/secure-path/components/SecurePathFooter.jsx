
import { Pagination } from "react-bootstrap"

function SecurePathFooter(props) {
  const {table}=props
  return (
    <div class="row ml-1 mt-2">
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
  )
}

export default SecurePathFooter