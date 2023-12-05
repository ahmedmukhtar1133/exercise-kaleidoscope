import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import KaleidoscopeCanvas from './KaleidoscopeCanvas';

function Kaleidos() {
  return (
    <div>
      <KaleidoscopeCanvas />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Kaleidos />} />
      </Routes>
    </Router>
  );
}
