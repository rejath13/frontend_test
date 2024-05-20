import React, { useEffect, useRef, useState } from "react";
import {
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Form,
  Badge,
  OverlayTrigger,
  Tooltip,
  Modal,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { colourOptions } from "../forms/FormsSelect";
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import "./itc.css";
import Datetime from 'react-datetime';
import ProjectAddEditForm from "./projects/ProjectAddEditForm";
import PostRequest, { API_URL } from "../../services/PostRequest";
import { showAlert } from "../../services/alert";
import ProjectItem from "./projects/ProjectItem";
import PermitAddEditForm from "./permits/PermitAddEditForm";
import PermitItem from "./permits/PermitItem";

import moment from "moment";
import { implementationType, invoiceStatus, leadSource, leadType, paymentStatus, projectStatus } from "./projects/project-options-data";
import CSVResponseModal from "./csv/CSVResponseModal";
import { API_URL as MainAPIURL } from "../../config/constant";
import ITCGlobalFilters from "./ITCGlobalFilters";

var typingTimer = false;


const ITC = () => {

  const fileRef = useRef()

  const [configOpen, setConfigOpen] = useState(false);
  const [addProjectModelOpen, setAddProjectModelOpen] = useState(false);
  const [addPermitModelOpen, setAddPermitModelOpen] = useState(false);
  const [csvResponseModelOpen, setCSVResponseModelOpen] = useState(false);
  const [csvResponse, setCSVResponse] = useState({ errorRecords: [], successRecords: [] });

  const [activeTab, setActiveTab] = useState('projects');
  const [uploading, setUploading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isLoadMore, setLoadMore] = useState(false)
  const [statistics, setStatistics] = useState({})

  const [companies, setCompanies] = useState([]);
  const [salesPersons, setSalesPersons] = useState([]);
  const [projects, setProjects] = useState([]);
  const [permits, setPermits] = useState([]);

  const [permitSearch, setPermitsSearch] = useState("")
  const [projectSearch, setProjectSearch] = useState("")

  const [filters, setFilters] = useState([])
  const [filter, setFilter] = useState({})


  const [filterProjects, setFilterProjects] = useState([])

  const [filtersData, setFiltersData] = useState({
    company: null,
    daterange : null,
    project: null,
    leadSource: null,
    leadType: null,
    implementationType: null,
    projectStatus: null,
    paymentStatus: null,
    invoiceStatus: null,
    salesPersons: null,
    installationStatus: null,
    activationStatus: null,
    certificateStatus: null,
    permitStatus: null,
    permitPaymentStatus: null,
  })

  const addProjectFormRef = useRef();
  const addPermitFormRef = useRef();
  const filterFormRef = useRef();

  const [isLoadingFromCompanySelection, setIsLoadingFromCompanySelection] = useState(false)

  let configClass = ["menu-styler"];
  if (configOpen) {
    configClass = [...configClass, "open"];
  }

  const loginUserId = localStorage.getItem('loginUserId');

  const handleAddProjectForm = async (e) => {

    const formData = new FormData(addProjectFormRef.current);
    e.preventDefault();

    const formDataObj = Array.from(formData.entries()).reduce((prev, [name, value]) => ({
      ...prev,
      [name]: value
    }), {});

    try {
      if (formDataObj.company == '') throw new Error("Please select Company");
      const responseData = await PostRequest('/itc/project/create', formDataObj, "createProject");
      setAddProjectModelOpen(false);
      showAlert({ title: 'Project Created', type: 'success', text: 'Successfully created project!' })
      loadCompanies()
      loadProjects()
    } catch (error) {
      alert(error);
    }

  }

  const handleAddPermitForm = async () => {

    const formData = new FormData(addPermitFormRef.current);

    const formDataObj = Array.from(formData.entries()).reduce((prev, [name, value]) => ({
      ...prev,
      [name]: value
    }), {});



    if(formDataObj.isNewProject == 'true' || formDataObj.isNewProject == true){
      const salePersonConmpany = companies.find(c => c.sales_plus_id == formDataObj.company);
      // console.log('salePersonConmpany',salePersonConmpany)
      if(salePersonConmpany){
        const salePerson = salesPersons.find(s => s.user_id == salePersonConmpany.sales_plus_person);
        formDataObj.salePerson = salePerson ? salePerson.user_name : '';
      }
      
    }

    try {
      const responseData = await PostRequest('/itc/permit/create', formDataObj, "createPermit");

      setAddPermitModelOpen(false);
      showAlert({ title: 'Permits Created', type: 'success', text: 'Successfully created permit!' })
      loadPermits()
    } catch (error) {
      alert(error);
    }

  }

  const loadCompanies = async () => {

    try {

      const cp = await PostRequest('/itc/companies', {});
      setCompanies(cp);

    } catch (error) {

    }

  }

  const loadSalesPersons = async () => {

    try{
      
      const authToken = localStorage.getItem('authToken');

      const options = { 
        method: 'get',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Xtoken': authToken
        }
      }    

          
      const url = MainAPIURL+"salesperson";

      const response = await fetch(url, options)
      const data = await response.json();

      // console.log(data);
      setSalesPersons(data.data);
      
    }
    catch{

    }

    // try {

    //   const sp = await PostRequest('/itc/salespersons', {});
    //   setSalesPersons(sp);

    // } catch (error) {

    // }

  }

  const loadProjects = async (data = {}, isFirstTime = false, statisticsType = "project") => {
    if (isLoading || isLoadMore) return
    try {
      data.skip ? setLoadMore(true) : setLoading(true)
      const projectsResponse = await PostRequest('/itc/projects', data);
      data.skip ? setProjects([...projects, ...projectsResponse]) : setProjects(projectsResponse);
      if (!isFirstTime) await loadStatistics(data, 'statisticsType')
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
      setLoadMore(false)
    }

  }


  const loadPermits = async (data = {}, isFirstTime = false, statisticsType = "permit") => {
    if (isLoading || isLoadMore) return
    try {
      data.skip ? setLoadMore(true) : setLoading(true)
      const permitResponse = await PostRequest('/itc/permits', data);
      data.skip ? setPermits([...permits, ...permitResponse]) : setPermits(permitResponse);
      if (!isFirstTime) await loadStatistics(data, statisticsType)

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
      setLoadMore(false)
    }

  }

  const loadStatistics = async (data = {}, type = '') => {
    try {
      var cloneData = { ...data }
      if (cloneData?.filters?.length == 0) delete cloneData.filters;
      if (cloneData?.search == '') delete cloneData.search;
      if (cloneData.filters) {
        Object.keys(cloneData.filters).map((key) => {
          if (cloneData.filters[key] == '') delete cloneData.filters[key];
        })
        if (Object.keys(cloneData.filters).length == 0) delete cloneData.filters;
      }

      const response = await PostRequest('/itc/statistics', cloneData);
      if (type == 'project') {
        setStatistics({ ...statistics, totalProjects: response.totalProjects })
      } else if (type == 'permit') {
        setStatistics({ ...statistics, totalPermits: response.totalPermits })
      } else {
        setStatistics(response)
      }
    } catch (error) {
      console.log(error);
    }

  }

  const handleClearFilter = () => {
    try {

      filterFormRef.current.reset()
      setFiltersData({})

      setFilters([])
      setFilter({daterange : filter.daterange})
      loadProjects({
        filters: {daterange : filter.daterange},
      })
      loadPermits({
        filters: {daterange : filter.daterange},
      })
      setConfigOpen(false)

    } catch (error) {
      alert(error)
    }
  }

  const handleFilterForm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const _filters = {};

    for (const [key, value] of formData.entries()) {
      if (_filters[key]) {
        if (!Array.isArray(_filters[key])) {
          _filters[key] = [_filters[key]];
        }
        _filters[key].push(value);
      } else {
        _filters[key] = value;
      }
    }

    const f = []

    Object.keys(_filters).map((key) => {
      if (Array.isArray(_filters[key])) {
        if (key == 'company') {
          var companiesStr = "";
          _filters[key].map((cid) => {
            var index = companies.findIndex((c) => c.sales_plus_id == cid)
            if (index != -1) companiesStr = `${companiesStr}${companies[index].sales_plus_company_name}, `
          })
          f.push(companiesStr)
        } else {
          if (key == 'company') {

          }
          f.push(_filters[key].join(", "))
        }
      } else {
        if (key == 'company') {
          var index = companies.findIndex((c) => c.sales_plus_id == _filters[key])
          if (index != -1) f.push(companies[index].sales_plus_company_name)
        } else if (_filters[key] != '') {
          f.push(_filters[key])
        }
      }
    })

    const finalFilter = { ...filter, ..._filters };
    setFilters(f)
    setFilter(finalFilter)

    // console.log('finalFilter',finalFilter)

    if (activeTab == 'projects') {

      loadProjects({
        filters: finalFilter,
        search: projectSearch,
      })

    } else {
      loadPermits({
        filters: finalFilter,
        search: permitSearch,
      })
    }


  }

  const searchProject = (e) => {

    setProjectSearch(e.target.value)
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {

      loadProjects({
        search: e.target.value.trim(),
        filters: filter,
      })

    }, 500);

  }

  const searchPermit = (e) => {

    setPermitsSearch(e.target.value)
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {

      loadPermits({
        search: e.target.value.trim(),
        filters: filter,
      })

    }, 500);

  }

  const onExportPermit = async () => {
    try {
      if (exporting) return;
      setExporting(true)
      var response = await PostRequest("/itc/permits/export", {});
      const link = document.createElement('a');
      link.href = `${API_URL}/itc/permit/export/${response}`;
      link.setAttribute(
        'download',
        response,
      );

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);

    } catch (e) {
      showAlert(e)
    } finally {
      setExporting(false)
    }
  }

  const handleCSVFileSelect = async (e) => {
    if (e.target.files.length <= 0 || uploading) return
    setUploading(true)
    var formData = new FormData()
    formData.append("csv", e.target.files[0])
    try {
      const response = await PostRequest("/itc/permit/upload-csv", formData);
      e.target.value = null;
      setCSVResponse(response)
      // showAlert({ title: 'Success', type: 'success', text: 'Successfully imported csv file!' })
      setCSVResponseModelOpen(true)
      // loadProjects();
      // loadPermits()
    } catch (error) {
      alert(error)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    loadCompanies();
    loadSalesPersons()
    loadProjects({}, true);
    loadPermits({}, true);
    loadStatistics();

    return () => {
      if (typingTimer) clearTimeout(typingTimer)
    }
  }, [])


  useEffect(() => {

    setFilterProjects(projects)

  },[projects])

  const renderCSVResponseModal = () => {
    return <Modal
      size="lg"
      centered
      show={csvResponseModelOpen}
      onHide={() => setCSVResponseModelOpen(false)}
    >
      <Modal.Header closeButton>
        <Row className="justify-content-between mb-2">
          <Col className="text-start">
            <Badge variant="primary mr-2">Total : {csvResponse.successRecords.length + csvResponse.errorRecords.length} Records</Badge>
            <Badge variant="success mr-2">Success : {csvResponse.successRecords.length} Records</Badge>
            <Badge variant="danger">Failed : {csvResponse.errorRecords.length} Records</Badge>
          </Col>
        </Row>
      </Modal.Header>
      <Modal.Body>
        <div className="text-mute small mb-3">Please check following records, those are failed to upload.</div>
        <CSVResponseModal response={csvResponse} />
      </Modal.Body>
    </Modal>
  }

  const renderAddProjectModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={addProjectModelOpen}
        onHide={() => setAddProjectModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Create Project</Modal.Title>
        </Modal.Header>
        <form ref={addProjectFormRef} onSubmit={handleAddProjectForm} className="itc-form">
          <Modal.Body>

            <ProjectAddEditForm companies={companies} salesPersons={salesPersons} />

          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setAddProjectModelOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" size="sm" id="createProject" variant="primary">Create Project</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  };


  const renderAddPermitModel = () => {
    return (
      <Modal
        size="lg"
        centered
        show={addPermitModelOpen}
        onHide={() => setAddPermitModelOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title as="h5">Create Permit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form ref={addPermitFormRef} className="itc-form">
            <PermitAddEditForm companies={companies} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setAddPermitModelOpen(false)}
          >
            Close
          </Button>
          <Button onClick={handleAddPermitForm} size="sm" id="createPermit" variant="primary">Create Permit</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const onCompanyEdited = () => {
    loadCompanies();
    loadPermits();

    loadProjects({
      filters: filter,
      search: projectSearch,
    })

  }


  const handleCopyPermit = (permit) => {

    const permitCopy = { ...permit }


    const clones = [...permits];
    const index = clones.findIndex(p => p.id === permit.id);

    if (index !== -1) {
      permitCopy.id = clones.length + 1;

      permitCopy.chassisNo = '';
      permitCopy.trailerID = '';
      permitCopy.vehicleModel = '';
      permitCopy.platNumber = '';
      permitCopy.simCardNumber = '';
      permitCopy.deviceID = '';
      permitCopy.registrationExpire = '';
      permitCopy.remarks = '';


      permitCopy.isCopy = true;
      clones.splice(index + 1, 0, permitCopy);
      setPermits(clones);
    }

    showAlert({
      text: 'Copied permit',
    });


  }

  const syncPermits = (permit, newResponse, showCopyAlert = true) => {

    const permitCopy = { ...permit }


    const clones = [...permits];
    const index = clones.findIndex(p => p.id === permit.id);

    if (index !== -1) {

      Object.keys(permitCopy).map(key => {
        if (newResponse[key]) {
          permitCopy[key] = newResponse[key]
        }
      })

      permitCopy.isCopy = false;


      clones[index] = permitCopy;
      setPermits(clones);
    }

    if (showCopyAlert) {
      showAlert({
        text: 'Copied permit',
      });
    }


  }

  const onSelectCompany = async (option, type = '') => {
    try {

      if(isLoadingFromCompanySelection) return false;

      setFiltersData({ ...filtersData, company: option })
      var ids = option == null ? "" : option.map((c) => c.sales_plus_id.toString());

      setFilter({ ...filter, company: ids });

      setIsLoadingFromCompanySelection(true);


      // if(type == 'project'){
       
      // }
      await loadProjects({
        filters: { ...filter, company: ids },
        search: projectSearch
      })

       await loadPermits({
        filters: { ...filter, company: ids },
        search: permitSearch,
      }, false, "");


    } catch (error) {

      alert(error.message);

    } finally {
      setIsLoadingFromCompanySelection(false);
    }
  }


  const handleInputChange =  (value) => {
     
    try {
      const isExistName = filterProjects.find(project => project.clientName.match( new RegExp(value,'i') ));

      if(true){

        const data = {
          search: value.trim(),
          // filters: filter,
          excludeCompany : true,
          limit : 10
        }
        PostRequest('/itc/projects', data)
        .then((projectsResponseForFilter) => {
          setFilterProjects(projectsResponseForFilter)
        })
        .catch(e => {
          console.error(e)
        })

      }
    } catch (error) {
      console.error('Error',error)
    }

  };

  const onSelectDateRange = async ({startDate, endDate, isApplied}) => {

    try {

      var filterIs = { ...filter, daterange: {startDate, endDate} }

      if(isApplied){
        setFiltersData({ ...filtersData, daterange: {startDate, endDate} })
      } else{
        setFiltersData({ ...filtersData, daterange: null });
        var filterIs = { ...filter, daterange: null }
      }

      setFilter(filterIs);

      
      setIsLoadingFromCompanySelection(true);

      await loadProjects({
        filters: filterIs,
        search: projectSearch
      })

       await loadPermits({
        filters: filterIs,
        search: permitSearch,
      }, false, "");


    } catch (error) {

      alert(error.message);

    } finally {
      setIsLoadingFromCompanySelection(false);
    }
    
    

  }

  return (
    <React.Fragment>
      <Row className="itc-card">
        <Col>

          {/*  ACTION BUTTONS  */}

          {activeTab == 'projects' && <div className="action-buttons d-flex justify-content-end">
            <Badge variant="primary" className="total-badge mr-3">Total Projects : {projects.length} / {statistics.totalProjects || '0'}</Badge>
            
            <input
              onChange={searchProject}
              value={projectSearch}
              className="form-control search-input-itc"
              placeholder="Search Projects...."
            />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>ADD PROJECT</Tooltip>
              }
            >
              <Button
                onClick={() => setAddProjectModelOpen(true)}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className="fas fa-plus mr-0"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>Filters</Tooltip>
              }
            >
              <Button
                onClick={() => setConfigOpen(!configOpen)}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className="fas fa-filter mr-0"></i>
              </Button>
            </OverlayTrigger>

            {loginUserId == 7 && <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>Import CSV</Tooltip>
              }
            >
              <Button
                onClick={() => fileRef.current.click()}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className={`fas mr-0 ${uploading ? 'fa-spinner spin' : 'fa-upload'}`}></i>
              </Button>
            </OverlayTrigger>}

          </div>
          }

          {/* Permits */}

          {activeTab == 'permits' && <div className="action-buttons d-flex justify-content-end" style={{ width: 1120 }}>
            {!isLoadingFromCompanySelection && <Badge variant="primary" className="total-badge mr-3">Total Permits : {permits.length} / {statistics.totalPermits || '0'}</Badge>}
            {isLoadingFromCompanySelection && <Badge variant="primary" className="total-badge mr-3"> <i className="fa fa-spin fa-spinner"></i> Loading...</Badge>}
            {/* <div style={{ width: 400 }} className="mr-2 header-multi-select">
              <Select
                closeMenuOnSelect={false}
                defaultValue={[companies[0]]}
                isMulti
                getOptionLabel={(option) => option.sales_plus_company_name}
                getOptionValue={(option) => option.sales_plus_id}
                options={companies}
                value={filtersData.company || null}
                onChange={(option) => onSelectCompany(option, 'permit')}
              />
            </div> */}
            <input
              onChange={searchPermit}
              value={permitSearch}
              className="form-control search-input-itc"
              placeholder="Search Permits...."
            />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>ADD PERMIT</Tooltip>
              }
            >
              <Button
                onClick={() => setAddPermitModelOpen(true)}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className="fas fa-plus mr-0"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>Filters</Tooltip>
              }
            >
              <Button
                onClick={() => setConfigOpen(!configOpen)}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className="fas fa-filter mr-0"></i>
              </Button>
            </OverlayTrigger>

            {loginUserId == 7 && <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-top`}>Import CSV</Tooltip>
              }
            >
              <Button
                onClick={() => fileRef.current.click()}
                size="sm"
                className="shadow-3"
                variant="dark"
              >
                <i className={`fas mr-0 ${uploading ? 'fa-spinner spin' : 'fa-upload'}`}></i>
              </Button>
            </OverlayTrigger>}

            {loginUserId == 7 &&
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-top`}>Export</Tooltip>
                }
              >
                <Button
                  onClick={onExportPermit}
                  size="sm"
                  className="shadow-3"
                  variant="dark"
                >
                  <i className={`fas mr-0 ${exporting ? 'fa-spinner spin' : 'fa-download'}`}></i>
                </Button>
              </OverlayTrigger>}
          </div>
          }

          <input type="file" accept=".csv" className="hidden" ref={fileRef} max={1} onChange={handleCSVFileSelect} />

         
            {isLoading ? <div className="divLoader" style={{ position: "absolute", left: '45%', top: '25vh' }}>
              <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
              </svg>
            </div> : null}

           

          <Tabs
            onSelect={(k) => setActiveTab(k)}
            variant="pills"
            defaultActiveKey="projects"
            className="mb-2">

            <Tab eventKey="projects" title="PROJECTS">

              <ITCGlobalFilters 
                onSelectDateRange={onSelectDateRange}
                companies={companies} 
                filtersData={filtersData}
                onSelectCompany={onSelectCompany}
              />

            
              {/* {filters.length != 0 && <>
                <h5 className="font-weight-bold">Filters : </h5>
                {filters.map((f) => <Badge variant="light" className="total-badge mr-2 mb-2">{f}</Badge>)}
                <hr className="mt-0" />
              </>} */}

              {projects.map((project, index) => <ProjectItem
                companies={companies}
                loadCompanies={loadCompanies}
                salesPersons={salesPersons}
                isCompanyEditable={true}
                isEditable={true}
                isDeletable={true}
                index={index}
                project={project}
                key={index}
                onCompanyEdited={onCompanyEdited}
                loadProjects={() => {
                  loadProjects({
                    filters: filter,
                    search: projectSearch
                  })
                }}
                loadPermits={() => {
                  loadPermits({
                    filters: filter,
                    search: permitSearch
                  })
                }}
              />)}

              {!isLoading && <div className="d-flex">
                <div className="my-auto">Showing {projects.length} of {statistics.totalProjects || '0'} Records</div>
                <div className="text-center flex-1 mr-5">
                  <Button size="sm" variant='dark' onClick={() => loadProjects({ skip: projects.length, filters: filter, search: projectSearch })} >{isLoadMore && <i className="fas fa-spinner fa-spin"></i>} Load More</Button>
                </div>
              </div>}
            </Tab>

            <Tab eventKey="permits" title="PERMITS">
              {/* {filters.length != 0 && <>
                <h5 className="font-weight-bold">Filters : </h5>
                {filters.map((f) => <Badge variant="light" className="total-badge mr-2 mb-2">{f}</Badge>)}
                <hr className="mt-0" />
              </>} */}

              <ITCGlobalFilters 
                onSelectDateRange={onSelectDateRange}
                companies={companies} 
                filtersData={filtersData}
                onSelectCompany={onSelectCompany}
              />

              {permits.map((permit, index) => <PermitItem
                key={index}
                permit={permit}
                onCopyPermit={handleCopyPermit}
                syncPermits={syncPermits}
                companies={companies}
              />)}
              {!isLoading && <div className="d-flex">
                <div className="my-auto">Showing {permits.length} of {statistics.totalPermits || '0'} Records</div>
                <div className="text-center flex-1 mr-5">
                  <Button size="sm" variant='dark' onClick={() => loadPermits({ skip: permits.length, filters: filter, search: permitSearch })} >{isLoadMore && <i className="fas fa-spinner fa-spin"></i>} Load More</Button>
                </div>
              </div>}
            </Tab>

          </Tabs>

        </Col>
      </Row>


      <React.Fragment>
        <div id="filterSelector" className={configClass.join(" ")}>
          <div className="style-toggler">
            <Link to="#" onClick={() => setConfigOpen(!configOpen)}>

            </Link>
          </div>

          <form onSubmit={handleFilterForm} id="filterForm" ref={filterFormRef}>
            <div className="style-block">
              <h5 className="mb-2"> {activeTab == 'projects' ? 'Filter Projects' : 'Filter Permits'} </h5>
              <hr />

              <div>

                <Form.Group style={{ display: "none" }}>
                  <Form.Label> Companies </Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    defaultValue={[companies[0]]}
                    isMulti
                    name="company"
                    getOptionLabel={(option) => option.sales_plus_company_name}
                    getOptionValue={(option) => option.sales_plus_id}
                    options={companies}
                    value={filtersData.company || null}
                    onChange={(option) => setFiltersData({ ...filtersData, company: option })}
                  />
                </Form.Group>

                <Form.Group controlId="salePerson">
                  <Form.Label>Sale Person</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    defaultValue={[salesPersons[0]]}
                    isMulti
                    name="salePerson"
                    getOptionLabel={(option) => option.user_name}
                    getOptionValue={(option) => option.user_name}
                    options={salesPersons}
                    value={filtersData.salesPersons || null}
                    onChange={(option) => setFiltersData({ ...filtersData, salesPersons: option })}
                  />
                </Form.Group>


                {activeTab !== 'projects' && <Form.Group>
                  <Form.Label> ITC name </Form.Label>
                  {/* <AsyncSelect 
                    isMulti
                    name="project"
                    cacheOptions 
                    defaultOptions={projects}
                    getOptionLabel={(option) => `${option.clientName}  - Sales Date : ${moment(option.salesDate).format('DD MMM, YYYY')} [Quantity : ${option.quantity}]`}
                    getOptionValue={(option) => option.id}
                    loadOptions={loadOptions} 
                    onInputChange={handleInputChange}
                    onChange={(option) => setFiltersData({ ...filtersData, project: option })}
                  /> */}

                  <Select
                    onInputChange={handleInputChange}
                    closeMenuOnSelect={false}
                    isMulti
                    name="project"
                    getOptionLabel={(option) => `${option.clientName}  - Sales Date : ${moment(option.salesDate).format('DD MMM, YYYY')} [Quantity : ${option.quantity}]`}
                    getOptionValue={(option) => option.id}
                    options={filterProjects}
                    value={filtersData.project || null}
                    onChange={(option) => setFiltersData({ ...filtersData, project: option })}
                  />
                </Form.Group>}

                {activeTab == 'projects' && <>

                  <Form.Group>
                    <Form.Label> Lead Source </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="leadSource"
                      options={leadSource}
                      value={filtersData.leadSource || null}
                      onChange={(option) => setFiltersData({ ...filtersData, leadSource: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Lead Type </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="leadType"
                      options={leadType}
                      value={filtersData.leadType || null}
                      onChange={(option) => setFiltersData({ ...filtersData, leadType: option })}
                    />
                  </Form.Group>


                  <Form.Group>
                    <Form.Label> Implementation Type </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="implementationType"
                      options={implementationType}
                      value={filtersData.implementationType || null}
                      onChange={(option) => setFiltersData({ ...filtersData, implementationType: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Project Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="projectStatus"
                      options={projectStatus}
                      value={filtersData.projectStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, projectStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Payment Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="paymentStatus"
                      options={paymentStatus}
                      value={filtersData.paymentStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, paymentStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Invoice Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      isMulti
                      name="invoiceStatus"
                      options={invoiceStatus}
                      value={filtersData.invoiceStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, invoiceStatus: option })}
                    />
                  </Form.Group>
                </>}

                {activeTab == 'permits' && <div>

                  <Form.Group>
                    <Form.Label> Installation Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="installationStatus"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['Installed', 'Pending', 'Other']}
                      value={filtersData.installationStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, installationStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Activation Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="activationStatus"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['Activated', 'Pending', 'Other']}
                      value={filtersData.activationStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, activationStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Certificate Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="certificateStatus"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['Issued', 'Pending', 'Other']}
                      value={filtersData.certificateStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, certificateStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Permit Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="permitStatus"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['Issued', 'Pending', 'Other']}
                      value={filtersData.permitStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, permitStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Payment Status </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="permitPaymentStatus"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['Paid', 'Not Paid']}
                      value={filtersData.permitPaymentStatus || null}
                      onChange={(option) => setFiltersData({ ...filtersData, permitPaymentStatus: option })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label> Implementation Type </Form.Label>
                    <Select
                      closeMenuOnSelect={false}
                      defaultValue={[]}
                      isMulti
                      name="implementationType"
                      getOptionLabel={(option) => option}
                      getOptionValue={(option) => option}
                      options={['ASATEEL', 'LOCATOR+ASATEEL']}
                      value={filtersData.implementationType || null}
                      onChange={(option) => setFiltersData({ ...filtersData, implementationType: option })}
                    />
                  </Form.Group>

                </div>}


                <hr />

                <Form.Group>
                  <Button size="sm" onClick={handleClearFilter} type="reset" variant='warning'>Clear Filter</Button>
                  <Button size="sm" type="submit" variant='dark'>Apply Filter</Button>
                </Form.Group>

              </div>

            </div>
          </form>

        </div>
      </React.Fragment>

      {/* ADD PROJECT */}

      {renderAddProjectModel()}
      {renderAddPermitModel()}
      {renderCSVResponseModal()}
    </React.Fragment>
  );
};

export default ITC;
