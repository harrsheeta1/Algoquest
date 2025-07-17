import React, { useState, useEffect } from 'react';
import "../styles/MazeGame.css";
import boyGif from '../assets/boy.gif';

const numRows = 10;
const numCols = 10;

const MinCostPathGame = () => {
  const [grid, setGrid] = useState(createInitialGrid());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [gameMode, setGameMode] = useState('manual');
  const [difficulty, setDifficulty] = useState('easy');
  const [minPathSum, setMinPathSum] = useState(null);

  useEffect(() => {
    if (gameMode === 'random') generateRandomGrid(difficulty);
  }, [gameMode, difficulty]);

  function createInitialGrid() {
    return Array.from({ length: numRows }, (_, row) =>
      Array.from({ length: numCols }, (_, col) => ({
        row,
        col,
        isStart: false,
        isEnd: false,
        isVisited: false,
        isPath: false,
        isWall: false,
        isBoy: false,
        isMinPath: false,
        isGreedyPath: false,
        distance: Infinity,
        previous: null,
        value: 1,
      }))
    );
  }

  const resetGrid = () => {
    setGrid(createInitialGrid());
    setStart(null);
    setEnd(null);
    setIsRunning(false);
    setMinPathSum(null);
  };

  const generateRandomGrid = (level = 'easy') => {
    const newGrid = createInitialGrid();
    let startCell, endCell;
    const wallProbability = level === 'easy' ? 0.15 : level === 'medium' ? 0.25 : 0.4;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (Math.random() < wallProbability) {
          newGrid[row][col].isWall = true;
        } else {
          newGrid[row][col].value = Math.floor(Math.random() * 9) + 1;
        }
      }
    }

    while (true) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);
      if (!newGrid[row][col].isWall) {
        newGrid[row][col].isStart = true;
        newGrid[row][col].value = 0;
        startCell = { row, col };
        break;
      }
    }

    while (true) {
      const row = Math.floor(Math.random() * numRows);
      const col = Math.floor(Math.random() * numCols);
      if (!newGrid[row][col].isWall && (row !== startCell.row || col !== startCell.col)) {
        newGrid[row][col].isEnd = true;
        newGrid[row][col].value = 0;
        endCell = { row, col };
        break;
      }
    }

    setGrid(newGrid);
    setStart(startCell);
    setEnd(endCell);
  };

  const handleCellClick = (row, col, e) => {
    e.preventDefault();
    if (isRunning || gameMode === 'random') return;
    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    const cell = newGrid[row][col];

    if (e.type === 'contextmenu') {
      if (!cell.isStart && !cell.isEnd) cell.isWall = !cell.isWall;
    } else if (e.detail === 2) {
      if (!cell.isStart && !cell.isEnd && !cell.isWall) {
        const newVal = prompt("Enter cell value (1–9):", cell.value);
        const parsedVal = parseInt(newVal);
        if (!isNaN(parsedVal) && parsedVal >= 1 && parsedVal <= 9) {
          cell.value = parsedVal;
        }
      }
    } else if (!start) {
      cell.isStart = true;
      setStart({ row, col });
    } else if (!end && !cell.isStart) {
      cell.isEnd = true;
      setEnd({ row, col });
    }

    setGrid(newGrid);
  };

  const runSnake = () => {
    if (!start || !end) return alert('Set start and end points.');
    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    runPathfindingHelper(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col]);
  };

  const runGreedyCoinCollection = () => {
    if (!start || !end) return alert('Set start and end points.');
    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    runGreedyHelper(newGrid, newGrid[start.row][start.col], newGrid[end.row][end.col]);
  };

  const runPathfindingHelper = (gridToUse, startNode, endNode) => {
    setIsRunning(true);
    clearPathFlags(gridToUse);
    dijkstra(gridToUse, startNode, endNode);
    const path = getNodesInShortestPathOrder(endNode);
    animateSnake(path, gridToUse, 'min');
    const pathSum = path.reduce((sum, node) => sum + node.value, 0);
    setMinPathSum(pathSum);
  };

  const runGreedyHelper = (gridToUse, startNode, endNode) => {
    setIsRunning(true);
    clearPathFlags(gridToUse);
    const path = greedyCoinPath(gridToUse, startNode, endNode);
    if (path.length === 0) {
      alert("No path to the end node found.");
      setIsRunning(false);
      return;
    }
    animateSnake(path, gridToUse, 'greedy');
    const coinSum = path.reduce((sum, node) => sum + node.value, 0);
    setMinPathSum(coinSum);
  };

  const clearPathFlags = (grid) => {
    grid.forEach(row => {
      row.forEach(cell => {
        cell.isBoy = false;
        cell.isVisited = false;
        cell.isMinPath = false;
        cell.isGreedyPath = false;
      });
    });
  };

  const animateSnake = (path, gridCopy, pathType) => {
    path.forEach((node, i) => {
      setTimeout(() => {
        if (i > 0) {
          const prev = path[i - 1];
          gridCopy[prev.row][prev.col].isBoy = false;
          gridCopy[prev.row][prev.col].isVisited = true;
        }
        gridCopy[node.row][node.col].isBoy = true;
        if (pathType === 'min') gridCopy[node.row][node.col].isMinPath = true;
        else if (pathType === 'greedy') gridCopy[node.row][node.col].isGreedyPath = true;
        setGrid([...gridCopy]);
        if (i === path.length - 1) setIsRunning(false);
      }, 150 * i);
    });
  };

  return (
    <div className="main-container">
      <h2 className="text-xl font-bold mb-2">📍 Minimum Cost vs Greedy Coin Path</h2>

      <select value={gameMode} onChange={e => setGameMode(e.target.value)}>
        <option value="manual">Manual Mode</option>
        <option value="random">Random Mode</option>
      </select>

      {gameMode === 'random' && (
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      )}

      <div className="grid-container">
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`cell
                ${cell.isStart ? 'start' : ''}
                ${cell.isEnd ? 'end' : ''}
                ${cell.isWall ? 'wall' : ''}
                ${cell.isMinPath ? 'minpath' : ''}
                ${cell.isGreedyPath ? 'greedy' : ''}
              `}
              onClick={e => handleCellClick(rowIdx, colIdx, e)}
              onContextMenu={e => handleCellClick(rowIdx, colIdx, e)}
            >
              {cell.isBoy ? (
                <img src={boyGif} alt="boy" style={{ width: '30px' }} />
              ) : (!cell.isWall && cell.value !== 0 ? cell.value : '')}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button onClick={runSnake} disabled={isRunning}>Run Min Cost Path</button>
        <button onClick={runGreedyCoinCollection} disabled={isRunning}>Run Greedy Coin</button>
        <button onClick={resetGrid}>Reset</button>
      </div>

      {minPathSum !== null && (
        <div className="mt-4 text-green-700 font-semibold">✅ Path sum: {minPathSum}</div>
      )}
    </div>
  );
};

