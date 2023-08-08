import "./singleChampion.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Skins from "../skinsCorusel";
import PreviewSkills from "../previewSkils";
import useChampionService from "../../services/championsService";

const SingleChampion = () => {
  const { heroId } = useParams();
  const { getChampion } = useChampionService();

  const [activeChampion, setActiveChampoion] = useState({});
  const { name, img, role, description, difficulty, subtitle } = activeChampion;

  useEffect(() => {
    getChampion(heroId).then((res) => setActiveChampoion(res));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.title = name || 'Champions';
  }, [name]);
  const SetDifficutly = () => {
    return (
      <>
        <div className="squere plus"> </div>
        <div
          className={`squere ${
            difficulty === "mid" || difficulty === "high" ? "plus" : ""
          }`}
        ></div>
        <div className={`squere ${difficulty === "high" ? "plus" : ""}`}></div>
      </>
    );
  };

  return (
    <div className="single-champion">
      <div className="background">
        <div className="background__blackout">
          <img className="background__image" src={img} alt="hero background" />
        </div>
      </div>

      <div className="champion__face">
        <img className="champion__image" src={img} alt="champion__image" />

        <div className="champion__blackout"></div>
        <div className="champion__info">
          <h2 className="champion__title">
            <span>{subtitle}</span>
            <div>{name}</div>
          </h2>

          <div className="champion__info-inner">
            <ul className="champion__spec">
              <li className="role">
                <img
                  src={`https://raw.communitydragon.org/9.4/plugins/rcp-fe-lol-champion-details/global/default/role-icon-${role}.png`}
                  alt=""
                  className="role__img"
                />
                <h2 className="spec__title">role</h2>
                <span className="spec__desc">{role}</span>
              </li>

              <li className="difficutly">
                <div className="level role__img">
                  <SetDifficutly />
                </div>
                <h2 className="spec__title">DIFFICULTY</h2>
                <span className="spec__desc">{difficulty}</span>
              </li>
            </ul>

            <div className="info__desc">{description}</div>
          </div>

          <div className="champion__footer">
            <p className="footer__title">CHAMPION MASTERY</p>
            <a href="https://www.op.gg/">OP.GG</a>
            <a href="https://u.gg/">U.GG</a>
            <a href="https://www.probuilds.net/">PROBUILDS.NET</a>
          </div>
        </div>
      </div>

      <div />
      <div className="abilities">
        {activeChampion.skils && <PreviewSkills skils={activeChampion.skils} />}
      </div>

      {activeChampion.skins && <Skins champ={activeChampion.skins} />}
    </div>
  );
};

export default SingleChampion;
