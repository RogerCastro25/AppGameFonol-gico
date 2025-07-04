import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { PhonemeGame } from './pages/PhonemeGame';
import { AssociationGame } from './pages/AssociationGame';
import { WordBuildingGame } from './pages/WordBuildingGame';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phoneme" element={<PhonemeGame />} />
          <Route path="/association" element={<AssociationGame />} />
          <Route path="/word-building" element={<WordBuildingGame />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;