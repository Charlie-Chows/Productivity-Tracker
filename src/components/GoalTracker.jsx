import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function GoalTracker({ dailyGoal, onGoalChange }) {
  const [goalInput, setGoalInput] = useState(dailyGoal);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [goalHistory, setGoalHistory] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});

  // Preset goals in minutes
  const presetGoals = [
    { label: '2 hours', value: 120, emoji: '🕑' },
    { label: '4 hours', value: 240, emoji: '🕓' },
    { label: '6 hours', value: 360, emoji: '🕕' },
    { label: '8 hours', value: 480, emoji: '🕗' },
    { label: '10 hours', value: 600, emoji: '🕙' },
    { label: '12 hours', value: 720, emoji: '🕛' }
  ];

  // Calculate goal categories
  const getGoalCategory = (minutes) => {
    if (minutes >= 600) return { label: 'Extreme', color: '#dc3545', emoji: '🔥' };
    if (minutes >= 480) return { label: 'Ambitious', color: '#28a745', emoji: '🚀' };
    if (minutes >= 360) return { label: 'Moderate', color: '#17a2b8', emoji: '⚡' };
    if (minutes >= 240) return { label: 'Light', color: '#ffc107', emoji: '⭐' };
    return { label: 'Minimal', color: '#6c757d', emoji: '🌱' };
  };

  // Load weekly data
  useEffect(() => {
    const loadWeeklyData = () => {
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      const days = eachDayOfInterval({ start, end });
      
      const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
      const weeklyData = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayData = existingData[dateStr] || [];
        const studyMinutes = dayData.filter(b => b.category === 'study').length * 5;
        
        return {
          date: format(day, 'EEE'),
          fullDate: dateStr,
          study: studyMinutes,
          goal: dailyGoal,
          achievement: dailyGoal > 0 ? Math.min(Math.round((studyMinutes / dailyGoal) * 100), 100) : 0,
          isToday: format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
        };
      });
      
      setWeeklyStats(weeklyData);
    };

    loadWeeklyData();
  }, [dailyGoal]);

  // Load goal achievement history (last 30 days)
  useEffect(() => {
    const loadGoalHistory = () => {
      const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
      const dates = Object.keys(existingData).sort().slice(-30); // Last 30 days
      
      const history = dates.map(date => {
        const dayData = existingData[date];
        const studyMinutes = dayData.filter(b => b.category === 'study').length * 5;
        return {
          date: format(new Date(date), 'MMM dd'),
          fullDate: date,
          study: studyMinutes,
          goal: dailyGoal,
          achievement: dailyGoal > 0 ? Math.min(Math.round((studyMinutes / dailyGoal) * 100), 100) : 0
        };
      });
      
      setGoalHistory(history);
    };

    loadGoalHistory();
  }, [dailyGoal]);

  // Calculate monthly statistics
  useEffect(() => {
    const calculateMonthlyStats = () => {
      const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
      const currentMonth = format(new Date(), 'yyyy-MM');
      
      const monthData = Object.entries(existingData)
        .filter(([date]) => date.startsWith(currentMonth))
        .map(([_, dayData]) => ({
          study: dayData.filter(b => b.category === 'study').length * 5
        }));
      
      if (monthData.length > 0) {
        const totalStudy = monthData.reduce((sum, day) => sum + day.study, 0);
        const averageStudy = Math.round(totalStudy / monthData.length);
        const goalAchievedDays = monthData.filter(day => day.study >= dailyGoal).length;
        
        setMonthlyStats({
          totalStudy,
          averageStudy,
          goalAchievedDays,
          totalDays: monthData.length,
          achievementRate: Math.round((goalAchievedDays / monthData.length) * 100)
        });
      }
    };

    calculateMonthlyStats();
  }, [dailyGoal]);

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const minutes = parseInt(goalInput);
    if (!isNaN(minutes) && minutes > 0 && minutes <= 1440) {
      onGoalChange(minutes);
      setGoalInput(minutes);
    }
  };

  const todayStats = weeklyStats.find(day => day.isToday) || {};
  const weeklyTotal = weeklyStats.reduce((sum, day) => sum + day.study, 0);
  const weeklyGoal = dailyGoal * 7;
  const weeklyAchievement = weeklyGoal > 0 ? Math.min(Math.round((weeklyTotal / weeklyGoal) * 100), 100) : 0;

  const pieData = [
    { name: 'Goal Achieved', value: todayStats.study || 0, color: '#28a745' },
    { name: 'Remaining', value: Math.max(0, dailyGoal - (todayStats.study || 0)), color: '#e9ecef' }
  ];

  const goalCategory = getGoalCategory(dailyGoal);

  return (
    <div className="goal-tracker">
      {/* Goal Setting Section */}
      <div className="goal-setter">
        <h2>🎯 Set Your Daily Study Goal</h2>
        <p className="goal-description">Choose how many minutes you want to study each day.</p>
        
        <div className="goal-presets">
          <p>Quick Select Presets:</p>
          <div className="preset-buttons">
            {presetGoals.map(preset => (
              <button
                key={preset.value}
                className={`preset-btn ${dailyGoal === preset.value ? 'active' : ''}`}
                onClick={() => {
                  onGoalChange(preset.value);
                  setGoalInput(preset.value);
                }}
              >
                <span className="preset-emoji">{preset.emoji}</span>
                <span className="preset-label">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleGoalSubmit} className="goal-form">
          <div className="form-group">
            <label htmlFor="customGoal">Custom Goal (minutes):</label>
            <div className="input-with-button">
              <input
                type="number"
                id="customGoal"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                min="5"
                max="1440"
                step="5"
                placeholder="Enter minutes"
              />
              <button type="submit">Set Goal</button>
            </div>
            <p className="hint">
              Equivalent to: <strong>{Math.floor(goalInput / 60)} hours {goalInput % 60} minutes</strong>
              ({Math.floor(goalInput / 5)} five-minute blocks)
            </p>
            <div className="goal-category">
              <span className="category-badge" style={{ background: goalCategory.color }}>
                {goalCategory.emoji} {goalCategory.label} Goal
              </span>
            </div>
          </div>
        </form>
      </div>

      {/* Current Progress Stats */}
      <div className="stats-grid">
        <div className="stat-card today-goal">
          <h3>Today's Progress</h3>
          <div className="goal-progress">
            <div className="progress-circle" style={{ '--progress': `${todayStats.achievement || 0}%` }}>
              <div className="progress-value">
                {todayStats.achievement || 0}%
              </div>
              <div className="progress-label">
                of daily goal
              </div>
            </div>
            <div className="progress-details">
              <p><strong>{todayStats.study || 0} minutes</strong> studied</p>
              <p><strong>{Math.max(0, dailyGoal - (todayStats.study || 0))} minutes</strong> remaining</p>
              <p>Goal: {dailyGoal} minutes</p>
              <p className="status-text">
                {todayStats.achievement >= 100 ? '🎉 Goal Achieved!' : 
                 todayStats.achievement >= 75 ? 'Almost there! 💪' : 
                 todayStats.achievement >= 50 ? 'Halfway there! 🚀' : 
                 'Keep going! 🔥'}
              </p>
            </div>
          </div>
        </div>

        <div className="stat-card weekly-goal">
          <h3>Weekly Progress</h3>
          <div className="goal-progress">
            <div className="progress-circle" style={{ '--progress': `${weeklyAchievement}%` }}>
              <div className="progress-value">
                {weeklyAchievement}%
              </div>
              <div className="progress-label">
                of weekly goal
              </div>
            </div>
            <div className="progress-details">
              <p><strong>{weeklyTotal} minutes</strong> studied this week</p>
              <p><strong>{Math.max(0, weeklyGoal - weeklyTotal)} minutes</strong> remaining</p>
              <p>Weekly Goal: {weeklyGoal} minutes</p>
              <p className="status-text">
                {weeklyAchievement >= 100 ? '🎯 Weekly Goal Achieved!' : 
                 weeklyAchievement >= 75 ? 'Great progress this week! ⚡' : 
                 weeklyAchievement >= 50 ? 'Good pace! 🔥' : 
                 'Keep pushing! 💪'}
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Stats Card */}
        {monthlyStats.totalDays > 0 && (
          <div className="stat-card monthly-goal">
            <h3>Monthly Progress</h3>
            <div className="goal-progress">
              <div className="progress-circle" style={{ '--progress': `${monthlyStats.achievementRate}%` }}>
                <div className="progress-value">
                  {monthlyStats.achievementRate}%
                </div>
                <div className="progress-label">
                  goal achievement
                </div>
              </div>
              <div className="progress-details">
                <p><strong>{monthlyStats.goalAchievedDays}/{monthlyStats.totalDays} days</strong> met goal</p>
                <p><strong>{Math.floor(monthlyStats.averageStudy / 60)}h {monthlyStats.averageStudy % 60}m</strong> daily average</p>
                <p><strong>{Math.floor(monthlyStats.totalStudy / 60)}h</strong> total this month</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Today's Goal Progress Pie Chart */}
      <div className="chart-container">
        <h3>Today's Goal Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} minutes`, 'Time']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Progress Calendar */}
      <div className="weekly-calendar">
        <h3>This Week's Daily Progress</h3>
        <div className="week-days">
          {weeklyStats.map(day => (
            <div key={day.fullDate} className={`day-progress ${day.isToday ? 'today' : ''}`}>
              <div className="day-name">{day.date}</div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ 
                    height: `${day.achievement}%`,
                    backgroundColor: day.achievement >= 100 ? '#28a745' : 
                                   day.achievement >= 75 ? '#4cd964' : 
                                   day.achievement >= 50 ? '#ffc107' : 
                                   day.achievement >= 25 ? '#ff9500' : '#dc3545'
                  }}
                >
                  <span className="progress-percent">{day.achievement}%</span>
                </div>
              </div>
              <div className="day-total">{Math.floor(day.study / 60)}h {day.study % 60}m</div>
              <div className="day-goal">{dailyGoal}m goal</div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Achievement History */}
      <div className="goal-history">
        <h3>30-Day Goal Achievement History</h3>
        <div className="history-list">
          {goalHistory.length > 0 ? (
            goalHistory.map((day, index) => (
              <div key={index} className="history-item">
                <div className="history-date">{day.date}</div>
                <div className="history-progress">
                  <div className="progress-track">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${day.achievement}%`,
                        backgroundColor: day.achievement >= 100 ? '#28a745' : 
                                       day.achievement >= 75 ? '#4cd964' : 
                                       day.achievement >= 50 ? '#ffc107' : 
                                       day.achievement >= 25 ? '#ff9500' : '#dc3545'
                      }}
                    >
                      <span>{day.achievement}%</span>
                    </div>
                  </div>
                </div>
                <div className="history-minutes">
                  {day.study}/{day.goal}m
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No goal history available. Start tracking your study time!</p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Tips */}
      <div className="goal-tips">
        <h3>💡 Tips for Achieving Your Goal</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Break It Down</h4>
            <p>Use the 5-minute blocks to break your study goal into manageable chunks.</p>
          </div>
          <div className="tip-card">
            <h4>Consistency Matters</h4>
            <p>Studying a little every day is better than cramming everything in one day.</p>
          </div>
          <div className="tip-card">
            <h4>Track Progress</h4>
            <p>Regularly check your progress to stay motivated and adjust as needed.</p>
          </div>
          <div className="tip-card">
            <h4>Reward Yourself</h4>
            <p>Celebrate when you achieve your daily goal to build positive habits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalTracker;