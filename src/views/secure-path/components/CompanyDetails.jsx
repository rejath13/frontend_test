import {Card,Badge} from 'react-bootstrap'

import "../securepath.scss"

function CompanyDetails(props) {

   const openEditModal=()=>{
      // props.UpdateFields.current=props.row
      props.setUpdatedField({current:props.row})
      props.handleShowUpdateModal()
      
      
   }

  return (
    <div className='cmp-container'>
        <div class={`cmp-name ${props.registration_status=='expired'?'text-danger':''}`} onClick={openEditModal}>{`${props.name}`.toUpperCase()}</div>
         <span>
         <div className='badge-status' style={{fontSize:'.8rem'}} >{props.status.toUpperCase()}</div>
         </span>

         <span>
         <div className='badge-type' style={{fontSize:'0.8rem'}}>{props.type.toUpperCase()}</div>
         </span>

         <span>
         <div className='badge-count' style={{fontSize:'0.8rem'}}>{props.count}</div>
         </span>
    </div>
      

      
  )
}

export default CompanyDetails