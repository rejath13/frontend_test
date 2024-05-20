import React, { useState } from 'react';
import Select from "react-select";
import { Col, Row } from 'react-bootstrap';

import './ITCGlobalFilters.css';


const ITCGlobalFilters = (props) => {


  const {companies,onSelectCompany,filtersData, onSelectDateRange} = props;

  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  
  const [isApplied, setIsApplied] = useState(false);

  const handleOnApplyDate = () => {
    if(!isApplied && (startDate == false || endDate == false)) return;
    onSelectDateRange({startDate,endDate,isApplied : true});
    setIsApplied(true);
  }

  const clearFilter = () => {
    onSelectDateRange({startDate,endDate,isApplied : false});
    setIsApplied(false);
  }

  return (
    <div className='global-filter-card'>
        <div  className="mr-2 header-multi-select">
            <Row>
                <Col>
                    <Select
                        closeMenuOnSelect={false}
                        defaultValue={[companies[0]]}
                        isMulti
                        getOptionLabel={(option) => option.sales_plus_company_name}
                        getOptionValue={(option) => option.sales_plus_id}
                        options={companies}
                        value={filtersData.company || null}
                        onChange={(option) => onSelectCompany(option, 'project')}
                    />
                </Col>

                <Col md={4} className='date-range-picker d-flex justify-content-between align-items-center '>
                    <div className='dates'> 
                        <input formd onChange={(e) => setStartDate(e.target.value)} className='form-control' type='date' />
                    </div> 
                    <div className='date-separator-to'> To </div> 
                    <div className='dates'> 
                        <input onChange={(e) => setEndDate(e.target.value)} className='form-control' type='date' />
                    </div> 
                    <div className='date-icon'> 
                       <span onClick={ handleOnApplyDate } >Apply </span>
                      {isApplied && <i onClick={clearFilter} className='fa fa-times clear'></i> }
                    </div>
                </Col>           
                    
             </Row>
        </div>
    </div>
  )
}

export default ITCGlobalFilters