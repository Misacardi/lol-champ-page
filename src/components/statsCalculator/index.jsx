import { useEffect, useMemo, useState } from "react";
import useChampionService from "../../services/championsService";
import "./statsCalculator.css";

const trackedStats = [
  { key: "health", label: "HP", max: 5200, decimals: 0 },
  { key: "attackDamage", label: "AD", max: 420, decimals: 0 },
  { key: "abilityPower", label: "AP", max: 900, decimals: 0 },
  { key: "armor", label: "Armor", max: 340, decimals: 0 },
  { key: "magicResist", label: "MR", max: 260, decimals: 0 },
  { key: "attackSpeed", label: "AS", max: 2.5, decimals: 2 },
];

const manualFields = [
  { key: "health", label: "HP" },
  { key: "attackDamage", label: "AD" },
  { key: "abilityPower", label: "AP" },
  { key: "armor", label: "Armor" },
  { key: "magicResist", label: "MR" },
  { key: "attackSpeedPercent", label: "AS %" },
];

const emptyManualBonuses = manualFields.reduce(
  (bonuses, field) => ({ ...bonuses, [field.key]: "0" }),
  {}
);

const hasTrackedBonus = (item) =>
  manualFields.some((field) => Number(item.bonuses?.[field.key] || 0) > 0);

const formatStat = (value, decimals = 0) => {
  if (decimals === 0) {
    return Math.round(value);
  }

  return Number(value).toFixed(decimals).replace(/\.?0+$/, "");
};

const getNumericBonus = (value) => Number(value) || 0;

const getStatAtLevel = (stats, key, level) => {
  if (key === "health") {
    return stats.health + stats.healthPerLevel * (level - 1);
  }

  if (key === "attackDamage") {
    return stats.attackDamage + stats.attackDamagePerLevel * (level - 1);
  }

  if (key === "armor") {
    return stats.armor + stats.armorPerLevel * (level - 1);
  }

  if (key === "magicResist") {
    return stats.magicResist + stats.magicResistPerLevel * (level - 1);
  }

  if (key === "attackSpeed") {
    return stats.attackSpeed * (1 + (stats.attackSpeedPerLevel * (level - 1)) / 100);
  }

  return 0;
};

const getBonusSummary = (bonuses = {}) =>
  manualFields
    .filter((field) => getNumericBonus(bonuses[field.key]) > 0)
    .map((field) => {
      const value = getNumericBonus(bonuses[field.key]);
      return `${field.label} +${field.key === "attackSpeedPercent" ? formatStat(value, 0) + "%" : formatStat(value, 0)}`;
    });

const CalculatorSkeleton = () => (
  <main className="stats-calc stats-calc--loading">
    <section className="stats-calc__hero">
      <div className="container stats-calc__hero-inner">
        <span className="stats-calc__eyebrow skeleton-shimmer" />
        <span className="stats-calc__title-skeleton skeleton-shimmer" />
        <span className="stats-calc__copy-skeleton skeleton-shimmer" />
      </div>
    </section>
  </main>
);

