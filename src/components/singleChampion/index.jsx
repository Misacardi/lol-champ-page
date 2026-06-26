import "./singleChampion.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Skins from "../skinsCorusel";
import PreviewSkills from "../previewSkills";
import useChampionService from "../../services/championsService";

const DifficultyLevel = ({ difficulty }) => (
  <div className="difficulty-meter" aria-label={`${difficulty} difficulty`}>
    {[1, 2, 3].map((level) => {
      const activeLevels =
        difficulty === "high" ? 3 : difficulty === "mid" ? 2 : 1;

      return (
        <span
          className={level <= activeLevels ? "is-active" : ""}
          key={level}
        />
      );
    })}
  </div>
);

const statItems = [
  {
    key: "health",
    growthKey: "healthPerLevel",
    label: "Health",
    shortLabel: "HP",
    max: 2800,
  },
  {
    key: "resource",
    growthKey: "resourcePerLevel",
    labelKey: "resourceName",
    shortLabel: "MP",
    max: 2200,
  },
  {
    key: "attackDamage",
    growthKey: "attackDamagePerLevel",
    label: "Attack damage",
    shortLabel: "AD",
    max: 170,
  },
  {
    key: "attackSpeed",
    growthKey: "attackSpeedPerLevel",
    label: "Attack speed",
    shortLabel: "AS",
    max: 1.2,
    decimals: 3,
    growthSuffix: "%",
    attackSpeed: true,
  },
  {
    key: "armor",
    growthKey: "armorPerLevel",
    label: "Armor",
    shortLabel: "AR",
    max: 150,
  },
  {
    key: "magicResist",
    growthKey: "magicResistPerLevel",
    label: "Magic resist",
    shortLabel: "MR",
    max: 100,
  },
  {
    key: "moveSpeed",
    label: "Move speed",
    shortLabel: "MS",
    max: 400,
  },
  {
    key: "attackRange",
    label: "Attack range",
    shortLabel: "RG",
    max: 650,
  },
];

const MIN_CHAMPION_LEVEL = 1;
const MAX_CHAMPION_LEVEL = 18;

const clampLevel = (value) =>
  Math.min(MAX_CHAMPION_LEVEL, Math.max(MIN_CHAMPION_LEVEL, value));

const getStatAtLevel = (stats, item, level) => {
  const baseValue = stats[item.key] || 0;
  const growth = item.growthKey ? stats[item.growthKey] || 0 : 0;

  if (item.attackSpeed) {
    return baseValue * (1 + (growth * (level - 1)) / 100);
  }

  return baseValue + growth * (level - 1);
};

const formatStat = (value, decimals = 1) => {
  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value).toFixed(decimals).replace(/\.0$/, "");
};

