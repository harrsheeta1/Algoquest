import { useState } from "react";

const numRows = 10;
const numCols = 10;

function createGrid() {
  return Array(numRows).fill(null).map(() =>
    Array(numCols).fill({
      isStart: false,
      isEnd: false,
      isWall: false,
      visited: false,
      distance: Infinity,
    })
  );
}

export default function MazeGame() {
  const [grid, setGrid] = useState(createGrid());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  function handleCellClick(row, col) {
    const newGrid = grid.map(r => [...r]);
    if (!start) {
      newGrid[row][col] = { ...newGrid[row][col], isStart: true };
      setStart({ row, col });
    } else if (!end) {
      newGrid[row][col] = { ...newGrid[row][col], isEnd: true };
      setEnd({ row, col });
    } else {
      newGrid[row][col] = { ...newGrid[row][col], isWall: !newGrid[row][col].isWall };
    }
    setGrid(newGrid);
  }

  function dijkstra() {
    if (!start || !end) {
      alert("Set both start and end points.");
      return;
    }

    const newGrid = grid.map(r => [...r]);
    const visited = Array(numRows).fill(null).map(() => Array(numCols).fill(false));
    const distances = Array(numRows).fill(null).map(() => Array(numCols).fill(Infinity));
    const queue = [];

    const { row: sr, col: sc } = start;
    distances[sr][sc] = 0;
    queue.push({ row: sr, col: sc, dist: 0 });

    const directions = [[1,0],[-1,0],[0,1],[0,-1]];

    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      const { row, col, dist } = queue.shift();
      if (visited[row][col]) continue;
      visited[row][col] = true;

      newGrid[row][col] = { ...newGrid[row][col], visited: true };

      if (row === end.row && col === end.col) {
        alert("Path found!");
        break;
      }

      for (let [dr, dc] of directions) {
        const nr = row + dr, nc = col + dc;
        if (
          nr >= 0 && nc >= 0 && nr < numRows && nc < numCols &&
          !visited[nr][nc] &&
          !newGrid[nr][nc].isWall
        ) {
          const newDist = dist + 1;
          if (newDist < distances[nr][nc]) {
            distances[nr][nc] = newDist;
            queue.push({ row: nr, col: nc, dist: newDist });
          }
        }
      }
    }

    setGrid(newGrid);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🧭 Maze Solver – Dijkstra</h2>
      <button onClick={dijkstra} className="bg-blue-600 text-white px-4 py-2 mb-4">Run Dijkstra</button>
      <div className="grid grid-cols-10 gap-1">
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            let bg = "bg-white";
            if (cell.isStart) bg = "bg-green-400";
            else if (cell.isEnd) bg = "bg-red-400";
            else if (cell.isWall) bg = "bg-black";
            else if (cell.visited) bg = "bg-yellow-300";

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-8 h-8 border ${bg} cursor-pointer`}
                onClick={() => handleCellClick(rIdx, cIdx)}
              ></div>
            );
          })
        )}
      </div>
    </div>
);
}