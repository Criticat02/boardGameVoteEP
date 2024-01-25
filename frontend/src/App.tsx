import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LoginPage from './Login';
import VotePage from './Vote';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/vote" element={<VotePage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
