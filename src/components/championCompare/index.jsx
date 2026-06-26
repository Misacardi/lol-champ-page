import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useChampionService from "../../services/championsService";
import "./championCompare.css";

const comparisonStats = [
  { key: "health", growthKey: "healthPerLevel", label: "Health", max: 2800 },
  {
    key: "resource",
    growthKey: "resourcePerLevel",
    label: "Resource",
    max: 2200,
  },
  {
    key: "attackDamage",
    growthKey: "attackDamagePerLevel",
    label: "Attack damage",
    max: 170,
  },
  {
    key: "attackSpeed",
    growthKey: "attackSpeedPerLevel",
    label: "Attack speed",
    max: 1.2,
    attackSpeed: true,
    decimals: 3,
  },
  { key: "armor", growthKey: "armorPerLevel", label: "Armor", max: 150 },
  {
    key: "magicResist",
    growthKey: "magicResistPerLevel",
    label: "Magic resist",
    max: 100,
  },
  { key: "moveSpeed", label: "Move speed", max: 400 },
  { key: "attackRange", label: "Attack range", max: 650 },
];

const getStatAtLevel = (stats, item, level) => {
  const baseValue = stats[item.key] || 0;
  const growth = item.growthKey ? stats[item.growthKey] || 0 : 0;

  if (item.attackSpeed) {
    return baseValue * (1 + (growth * (level - 1)) / 100);
  }

  return baseValue + growth * (level - 1);
};

const formatValue = (value, decimals = 1) => {
  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value).toFixed(decimals).replace(/\.0$/, "");
};

const ChampionSelector = ({ champion, onOpen, side }) => (
  <article className={`compare-champion compare-champion--${side}`}>
    <button
      className="compare-champion__art"
      onClick={onOpen}
      aria-label={`Change ${champion.name}`}
    >
      <img src={champion.img} alt={champion.name} />
      <div className="compare-champion__shade" />
      <span>{side === "left" ? "Champion one" : "Champion two"}</span>
      <strong>
        Change champion
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h16M12 4v16" />
        </svg>
      </strong>
    </button>

    <div className="compare-champion__identity">
      <p>{champion.subtitle}</p>
      <h2>{champion.name}</h2>
      <strong>{champion.roles.join(" · ")}</strong>
    </div>

    <Link className="compare-champion__link" to={`/${champion.id}`}>
      Open champion page ↗
    </Link>
  </article>
);

