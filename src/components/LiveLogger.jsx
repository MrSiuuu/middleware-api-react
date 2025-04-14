import React, { useRef, useEffect } from 'react';

const LiveLogger = ({ logs }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (!logs || logs.length === 0) {
    return null;
  }

  return (
    <div className="live-logger">
      <h2>Request Logs</h2>
      <div className="logs-container">
        {logs.map((log, index) => (
          <div key={`${log.id}-${index}`} className="log-item">
            {new Date().toLocaleTimeString()} - {log.message}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
};

export default LiveLogger; 