// === Dijkstra ===

function dijkstra(grid, startNode, endNode) {
  const unvisited = getAllNodes(grid);
  startNode.distance = 0;

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift();
    if (closest.isWall) continue;
    if (closest.distance === Infinity) break;

    closest.isVisited = true;
    if (closest === endNode) return;
    updateUnvisitedNeighbors(closest, grid);
  }
}

function updateUnvisitedNeighbors(node, grid) {
  const neighbors = getValidNeighbors(node, grid);
  for (let neighbor of neighbors) {
    const cost = node.distance + neighbor.value;
    if (cost < neighbor.distance) {
      neighbor.distance = cost;
      neighbor.previous = node;
    }
  }
}

function getValidNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(n => !n.isWall);
}

function getAllNodes(grid) {
  return grid.flat();
}

function getNodesInShortestPathOrder(endNode) {
  const path = [];
  let current = endNode;
  while (current) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
}

// === Greedy ===

function greedyCoinPath(grid, startNode, endNode) {
  const visited = new Set();
  const key = (r, c) => `${r}-${c}`;
  const pathMap = new Map();
  const openList = [startNode];

  visited.add(key(startNode.row, startNode.col));
  pathMap.set(key(startNode.row, startNode.col), null);

  while (openList.length) {
    openList.sort((a, b) => (b.value + heuristic(b, endNode)) - (a.value + heuristic(a, endNode)));
    const current = openList.shift();
    const currKey = key(current.row, current.col);
    if (current === endNode) {
      const path = [];
      let k = currKey;
      while (k) {
        const [r, c] = k.split('-').map(Number);
        path.unshift(grid[r][c]);
        k = pathMap.get(k);
      }
      return path;
    }

    for (let neighbor of getValidNeighbors(current, grid)) {
      const nKey = key(neighbor.row, neighbor.col);
      if (!visited.has(nKey)) {
        visited.add(nKey);
        pathMap.set(nKey, currKey);
        openList.push(neighbor);
      }
    }
  }
  return [];
}

function heuristic(a, b) {
  return -1 * (Math.abs(a.row - b.row) + Math.abs(a.col - b.col));
}

export default MinCostPathGame;
