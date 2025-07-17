import React, { useState, useEffect } from 'react';
import '../styles/MazeGame.css';
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
    if (gameMode === 'random') {
      generateRandomGrid(difficulty);
    }
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
        distance: Infinity,
        previous: null,
        value: 1,
        isMinPath: false, // <-- added
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
    if (gameMode === 'random') {
      setTimeout(() => {
        const newGrid = grid.map(r => r.map(cell => ({ ...cell, isMinPath: false })));
        const startNode = newGrid.flat().find(cell => cell.isStart);
        const endNode = newGrid.flat().find(cell => cell.isEnd);

        if (!startNode || !endNode) {
          alert('Start or End not found in random grid.');
          return;
        }

        setStart({ row: startNode.row, col: startNode.col });
        setEnd({ row: endNode.row, col: endNode.col });

        runPathfindingHelper(newGrid, startNode, endNode);
      }, 300);
    } else {
      if (!start || !end) {
        alert('Set both start and end points.');
        return;
      }

      const newGrid = grid.map(r => r.map(cell => ({ ...cell, isMinPath: false })));
      const startNode = newGrid[start.row][start.col];
      const endNode = newGrid[end.row][end.col];
      runPathfindingHelper(newGrid, startNode, endNode);
    }
  };

  const runPathfindingHelper = (gridToUse, startNode, endNode) => {
    setIsRunning(true);
    const visitedNodes = dijkstra(gridToUse, startNode, endNode);
    const path = getNodesInShortestPathOrder(endNode);
    animateSnake(path, gridToUse);
    const pathSum = path.reduce((sum, node) => sum + node.value, 0);
    setMinPathSum(pathSum);
  };

  const animateSnake = (path, gridCopy) => {
    path.forEach((node, i) => {
      setTimeout(() => {
        if (i > 0) {
          const prev = path[i - 1];
          gridCopy[prev.row][prev.col].isBoy = false;
          gridCopy[prev.row][prev.col].isVisited = true;
        }
        gridCopy[node.row][node.col].isBoy = true;
        gridCopy[node.row][node.col].isMinPath = true; // mark min path
        setGrid([...gridCopy]);
        if (i === path.length - 1) setIsRunning(false);
      }, 200 * i);
    });
  };

  return (
    <div className="main-container">
      <h2 className="text-xl font-bold mb-2">📍 Minimum Cost Path Game</h2>

      <select className="mb-4 p-2 border" value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
        <option value="manual">Manual Mode</option>
        <option value="random">Random Mode</option>
      </select>

      {gameMode === 'random' && (
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Level:</label>
          <select className="p-2 border" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}

      <div className="grid-container">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell
                ${cell.isStart ? 'start' : ''}
                ${cell.isEnd ? 'end' : ''}
                ${cell.isVisited ? 'visited' : ''}
                ${cell.isWall ? 'wall' : ''}
                ${cell.isMinPath ? 'minpath' : ''}
              `}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
              onContextMenu={(e) => handleCellClick(rowIndex, colIndex, e)}
            >
              {cell.isBoy ? (
                <img src={boyGif} alt="boy" style={{ width: '30px', height: '30px' }} />
              ) : (!cell.isWall && cell.value !== 0 ? cell.value : '')}
            </div>
          ))
        )}
      </div>

      {minPathSum !== null && (
        <div className="mt-4 text-green-700 font-semibold">
          ✅ Minimum path sum: {minPathSum}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button className="run-btn" onClick={runSnake} disabled={isRunning}>
          Run Pathfinding
        </button>
        <button className="run-btn bg-red-500 hover:bg-red-600" onClick={resetGrid}>
          Reset Grid
        </button>
      </div>
    </div>
  );
};

// ---------- Dijkstra Functions ----------

function dijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === endNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
  return visitedNodesInOrder;
}

function getAllNodes(grid) {
  return grid.flat();
}

function updateUnvisitedNeighbors(node, grid) {
  const { row, col } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < numRows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < numCols - 1) neighbors.push(grid[row][col + 1]);
  neighbors.forEach(neighbor => {
    if (!neighbor.isVisited && !neighbor.isWall) {
      const cost = node.distance + neighbor.value;
      if (cost < neighbor.distance) {
        neighbor.distance = cost;
        neighbor.previous = node;
      }
    }
  });
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

export default MinCostPathGame;
