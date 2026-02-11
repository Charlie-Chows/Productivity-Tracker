export const saveBlockData = (date, blocks) => {
  const dateStr = date.toISOString().split('T')[0];
  const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
  existingData[dateStr] = blocks.map(block => ({
    time: block.time,
    category: block.category
  }));
  localStorage.setItem('productivityData', JSON.stringify(existingData));
};

export const loadBlockData = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
  return existingData[dateStr] || null;
};

export const getStreakData = (days = 30) => {
  const existingData = JSON.parse(localStorage.getItem('productivityData') || '{}');
  const result = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = existingData[dateStr] || [];
    
    const studyMinutes = dayData.filter(b => b.category === 'study').length * 5;
    const wastedMinutes = dayData.filter(b => b.category === 'wasted').length * 5;
    
    result.push({
      date: dateStr,
      study: studyMinutes,
      wasted: wastedMinutes
    });
  }
  
  return result;
};