import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} />
        <YAxis />
        <Tooltip labelFormatter={(value) => new Date(value).toLocaleTimeString()} />
        <Legend />
        <Line type="monotone" dataKey="x" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="z" stroke="#ffc658" dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;