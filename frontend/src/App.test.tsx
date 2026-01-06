import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestComponent from './TestComponent';

function TestApp() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default TestApp;