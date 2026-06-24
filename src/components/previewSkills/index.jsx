import { useState, useRef } from "react";
import "./PreviewSkills.css";

const skillTypes = {
  1: "Q",
  2: "W",
  3: "E",
  4: "ULTIMATE",
  default: "PASIVE",
};

const PreviewSkills = ({ skils }) => {
  const [skillName, setskillName] = useState(skils[0].name);
  const [skillDesc, setskillDesc] = useState(skils[0].description);

  const itemRef = useRef([]);

  const [typeSkill, setTypeSkill] = useState(0);

  const focusOnItem = (id) => {
    itemRef.current.forEach((item) => item.classList.remove("active-skils"));
    itemRef.current[id].classList.add("active-skils");
    activeSkill(id);
    setTypeSkill(id);
  };

  const activeSkill = (key) => {
    setskillName(skils[key].name);
    setskillDesc(skils[key].description);
  };

  const elem = skils.map((item, i) => {
    let active = i ? "preview__img" : "preview__img active-skils";
    return (
      <li className="preview__button " key={i} onClick={() => focusOnItem(i)}>
        <button className={active} ref={(el) => (itemRef.current[i] = el)}>
          <div>
            <img src={item.img} alt="" />
            <div className="circle"></div>
          </div>
        </button>
      </li>
    );
  });

  return (
    <div className="abilities__inner">
      <div className="abilities__inner-preview">
        <h2 className="preview__title">ABILITIES</h2>
        <ul className="preview__list">{elem}</ul>

        <div className="abilities__desc">
          <span>{skillTypes[typeSkill] || skillTypes.default}</span>
          <h2 className="abilities__name">{skillName}</h2>
          <div>{skillDesc}</div>
        </div>
      </div>

      <div className="abilities__inner-video abilities__video-placeholder">
        <img src={skils[typeSkill].img} alt="" />
        <span>Видео способности пока недоступно</span>
      </div>
    </div>
  );
};

export default PreviewSkills;
