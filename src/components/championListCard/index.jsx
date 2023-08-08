import React from "react";
import { Link } from "react-router-dom";
import "./heroListCard.css";
const ChampionListItem = ({ name, img, id }) => {
  return (
    <Link
      to={`/${id}`}
      className="card"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="card__content">
        <h2 className="card__title">{name}</h2>
      </div>
    </Link>
  );
};

export default ChampionListItem;
