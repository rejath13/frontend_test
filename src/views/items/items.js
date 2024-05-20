
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Button, Alert } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';
import { useTable } from 'react-table'
import {  API_URL } from "../../config/constant";

function Table({ columns, data, getItemsList }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  useEffect(() => {
    getItemsList({  })
  }, [getItemsList])

  // Render the UI for your table
  return (
    <BTable striped bordered hover responsive {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </BTable>
  )
}

function App() {

  const deleteItem  = async (id) => {


      try{
        const options = { 
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        }   
            
        const url = API_URL+"deleteitem/"+id;

        const response = await fetch(url, options)
        
        const data = await response.json();
        if(data.status==='success'){
          
        }
        getItemsList();
      }
      catch{

      }
    
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'item_name',
      },
      {
        Header: 'Type',
        accessor: 'item_type',
      },
      {
        Header: 'Description',
        accessor: 'item_description',
      },
      {
        Header: '',
        accessor: 'item_id',
        Cell: ({ cell }) => {
          const { value } = cell;
          return(
            <span><Button variant="warning" >Edit</Button>
            <Button variant="danger" onClick={() => {
              const confirmBox = window.confirm(
                "Are you sure you want to delete this item?"
              )
              if (confirmBox === true) {
                deleteItem(value)
              }
            }}>Delete</Button></span>
          ) 
          
        }
      },
      
    ],
    []
  )

  const [data, setdata] = useState([]);

  const getItemsList = useCallback(async ({  })  => {

    try{
      const options = { 
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      }    

          
      const url = API_URL+"items";

      const response = await fetch(url, options)
      
      const data = await response.json();
      
      setdata(data.data);
    }
    catch{

    }

  }, []);
  return (
        <React.Fragment>
          <Row>
              <Col>
                  <Card>
                      <Card.Header>
                          <Card.Title as="h5">ITEM TABLE</Card.Title>
                          <Button variant="info" style={{float:'right'}}>Add More</Button> 
                      </Card.Header>
                      <Card.Body>
                          <Table columns={columns} data={data} getItemsList={getItemsList}/>
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
        </React.Fragment>
  )
}

export default App