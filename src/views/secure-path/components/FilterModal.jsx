import { useRef,useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from 'react-select';

function FilterModal({
  table,
  showFilterModal,
  handleCloseFilterModal,
  setColumnFilters,
  bussiness_category
}) {

  const [selectedOption, setSelectedOption] = useState({
    value:'all-type',
    label:'ALL'
  });
  const [selectedStatus, setSelectedStatus] = useState('all-status');
  const [selectedBussiness, setSelectedBussiness] = useState({
    value:'all-bussiness',
    label:'ALL'
  });
  
  
  const bcategory=useRef('')
  const btype=useRef('')

  const handleOptionChange = (e) => {
    
    setSelectedOption(e.target.value);
  };

  const handleStatusChange=(e)=>{
    setSelectedStatus(e.target.value)
  }

  const handleBussinesChange=(e)=>{
    console.log(e.value)
    setSelectedBussiness(e.value)
  }
 
 

 
  const categoires=[
    {
      name:'all-bussiness'
    },
    ...bussiness_category
  ]
  const types=['all-type','locator+securepath','securepath','securepathprem','securepathprem+locator','rasid','rasid+locator','shahin','shahin+locator']

  const submit = () => {
    table.setPageIndex(0)
   
    setColumnFilters([
      {
        id: "bussiness_category_name",
        value: selectedBussiness.value
      },
      {
        id: "status",
        value: selectedStatus
      },
      {
        id: "type",
        value: selectedOption.value
      },
      
    ]);
    handleCloseFilterModal();
  };
  return (
    <Modal show={showFilterModal} onHide={handleCloseFilterModal}>
      <Modal.Header closeButton>
        {/* <Modal.Title></Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>BUSSINIESS CATEGORY</Form.Label>
          <Select
    defaultValue={selectedBussiness}

    options={bussiness_category.map(i=>({
      value:i.name,
      label:`${i.name}`.toUpperCase()
    }))}
    onChange={setSelectedBussiness}
    classNamePrefix="select"
    maxMenuHeight={200}
  />
</Form.Group>
  <Form.Group className="mb-3">
    <Form.Label>TYPE</Form.Label>
      <Select
    defaultValue={selectedOption}

    options={types.map(i=>({
      value:i,
      label:`${i}`.toUpperCase()
    }))}
    onChange={setSelectedOption}
    classNamePrefix="select"
    maxMenuHeight={200}
  />
</Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>TYPE: </Form.Label>
          <div className="mb-3">

            {
              types.map(item=>(
                <Form.Check
                inline
                label={item.toUpperCase()}
                name="group1"
                type="radio"
                value={item}
                checked={selectedOption === item}
                onChange={handleOptionChange}
                
              />

              ))
            }
            <Form.Check
              inline
              label="ALL"
              name="group1"
              type="radio"
              value='all-type'
              checked={selectedOption === 'all-type'}
              onChange={handleOptionChange}
             
            />
          </div>
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label>STATUS: </Form.Label>
          <div className="mb-3">
            <Form.Check
              inline
              label="ACIVE"
              name="group2"
              type="radio"
              value='active'
              checked={selectedStatus== 'active'}
              onChange={handleStatusChange}
              
            />
            <Form.Check
              inline
              label="BLOCKED"
              name="group2"
              type="radio"
              value='blocked'
              checked={selectedStatus == 'blocked'}
              onChange={handleStatusChange}
              
            />
            <Form.Check
              inline
              label="ALL"
              name="group2"
              type="radio"
              value='all-status'
              checked={selectedStatus == 'all-status'}
              onChange={handleStatusChange}
            />
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseFilterModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit}>
          Apply Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterModal;
