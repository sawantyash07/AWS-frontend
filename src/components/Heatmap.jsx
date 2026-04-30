import React, { useState } from 'react';
import './Heatmap.css';

const Heatmap = ({ userContributions = [] }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const years = [2026, 2025, 2024, 2023];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Prepare a map of date -> count for easy lookup
  const contributionMap = {};
  userContributions.forEach(c => {
    contributionMap[c.date] = c.count;
  });

  // Generate 371 cells (53 weeks * 7 days) to fill the grid
  const generateGrid = () => {
    const cells = [];
    const today = new Date();
    // Start from one year ago
    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - 1);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Align to Sunday

    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = contributionMap[dateStr] || 0;
      cells.push({ date: dateStr, count });
    }
    return cells;
  };

  const gridData = generateGrid();

  const getColor = (count) => {
    if (count === 0) return '#161b22';
    if (count <= 2) return '#0e4429';
    if (count <= 5) return '#006d32';
    if (count <= 10) return '#26a641';
    return '#39d353';
  };

  return (
    <div className="contribution-section">
      <div className="heatmap-main-container">
        <div className="heatmap-header-months">
          {months.map(month => <span key={month}>{month}</span>)}
        </div>
        
        <div className="heatmap-body">
          <div className="heatmap-weekdays">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          
          <div className="heatmap-grid">
            {gridData.map((cell, i) => (
              <div 
                key={i} 
                className="heatmap-cell" 
                style={{ backgroundColor: getColor(cell.count) }}
                title={`${cell.count} contributions on ${cell.date}`}
              />
            ))}
          </div>
        </div>

        <div className="heatmap-footer">
          <a href="#" className="contribution-link">Learn how we count contributions</a>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="legend-cells">
              <div className="heatmap-cell" style={{ backgroundColor: '#161b22' }} />
              <div className="heatmap-cell" style={{ backgroundColor: '#0e4429' }} />
              <div className="heatmap-cell" style={{ backgroundColor: '#006d32' }} />
              <div className="heatmap-cell" style={{ backgroundColor: '#26a641' }} />
              <div className="heatmap-cell" style={{ backgroundColor: '#39d353' }} />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="heatmap-years-sidebar">
        {years.map(year => (
          <button 
            key={year} 
            className={`year-btn ${selectedYear === year ? 'active' : ''}`}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
