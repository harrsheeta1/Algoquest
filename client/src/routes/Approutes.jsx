import React from 'react';
import{ Routes, Route } from 'react-router-dom';
import Auth from '../pages/Auth'; // this handles both login & register
import Dashboard from "../pages/Dashboard";
import MazeGame from '../pages/MazeGame';
import GreedyTreasureGame from '../pages/GreedyTreasureGame';
import SudokuSolver from '../pages/SudokuSolver';
import KnapsackChallenge from '../pages/KnapsackChallenge';
const Approutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/maze" element={<MazeGame />} />
      <Route path="/sudoku" element={<SudokuSolver />} />
      <Route path="/greedy" element={<GreedyTreasureGame />} />
      <Route path="/knapsack" element={<KnapsackChallenge />} />
    </Routes>
  )
}

export default Approutes
