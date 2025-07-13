// SudokuSolver.jsx (Enhanced with Timer, Score, Theme Toggle)
import React, { useState, useEffect } from 'react';
import './SudokuSolver.css';

const emptyGrid = () => Array.from({ length: 9 }, () => Array(9).fill(''));

const SudokuSolver = () => {
  const [grid, setGrid] = useState(emptyGrid());
  const [fixedCells, setFixedCells] = useState(emptyGrid());
  const [difficulty, setDifficulty] = useState('easy');
  const [solving, setSolving] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    generatePuzzle(difficulty);
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (!solving) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [solving]);

  const formatTime = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const generatePuzzle = (level) => {
    const fullBoard = generateFullSudoku();
    const cellsToRemove = level === 'easy' ? 30 : level === 'medium' ? 45 : 55;
    const puzzle = removeCells(fullBoard, cellsToRemove);
    setGrid(puzzle);
    setFixedCells(puzzle.map(row => row.map(cell => cell !== '')));
    setTime(0);
    setScore(0);
  };

  const handleChange = (row, col, value) => {
    if (!solving && /^[1-9]?$/.test(value)) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = value;
      setGrid(newGrid);
    }
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && board[row][i] === num) return false;
      if (i !== row && board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i, c = boxCol + j;
        if ((r !== row || c !== col) && board[r][c] === num) return false;
      }
    }
    return true;
  };

  const solveStepByStep = async () => {
    setSolving(true);
    const board = grid.map(row => [...row]);

    const solve = async () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === '') {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num.toString())) {
                board[row][col] = num.toString();
                setGrid(board.map(r => [...r]));
                await sleep(100);
                if (await solve()) return true;
                board[row][col] = '';
                setGrid(board.map(r => [...r]));
                await sleep(100);
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    await solve();
    setSolving(false);
  };

  const checkAnswer = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = grid[row][col];
        if (val === '' || !isValid(grid, row, col, val)) {
          alert('❌ Incorrect or incomplete solution.');
          return;
        }
      }
    }
    const earned = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300;
    setScore(earned);
    alert(`✅ Correct! Score: +${earned}`);
  };

  const generateFullSudoku = () => {
    const board = emptyGrid();
    const fill = (row, col) => {
      if (col === 9) {
        col = 0;
        row++;
        if (row === 9) return true;
      }
      const nums = shuffle(Array.from({ length: 9 }, (_, i) => (i + 1).toString()));
      for (let num of nums) {
        if (isValid(board, row, col, num)) {
          board[row][col] = num;
          if (fill(row, col + 1)) return true;
          board[row][col] = '';
        }
      }
      return false;
    };
    fill(0, 0);
    return board;
  };

  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const removeCells = (board, count) => {
    const puzzle = board.map(row => [...row]);
    let removed = 0;
    while (removed < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== '') {
        puzzle[row][col] = '';
        removed++;
      }
    }
    return puzzle;
  };

  return (
    <div className={`sudoku-container ${theme}`}>
      <h2 className="text-xl font-bold mb-2">🧩 Sudoku Solver</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <label className="font-semibold">Difficulty:</label>
        <select className="border p-1" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => generatePuzzle(difficulty)}>🔄 New Puzzle</button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={solveStepByStep} disabled={solving}>▶ Solve Step-by-Step</button>
        <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={checkAnswer} disabled={solving}>✔ Check My Answer</button>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={toggleTheme}>🌓 Toggle Theme</button>
      </div>

      <div className="flex gap-4 mb-4">
        <span>⏱️ Timer: {formatTime(time)}</span>
        <span>🎯 Score: {score}</span>
      </div>

      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={cell}
                className={`sudoku-cell ${fixedCells[rowIndex][colIndex] ? 'fixed-cell' : ''}`}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                disabled={fixedCells[rowIndex][colIndex]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SudokuSolver;

