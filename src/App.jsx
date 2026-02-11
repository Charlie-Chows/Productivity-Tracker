import React, { useState, useEffect } from 'react';
import './App.css';
import { format, isToday } from 'date-fns';
import DayPlanner from './components/DayPlanner';
import Statistics from './components/Statistics';
import StreakGraph from './components/StreakGraph';
import GoalTracker from './components/GoalTracker';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('planner'); // 'planner', 'stats', 'streak', 'goals'
  const [dailyGoal, setDailyGoal] = useState(480); // Default: 8 hours in minutes

  useEffect(() => {
    // Load goal from localStorage
    const savedGoal = localStorage.getItem('dailyStudyGoal');
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal));
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGoalChange = (newGoal) => {
    setDailyGoal(newGoal);
    localStorage.setItem('dailyStudyGoal', newGoal.toString());
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>⏱️ 5-Minute Block Productivity Tracker</h1>
        <div className="header-info">
          <div className="current-time">
            {format(currentTime, 'HH:mm:ss')} | {format(currentTime, 'EEEE, MMMM do')}
          </div>
          <div className="daily-goal-display">
            📚 Daily Goal: <strong>{Math.floor(dailyGoal / 60)}h {dailyGoal % 60}m</strong>
          </div>
        </div>
      </header>

      <nav className="view-nav">
        <button
          className={view === 'planner' ? 'active' : ''}
          onClick={() => setView('planner')}
        >
          📅 Daily Planner
        </button>
        <button
          className={view === 'stats' ? 'active' : ''}
          onClick={() => setView('stats')}
        >
          📊 Statistics
        </button>
        <button
          className={view === 'streak' ? 'active' : ''}
          onClick={() => setView('streak')}
        >
          📈 Streak Graph
        </button>
        <button
          className={view === 'goals' ? 'active' : ''}
          onClick={() => setView('goals')}
        >
          🎯 Goals
        </button>
      </nav>

      <main className="main-content">
        {view === 'planner' && (
          <>
            <div className="date-selector">
              <button onClick={() => {
                const prevDay = new Date(selectedDate);
                prevDay.setDate(prevDay.getDate() - 1);
                setSelectedDate(prevDay);
              }}>
                ◀ Previous Day
              </button>
              <h2>{format(selectedDate, 'EEEE, MMMM do')}</h2>
              <button onClick={() => {
                const nextDay = new Date(selectedDate);
                nextDay.setDate(nextDay.getDate() + 1);
                if (nextDay <= new Date()) setSelectedDate(nextDay);
              }} disabled={isToday(selectedDate)}>
                {isToday(selectedDate) ? 'Today' : 'Next Day ▶'}
              </button>
            </div>
            <DayPlanner date={selectedDate} dailyGoal={dailyGoal} />
          </>
        )}

        {view === 'stats' && <Statistics dailyGoal={dailyGoal} />}
        {view === 'streak' && (
          <ErrorBoundary>
            <StreakGraph dailyGoal={dailyGoal} />
          </ErrorBoundary>
        )}
        {view === 'goals' && <GoalTracker dailyGoal={dailyGoal} onGoalChange={handleGoalChange} />}
      </main>
    </div>
  );
}

export default App;