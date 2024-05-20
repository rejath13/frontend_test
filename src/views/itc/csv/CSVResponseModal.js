import React from 'react'
import { Table } from 'react-bootstrap'

const CSVResponseModal = ({ response }) => {
    return (
        <>
            <Table responsive>
                <thead>
                    <tr>
                        <th>Row No</th>
                        <th>Locator Client</th>
                        <th>ITC Company Name</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {response.errorRecords.map((item, i) => <>
                        <tr>
                            <th scope="row">{i + 1}</th>
                            <td>{item.row.locator_client || ''}</td>
                            <td>{item.row.itc_company_name || ''}</td>
                            <td className='text-danger'>{item.error || ''}</td>
                        </tr>
                    </>
                    )}
                </tbody>
            </Table>

        </>
    )
}
export default CSVResponseModal