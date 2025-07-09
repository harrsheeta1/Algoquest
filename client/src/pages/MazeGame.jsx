// SnakeGame.jsx
import React, { useState } from 'react';
import './MazeGame.css';

const numRows = 10;
const numCols = 10;

const SnakeGame = () => {
  const [grid, setGrid] = useState(createInitialGrid());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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
        isHead: false,
        distance: Infinity,
        previous: null,
      }))
    );
  }

  const handleCellClick = (row, col, e) => {
    e.preventDefault();
    if (isRunning) return;
    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    const cell = newGrid[row][col];

    if (e.type === 'contextmenu') {
      if (!cell.isStart && !cell.isEnd) cell.isWall = !cell.isWall;
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
    if (!start || !end) {
      alert('Set both start and end points.');
      return;
    }

    setIsRunning(true);
    const newGrid = grid.map(r => r.map(cell => ({ ...cell })));
    const startNode = newGrid[start.row][start.col];
    const endNode = newGrid[end.row][end.col];

    const visitedNodes = dijkstra(newGrid, startNode, endNode);
    const path = getNodesInShortestPathOrder(endNode);
    animateSnake(path, newGrid);
  };

  const animateSnake = (path, gridCopy) => {
    path.forEach((node, i) => {
      setTimeout(() => {
        if (i > 0) {
          const prev = path[i - 1];
          gridCopy[prev.row][prev.col].isHead = false;
          gridCopy[prev.row][prev.col].isVisited = true;
        }
        gridCopy[node.row][node.col].isHead = true;
        setGrid([...gridCopy]);
        if (i === path.length - 1) setIsRunning(false);
      }, 200 * i);
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🐍 Snake Pathfinding Game</h2>
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
                ${cell.isHead ? 'snake-head' : ''}
              `}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
              onContextMenu={(e) => handleCellClick(rowIndex, colIndex, e)}
            ></div>
          ))
        )}
      </div>
      <button className="run-btn" onClick={runSnake} disabled={isRunning}>
        Run Snake
      </button>
    </div>
  );
};

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
      if (node.distance + 1 < neighbor.distance) {
        neighbor.distance = node.distance + 1;
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

export default SnakeGame;