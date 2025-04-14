import React, { useState } from 'react';
import { runRequests } from '../utils/requestManager';
import { calculateStats } from '../utils/statsCalculator';

const ControlPanel = ({ setStats, addLog, clearLogs }) => {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  const [numRequests, setNumRequests] = useState(10);
  const [middlewares, setMiddlewares] = useState('logger,timer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    clearLogs();
    
    try {
      // Validation
      if (!url.trim()) {
        throw new Error('URL is required');
      }
      
      if (isNaN(numRequests) || numRequests <= 0) {
        throw new Error('Number of requests must be a positive number');
      }
      
      const middlewareList = middlewares.split(',')
        .map(m => m.trim())
        .filter(m => m.length > 0);
      
      addLog(`Starting test with URL: ${url}`);
      addLog(`Number of requests: ${numRequests}`);
      addLog(`Middlewares: ${middlewareList.join(', ') || 'None'}`);
      
      const results = await runRequests(url, numRequests, middlewareList, addLog);
      const calculatedStats = calculateStats(results);
      
      setStats(calculatedStats);
      addLog('Test completed successfully');
    } catch (err) {
      setError(err.message);
      addLog(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="control-panel">
      <h2>API Test Configuration</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">API URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="numRequests">Number of Requests:</label>
          <input
            type="number"
            id="numRequests"
            value={numRequests}
            onChange={(e) => setNumRequests(parseInt(e.target.value) || 0)}
            min="1"
            max="1000"
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="middlewares">Middlewares (comma-separated):</label>
          <input
            type="text"
            id="middlewares"
            value={middlewares}
            onChange={(e) => setMiddlewares(e.target.value)}
            placeholder="logger,timer,pow"
            disabled={isLoading}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run Tests'}
        </button>
      </form>
    </div>
  );
};

export default ControlPanel; 