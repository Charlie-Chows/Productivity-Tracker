import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { format } from 'date-fns';

function StreakGraph({ dailyGoal }) {
  const [streakData, setStreakData] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [averageStudy, setAverageStudy] = useState(0);

  useEffect(() => {
    const loadStreakData = () => {
      const days = 30;
      const data = [];
      let totalStudy = 0;
      
      const savedData = JSON.parse(localStorage.getItem('productivityData') || '{}');
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayData = savedData[dateStr] || [];
        
        const studyMinutes = dayData.filter(b => b.category === 'study').length * 5;
        const wastedMinutes = dayData.filter(b => b.category === 'wasted').length * 5;
        const dailyMinutes = dayData.filter(b => b.category === 'daily').length * 5;
        
        totalStudy += studyMinutes;
        
        data.push({
          date: format(date, 'MMM dd'),
          fullDate: dateStr,
          study: studyMinutes,
          wasted: wastedMinutes,
          daily: dailyMinutes,
          productivity: studyMinutes > 0 
            ? Math.round((studyMinutes / (studyMinutes + wastedMinutes + dailyMinutes)) * 100)
            : 0,
          goalAchievement: dailyGoal > 0 
            ? Math.min(Math.round((studyMinutes / dailyGoal) * 100), 100)
            : 0
        });
      }
      
      // Calculate streaks
      let current = 0;
      let best = 0;
      let tempStreak = 0;
      
      data.forEach(day => {
        if (day.study >= 120) { // More than 2 hours counts as a productive day
          tempStreak++;
          current = tempStreak;
          best = Math.max(best, tempStreak);
        } else {
          tempStreak = 0;
        }
      });
      
      setStreakData(data);
      setCurrentStreak(current);
      setBestStreak(best);
      setTotalStudyTime(totalStudy);
      setAverageStudy(Math.round(totalStudy / days));
    };

    loadStreakData();
  }, [dailyGoal]);

  const productiveDays = streakData.filter(day => day.study >= 120).length;
  const goalAchievedDays = streakData.filter(day => dailyGoal > 0 && day.study >= dailyGoal).length;

  return (
    <div className="streak-graph">
      {/* Streak Info Cards */}
      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Current Streak</h3>
          <div className="value" style={{ color: '#667eea', fontSize: '2.8rem' }}>
            {currentStreak}
          </div>
          <p>days in a row studying ≥ 2 hours</p>
        </div>
        
        <div className="stat-card">
          <h3>Best Streak</h3>
          <div className="value" style={{ color: '#28a745', fontSize: '2.8rem' }}>
            {bestStreak}
          </div>
          <p>longest productive streak</p>
        </div>
        
        <div className="stat-card">
          <h3>Productive Days</h3>
          <div className="value" style={{ color: '#ffc107', fontSize: '2.8rem' }}>
            {productiveDays}/{streakData.length}
          </div>
          <p>{Math.round((productiveDays / streakData.length) * 100)}% productive</p>
        </div>
        
        <div className="stat-card">
          <h3>Goal Achieved</h3>
          <div className="value" style={{ color: '#dc3545', fontSize: '2.8rem' }}>
            {goalAchievedDays}
          </div>
          <p>days meeting daily goal</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Study Time</h3>
          <div className="value">
            {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
          </div>
          <p>last 30 days</p>
        </div>
        
        <div className="stat-card">
          <h3>Daily Average</h3>
          <div className="value">
            {Math.floor(averageStudy / 60)}h {averageStudy % 60}m
          </div>
          <p>per day last 30 days</p>
        </div>
      </div>

      {/* Study Time Line Chart */}
      <div className="chart-container">
        <h3>30-Day Study Journey (Minutes)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `${value}`}
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
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="study" 
              name="Study Time" 
              stroke="#28a745" 
              fill="#28a745" 
              fillOpacity={0.3}
              strokeWidth={3}
            />
            <Area 
              type="monotone" 
              dataKey="wasted" 
              name="Wasted Time" 
              stroke="#dc3545" 
              fill="#dc3545" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Goal Achievement Chart */}
      <div className="chart-container">
        <h3>Daily Goal Achievement (%)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={streakData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 100]} 
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Goal Achievement']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="goalAchievement" 
              name="Goal Achievement %" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              name="Productivity %" 
              stroke="#ffc107" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap-like bar chart */}
      <div className="chart-container">
        <h3>Study Intensity Heatmap</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={streakData}>
            <Tooltip 
              formatter={(value) => [`${value} minutes`, 'Study Time']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar 
              dataKey="study" 
              name="Study Time"
              radius={[2, 2, 0, 0]}
            >
              {streakData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.study >= 480 ? '#28a745' : 
                        entry.study >= 240 ? '#4cd964' : 
                        entry.study >= 120 ? '#ffc107' : 
                        entry.study >= 60 ? '#ff9500' : 
                        '#dc3545'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#28a745', borderRadius: '4px' }}></div>
            <span>≥ 8h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#4cd964', borderRadius: '4px' }}></div>
            <span>4-8h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ffc107', borderRadius: '4px' }}></div>
            <span>2-4h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#ff9500', borderRadius: '4px' }}></div>
            <span>1-2h</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '20px', background: '#dc3545', borderRadius: '4px' }}></div>
            <span>&lt; 1h</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="chart-container">
        <h3>30-Day Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="summary-card">
            <div className="summary-label">Most Productive Day</div>
            <div className="summary-value">
              {streakData.length > 0 ? 
                `${streakData.reduce((max, day) => day.study > max.study ? day : max, streakData[0]).date}: ` +
                `${Math.floor(streakData.reduce((max, day) => day.study > max.study ? day : max, streakData[0]).study / 60)}h` : 
                'No data'
              }
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Wasted Time</div>
            <div className="summary-value">
              {Math.floor(streakData.reduce((sum, day) => sum + day.wasted, 0) / 60)}h
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Average Productivity</div>
            <div className="summary-value">
              {Math.round(streakData.reduce((sum, day) => sum + day.productivity, 0) / streakData.length)}%
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Consistency Score</div>
            <div className="summary-value">
              {Math.round((productiveDays / streakData.length) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakGraph;