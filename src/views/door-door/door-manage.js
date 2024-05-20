import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Card, Pagination, Table, Button, OverlayTrigger, Tooltip, ButtonGroup, Form, Badge, Modal, Tabs, Tab } from 'react-bootstrap';
import BTable from 'react-bootstrap/Table';

import { useTable, useSortBy, usePagination } from 'react-table';
import './door-door.css';
import { API_URL } from "../../config/constant";

import axios from 'axios';
import PNotify from "pnotify/dist/es/PNotify";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type
        });
};

function DynamicTable({ columns, data, fromNumber, toNumber, totalCount, getDoorList, selectedArray, callRemoveFunction, callAddFunction }) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { sortBy, pageIndex },
    } = useTable(
        {
            columns,
            data,
            manualSortBy: true,
            initialState: { pageIndex: 0, sortBy: [{ id: '', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 50),
        },
        useSortBy,
        usePagination
    )

    const authToken = localStorage.getItem('authToken');
    const loginUserName = localStorage.getItem('loginUserName');
    const [updateList, setupdateList] = useState(false);
    const [searchtext, setSearchText] = useState(null);

    const onChangeSearchtext = (e) => {
        setSearchText(e.target.value);
    };

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    const clearsearch = () => {
        setSearchText(null);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    const search = () => {
        if (searchtext)
            setSearchText(searchtext);

        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    };

    useEffect(() => {

        getDoorList({ pageIndex, searchtext });
    }, [getDoorList, pageIndex, updateList])

    const removeSelectedRows = async () =>{
        callRemoveFunction();
    }

    const addSelectedRows = async () =>{
        callAddFunction();
    }

    return (
        <>
        <Form>
                <Form.Row className='mb-2'>
                    <Col xs={6}></Col>
                    <Col xs={4}>
                        <Form.Control placeholder="Search..." value={searchtext || ''} onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                        {searchtext && <button type="button" className="react-datepicker__close-icon" onClick={clearsearch} style={{ right: '2px', height: '90%' }}></button>}
                    </Col>
                    
                    <Col xs={2}>
                        <button
                            className="text-capitalize btn btn-success topbuttons"
                            type="button"
                            onClick={search}
                        >
                            <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                        </button>

                        <button
                            className="text-capitalize btn btn-danger topbuttons"
                            type="button"
                            onClick={clearsearch}
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>
                    </Col>

                </Form.Row>

            </Form>

            <BTable striped bordered hover responsive {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th style={{ whiteSpace: 'normal' }} className={column.className} {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? <span className='feather icon-arrow-down text-muted float-right mt-1' />
                                                : <span className='feather icon-arrow-up text-muted float-right mt-1' />
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps({ className: cell.column.className })}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </BTable>
            <Row className='justify-content-between mt-3'>
                <Col sm={12} md={4}>
                    <span className="d-flex align-items-center">
                        Page {' '} <strong> {pageIndex + 1} of {pageOptions.length} </strong>{' '}
                        | Go to page:{' '}
                        <input
                            type="number"
                            className='form-control ml-2'
                            value={pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>

                </Col>
                <Col sm={12} md={5}>
                    <span>{fromNumber} - {toNumber} of {totalCount} items</span>

                    {totalCount > 0 && <button
                        className="text-capitalize btn btn-success"
                        type="button"
                        onClick={() => addSelectedRows()}
                        style={{ float: 'right' }}
                    >Add selected</button>}

                    <button
                        className="text-capitalize btn btn-danger"
                        type="button"
                        onClick={() => removeSelectedRows()}
                        style={{ float: 'right' }}
                    >Remove selected</button>

                </Col>
                <Col sm={12} md={3}>
                    <Pagination className='justify-content-end'>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>
        </>
    )
}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [isLoading, setIsLoading] = useState(false);
    const [doorList, setDoorList] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [listupdated, setListUpdated] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [fileUploadPopup, setFileUploadPopup] = useState(false);
    const [uploadFile, setUploadFile] = useState();
    const [fileUploadType, setFileUploadType] = useState(null);
    const loginUserId = localStorage.getItem('loginUserId');
    const [sheetName, setSheetName] = useState('');
    const [sheetId, setSheetId] = useState('');
    const categoryOptions = [];
    const [categoryList, setCategoryList] = useState([]);
    const [selectedArray, setSelectedArray] = useState({});
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [updateCmp, setUpdateCmp] = useState(false);

    const onChangeSearchCategory = (e) => {
        setSearchCategory(e.target.value);
    };

    const handleCategoryKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            searchcategoryfn();
        }
    };

    const clearcategorysearch = () => {
        setSearchCategory(null);
        getCategoryList(null);
    }

    const searchcategoryfn = () => {
        console.log(searchCategory);

        getCategoryList(searchCategory);
    };

    const getCategoryList = useCallback(async (searchCategory) => {

        setIsLoading(true);
        console.log(searchCategory)
        const postdata = {searchKeyWord: searchCategory};

        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata)
            }

            const url = API_URL + "getCategoriesList";

            const response = await fetch(url, options)

            const data = await response.json();

            //const list = data.data;

            // list.map((item) => {
            //     if (item.label !== '') {
            //         categoryOptions.push({ label: item.label });
            //     }
            // });

            setCategoryList(data.data);

            setIsLoading(false);
        }
        catch {

        }
    }, []);

    useEffect(() => {
        getCategoryList(searchCategory);
    }, [getCategoryList, listupdated])

    const handleRemoveArrayChange = (e) => {
        const isChecked = e.target.checked;
        const checkeditem = e.target.name;
        setSelectedArray(selectedArray => ({ ...selectedArray, [checkeditem]: isChecked }));
        setUpdateCmp(updateCmp?false:true);
    }

    const columns = React.useMemo(
        () => [
            {
               Header: '',
               accessor: 'door_id',
               className: 'removecheckbox',
               Cell: ({row}) => {
                    return(
                        <div className="checkbox d-inline">
                            <Form.Control type="checkbox" name={row.original.door_id} value="true"
                                checked={selectedArray[row.original.door_id]} 
                                id={`door_${row.original.door_id}`}
                                onClick={(e) => handleRemoveArrayChange(e)} />
                            <Form.Label htmlFor={`door_${row.original.door_id}`} className="cr"></Form.Label>
                        </div>
                    );
               } 
            },
            {
                Header: 'Company Name',
                accessor: 'door_contact_name',
                className: 'namecolumn',
                Cell: ({ row }) => {
                    return (
                        <span>
                            <span className="pointer">{row.original.door_company}</span><br />
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Contact name</Tooltip>}><span>{row.original.door_contact_name}</span></OverlayTrigger><br />
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Existing customer</Tooltip>}><span>[{row.original.original_company} ({row.original.original_phone}) ]</span></OverlayTrigger>
                        </span>
                    );

                }
            },
            {
                Header: 'Phone',
                accessor: 'door_contact_phone',
                className: 'Phonecolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (<span>{row.original.door_contact_phone}</span>);

                }
            },
            {
                Header: 'Category/Zone',
                accessor: 'category_name',
                className: 'zonecolumn',
                Cell: ({ row }) => {

                    return (
                        <span>{row.original.category_name}<br />{row.original.zone_name} </span>
                    );
                }
            },
            {
                Header: '',
                accessor: 'button',
                className: 'Deletecolumn',
                Cell: ({ row }) => {

                    return (

                        <button
                            className="text-capitalize btn btn-danger  topbuttons"
                            type="button"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this?'))
                                    removeSingleEntry(row.original.door_id)
                            }}
                        >
                            <i className="fa fa-trash" style={{ margin: 0 }}></i>
                        </button>
                    );
                }
            }
        ],
        []
    )

    const removeItem = async () => {

        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(selectedArray) 
            }

            const url = API_URL + "deleteTempEntry";

            const response = await fetch(url, options)

            const resdata = await response.json();

            setListUpdated(true);
        }
        catch {

        }

    }

    const removeSingleEntry = (id) => {
        setSelectedArray({ id: true });
        setUpdateCmp(updateCmp?false:true);
        removeItem();
    }

    const callRemoveFunction = () =>{
        if (Object.keys(selectedArray).length>0) {
            removeItem();
        }
        else{
            window.alert('Select rows to delete')
        }
    }

    const callAddFunction = () =>{
        if (Object.keys(selectedArray).length>0) {
            addtoMainData();
        }
        else{
            window.alert('Select rows to add')
        }
    }

    const addtoMainData = async () => {
        try {
            const options = {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(selectedArray) 
            }

            const url = API_URL + "moveTempDoorRecords";

            const response = await fetch(url, options)

            const resdata = await response.json();

            setListUpdated(true);
        }
        catch {

        }
    }

    useEffect(() => {
        if (listupdated) {

            const pageIndex = currentPage;
            const searchtext = searchKeyword
            getDoorList({ pageIndex, searchtext });
        }
    }, [listupdated])

    const getDoorList = useCallback(async ({ pageIndex, searchtext }) => {

        setIsLoading(true);

        const cpage = pageIndex + 1;
        setCurrentPage(pageIndex);
        setSearchKeyword(searchtext);

        const postdata = {searchKeyWord: searchtext}

        try {
            const options = {
                method: 'Post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                },
                body: JSON.stringify(postdata)
            }

            var url = API_URL + "listTempDoorData?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setDoorList(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

    }, []);

    const showFileUploadPopup = (type) => {
        setFileUploadType(type);
        setFileUploadPopup(true);
    }

    const submitFile = (event) => {

        if (sheetName=='') {
            PNotify.error({
                title: "Error",
                text: "Please fill category name",
            });
        }else{
            setIsLoading(true);
            event.preventDefault();
            const dataArray = new FormData();
            dataArray.append("sales_person", loginUserId);
            dataArray.append("type", fileUploadType);
            dataArray.append("sheetname", sheetName);
            dataArray.append("file", uploadFile);

            const api_url = API_URL + "uploadDataFile";

            axios.post(api_url, dataArray, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Xtoken': authToken
                }
            })
            .then((response) => {

                if (response.data.status == 'success') {
                    setListUpdated(true);
                    setIsLoading(false);

                    let msg = '';

                    if (response.data.data>0 && response.data.errorcount===0) {
                        msg = `${response.data.data} rows uploaded successfully.`;
                    }else if (response.data.data>0 && response.data.errorcount>0) {
                        msg = `${response.data.data} rows uploaded successfully. ${response.data.errorcount} rows failed`;
                    }else if (response.data.data===0 && response.data.errorcount>0) {
                        msg = `${response.data.errorcount} rows failed`;
                    }else if (response.data.data===0 && response.data.errorcount===0) {
                        msg = `No rows uploaded`;
                    }

                    sweetAlertHandler({title: 'Success!', type: 'success', text: msg})

                    // PNotify.success({
                    //     title: "Success",
                    //     text: msg,
                    // });

                    setFileUploadPopup(false);
                    setFileUploadType(null);
                    setUploadFile('');

                }
                else {
                    setIsLoading(false);
                    sweetAlertHandler({title: 'Error', type: 'error', text: response.data.data})
                    // PNotify.error({
                    //     title: "Error",
                    //     text: response.data.data,
                    // });
                }

            })
            .catch((error) => {
                setIsLoading(false);
                PNotify.error({
                    title: "Error",
                    text: error.data.message,
                });
            });
        }
    }

    const Loader = () => (
        <div className="divLoader" style={{zIndex:1075}}>
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    return (
        <React.Fragment>
            <Row>
                <Col className='p-0'>
                    {isLoading ? <Loader /> : null}

                    <Tabs defaultActiveKey="categories">
                        <Tab eventKey="categories" title="Categories">
                            <Form>
                                <Form.Row>
                                    <Col xs={4}></Col>
                                    <Col xs={4}>
                                        <Form.Control className='bg-white' placeholder="Search..." value={searchCategory || ''} onChange={onChangeSearchCategory} onKeyPress={handleCategoryKeypress} />
                                        {searchCategory && <button type="button" className="react-datepicker__close-icon" onClick={clearcategorysearch} style={{ right: '2px', height: '90%' }}></button>}
                                    </Col>
                                    <Col xs={2}>
                                        <button
                                            className="text-capitalize btn btn-success topbuttons"
                                            type="button"
                                            onClick={searchcategoryfn}
                                        >
                                            <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                                        </button>

                                        <button
                                            className="text-capitalize btn btn-danger topbuttons"
                                            type="button"
                                            onClick={clearcategorysearch}
                                        >
                                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                                        </button>
                                    </Col>
                                    <Col xs={2}>

                                        <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Add new category</Tooltip>}>

                                            <button
                                                className="text-capitalize btn btn-primary  topbuttons"
                                                type="button"
                                                onClick={() => {
                                                    showFileUploadPopup('insert');
                                                    setSheetName('')
                                                }}
                                            >
                                                <i className="fa fa-plus" style={{ margin: '0 5px 0 0' }}></i>Category
                                            </button>

                                        </OverlayTrigger>

                                    </Col>

                                </Form.Row>

                            </Form>
                            {categoryList.length > 0 && <Row className="mt-2">

                                {categoryList.map((item, index) => 
                                    
                                        (<Col md={4} xl={4}>
                                            <Card>
                                                <Card.Body style={{padding:'20px'}}>
                                                    <Card.Title as="h5">{item.category_name}</Card.Title>
                                                    <Card.Text>
                                                        <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Assigned count </Tooltip>}><span>Count: {item.count}</span></OverlayTrigger>
                                                            {item.totalcount>0 && <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>New / Total uploaded count </Tooltip>}><span className='ml-5'>New / Total count: {item.newcount}/{item.totalcount}</span></OverlayTrigger>}
                                                    </Card.Text>
                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Download data with zone (Number of unassigned leads) </Tooltip>}>

                                                        <Form action={`${API_URL}exportDoorData/${loginUserId}`} method="POST" target="_blank" style={{width: 'fit-content',display: 'inline-block'}}>

                                                            <input type="hidden"  name="categorytoExport" value={sheetId} />

                                                            <input type="hidden" name="exporttype" value='0' />

                                                            <Button variant="warning"
                                                                type="submit"
                                                                onClick={() => {
                                                                    setSheetId(item.category_id);
                                                                }}
                                                                style={{padding:'5px 8px', marginRight:'5px'}}
                                                            >
                                                                <i className="fa fa-download" style={{ margin: '0 5px 0 0' }}></i> with zone 
                                                                ({item.notassignedcount})
                                                            </Button>

                                                        </Form>

                                                    </OverlayTrigger>

                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Upload data with salesperson </Tooltip>}>

                                                        <Button variant="success"
                                                            type="button"
                                                            onClick={() => {
                                                                showFileUploadPopup('update');
                                                                setSheetId(item.category_id);
                                                                setSheetName(item.category_name);
                                                            }}
                                                            style={{padding:'5px  8px', marginRight:'5px'}}
                                                        >
                                                            <i className="fa fa-upload" style={{ margin: '0 5px 0 0' }}></i>with salesperson
                                                        </Button>

                                                    </OverlayTrigger>

                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Download data</Tooltip>}>

                                                        <Form action={`${API_URL}exportDoorData/${loginUserId}`} method="POST" target="_blank" style={{width: 'fit-content',display: 'inline-block'}}>

                                                            <input type="hidden"  name="categorytoExport" value={sheetId} />

                                                            <input type="hidden" name="exporttype" value={loginUserId} />

                                                            <Button variant="secondary"
                                                                type="submit"
                                                                onClick={() => {
                                                                    setSheetId(item.category_id);
                                                                }}
                                                                style={{padding:'5px  8px', marginRight:'5px'}}
                                                            >
                                                                <i className="fa fa-download" style={{ margin: '0' }}></i>
                                                            </Button>

                                                        </Form>

                                                    </OverlayTrigger>

                                                    <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Add new data</Tooltip>}>

                                                        <Button variant="primary"
                                                            type="button"
                                                            onClick={() => {
                                                                showFileUploadPopup('insert');
                                                                setSheetId(item.category_id);
                                                                setSheetName(item.category_name);
                                                            }}
                                                            style={{padding:'5px 8px', marginRight:0}}
                                                        >
                                                            <i className="fa fa-plus" style={{ margin: '0' }}></i>
                                                        </Button>

                                                    </OverlayTrigger>

                                                </Card.Body>
                                            </Card>
                                        </Col>))}
                            </Row>}
                        </Tab>
                        <Tab eventKey="data" title="Data">
                            <Card>
                                <Card.Body style={{ padding: '15px' }}>
                                    <DynamicTable columns={columns} data={doorList} fromNumber={fromNumber} toNumber={toNumber} totalCount={totalCount} getDoorList={getDoorList} selectedArray={selectedArray} callRemoveFunction={callRemoveFunction} callAddFunction={callAddFunction} />
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>

                    <Modal size="sm" show={fileUploadPopup} onHide={() => setFileUploadPopup(false)} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title as="h5">Upload File</Modal.Title>
                        </Modal.Header>
                        <Form key="fileform" onSubmit={submitFile}>
                            <Modal.Body>
                                <Row>
                                    <Col md="12">

                                        {fileUploadType==='insert' ? <input type="text" value={sheetName} onChange={e => setSheetName(e.target.value)} className="form-control" placeholder="Category" required /> : <input type="text" value={sheetName} disabled className="form-control" />}
                                        <input type="file" className="mt-2" onChange={(e) => setUploadFile(e.target.files[0])} />
                                    </Col>
                                </Row>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" type='submit'>Upload</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>




                </Col>
            </Row>

        </React.Fragment>
    );
}

export default App