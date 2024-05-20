import SecureVehicles from './SecureVehicles'
import { useState } from 'react'

function SecureVehicleWrapper() {

 const [pagination, setPagination] = useState({
        pageIndex:0,
        pageSize: 25, 
      })

  return (
    <SecureVehicles pagination={pagination} setPagination={setPagination} />
  )
}

export default SecureVehicleWrapper