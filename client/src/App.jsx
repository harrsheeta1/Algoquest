import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth'; // this handles both login & register
import Dashboard from './pages/Dashboard';
import MazeGame from './pages/MazeGame';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/maze" element={<MazeGame />} />
    </Routes>
  );
}