const ChampionStats = ({ stats }) => {
  const [level, setLevel] = useState(MIN_CHAMPION_LEVEL);
  const [levelInput, setLevelInput] = useState(String(MIN_CHAMPION_LEVEL));

  const updateLevel = (nextLevel) => {
    const safeLevel = clampLevel(nextLevel);
    setLevel(safeLevel);
    setLevelInput(String(safeLevel));
  };

  const handleLevelInputChange = (event) => {
    const nextValue = event.target.value;
    setLevelInput(nextValue);

    if (nextValue === "") {
      return;
    }

    updateLevel(Number(nextValue));
  };

  const handleLevelInputBlur = () => {
    if (levelInput === "") {
      setLevelInput(String(level));
      return;
    }

    updateLevel(Number(levelInput));
  };

  return (
    <section className="champion-stats">
      <div className="container champion-stats__inner">
        <div className="champion-stats__heading">
          <div>
            <span>Scaling attributes</span>
            <h2>Combat profile</h2>
          </div>

          <div className="champion-level-control" aria-label="Champion level">
            <p>
              Champion level
              <small>Values update with level scaling</small>
            </p>

            <div className="champion-level-control__stepper">
              <button
                onClick={() => updateLevel(level - 1)}
                disabled={level <= MIN_CHAMPION_LEVEL}
                aria-label="Decrease champion level"
              >
                −
              </button>

              <label>
                <span>Level</span>
                <input
                  type="number"
                  min={MIN_CHAMPION_LEVEL}
                  max={MAX_CHAMPION_LEVEL}
                  value={levelInput}
                  onBlur={handleLevelInputBlur}
                  onChange={handleLevelInputChange}
                  aria-label="Champion level"
                />
              </label>

              <button
                onClick={() => updateLevel(level + 1)}
                disabled={level >= MAX_CHAMPION_LEVEL}
                aria-label="Increase champion level"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="champion-stats__grid">
          {statItems.map((item) => {
            const value = getStatAtLevel(stats, item, level);
            const growth = item.growthKey ? stats[item.growthKey] : 0;
            const label = item.labelKey ? stats[item.labelKey] : item.label;
            const progress = Math.min(
              100,
              Math.max(4, (value / item.max) * 100)
            );

            return (
              <article className="champion-stat" key={item.key}>
                <div className="champion-stat__top">
                  <span className="champion-stat__symbol">
                    {item.shortLabel}
                  </span>
                  <div>
                    <span>{label}</span>
                    <strong>{formatStat(value, item.decimals)}</strong>
                  </div>
                </div>

                <div className="champion-stat__track" aria-hidden="true">
                  <span style={{ width: `${progress}%` }} />
                </div>

                <div className="champion-stat__footer">
                  <span>Level {level}</span>
                  {growth > 0 && (
                    <strong>
                      +{formatStat(growth)}
                      {item.growthSuffix || ""} / lvl
                    </strong>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SingleChampionSkeleton = () => (
  <main className="single-champion single-champion--skeleton">
    <section className="champion-intro champion-intro--skeleton">
      <div className="champion-intro__backdrop champion-skeleton__backdrop" />
      <div className="champion-intro__glow" aria-hidden="true" />

      <div className="container champion-intro__container">
        <span className="champion-skeleton__back skeleton-shimmer" />

        <div className="champion-poster champion-poster--skeleton skeleton-shimmer">
          <span className="champion-skeleton__poster-line champion-skeleton__poster-line--one" />
          <span className="champion-skeleton__poster-line champion-skeleton__poster-line--two" />
        </div>

        <div className="champion-heading champion-heading--skeleton">
          <span className="champion-skeleton__eyebrow skeleton-shimmer" />
          <span className="champion-skeleton__subtitle skeleton-shimmer" />
          <span className="champion-skeleton__title skeleton-shimmer" />
        </div>

        <div className="champion-summary champion-summary--skeleton">
          <div className="champion-skeleton__specs">
            {[1, 2].map((item) => (
              <div className="champion-skeleton__spec" key={item}>
                <span className="champion-skeleton__icon skeleton-shimmer" />
                <div>
                  <span className="champion-skeleton__label skeleton-shimmer" />
                  <span className="champion-skeleton__value skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>

          <div className="champion-skeleton__lore">
            <span className="champion-skeleton__label skeleton-shimmer" />
            <span className="champion-skeleton__line skeleton-shimmer" />
            <span className="champion-skeleton__line skeleton-shimmer" />
            <span className="champion-skeleton__line champion-skeleton__line--short skeleton-shimmer" />
          </div>
        </div>

        <div className="champion-resources champion-resources--skeleton">
          {[1, 2, 3, 4].map((item) => (
            <span className="skeleton-shimmer" key={item} />
          ))}
        </div>
      </div>
    </section>

    <section className="champion-stats champion-stats--skeleton">
      <div className="container champion-stats__inner">
        <div className="champion-stats__heading">
          <div>
            <span>Loading attributes</span>
            <h2>Combat profile</h2>
          </div>
          <div className="champion-skeleton__level skeleton-shimmer" />
        </div>

        <div className="champion-stats__grid">
          {statItems.map((item) => (
            <article className="champion-stat champion-stat--skeleton" key={item.key}>
              <div className="champion-stat__top">
                <span className="champion-stat__symbol skeleton-shimmer" />
                <div>
                  <span className="champion-skeleton__label skeleton-shimmer" />
                  <strong className="skeleton-shimmer" />
                </div>
              </div>
              <div className="champion-stat__track skeleton-shimmer" />
              <div className="champion-stat__footer">
                <span className="skeleton-shimmer" />
                <strong className="skeleton-shimmer" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  </main>
);

const SingleChampion = () => {
  const { heroId } = useParams();
  const { getChampion } = useChampionService();
  const [activeChampion, setActiveChampion] = useState({});
  const { id, name, img, role, description, difficulty, subtitle } =
    activeChampion;

  useEffect(() => {
    window.scrollTo(0, 0);
    getChampion(heroId).then((res) => setActiveChampion(res));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.title = name || "Champions";
  }, [name]);

  if (!name) {
    return <SingleChampionSkeleton />;
  }

  return (
    <main className="single-champion">
      <section className="champion-intro">
        <div className="champion-intro__backdrop" aria-hidden="true">
          <img src={img} alt="" />
        </div>
        <div className="champion-intro__glow" aria-hidden="true" />

        <div className="container champion-intro__container">
          <Link className="champion-intro__back" to="/">
            <span aria-hidden="true">←</span>
            All champions
          </Link>

          <div className="champion-poster">
            <img className="champion-poster__image" src={img} alt={name} />
            <div className="champion-poster__shade" />
            <span className="champion-poster__index" aria-hidden="true">
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <div className="champion-heading">
            <span className="champion-heading__eyebrow">
              Meet the champion
            </span>
            <p>{subtitle}</p>
            <h1>{name}</h1>
          </div>

          <div className="champion-summary">
            <ul className="champion-summary__specs">
              <li>
                <img
                  src={`https://raw.communitydragon.org/9.4/plugins/rcp-fe-lol-champion-details/global/default/role-icon-${role}.png`}
                  alt=""
                  className="champion-summary__role-icon"
                />
                <div>
                  <span>Primary role</span>
                  <strong>{role}</strong>
                </div>
              </li>

              <li>
                <DifficultyLevel difficulty={difficulty} />
                <div>
                  <span>Difficulty</span>
                  <strong>{difficulty}</strong>
                </div>
              </li>
            </ul>

            <div className="champion-summary__lore">
              <span>Champion lore</span>
              <p>{description}</p>
            </div>
          </div>

          <div className="champion-resources">
            <Link className="champion-resources__compare" to={`/compare?left=${id}`}>
              Compare champion
            </Link>
            <a href="https://www.op.gg/" target="_blank" rel="noreferrer">
              OP.GG ↗
            </a>
            <a href="https://u.gg/" target="_blank" rel="noreferrer">
              U.GG ↗
            </a>
            <a
              href="https://www.probuilds.net/"
              target="_blank"
              rel="noreferrer"
            >
              Probuilds ↗
            </a>
          </div>
        </div>
      </section>

      {activeChampion.stats && <ChampionStats stats={activeChampion.stats} />}

      <section className="abilities">
        {activeChampion.skils && <PreviewSkills skils={activeChampion.skils} />}
      </section>

      {activeChampion.skins && <Skins champ={activeChampion.skins} />}
    </main>
  );
};

export default SingleChampion;
