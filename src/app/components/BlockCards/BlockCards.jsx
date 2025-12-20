import React from "react";
import "./BlockCards.scss";

const BlockCard = ({ title, onClick }) => (
  <div className="blockcard" onClick={onClick}>
    <h3 className="blockcard__title">{title}</h3>
  </div>
);

export default BlockCard;
