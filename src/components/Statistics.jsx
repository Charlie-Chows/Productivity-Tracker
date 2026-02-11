import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

function Statistics({ dailyGoal }) {
  const [stats, setStats] = useState({
    study: 0,
    daily: 0,
    wasted: 0
  });

  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    // Load today's data
    const today = format(new Date(), 'yyyy-MM-dd');
    const savedData = JSON.parse(localStorage.getItem('productivityData') || '{}');
    
    if (savedData[today]) {
      const todayData = savedData[today];
      const todayStats = {
        study: todayData.filter(b => b.category === 'study').length * 5,
        daily: todayData.filter(b => b.category === 'daily').length * 5,
        wasted: todayData.filter(b => b.category === 'wasted').length * 5
      };
      setStats(todayStats);
    }

    // Load weekly data
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = savedData[dateStr] || [];
      
      const studyMinutes = dayData.filter(b => b.category === 'study').length * 5;
      const wastedMinutes = dayData.filter(b => b.category === 'wasted').length * 5;
      
      weekly.push({
        name: format(date, 'EEE'),
        fullDate: format(date, 'MMM dd'),
        study: studyMinutes,
        wasted: wastedMinutes,
        productivity: studyMinutes > 0 ? Math.round((studyMinutes / (studyMinutes + wastedMinutes)) * 100) : 0
      });
    }
    setWeeklyData(weekly);
  }, []);

  const pieData = [
    { name: 'Study', value: stats.study, color: '#28a745' },
    { name: 'Daily Activities', value: stats.daily, color: '#17a2b8' },
    { name: 'Wasted', value: stats.wasted, color: '#dc3545' }
  ].filter(item => item.value > 0);

  const totalMinutes = stats.study + stats.daily + stats.wasted;
  const productivityRate = totalMinutes > 0 
    ? Math.round((stats.study / totalMinutes) * 100) 
    : 0;
  
  const goalAchievement = dailyGoal > 0 
    ? Math.min(Math.round((stats.study / dailyGoal) * 100), 100)
    : 0;

  const averageDailyStudy = weeklyData.length > 0
    ? Math.round(weeklyData.reduce((sum, day) => sum + day.study, 0) / weeklyData.length)
    : 0;

  return (
    <div className="statistics">
      <div className="statistics-grid">
        <div className="stat-card study">
          <h3>Study Time</h3>
          <div className="value">
            {Math.floor(stats.study / 60)}h {stats.study % 60}m
          </div>
          <p>{Math.round(stats.study / 5)} blocks</p>
        </div>
        
        <div className="stat-card daily">
          <h3>Daily Activities</h3>
          <div className="value">
            {Math.floor(stats.daily / 60)}h {stats.daily % 60}m
          </div>
          <p>{Math.round(stats.daily / 5)} blocks</p>
        </div>
        
        <div className="stat-card wasted">
          <h3>Wasted Time</h3>
          <div className="value">
            {Math.floor(stats.wasted / 60)}h {stats.wasted % 60}m
          </div>
          <p>{Math.round(stats.wasted / 5)} blocks</p>
        </div>
        
        <div className="stat-card">
          <h3>Productivity Rate</h3>
          <div className="value" style={{ 
            color: productivityRate >= 70 ? '#28a745' : 
                   productivityRate >= 50 ? '#ffc107' : '#dc3545'
          }}>
            {productivityRate}%
          </div>
          <p>Study / Total Time</p>
        </div>
        
        <div className="stat-card">
          <h3>Goal Achievement</h3>
          <div className="value" style={{ 
            color: goalAchievement >= 100 ? '#28a745' : 
                   goalAchievement >= 80 ? '#ffc107' : '#dc3545'
          }}>
            {goalAchievement}%
          </div>
          <p>
            {goalAchievement >= 100 ? '🎉 Goal achieved!' : 
             goalAchievement >= 80 ? 'Almost there!' : 
             'Keep going!'}
          </p>
        </div>
        
        <div className="stat-card">
          <h3>Average Daily Study</h3>
          <div className="value">
            {Math.floor(averageDailyStudy / 60)}h {averageDailyStudy % 60}m
          </div>
          <p>Last 7 days</p>
        </div>
      </div>

      {/* Pie Chart */}
      {pieData.length > 0 ? (
        <div className="chart-container">
          <h3>Time Distribution Today</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} minutes`, 'Time']}
                labelFormatter={() => 'Time Distribution'}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty-state">
          <h3>No data for today</h3>
          <p>Start tracking your time in the Daily Planner!</p>
        </div>
      )}

      {/* Weekly Bar Chart */}
      {weeklyData.length > 0 && (
        <div className="chart-container">
          <h3>Weekly Study Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                tickFormatter={(value) => `${Math.floor(value / 60)}h`}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'study' || name === 'wasted') {
                    const hours = Math.floor(value / 60);
                    const minutes = value % 60;
                    return [`${hours}h ${minutes}m`, name === 'study' ? 'Study Time' : 'Wasted Time'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Legend />
              <Bar dataKey="study" name="Study Time" fill="#28a745" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wasted" name="Wasted Time" fill="#dc3545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Productivity Bar Chart */}
      {weeklyData.length > 0 && (
        <div className="chart-container">
          <h3>Productivity Rate (%) - Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Productivity']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Bar 
                dataKey="productivity" 
                name="Productivity %" 
                fill="#667eea" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Statistics;