import React from 'react'

function OwnerDetails(props) {
  return (
    <div>
        <p className='my-2'>{props.name}</p>   
        <p className='my-2'>{props.email}</p>
        <p className='my-2'>{props.phone}</p>
    </div>
  )
}

export default OwnerDetails