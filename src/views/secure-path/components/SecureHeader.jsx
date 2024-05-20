import {Row,Col,Form,Button,InputGroup ,Badge} from "react-bootstrap";
import {FaFileCsv, FaFilter, FaPlus,FaTimesCircle} from "react-icons/fa";

import CsvDownloadButton from 'react-json-to-csv'


import '../securepath.scss'

function SecureHeader(props) {

const {handleShowAddModal,table,handleShowFilterModal,filtering,SetFiltering,setColumnFilters}=props

const exportExcel = (rows) => {
  const rowData = rows.map((row) =>{

    let fltr_obj={}

    Object.keys(row.original).forEach(key=>{
        if(key=='company_business_category' || key=='bussinessCategoryId'){
            return 
          } 
          else if(key=='bussiness_category'){
              return fltr_obj[key]=row.original[key].name   
          }
          else{
            return fltr_obj[key]=row.original[key]
          }
    })

    return fltr_obj
})


return rowData
}


return (
  
<div class="sp-header-container">
<div className="">
<p>COUNT:
{table.getFilteredRowModel().rows.length}
</p>

<span>
FILTERS:
{table.getState().columnFilters.map((item) => (
                <Badge className="bg-info label-text mx-sm-1">
                  {item.value}
                </Badge>
))}
</span>
</div>


<div className="" style={{marginRight:'21px'}}>
  <InputGroup>
   <div style={{position:'relative'}}>
    <Form.Control
    style={{ width: '20em' }}
    className="sp-search"
      placeholder="SEARCH"
      value={filtering}
      onChange={(e) => {
        table.setPageIndex(0)
        SetFiltering(e.target.value)
      }}
    />

       {filtering.length>0 && (
          
          <FaTimesCircle 
          className="pointer"
          style={{position:'absolute',left:'15.6rem',top:'0.5rem'}}
          size={30}    
          onClick={() => SetFiltering("")}
          />

         
        )}
   </div>
    <InputGroup.Append>
      <Button
        variant="warning"
        onClick={handleShowFilterModal}
      >
        FILTER <FaFilter />
      </Button>
      <Button variant="primary" onClick={handleShowAddModal}>
        ADD <FaPlus />
      </Button>
      <Button
        variant="danger"
        onClick={() => table.resetColumnFilters()}
      >
        <i
          className="feather icon-refresh-cw"
          style={{ margin: 0 }}
        ></i>
      </Button>
      {
        localStorage.getItem('loginUserId')==1&&(<>
        <CsvDownloadButton 
           style={{ 
           height:'100%',
          //  borderRadius:'0.5em',
            display:"inline-block",
            fontSize:"14px",
            cursor:"pointer",
            fontSize:"1em",
            marginBottom:'2px',
            padding:"6px 8px",

            }}
           
          className="btn-dark"
          data={exportExcel(table.getFilteredRowModel().rows)} 
          delimiter="," 
          filename='company_details.csv'
          // headers={[
          //   "COMPANY",
          //   "TRADE LICENSE",
          //   "TRAFFIC FILE NO",
          //   "OWNER NAME",
          //   "EMAIL",
          //   "PHONE NO",
          //   "ZIP CODE",
          //   "ADDRESS",
          //   "STATUS",
          //   "TYPE",
          // ]}


          >
          
          <FaFileCsv className="mx-1"/>
          EXPORT
          </CsvDownloadButton>
        
        
        </>)
      }
      
      

    </InputGroup.Append>
  </InputGroup>
  
</div>

         
  
</div>
    
  )
}

export default SecureHeader





