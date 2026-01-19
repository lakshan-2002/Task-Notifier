import React, { useMemo } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Charts.css';

const Charts = ({ tasks = [], allTasks = 0, pendingTasks = 0, completedTasks = 0, isLoading = false }) => {
  // Calculate daily completion trend from actual tasks
  const lineData = useMemo(() => {
    // Get last 7 days
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toISOString().split('T')[0];
      
      // Count completed tasks for this day
      const completedOnDay = tasks.filter(task => {
        if (task.status?.toLowerCase() !== 'completed') return false;
        // Assuming tasks have a completedDate or we can use dueDate as approximation
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === dateStr;
      }).length;
      
      last7Days.push({
        day: dayName,
        completed: completedOnDay
      });
    }
    
    return last7Days;
  }, [tasks]);

  // Pie chart data based on actual task counts
  const pieData = useMemo(() => [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
    { name: 'All Tasks', value: allTasks, color: '#3b82f6' }
  ], [completedTasks, pendingTasks, allTasks]);

  if (isLoading) {
    return (
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Daily Completion Trend</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <p>Loading chart data...</p>
          </div>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Task Distribution</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
            <p>Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

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