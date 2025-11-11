import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

const Charts = () => {
  // Sample data for line chart
  const lineData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 6 },
    { day: 'Wed', completed: 3 },
    { day: 'Thu', completed: 8 },
    { day: 'Fri', completed: 5 },
    { day: 'Sat', completed: 7 },
    { day: 'Sun', completed: 4 },
  ];

  // Sample data for pie chart
  const pieData = [
    { name: 'Completed', value: 37, color: '#10b981' },
    { name: 'Pending', value: 28, color: '#f59e0b' },
    { name: 'All Tasks', value: 65, color: '#3b82f6' },
  ];

  return (
    <div className="charts-grid">
      {/* Line Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Daily Completion Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completed" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-card">
        <h3 className="chart-title">Task Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;