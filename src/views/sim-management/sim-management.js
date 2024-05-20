
import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Pagination, Button, OverlayTrigger, Tooltip, Form, Card, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import BTable from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from 'react-table';
import './sim-management.css';
import { API_URL } from "../../config/constant";
import axios from 'axios';
import PNotify from "pnotify/dist/es/PNotify";
import ReactModal from 'react-modal-resizable-draggable';

const sweetAlertHandler = (alert) => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        //title: alert.title,
        icon: 'success',
        text: alert.text,
        type: alert.type
    });
};

function DynamicTable({ columns, data, fromNumber, toNumber, getVehiclesList, totalCount }) {

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
            disableSortRemove: true,
            manualSortBy: true,
            initialState: { pageIndex: 0, sortBy: [{ id: '', desc: true }] },
            manualPagination: true,
            pageCount: Math.ceil(totalCount / 50),
        },
        useSortBy,
        usePagination
    )

    const [searchtext, setSearchText] = useState(null);
    const [updateList, setupdateList] = useState(false);
    const loginUserId = localStorage.getItem('loginUserId');
    const [uploadFile, setUploadFile] = useState();
    const authToken = localStorage.getItem('authToken');
    const [searchFromEtisalat, setSearchFromEtisalat] = useState(false);
    const [etisalatList, setEtisalatList] = useState([]);
    const [etisalatSearchPopup, setEtisalatSearchPopup] = useState(false);
    const [isTopLoading, setIsTopLoading] = useState(false);
    const [simVerification, setSimVerification] = useState('no');
    const [selectedStatus, setSelectedStatus] = useState('active')
    const [imeiSearchKeyword, setImeiSearchKeyword] = useState(null);

    const importFile = () => {

        setIsTopLoading(true);
        const dataArray = new FormData();
        dataArray.append("file", uploadFile);

        const api_url = API_URL + "importEtisalatCsv";

        axios.post(api_url, dataArray, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Xtoken': authToken
            }
        })
            .then((response) => {

                if (response.data.status == 'success') {

                    let msg = '';

                    if (response.data.data > 0 && response.data.errorcount === 0) {
                        msg = `${response.data.data} rows uploaded successfully.`;
                    } else if (response.data.data > 0 && response.data.errorcount > 0) {
                        msg = `${response.data.data} rows uploaded successfully. ${response.data.errorcount} rows failed`;
                    } else if (response.data.data === 0 && response.data.errorcount > 0) {
                        msg = `${response.data.errorcount} rows failed`;
                    } else if (response.data.data === 0 && response.data.errorcount === 0) {
                        msg = `No rows uploaded`;
                    }

                    setIsTopLoading(false);

                    sweetAlertHandler({ title: 'Success!', type: 'success', text: msg })

                    setUploadFile('');

                }
                else {
                    setIsTopLoading(false);
                    sweetAlertHandler({ title: 'Error', type: 'error', text: response.data.data })
                }
            })
            .catch((error) => {
                setIsTopLoading(false);
                PNotify.error({
                    title: "Error",
                    text: error.data.message,
                });
            });
    }

    const onChangeSearchtext = (e) => {
        setSearchText(e.target.value);
    };

    const clearsearch = () => {
        setSearchText(null);
        setSearchFromEtisalat(false);
        if (pageIndex > 0) {
            gotoPage(0);
        } else {
            setupdateList(updateList === true ? false : true)
        }
    }

    const searchfromEtisalatList = async (searchkeyword) => {
        setIsTopLoading(true);
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "searchfromEtisalatList/" + searchkeyword;

            const response = await fetch(url, options);

            const data = await response.json();

            if (data.status === 'success') {

                setEtisalatList(data.data);

                if (etisalatSearchPopup === false)
                    setEtisalatSearchPopup(true);

                setIsTopLoading(false);
            } else {
                PNotify.error({
                    title: "Error ",
                    text: data.data,
                });
                setIsTopLoading(false);
            }
        }
        catch {

        }
    }

    const search = () => {

        if (searchFromEtisalat) {
            setImeiSearchKeyword(searchtext);
            searchfromEtisalatList(searchtext);
        } else {
            if (pageIndex > 0) {
                gotoPage(0);
            }
            else
                setupdateList(updateList ? false : true);
        }
    };

    const clearAllFilters = () => {
        setSearchText(null);
        setSearchFromEtisalat(false);
        if (pageIndex > 0) {
            gotoPage(0);
        }
        else
            setupdateList(updateList ? false : true);
    }

    useEffect(() => {

        getVehiclesList(pageIndex, searchtext, sortBy, simVerification, selectedStatus);
    }, [sortBy, pageIndex, updateList])

    const handleKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            search();
        }
    };

    const handlePopupSearchKeypress = e => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            setSearchText(imeiSearchKeyword);
            searchfromEtisalatList(imeiSearchKeyword);
        }
    };

    const searchfromPopup = () => {
        searchfromEtisalatList(imeiSearchKeyword);
    };

    const TopLoader = () => (
        <div className="divLoader">
            <svg className="svgLoader" viewBox="0 0 100 100" width="10em" height="10em">
                <path stroke="none" d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" fill="#51CACC" transform="rotate(179.719 50 51)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51;360 50 51" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></path>
            </svg>
        </div>
    );

    return (
        <>
            {isTopLoading ? <TopLoader /> : null}

            <Form>
                <Form.Row>
                    <Col xs={1} style={{ color: 'black' }}>
                        <span style={{ top: '12px', position: 'relative' }}><b>Total : {totalCount}</b></span>
                    </Col>
                    <Col xs={1}>

                        <Form.Control as="select" value={selectedStatus} onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setupdateList(updateList === true ? false : true);
                        }}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="offline">Offline</option>
                            <option value="blocked">Blocked</option>
                            <option value="deviceblocked">Devices Blocked</option>
                            <option value="duplicates">Duplicates</option>
                        </Form.Control>
                    </Col>
                    <Col xs="2">
                        <Form.Control as="select" value={simVerification} onChange={(e) => {
                            setSimVerification(e.target.value);
                            setupdateList(updateList === true ? false : true);
                        }}>
                            <option value="no">Not Verified</option>
                            <option value="yes">Verified</option>
                            <option value="all">All</option>
                        </Form.Control>
                    </Col>
                    <Col xs={3}>
                        <Form.Control placeholder="Search..." value={searchtext || ''} onChange={onChangeSearchtext} onKeyPress={handleKeypress} />
                        {searchtext && <button type="button" class="react-datepicker__close-icon" onClick={clearsearch} style={{ right: '2px', height: '90%' }}></button>}
                    </Col>

                    <Col xs={2}>

                        <OverlayTrigger
                            placement='top'
                            overlay={<Tooltip id={`tooltip-top`}>Search from IMEI in Etisalat Portal</Tooltip>}>
                            <div className="checkbox d-inline checkbox-primary">
                                <Form.Control type="checkbox" name='etisalat_search' checked={searchFromEtisalat} id='etisalat_search' onChange={(e) => setSearchFromEtisalat(e.target.checked)} />
                                <Form.Label htmlFor='etisalat_search' className="cr"></Form.Label>
                            </div>
                        </OverlayTrigger>

                        <button
                            className="text-capitalize btn btn-success"
                            type="button"
                            onClick={search}
                        >
                            <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                        </button>

                        <button
                            className="text-capitalize btn btn-danger"
                            type="button"
                            onClick={clearAllFilters}
                        >
                            <i className="feather icon-refresh-cw" style={{ margin: 0 }}></i>
                        </button>
                    </Col>

                    <Col xs={3}>
                        {loginUserId === '1' ?
                            <InputGroup className="mb-3 cust-file-button">
                                <div className="custom-file">
                                    <Form.Control
                                        aria-describedby="custom-addons8"
                                        type="file"
                                        className="custom-file-input"
                                        id="validatedCustomFile4"
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                    />
                                    <Form.Label className="custom-file-label" htmlFor="validatedCustomFile4">Choose file</Form.Label>
                                </div>
                                <InputGroup.Append>
                                    <Button id="custom-addons8" onClick={() => importFile()} style={{ lineHeight: '1.6' }}>Button</Button>
                                </InputGroup.Append>
                            </InputGroup>
                            : ''}
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
                <Col sm={12} md={4}><span>{fromNumber} - {toNumber} of {totalCount} items</span></Col>
                <Col sm={12} md={4}>
                    <Pagination className='justify-content-end'>
                        <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
                        <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
                        <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
                        <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
                    </Pagination>
                </Col>
            </Row>

            <ReactModal
                initWidth={800}
                onRequestClose={() => setEtisalatSearchPopup(false)}
                isOpen={etisalatSearchPopup}>
                <h5>Search Result from IMEI in Etisalat Portal</h5>
                <div className="body">
                    <Row style={{ margin: '0 auto', width: '100%' }}>
                        <Col md={12} className='p-0'>
                            <Card style={{ margin: 0 }}>
                                <Card.Body style={{ maxHeight: '75vh' }}>
                                    <Form>
                                        <Form.Row>
                                            <Col xs={6}></Col>
                                            <Col xs={4}>
                                                <Form.Control placeholder="Search..." value={imeiSearchKeyword || ''} onChange={(e) => { setImeiSearchKeyword(e.target.value); setSearchText(imeiSearchKeyword); }} onKeyPress={handlePopupSearchKeypress} />
                                                {(imeiSearchKeyword !== null && imeiSearchKeyword.length > 0) ? <span>Number of digits: {imeiSearchKeyword.length}</span> : ''}
                                            </Col>
                                            <Col xs={1}>
                                                <button
                                                    className="text-capitalize btn btn-success"
                                                    type="button"
                                                    onClick={searchfromPopup}
                                                >
                                                    <i className="feather icon-search" style={{ margin: 0, fontSize: '16px' }}></i>
                                                </button>
                                            </Col>
                                        </Form.Row>
                                    </Form>
                                    <table className='etisalat-table table-bordered'>
                                        <thead>
                                            <tr>
                                                <th>IMEI</th>
                                                <th>ICCID</th>
                                                <th>Sim</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {etisalatList && etisalatList.map((item, index) => (
                                                <tr>
                                                    <td>{item.imei}</td>
                                                    <td>{item.iccid}</td>
                                                    <td>{item.sim}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>

                                    <button className='mt-2 btn btn-secondary float-right' onClick={() => setEtisalatSearchPopup(false)}>
                                        Close
                                    </button>

                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

            </ReactModal>


        </>
    )
}

function App() {

    const authToken = localStorage.getItem('authToken');
    const [vehicles, setvehicle] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [fromNumber, setFromNumber] = useState(0);
    const [toNumber, setToNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [simVerfn, setSimVerfn] = useState('');
    const [savedStatus, setSavedStatus] = useState('');
    const [listupdated, setListUpdated] = useState(false);
    const [sortType, setSortType] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedVehicleId, setSelectedVehicleId] = useState(0);
    const [refreshView, setRefreshView] = useState(false);

    const columns = React.useMemo(
        () => [

            {
                Header: 'Customer Name/UserName',
                accessor: 'customer_name',
                className: 'namecolumn',
                Cell: ({ row }) => {

                    return (<span className="pointer">
                        {row.original.customer_name} <br />
                        <span><OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Username</Tooltip>}><span>({row.original.customer_username}) </span></OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Customer Status</Tooltip>}
                            >
                                <span className={row.original.customer_status === 'blocked' ? 'text-danger mr-2' : 'text-success mx-2'} style={{ 'text-transform': 'capitalize' }}>{row.original.customer_status === 'followup' ? 'Newly Created' : row.original.customer_status}</span>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={<Tooltip id={`tooltip-top`}>Implementation Type</Tooltip>}
                            >
                                <span className='text-primary'>{row.original.customer_implementation_type}</span>
                            </OverlayTrigger></span>
                    </span>);
                }
            },
            {
                Header: 'Vehicle Name/IMEI',
                accessor: 'vehicle_name',
                className: 'vehiclecolumn',
                Cell: ({ row }) => {

                    return (
                        <span>
                            {row.original.vehicle_name}<br />
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>IMEI</Tooltip>}><span>{row.original.vehicle_imei}</span></OverlayTrigger>
                        </span>
                    );
                }
            },
            {
                Header: 'NW',
                accessor: 'vehicle_sim_4g',
                className: 'networkclmn',
                Cell: ({ row }) => {
                    return (<span className="pointer">
                        <Form.Control as="select" name="network" onChange={(e) => updateNetwork(e, row.original.vehicle_id)} value={row.original.vehicle_sim_4g} >
                            <option value="yes">4G</option>
                            <option value="no">2G</option>
                        </Form.Control>
                    </span>);
                }
            },
            {
                Header: 'ICCID',
                accessor: 'vehicle_iccid',
                className: 'iccidcolumn',
                Cell: ({ row }) => {

                    return (
                        <span className="pointer d-flex">
                            <Form.Control name='iccid' id={`iccid_${row.original.vehicle_id}`} value={row.original.vehicle_iccid} onChange={(e) => {
                                row.original.vehicle_iccid = e.target.value;
                                handleIccidChange(row.original.vehicle_traccar_id, e);
                            }}
                                onKeyPress={(e) => handleICCIDPress(e, row.original.vehicle_traccar_id, row.original.vehicle_iccid)}
                            />
                            <button className='btn btn-success text-capitalize my-0 mx-1 p-2' onClick={() => findSimNumber(row.original.vehicle_traccar_id, row.original.vehicle_iccid)}>
                                <i className="feather icon-search m-0"></i>
                            </button>
                        </span>
                    );
                }
            },
            {
                Header: 'Sim',
                accessor: 'vehicle_sim',
                className: 'imeicolumn',
                Cell: ({ row }) => {

                    return (
                        <span className="pointer">
                            <Form.Control name='sim' className=' mr-1' id={`sim_${row.original.vehicle_id}`} value={row.original.vehicle_sim} onChange={(e) => handleSimChange(row.original.vehicle_traccar_id, e)} />
                        </span>
                    );
                }
            },
            {
                Header: 'Comment',
                accessor: 'vehicle_sim_management_note',
                className: 'commentcolumn',
                Cell: ({ row }) => {
                    return (
                        <span className="pointer">
                            {/* <Form.Control defaultValue={row.original.vehicle_sim_management_note} onBlur={(e) => row.original.vehicle_sim_management_note = e.target.value} /> */}

                            <Form.Control name={`sim_note`} className='mr-1' value={row.original.vehicle_sim_management_note || ''} onChange={(e) => handleSimNoteChange(row.original.vehicle_id, e)} />
                        </span>
                    );
                }
            },
            {
                Header: 'Verified',
                accessor: 'vehicle_sim_verified',
                className: 'buttoncolumn',
                Cell: ({ row }) => {

                    return (
                        <div className="checkbox d-inline checkbox-primary">
                            <Form.Control type="checkbox" name={`verified_sim_${row.original.vehicle_id}`} checked={row.original.vehicle_sim_verified === 'yes'} id={`verified_sim_${row.original.vehicle_id}`} onClick={(e) => updateSimVerification(e, row.original.vehicle_id)} />
                            <Form.Label htmlFor={`verified_sim_${row.original.vehicle_id}`} className="cr"></Form.Label>
                        </div>
                    );
                }
            },
            {
                Header: '',
                accessor: 'action',
                className: 'buttoncolumn',
                disableSortBy: true,
                Cell: ({ row }) => {

                    return (
                        <span>
                            <OverlayTrigger placement='top' overlay={<Tooltip id={`tooltip-top`}>Save</Tooltip>}>
                                <button className='btn btn-primary text-capitalize p-2' onClick={() => {
                                    const updatedRow = row.values;
                                    console.log(updatedRow);
                                    saveSingleVehicle(row.original.vehicle_traccar_id, row.original.vehicle_iccid, row.original.vehicle_sim, row.original.vehicle_sim_verified, row.original.vehicle_sim_4g, row.original.vehicle_sim_management_note);
                                }}>
                                    <i className="far fa-save m-0"></i>
                                </button>
                            </OverlayTrigger>
                        </span>
                    );
                }
            }
        ],
        []
    )

    const handleICCIDPress = (e, veh_id, iccid) => {
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            findSimNumber(veh_id, iccid);
        }
    };

    const handleIccidChange = (veh_id, e) => {
        e.preventDefault();

        let previousState = '';
        setvehicle((prev) => {
            const idx = prev.findIndex((v) => v.vehicle_traccar_id === veh_id);
            if (idx >= 0) {
                previousState = prev[idx];
                prev[idx] = { ...prev[idx], vehicle_iccid: e.target.value };
                return [...prev];
            }
        });
    }

    const handleSimChange = (veh_id, e) => {
        e.preventDefault();

        let previousState = '';
        setvehicle((prev) => {
            const idx = prev.findIndex((v) => v.vehicle_traccar_id === veh_id);
            if (idx >= 0) {
                previousState = prev[idx];
                prev[idx] = { ...prev[idx], vehicle_sim: e.target.value };
                return [...prev];
            }
        });
    }

    const handleSimNoteChange = (veh_id, e) => {
        e.preventDefault();
        let previousState = '';
        setvehicle((prev) => {
            const idx = prev.findIndex((v) => v.vehicle_id === veh_id);
            if (idx >= 0) {
                previousState = prev[idx];
                prev[idx] = { ...prev[idx], vehicle_sim_management_note: e.target.value };
                return [...prev];
            }
        });
    }

    const findSimNumber = async (veh_id, iccid) => {
        setSelectedVehicleId(veh_id);
        setIsLoading(true);
        try {
            const options = {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Xtoken': authToken
                }
            }

            const url = API_URL + "getSimNumberfromEtisalat/" + iccid;

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {

                let previousState = '';
                setvehicle((prev) => {
                    const idx = prev.findIndex((v) => v.vehicle_traccar_id === veh_id);
                    if (idx >= 0) {
                        previousState = prev[idx];
                        prev[idx] = { ...prev[idx], vehicle_sim: data.data.sim };
                        return [...prev];
                    }
                });

                setRefreshView(refreshView ? false : true);
            } else {
                PNotify.error({
                    title: "Error ",
                    text: data.data,
                });
            }
            setIsLoading(false);
        }
        catch {

        }
    }

    const updateNetwork = (e, vehicle_id) => {

        let previousState = '';
        setvehicle((prev) => {
            const idx = prev.findIndex((v) => v.vehicle_id === vehicle_id);
            if (idx >= 0) {
                previousState = prev[idx];
                prev[idx] = { ...prev[idx], vehicle_sim_4g: e.target.value };
                return [...prev];
            }
        });
    }

    const updateSimVerification = async (e, id) => {

        var network = e.target.checked;
        if (network == true)
            network = 'yes';
        else
            network = 'no';

        let previousState = '';
        setvehicle((prev) => {
            const idx = prev.findIndex((v) => v.vehicle_id === id);
            if (idx >= 0) {
                previousState = prev[idx];
                prev[idx] = { ...prev[idx], vehicle_sim_verified: network };
                return [...prev];
            }
        });
    }

    const saveSingleVehicle = async (traccar_id, iccid, sim, verified, network, simNote) => {

        const postdata = { vehicle_traccar_id: traccar_id, vehicle_iccid: iccid, vehicle_sim: sim, vehicle_sim_verified: verified, vehicle_sim_4g: network, vehicle_sim_management_note: simNote };

        setIsLoading(true);
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

            const url = API_URL + "updateSimDetails/" + traccar_id;

            const response = await fetch(url, options)

            const data = await response.json();

            if (data.status === 'success') {
                setListUpdated(listupdated === true ? false : true);
                PNotify.success({
                    title: "Success",
                    text: data.data,
                });
            } else {
                PNotify.error({
                    title: "Error ",
                    text: data.data,
                });
            }
            setIsLoading(false);
        }
        catch {

        }

    }

    useEffect(() => {
        const sortBy = [{ id: sortType, desc: sortOrder === 'desc' ? true : false }];
        console.log(searchKeyword);
        const searchText = searchKeyword;
        const pageIndex = currentPage;
        const simVerification = simVerfn;
        const selectedStatus = savedStatus;

        getVehiclesList(pageIndex, searchText, sortBy, simVerification, selectedStatus);
    }, [listupdated])

    const getVehiclesList = useCallback(async (pageIndex, searchtext, sortBy, simVerification, selectedStatus) => {

        setIsLoading(true);

        setTotalCount(0);

        const cpage = pageIndex + 1;

        setCurrentPage(pageIndex);

        var stype = '';

        var sorder = '';

        setSearchKeyword(searchtext);

        setSimVerfn(simVerification);

        setSavedStatus(selectedStatus);

        if (sortBy.length > 0) {

            setSortType(sortBy[0].id);
            stype = sortBy[0].id;

            if (sortBy[0].desc) {
                setSortOrder('desc');
                sorder = 'desc';
            }
            else {
                setSortOrder('asc');
                sorder = 'asc';
            }
        }

        const postdata = {
            keyword: searchtext, sortType: stype ? stype : sortType, sortOrder: sorder ? sorder : sortOrder, export: false, verificationStatus: simVerification, status: selectedStatus
        }

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

            const url = API_URL + "simList?page=" + cpage;

            const response = await fetch(url, options)

            const data = await response.json();

            setvehicle(data.data.data);

            setTotalCount(data.data.total);

            setFromNumber(data.data.from);

            setToNumber(data.data.to);

            setIsLoading(false);

            setListUpdated(false);
        }
        catch {

        }

    }, []);

    const Loader = () => (
        <div className="divLoader">
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
                    <Card>
                        <Card.Body style={{ padding: '15px' }}>
                            <DynamicTable columns={columns} data={vehicles} fromNumber={fromNumber} toNumber={toNumber} getVehiclesList={getVehiclesList} totalCount={totalCount} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    );

}

export default App