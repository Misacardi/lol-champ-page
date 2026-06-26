import "./skins.css";
import { useCallback, useEffect, useRef, useState } from "react";

const Skins = ({ champ }) => {
  const [activeSkin, setActiveSkin] = useState(0);
  const [previousSkin, setPreviousSkin] = useState(null);
  const galleryRef = useRef(null);
  const carouselRef = useRef(null);
  const thumbnailsRef = useRef([]);
  const skin = champ[activeSkin];

  const selectSkin = useCallback(
    (nextSkin) => {
      const normalizedSkin = (nextSkin + champ.length) % champ.length;

      if (normalizedSkin === activeSkin) {
        return;
      }

      setPreviousSkin(champ[activeSkin]);
      setActiveSkin(normalizedSkin);
    },
    [activeSkin, champ]
  );

  const showPreviousSkin = useCallback(() => {
    selectSkin(activeSkin - 1);
  }, [activeSkin, selectSkin]);

  const showNextSkin = useCallback(() => {
    selectSkin(activeSkin + 1);
  }, [activeSkin, selectSkin]);

  useEffect(() => {
    const carousel = carouselRef.current;
    const thumbnail = thumbnailsRef.current[activeSkin];

    if (!carousel || !thumbnail) {
      return;
    }

    const nextScrollLeft =
      thumbnail.offsetLeft -
      carousel.clientWidth / 2 +
      thumbnail.clientWidth / 2;

    carousel.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  }, [activeSkin]);

  useEffect(() => {
    if (!previousSkin) {
      return undefined;
    }

    const transitionTimer = window.setTimeout(() => {
      setPreviousSkin(null);
    }, 460);

    return () => window.clearTimeout(transitionTimer);
  }, [previousSkin]);

  useEffect(() => {
    const handleKeyboardNavigation = (event) => {
      const activeElement = document.activeElement;
      const isTyping =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "SELECT" ||
        activeElement?.isContentEditable;
      const galleryRect = galleryRef.current?.getBoundingClientRect();
      const isGalleryInView =
        galleryRect &&
        galleryRect.top < window.innerHeight &&
        galleryRect.bottom > 0;

      if (isTyping || !isGalleryInView) {
        return;
      }

      const pressedKey = event.key;

      if (pressedKey === "ArrowLeft") {
        event.preventDefault();
        showPreviousSkin();
      }

      if (pressedKey === "ArrowRight") {
        event.preventDefault();
        showNextSkin();
      }

      if (pressedKey === "Home") {
        event.preventDefault();
        selectSkin(0);
      }

      if (pressedKey === "End") {
        event.preventDefault();
        selectSkin(champ.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [champ.length, selectSkin, showNextSkin, showPreviousSkin]);

  return (
    <section
      className="skins"
      aria-label="Champion skin gallery"
      ref={galleryRef}
    >
      <div className="container skins__inner">
        <div className="skins__heading">
          <div>
            <span>Change the fantasy</span>
            <h2>Available skins</h2>
          </div>
          <p>
            {String(activeSkin + 1).padStart(2, "0")} /{" "}
            {String(champ.length).padStart(2, "0")}
          </p>
        </div>

        <div className="skins__stage">
          {previousSkin && (
            <img
              className="skins__img skins__img--previous"
              src={previousSkin.img}
              alt=""
              aria-hidden="true"
            />
          )}
          <img
            className="skins__img skins__img--active"
            src={skin.img}
            alt={skin.name}
            key={skin.id}
          />
          <div className="skins__shade" />

          <div className="skins__navigation">
            <button
              className="skins__arrow skins__arrow--previous"
              onClick={showPreviousSkin}
              aria-label="Previous skin"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m15 5-7 7 7 7" />
              </svg>
            </button>
            <button
              className="skins__arrow skins__arrow--next"
              onClick={showNextSkin}
              aria-label="Next skin"
              type="button"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="skins__current">
            <span>Selected appearance</span>
            <div className="skins__current-title">
              <h3>{skin.name}</h3>
              {skin.hasChroma && <strong>Chroma</strong>}
            </div>
          </div>
        </div>

        <div
          className="skins__carousel"
          aria-label="Champion skins"
          ref={carouselRef}
        >
          {champ.map((item, index) => (
            <button
              ref={(element) => {
                thumbnailsRef.current[index] = element;
              }}
              className={
                index === activeSkin
                  ? "carousel__item carousel-active"
                  : "carousel__item"
              }
              key={item.id}
              onClick={() => selectSkin(index)}
              aria-pressed={index === activeSkin}
              type="button"
            >
              <img className="carousel__img" src={item.img} alt="" />
              <span className="carousel__name">{item.name}</span>
              {item.hasChroma && (
                <span
                  className="carousel__chroma"
                  aria-label="Chroma available"
                  title="Chroma available"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skins;
