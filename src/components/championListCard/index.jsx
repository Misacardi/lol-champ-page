import { Link } from "react-router-dom";
import "./heroListCard.css";

const ChampionListItem = ({ name, img, id, roles }) => {
  return (
    <Link to={`/${id}`} className="card">
      <img className="card__image" src={img} alt={`${name} splash art`} />
      <div className="card__shade" />
      <div className="card__content">
        <div className="card__roles">
          {roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
        <h2 className="card__title">{name}</h2>
        <span className="card__link">
          View champion
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
};

export default ChampionListItem;
