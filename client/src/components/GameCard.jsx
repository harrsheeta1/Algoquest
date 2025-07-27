// src/components/GameCard.jsx
// import { useNavigate } from "react-router-dom";

// export default function GameCard({ title, description, image, path }) {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col items-center text-center transition-transform hover:scale-105">
//       <img src={image} alt={title} className="rounded-md h-40 w-full object-cover mb-4" />
//       <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
//       <p className="text-sm text-gray-600 mb-4">{description}</p>
//       <button
//         onClick={() => navigate(path)}
//         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         ▶️ Play
//       </button>
//     </div>
//   );
// }



// import { useNavigate } from "react-router-dom";
// import "../styles/dashboard.css"; // Assuming you have a CSS file for styling

// export default function GameCard({ title, description, image, link }) {
//   const navigate = useNavigate();

//   return (
//     <div className="gamecard">
//       <img src={image} alt={title} className="gamecard-image" />
//       <div className="gamecard-text">
//         <h2 className="gamecard-title">{title}</h2>
//         <p className="gamecard-description">{description}</p>
//         <button onClick={() => navigate(link)} className="gamecard-button">
//           ▶️ Play
//         </button>
//       </div>
//     </div>
//   );
// }

import React from "react";
import "../styles/gamecard.css"; // Assuming you have a CSS file for styling

const GameCard = ({ title, image, description,path }) => {
  return (
    <div className="game-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
     <div className="play-button-wrapper">
        <br/>
     <button
    className="play-button"
    onClick={() => window.location.href = `/pages/${path}`}>
    Play
    </button>
    </div>

    </div>
  );
};

export default GameCard;