const ChampionPicker = ({ champions, currentChampion, onChoose, onClose }) => {
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
        aria-labelledby="stats-champion-picker-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="champion-picker__header">
          <div>
            <span>Stats calculator</span>
            <h2 id="stats-champion-picker-title">Choose a champion</h2>
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

const StatsCalculator = () => {
  const { getChampionList, getChampion, getItemList } = useChampionService();
  const [champions, setChampions] = useState([]);
  const [items, setItems] = useState([]);
  const [championId, setChampionId] = useState("Ahri");
  const [champion, setChampion] = useState(null);
  const [level, setLevel] = useState(18);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [manualBonuses, setManualBonuses] = useState(emptyManualBonuses);
  const [itemSearch, setItemSearch] = useState("");
  const [showCompletedItems, setShowCompletedItems] = useState(false);
  const [isChampionPickerOpen, setIsChampionPickerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingChampion, setLoadingChampion] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Stats calculator";
    window.scrollTo(0, 0);

    Promise.all([getChampionList(), getItemList()])
      .then(([championList, itemList]) => {
        setChampions(championList);
        setItems(itemList.filter(hasTrackedBonus));
        setError(null);
      })
      .catch(() => {
        setError("Unable to load calculator data. Check your connection and refresh the page.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isActive = true;

    getChampion(championId)
      .then((data) => {
        if (isActive) {
          setChampion(data);
          setError(null);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("Unable to load champion stats. Try another champion.");
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingChampion(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [championId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedItems = useMemo(
    () =>
      selectedItemIds
        .map((itemId) => items.find((item) => item.id === itemId))
        .filter(Boolean),
    [items, selectedItemIds]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = itemSearch.trim().toLowerCase();

    return items.filter(
      (item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
        const matchesCompletion = !showCompletedItems || item.isCompleted;

        return matchesSearch && matchesCompletion;
      }
    );
  }, [itemSearch, items, showCompletedItems]);

  const itemBonuses = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) =>
          manualFields.reduce(
            (nextTotal, field) => ({
              ...nextTotal,
              [field.key]:
                getNumericBonus(nextTotal[field.key]) +
                getNumericBonus(item.bonuses[field.key]),
            }),
            total
          ),
        emptyManualBonuses
      ),
    [selectedItems]
  );

  const totalBonuses = useMemo(
    () =>
      manualFields.reduce(
        (total, field) => ({
          ...total,
          [field.key]:
            getNumericBonus(itemBonuses[field.key]) +
            getNumericBonus(manualBonuses[field.key]),
        }),
        {}
      ),
    [itemBonuses, manualBonuses]
  );

  const calculatedStats = useMemo(() => {
    if (!champion) {
      return [];
    }

    return trackedStats.map((stat) => {
      const baseValue =
        stat.key === "abilityPower"
          ? 0
          : getStatAtLevel(champion.stats, stat.key, level);
      const itemAndManualValue =
        stat.key === "attackSpeed"
          ? baseValue * (getNumericBonus(totalBonuses.attackSpeedPercent) / 100)
          : getNumericBonus(totalBonuses[stat.key]);
      const totalValue = baseValue + itemAndManualValue;

      return {
        ...stat,
        baseValue,
        bonusValue: itemAndManualValue,
        totalValue,
        width: Math.min(100, Math.max(4, (totalValue / stat.max) * 100)),
      };
    });
  }, [champion, level, totalBonuses]);

  const addItem = (itemId) => {
    setSelectedItemIds((currentItems) => {
      if (currentItems.length >= 6 || currentItems.includes(itemId)) {
        return currentItems;
      }

      return [...currentItems, itemId];
    });
  };

  const removeItem = (itemId) => {
    setSelectedItemIds((currentItems) =>
      currentItems.filter((selectedItemId) => selectedItemId !== itemId)
    );
  };

  const updateManualBonus = (key, value) => {
    setManualBonuses((currentBonuses) => ({ ...currentBonuses, [key]: value }));
  };

  const updateChampion = (nextChampionId) => {
    setChampion(null);
    setLoadingChampion(true);
    setChampionId(nextChampionId);
    setIsChampionPickerOpen(false);
  };

  if (loading || loadingChampion || !champion) {
    return <CalculatorSkeleton />;
  }

  return (
    <main className="stats-calc">
      <section
        className="stats-calc__hero"
        style={{ "--hero-image": `url(${champion.img})` }}
      >
        <div className="container stats-calc__hero-inner">
          <div className="stats-calc__hero-copy">
            <span className="stats-calc__eyebrow">Build laboratory</span>
            <h1>Stats calculator</h1>
            <p>{champion.name} · level {level} · {selectedItems.length}/6 items</p>
          </div>
        </div>
      </section>

      <section className="stats-calc__workspace">
        <div className="container stats-calc__grid">
          <aside className="stats-calc__controls">
            <div className="stats-calc__champion-control">
              <span>Champion</span>
              <button
                className="stats-calc__champion-button"
                onClick={() => setIsChampionPickerOpen(true)}
                aria-label={`Change ${champion.name}`}
              >
                <img src={champion.img} alt="" />
                <span>
                  <strong>{champion.name}</strong>
                  <small>{champion.roles.join(" · ")}</small>
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h16M12 4v16" />
                </svg>
              </button>
            </div>

            <div className="stats-calc__level">
              <div>
                <span>Level</span>
                <strong>{level}</strong>
              </div>
              <input
                type="range"
                min="1"
                max="18"
                value={level}
                onChange={(event) => setLevel(Number(event.target.value))}
                aria-label="Champion level"
              />
            </div>

            <div className="stats-calc__manual">
              <div className="stats-calc__section-heading">
                <span>Manual bonuses</span>
                <button onClick={() => setManualBonuses(emptyManualBonuses)}>
                  Reset
                </button>
              </div>

              <div className="stats-calc__manual-grid">
                {manualFields.map((field) => (
                  <label key={field.key}>
                    <span>{field.label}</span>
                    <input
                      type="number"
                      value={manualBonuses[field.key]}
                      onChange={(event) =>
                        updateManualBonus(field.key, event.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="stats-calc__results">
            <article className="stats-calc__champion-panel">
              <img src={champion.img} alt={champion.name} />
              <div>
                <span>{champion.roles.join(" · ")}</span>
                <h2>{champion.name}</h2>
                <p>{champion.subtitle}</p>
              </div>
            </article>

            <div className="stats-calc__stat-table">
              {calculatedStats.map((stat) => (
                <article className="stats-calc__stat-row" key={stat.key}>
                  <div className="stats-calc__stat-label">
                    <span>{stat.label}</span>
                    <small>
                      {formatStat(stat.baseValue, stat.decimals)} base
                      {stat.bonusValue > 0 &&
                        ` + ${formatStat(stat.bonusValue, stat.decimals)}`}
                    </small>
                  </div>

                  <div className="stats-calc__stat-meter">
                    <span style={{ width: `${stat.width}%` }} />
                  </div>

                  <strong>{formatStat(stat.totalValue, stat.decimals)}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className="stats-calc__build">
            <div className="stats-calc__section-heading">
              <span>Item build</span>
              <button onClick={() => setSelectedItemIds([])}>Clear</button>
            </div>

            <div className="stats-calc__slots">
              {Array.from({ length: 6 }, (_, index) => {
                const item = selectedItems[index];

                return item ? (
                  <button
                    className="stats-calc__slot is-filled"
                    onClick={() => removeItem(item.id)}
                    key={item.id}
                    aria-label={`Remove ${item.name}`}
                  >
                    <img src={item.img} alt="" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <div className="stats-calc__slot" key={`empty-${index}`}>
                    <span>Empty</span>
                  </div>
                );
              })}
            </div>

            <dl className="stats-calc__bonus-list">
              {getBonusSummary(itemBonuses).length > 0 ? (
                getBonusSummary(itemBonuses).map((bonus) => (
                  <div key={bonus}>
                    <dt>{bonus.split(" +")[0]}</dt>
                    <dd>+{bonus.split(" +")[1]}</dd>
                  </div>
                ))
              ) : (
                <div>
                  <dt>Items</dt>
                  <dd>+0</dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </section>

      <section className="stats-calc__armory">
        <div className="container">
          <div className="stats-calc__armory-heading">
            <div>
              <span className="stats-calc__eyebrow">Item API</span>
              <h2>Bonus sources</h2>
            </div>

            <label className="stats-calc__search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <input
                type="search"
                value={itemSearch}
                onChange={(event) => setItemSearch(event.target.value)}
                placeholder="Search item"
                aria-label="Search item"
              />
            </label>

            <button
              className={`stats-calc__completed-button ${
                showCompletedItems ? "is-active" : ""
              }`}
              onClick={() => setShowCompletedItems((current) => !current)}
              aria-pressed={showCompletedItems}
            >
              Completed items
            </button>
          </div>

          <div className="stats-calc__items">
            {filteredItems.map((item) => {
              const selected = selectedItemIds.includes(item.id);
              const fullBuild = selectedItemIds.length >= 6;
              const bonuses = getBonusSummary(item.bonuses);

              return (
                <article className="stats-calc__item" key={item.id}>
                  <img src={item.img} alt={`${item.name} icon`} loading="lazy" />
                  <div>
                    <span>{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{bonuses.join(" · ")}</p>
                  </div>
                  <button
                    onClick={() => addItem(item.id)}
                    disabled={selected || fullBuild}
                  >
                    {selected ? "Added" : "Add"}
                  </button>
                </article>
              );
            })}
          </div>

          {error && <div className="stats-calc__error">{error}</div>}
          {!error && filteredItems.length === 0 && (
            <div className="stats-calc__empty">No stat items found.</div>
          )}
        </div>
      </section>

      {isChampionPickerOpen && (
        <ChampionPicker
          champions={champions}
          currentChampion={champion}
          onChoose={updateChampion}
          onClose={() => setIsChampionPickerOpen(false)}
        />
      )}
    </main>
  );
};

export default StatsCalculator;
