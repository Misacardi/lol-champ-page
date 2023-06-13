import "./skins.css";
import { useRef, useState } from "react";

const Skins = ({ champ }) => {
  const [skinsImg, setSkins] = useState(champ[0].img);
  const skinsRef = useRef([]);
  const carouselRef = useRef();
  const [offset, setOffset] = useState(0);
  let heigth = 100;

  const changeBackgroundImg = (id) => {
    setSkins(champ[id].img);
  };

  const focusOnItem = (id) => {
    skinsRef.current.forEach((item) =>
      item.classList.remove("carousel-active")
    );
    skinsRef.current[id].classList.add("carousel-active");
    setOffset(heigth * id);
    changeBackgroundImg(id);
  };

  const skinsButton = champ.map((item, i) => {
    let active = i ? "carousel__item" : "carousel__item carousel-active";

    return (
      <button
        className={active}
        key={i}
        ref={(el) => (skinsRef.current[i] = el)}
        onClick={() => focusOnItem(i)}
      >
        <img className="carousel__img " src={item.img} alt="" />
        <span>{item.name}</span>
      </button>
    );
  });

  return (
    <>
      <div className="skins">
        <div className="skins__inner">
          <div className="skins__image">
            <img className="skins__img" src={skinsImg} alt="" />
            <div className="skins__carousel">
              <div className="corousel__title">AVAILABLE SKINS</div>

              <div className="carousel">
                <ul
                  className="carousel__inner"
                  style={{ transform: `translateY(-${offset}px)` }}
                  ref={(el) => (carouselRef.current = el)}
                >
                  {skinsButton}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Skins;
