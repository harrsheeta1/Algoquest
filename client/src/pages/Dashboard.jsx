// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please log in first");
//       navigate("/");
//     }
//   }, []);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Welcome to AlgoQuest!</h1>
//       <p className="mb-4">Choose a game to play and sharpen your algorithm skills 🔥</p>

//       <div className="grid gap-4">
//         <button
//           onClick={() => navigate("/maze")}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           🧭 Maze Solver (Dijkstra)
//         </button>

//         {/* Future games */}
//         <button
//     onClick={() => navigate("/knapsack")}
//     className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
//   >
//     🎒 Knapsack Challenge (DP)
//   </button>
//          <button
//         onClick={() => navigate("/greedy")}
//         className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
//       >
//         💰 Greedy Treasure Game
//       </button>
//       <button
//     onClick={() => navigate("/sudoku")}
//     className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
//   >
//     🧩 Sudoku Solver
//   </button>
//       </div>
//     </div>
//   );
// }


// src/components/Dashboard.jsx


// export default function Dashboard() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please log in first");
//       navigate("/");
//     }
//   }, []);

//   return (
//     <div className="dashboard-page">
//       <h1 className="text-3xl font-bold text-center text-white mb-10 drop-shadow-lg">
//         Welcome to AlgoQuest!
//       </h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
//         {gameData.map((game, index) => (
//           <GameCard key={index} {...game} />
//         ))}
//       </div>
//     </div>
//   );
// }

import gameData from "../components/data/gamedata";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome to AlgoQuest!</h1>
      <p>AlgoQuest is an interactive web application designed to help users learn and understand various algorithms through engaging visualizations. Whether you're a beginner in data structures or preparing for coding interviews, AlgoQuest simplifies complex algorithm logic by animating each step in a clear and intuitive way.</p>
      <br/><div className="dashboard-cards">
        {gameData.map((game, idx) => (
          <GameCard key={idx} {...game} />
        ))}
      </div>
    </div>
  );
}
// import React from "react";
// import GameCard from "../components/GameCard";

// function App() {
//   return (
//     <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", padding: "40px" }}>
//       <GameCard
//         title="Space Adventure"
//         image="https://via.placeholder.com/300x200"
//         description="A thrilling journey across the galaxy!"
//       />
//       <GameCard
//         title="Zombie Escape"
//         image="https://via.placeholder.com/300x200"
//         description="Survive the zombie apocalypse!"
//       />
//     </div>
//   );
// }

// export default App;