const ChampionPicker = ({
  champions,
  currentChampion,
  onChoose,
  onClose,
  side,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredChampions = champions.filter((champion) =>
    champion.name.toLowerCase().includes(normalizedQuery)
  );

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div className="champion-picker" onMouseDown={onClose}>
      <div
        className="champion-picker__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="champion-picker-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="champion-picker__header">
          <div>
            <span>
              {side === "left" ? "Champion one" : "Champion two"}
            </span>
            <h2 id="champion-picker-title">Choose a champion</h2>
          </div>

          <button
            className="champion-picker__close"
            onClick={onClose}
            aria-label="Close champion picker"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <label className="champion-picker__search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search champion"
            aria-label="Search champion"
            autoFocus
          />
          <span>{filteredChampions.length} found</span>
        </label>

        {filteredChampions.length > 0 ? (
          <div className="champion-picker__grid">
            {filteredChampions.map((champion) => {
              const isSelected = champion.id === currentChampion.id;

              return (
                <button
                  className={
                    isSelected
                      ? "champion-picker__card is-selected"
                      : "champion-picker__card"
                  }
                  onClick={() => onChoose(champion.id)}
                  key={champion.id}
                  aria-pressed={isSelected}
                >
                  <img src={champion.img} alt="" loading="lazy" />
                  <div className="champion-picker__card-shade" />
                  <div className="champion-picker__card-copy">
                    <strong>{champion.name}</strong>
                    <span>{champion.roles.join(" · ")}</span>
                  </div>
                  {isSelected && (
                    <small>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" />
                      </svg>
                      Selected
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="champion-picker__empty">
            No champions found. Try another name.
          </div>
        )}
      </div>
    </div>
  );
};

const CompareSkeleton = () => (
  <main className="compare-page compare-page--skeleton">
    <section className="compare-hero compare-hero--skeleton">
      <div className="compare-skeleton__backdrop compare-skeleton__backdrop--left" />
      <div className="compare-skeleton__backdrop compare-skeleton__backdrop--right" />

      <div className="container compare-hero__inner">
        <span className="compare-skeleton__eyebrow skeleton-shimmer" />
        <span className="compare-skeleton__title skeleton-shimmer" />
        <span className="compare-skeleton__title compare-skeleton__title--outline skeleton-shimmer" />
        <span className="compare-skeleton__copy skeleton-shimmer" />
      </div>
    </section>

    <section className="compare-workspace">
      <div className="container">
        <div className="compare-matchup">
          {["left", "right"].map((side) => (
            <article
              className={`compare-champion compare-champion--skeleton compare-champion--${side}`}
              key={side}
            >
              <div className="compare-skeleton__art skeleton-shimmer" />
              <div className="compare-skeleton__identity">
                <span className="skeleton-shimmer" />
                <strong className="skeleton-shimmer" />
                <small className="skeleton-shimmer" />
              </div>
            </article>
          ))}

          <div className="compare-versus" aria-hidden="true">
            <span>VS</span>
          </div>
        </div>

        <div className="compare-level compare-level--skeleton">
          <div>
            <span>Loading comparison</span>
            <h2>Attribute breakdown</h2>
          </div>
          <span className="compare-skeleton__level skeleton-shimmer" />
        </div>

        <div className="comparison-table comparison-table--skeleton">
          {comparisonStats.map((item) => (
            <article className="comparison-row comparison-row--skeleton" key={item.key}>
              <span className="skeleton-shimmer" />
              <span className="skeleton-shimmer" />
              <span className="skeleton-shimmer" />
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const ChampionCompare = () => {
  const { getChampionList, getChampion } = useChampionService();
  const [searchParams, setSearchParams] = useSearchParams();
  const [champions, setChampions] = useState([]);
  const [leftChampion, setLeftChampion] = useState(null);
  const [rightChampion, setRightChampion] = useState(null);
  const [level, setLevel] = useState(1);
  const [pickerSide, setPickerSide] = useState(null);

  const leftId = searchParams.get("left") || "Ahri";
  const rightId =
    searchParams.get("right") || (leftId === "Garen" ? "Ahri" : "Garen");
  const isLoading =
    !leftChampion ||
    !rightChampion ||
    leftChampion.id !== leftId ||
    rightChampion.id !== rightId;

  useEffect(() => {
    document.title = "Compare champions";
    window.scrollTo(0, 0);

    getChampionList().then(setChampions);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Promise.all([getChampion(leftId), getChampion(rightId)]).then(
      ([left, right]) => {
        setLeftChampion(left);
        setRightChampion(right);
      }
    );
  }, [leftId, rightId]); // eslint-disable-line react-hooks/exhaustive-deps

  const comparison = useMemo(() => {
    if (!leftChampion || !rightChampion) {
      return [];
    }

    return comparisonStats.map((item) => {
      const leftValue = getStatAtLevel(leftChampion.stats, item, level);
      const rightValue = getStatAtLevel(rightChampion.stats, item, level);
      const usesDifferentResources =
        item.key === "resource" &&
        leftChampion.stats.resourceName !== rightChampion.stats.resourceName;

      return {
        ...item,
        leftValue,
        rightValue,
        usesDifferentResources,
        winner:
          usesDifferentResources
            ? "neutral"
            : leftValue === rightValue
            ? "tie"
            : leftValue > rightValue
              ? "left"
              : "right",
      };
    });
  }, [leftChampion, rightChampion, level]);

  const updateChampion = (side, championId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(side, championId);
    setSearchParams(nextParams);
    setPickerSide(null);
  };

  if (isLoading) {
    return <CompareSkeleton />;
  }

  return (
    <main className="compare-page">
      <section className="compare-hero">
        <div
          className="compare-hero__backdrop compare-hero__backdrop--left"
          style={{ backgroundImage: `url(${leftChampion.img})` }}
        />
        <div
          className="compare-hero__backdrop compare-hero__backdrop--right"
          style={{ backgroundImage: `url(${rightChampion.img})` }}
        />

        <div className="container compare-hero__inner">
          <span className="compare-hero__eyebrow">Champion laboratory</span>
          <h1>
            Compare
            <span>the legends.</span>
          </h1>
          <p>
            Put two champions side by side and see how their base attributes
            and level scaling shape different playstyles.
          </p>
        </div>
      </section>

      <section className="compare-workspace">
        <div className="container">
          <div className="compare-matchup">
            <ChampionSelector
              champion={leftChampion}
              onOpen={() => setPickerSide("left")}
              side="left"
            />

            <div className="compare-versus" aria-hidden="true">
              <span>VS</span>
            </div>

            <ChampionSelector
              champion={rightChampion}
              onOpen={() => setPickerSide("right")}
              side="right"
            />
          </div>

          <div className="compare-level">
            <div>
              <span>Comparison level</span>
              <h2>Attribute breakdown</h2>
            </div>

            <div className="compare-level__buttons">
              {[1, 18].map((item) => (
                <button
                  className={level === item ? "is-active" : ""}
                  onClick={() => setLevel(item)}
                  key={item}
                  aria-pressed={level === item}
                >
                  Level {item}
                </button>
              ))}
            </div>
          </div>

          <div className="comparison-table">
            <div className="comparison-table__header">
              <strong>{leftChampion.name}</strong>
              <span>Level {level}</span>
              <strong>{rightChampion.name}</strong>
            </div>

            {comparison.map((item) => {
              const leftWidth = Math.min(
                100,
                Math.max(4, (item.leftValue / item.max) * 100)
              );
              const rightWidth = Math.min(
                100,
                Math.max(4, (item.rightValue / item.max) * 100)
              );
              const resourceLabel =
                item.key === "resource"
                  ? `${leftChampion.stats.resourceName} / ${rightChampion.stats.resourceName}`
                  : item.label;

              return (
                <article className="comparison-row" key={item.key}>
                  <div
                    className={`comparison-row__value ${
                      item.winner === "left" ? "is-winner" : ""
                    }`}
                  >
                    <strong>
                      {formatValue(item.leftValue, item.decimals)}
                    </strong>
                    <div className="comparison-row__track comparison-row__track--left">
                      <span style={{ width: `${leftWidth}%` }} />
                    </div>
                  </div>

                  <div className="comparison-row__label">
                    <span>{resourceLabel}</span>
                    {item.winner === "tie" && <small>Even</small>}
                    {item.usesDifferentResources && (
                      <small>Different systems</small>
                    )}
                  </div>

                  <div
                    className={`comparison-row__value comparison-row__value--right ${
                      item.winner === "right" ? "is-winner" : ""
                    }`}
                  >
                    <strong>
                      {formatValue(item.rightValue, item.decimals)}
                    </strong>
                    <div className="comparison-row__track comparison-row__track--right">
                      <span style={{ width: `${rightWidth}%` }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {pickerSide && (
        <ChampionPicker
          champions={champions}
          currentChampion={
            pickerSide === "left" ? leftChampion : rightChampion
          }
          onChoose={(championId) => updateChampion(pickerSide, championId)}
          onClose={() => setPickerSide(null)}
          side={pickerSide}
        />
      )}
    </main>
  );
};

export default ChampionCompare;
