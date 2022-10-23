import {useState, useRef } from "react";
import './PreviewSkills.css'

const PreviewSkills = ({skils}) => {


    const [skillName, setskillName] = useState(skils[0].name)
    const [skillDesc, setskillDesc] = useState(skils[0].description)
    const [skillVideo, setskillVideo] = useState(skils[0].video)




  const itemRef = useRef([])
  const focusOnItem = (id) => {
    itemRef.current.forEach(item => item.classList.remove('active'));
    itemRef.current[id].classList.add('active')
    console.log(id);
  }
  const activeSkill = (key) => {
    setskillName(skils[key].name)
    setskillDesc(skils[key].description)
    setskillVideo(skils[key].video)
  }
  const elem = skils.map((item, i) => {

    let active = i ? "preview__img": "preview__img active"
    return (
      <li className="preview__button " key={i} onClick={() => { activeSkill(i); focusOnItem(i) }}>
        <button>
          <div className={active} ref={el => itemRef.current[i] = el}>
            <img className="" src={item.img} alt="" />
          </div>
          <div className="circle"></div>
        </button>
      </li>
    )
  })




    return(

        <div className="abilities__inner">
        <div className="abilities__inner-preview">
          <h2 className="preview__title">ABILITIES</h2>
          <ul className="preview__list">
            {elem}
          </ul>

          <div className="abilities__desc">
            <span>PASSIVE</span>
            <h2 className="abilities__name">{skillName}</h2>
            <div>{skillDesc}</div>
          </div>
        </div>

        <div className="abilities__inner-video">
          <video muted autoPlay loop src={skillVideo} type="video/webm"></video>

        </div>


      </div>
        
    )
}

export default PreviewSkills