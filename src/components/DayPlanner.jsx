import React, { useState, useEffect } from 'react';
import { format, startOfDay, addMinutes, isToday } from 'date-fns';
import './DayPlanner.css';

const CATEGORIES = {
  STUDY: 'study',
  DAILY: 'daily',
  WASTED: 'wasted'
};

const COLORS = {
  [CATEGORIES.STUDY]: '#28a745',
  [CATEGORIES.DAILY]: '#17a2b8',
  [CATEGORIES.WASTED]: '#dc3545'
};

function DayPlanner({ date, dailyGoal }) {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());

  // Initialize time blocks for the day
  useEffect(() => {
    const totalBlocks = 24 * 12; // 5-minute blocks in 24 hours
    const startTime = startOfDay(date);
    const newBlocks = [];
    
    for (let i = 0; i < totalBlocks; i++) {
      const blockTime = addMinutes(startTime, i * 5);
      newBlocks.push({
        id: i,
        time: format(blockTime, 'HH:mm'),
        category: null,
        isActive: blockTime <= new Date() || !isToday(date)
      });
    }
    
    // Load saved data from localStorage
    const savedData = loadBlockData(date);
    if (savedData) {
      savedData.forEach(savedBlock => {
        const index = newBlocks.findIndex(block => block.time === savedBlock.time);
        if (index !== -1) {
          newBlocks[index].category = savedBlock.category;
        }
      });
    }
    
    setBlocks(newBlocks);
    setSelectedBlocks(new Set());
  }, [date]);

  const handleCategorySelect = (blockId, category) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, category } : block
    );
    setBlocks(updatedBlocks);
    saveBlockData(date, updatedBlocks);
  };

  const handleQuickSelect = (startId, count, category) => {
    const updatedBlocks = [...blocks];
    for (let i = 0; i < count && startId + i < blocks.length; i++) {
      updatedBlocks[startId + i].category = category;
    }
    setBlocks(updatedBlocks);
    saveBlockData(date, updatedBlocks);
  };

  const calculateStats = () => {
    const stats = {
      [CATEGORIES.STUDY]: 0,
      [CATEGORIES.DAILY]: 0,
      [CATEGORIES.WASTED]: 0
    };
    
    blocks.forEach(block => {
      if (block.category) {
        stats[block.category] += 5; // 5 minutes per block
      }
    });
    
    return stats;
  };

  const stats = calculateStats();
  const studyProgress = Math.min(Math.round((stats[CATEGORIES.STUDY] / dailyGoal) * 100), 100);
  const remainingTime = Math.max(0, dailyGoal - stats[CATEGORIES.STUDY]);

  // Save to localStorage
  const saveBlockData = (date, blocks) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
    existingData[dateStr] = blocks.map(block => ({
      time: block.time,
      category: block.category
    }));
    localStorage.setItem('productivityData', JSON.stringify(existingData));
  };

  // Load from localStorage
  const loadBlockData = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
    return existingData[dateStr] || null;
  };

  return (
    <div className="day-planner">
      {/* Goal Progress Header */}
      <div className="goal-progress-header">
        <div className="goal-info">
          <h3>Daily Study Goal Progress</h3>
          <div className="goal-numbers">
            <span className="current">{stats[CATEGORIES.STUDY]}m</span>
            <span className="separator">/</span>
            <span className="target">{dailyGoal}m</span>
            <span className="remaining">({remainingTime}m remaining)</span>
          </div>
        </div>
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large"
            style={{ 
              width: `${studyProgress}%`,
              backgroundColor: studyProgress >= 100 ? '#28a745' : 
                             studyProgress >= 75 ? '#28a745' : 
                             studyProgress >= 50 ? '#ffc107' : '#dc3545'
            }}
          >
            <span>{studyProgress}%</span>
          </div>
        </div>
        <div className="goal-status">
          {studyProgress >= 100 ? (
            <span className="goal-achieved">🎉 Goal Achieved!</span>
          ) : studyProgress >= 75 ? (
            <span className="goal-close">Almost there! Keep going!</span>
          ) : studyProgress >= 50 ? (
            <span className="goal-halfway">Halfway there! 💪</span>
          ) : (
            <span className="goal-start">Start studying to reach your goal!</span>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="statistics-grid">
        <div className={`stat-card ${CATEGORIES.STUDY}`}>
          <h3>Study Time</h3>
          <div className="value">
            {Math.floor(stats[CATEGORIES.STUDY] / 60)}h {stats[CATEGORIES.STUDY] % 60}m
          </div>
          <p>{Math.round(stats[CATEGORIES.STUDY] / 5)} five-minute blocks</p>
        </div>
        <div className={`stat-card ${CATEGORIES.DAILY}`}>
          <h3>Daily Activities</h3>
          <div className="value">
            {Math.floor(stats[CATEGORIES.DAILY] / 60)}h {stats[CATEGORIES.DAILY] % 60}m
          </div>
          <p>{Math.round(stats[CATEGORIES.DAILY] / 5)} five-minute blocks</p>
        </div>
        <div className={`stat-card ${CATEGORIES.WASTED}`}>
          <h3>Wasted Time</h3>
          <div className="value">
            {Math.floor(stats[CATEGORIES.WASTED] / 60)}h {stats[CATEGORIES.WASTED] % 60}m
          </div>
          <p>{Math.round(stats[CATEGORIES.WASTED] / 5)} five-minute blocks</p>
        </div>
      </div>

      {/* Time Blocks */}
      <div className="time-blocks-container">
        {blocks.map((block) => (
          <div 
            key={block.id} 
            className={`time-block ${block.category || ''}`}
            onMouseEnter={() => {
              if (!selectedBlocks.has(block.id)) {
                setSelectedBlocks(prev => new Set([...prev, block.id]));
              }
            }}
            onMouseLeave={() => {
              setSelectedBlocks(prev => {
                const newSet = new Set(prev);
                newSet.delete(block.id);
                return newSet;
              });
            }}
          >
            <div className="block-header">
              <span className="block-time">{block.time}</span>
              <span className="block-category">
                {block.category ? block.category.toUpperCase() : 'UNASSIGNED'}
              </span>
            </div>
            
            <div className="block-controls">
              <button 
                className="activity-btn study-btn"
                onClick={() => handleCategorySelect(block.id, CATEGORIES.STUDY)}
                disabled={!block.isActive}
              >
                📚 Study
              </button>
              <button 
                className="activity-btn daily-btn"
                onClick={() => handleCategorySelect(block.id, CATEGORIES.DAILY)}
                disabled={!block.isActive}
              >
                🏠 Daily
              </button>
              <button 
                className="activity-btn wasted-btn"
                onClick={() => handleCategorySelect(block.id, CATEGORIES.WASTED)}
                disabled={!block.isActive}
              >
                ⏰ Wasted
              </button>
              <button 
                className="activity-btn clear-btn"
                onClick={() => handleCategorySelect(block.id, null)}
                disabled={!block.isActive}
              >
                ✗ Clear
              </button>
            </div>

            {selectedBlocks.has(block.id) && (
              <div className="quick-select">
                <button onClick={() => handleQuickSelect(block.id, 7, CATEGORIES.STUDY)}>
                  +35m Study (7 blocks)
                </button>
                <button onClick={() => handleQuickSelect(block.id, 12, CATEGORIES.STUDY)}>
                  +1h Study (12 blocks)
                </button>
                <button onClick={() => handleQuickSelect(block.id, 7, CATEGORIES.DAILY)}>
                  +35m Daily (7 blocks)
                </button>
                <button onClick={() => handleQuickSelect(block.id, 7, CATEGORIES.WASTED)}>
                  +35m Wasted (7 blocks)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayPlanner;