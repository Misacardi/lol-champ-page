import { useState, useRef } from "react";
import "./PreviewSkills.css";

const PreviewSkills = ({ skils }) => {
  const [skillName, setskillName] = useState(skils[0].name);
  const [skillDesc, setskillDesc] = useState(skils[0].description);
  const [skillVideo, setskillVideo] = useState(skils[0].video);

  const itemRef = useRef([]);

  const [typeSkill, setTypeSkill] = useState(0);

  const SetTypeOfSkill = () => {
    const skillTypes = {
      1: "Q",
      2: "W",
      3: "E",
      4: "ULTIMATE",
      default: "PASIVE",
    };

    return skillTypes[typeSkill] || skillTypes.default;
  };

  const focusOnItem = (id) => {
    itemRef.current.forEach((item) => item.classList.remove("active-skils"));
    itemRef.current[id].classList.add("active-skils");
    activeSkill(id);
    setTypeSkill(id);
  };

  const activeSkill = (key) => {
    setskillName(skils[key].name);
    setskillDesc(skils[key].description);
    setskillVideo(skils[key].video);
  };

  const elem = skils.map((item, i) => {
    let active = i ? "preview__img" : "preview__img active-skils";
    return (
      <li className="preview__button " key={i} onClick={() => focusOnItem(i)}>
        <button>
          <div className={active} ref={(el) => (itemRef.current[i] = el)}>
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
          <span>
            <SetTypeOfSkill />
          </span>
          <h2 className="abilities__name">{skillName}</h2>
          <div>{skillDesc}</div>
        </div>
      </div>

      <div className="abilities__inner-video">
        <video muted autoPlay playsInline loop src={skillVideo} type="video/mp4"></video>
      </div>
    </div>
  );
};

export default PreviewSkills;
