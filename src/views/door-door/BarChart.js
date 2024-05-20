import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarSimpleChart = (data) => {

    return (
        <React.Fragment>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <defs>
                        <linearGradient id="colorBar1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="1%" stopColor="#1de9b6" stopOpacity={1}/>
                            <stop offset="99%" stopColor="#1dc4e9" stopOpacity={1}/>
                        </linearGradient>
                        <linearGradient id="colorBar2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="1%" stopColor="#899FD4" stopOpacity={1}/>
                            <stop offset="99%" stopColor="#A389D4" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fillOpacity={1} fill="url(#colorBar1)" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}

export default BarSimpleChart;