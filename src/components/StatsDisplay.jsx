import React from 'react';

const StatsDisplay = ({ stats }) => {
  if (!stats) return null;

  const getSuccessRateClass = (rate) => {
    if (rate >= 90) return 'success-high';
    if (rate >= 70) return 'success-medium';
    return 'success-low';
  };

  return (
    <div className="stats-display">
      <h2>Test Results</h2>
      
      <div className="stats-card">
        <div className="success-rate">
          <span className={getSuccessRateClass(stats.successRate)}>
            {stats.successRate.toFixed(1)}% Success Rate
          </span>
        </div>
        
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.totalRequests}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.successCount}</div>
            <div className="stat-label">Successful (2xx)</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.networkErrorCount}</div>
            <div className="stat-label">Network Errors</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.clientErrorCount}</div>
            <div className="stat-label">Client Errors (4xx)</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.serverErrorCount}</div>
            <div className="stat-label">Server Errors (5xx)</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.minTime.toFixed(2)} ms</div>
            <div className="stat-label">Min Response Time</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.maxTime.toFixed(2)} ms</div>
            <div className="stat-label">Max Response Time</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">{stats.avgTime.toFixed(2)} ms</div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay; 