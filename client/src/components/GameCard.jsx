import React from "react";
import "../styles/gamecard.css"; // Assuming you have a CSS file for styling
import { useNavigate } from "react-router-dom";
const GameCard = ({ title,image,description,path }) => {
   const navigate = useNavigate();
  return (
    <div className="game-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
     <div className="play-button-wrapper">
        <br/>
     <button
    className="play-button"
    onClick={ () => navigate(path)}>
     Play
    </button>
    </div>

    </div>
  );
};

export default GameCard;
