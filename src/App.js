import React, { useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import StatsDisplay from './components/StatsDisplay';
import LiveLogger from './components/LiveLogger';

function App() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (log) => {
    setLogs(prevLogs => [...prevLogs, { id: Date.now(), message: log }]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Middleware API Tester</h1>
      </header>
      <main className="App-main">
        <div className="container">
          <ControlPanel setStats={setStats} addLog={addLog} clearLogs={clearLogs} />
          <div className="results-container">
            {stats && <StatsDisplay stats={stats} />}
            <LiveLogger logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
