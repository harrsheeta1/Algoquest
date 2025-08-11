

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

