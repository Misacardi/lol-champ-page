import { useEffect, useMemo, useState } from "react";
import useChampionService from "../../services/championsService";
import "./itemsPage.css";

const categoryButtons = [
  "all",
  "damage",
  "magic",
  "defense",
  "boots",
  "support",
  "consumable",
  "other",
];

const itemStats = [
  { label: "Price", value: (item) => `${item.price}g` },
  { label: "Sell", value: (item) => `${item.sellPrice}g` },
  { label: "Tier", value: (item) => item.depth },
];

const itemBonusFields = [
  { key: "health", label: "HP" },
  { key: "attackDamage", label: "AD" },
  { key: "abilityPower", label: "AP" },
  { key: "armor", label: "Armor" },
  { key: "magicResist", label: "MR" },
  { key: "attackSpeedPercent", label: "AS", suffix: "%" },
];

const formatBonusValue = (value) => {
  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value).toFixed(1).replace(/\.0$/, "");
};

const getItemBonuses = (item) =>
  itemBonusFields
    .map((field) => ({
      ...field,
      value: Number(item.bonuses?.[field.key] || 0),
    }))
    .filter((bonus) => bonus.value > 0);

const ItemCardSkeleton = () => (
  <article className="item-card item-card--skeleton" aria-hidden="true">
    <div className="item-card__icon skeleton-shimmer" />
    <div className="item-card__body">
      <span className="item-card__category skeleton-shimmer" />
      <span className="item-card__title-skeleton skeleton-shimmer" />
      <span className="item-card__text-skeleton skeleton-shimmer" />
      <span className="item-card__text-skeleton item-card__text-skeleton--short skeleton-shimmer" />
    </div>
  </article>
);

const ItemDetailsModal = ({ item, onClose }) => {
  const bonuses = getItemBonuses(item);

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
    <div className="item-modal" onMouseDown={onClose}>
      <article
        className="item-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="item-modal__close"
          onClick={onClose}
          aria-label="Close item details"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <header className="item-modal__header">
          <img src={item.img} alt={`${item.name} icon`} />
          <div>
            <span>{item.category}</span>
            <h2 id="item-modal-title">{item.name}</h2>
            <p>{item.tags.join(" · ") || "Shop item"}</p>
          </div>
        </header>

        <dl className="item-modal__economy">
          {itemStats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value(item)}</dd>
            </div>
          ))}
        </dl>

        <section className="item-modal__section">
          <span>Stat bonuses</span>
          {bonuses.length > 0 ? (
            <dl className="item-modal__bonuses">
              {bonuses.map((bonus) => (
                <div key={bonus.key}>
                  <dt>{bonus.label}</dt>
                  <dd>
                    +{formatBonusValue(bonus.value)}
                    {bonus.suffix || ""}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="item-modal__muted">No direct stat bonuses in API.</p>
          )}
        </section>

        <section className="item-modal__section">
          <span>Full description</span>
          <p>{item.description || item.summary || "No description available."}</p>
        </section>

        {(item.buildsFrom > 0 || item.buildsInto > 0) && (
          <div className="item-modal__build">
            {item.buildsFrom > 0 && <span>Builds from {item.buildsFrom}</span>}
            {item.buildsInto > 0 && <span>Builds into {item.buildsInto}</span>}
          </div>
        )}
      </article>
    </div>
  );
};

const ItemsPage = () => {
  const { getItemList } = useChampionService();
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Items";
    getItemList()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(() => {
        setError("Unable to load items. Check your connection and refresh the page.");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesCompletion = !showCompletedOnly || item.isCompleted;
      const matchesSearch =
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesCompletion && matchesSearch;
    });
  }, [activeCategory, items, searchQuery, showCompletedOnly]);

  const visibleCategories = categoryButtons.filter(
    (category) =>
      category === "all" || items.some((item) => item.category === category)
  );
  const skeletonCards = Array.from({ length: 12 }, (_, index) => (
    <ItemCardSkeleton key={index} />
  ));

  return (
    <main className="items-page">
      <section className="items-hero">
        <div className="container items-hero__inner">
          <div className="items-hero__copy">
            <span className="items-hero__eyebrow">Summoner's Rift shop</span>
            <h1 className="items-hero__title">Item forge</h1>
            <p className="items-hero__description">
              Browse current shop items, compare costs, and find the pieces that
              shape each build path.
            </p>
          </div>

          <div className="items-hero__panel" aria-label="Item archive stats">
            <strong>{items.length || "250+"}</strong>
            <span>Shop entries</span>
          </div>
        </div>
      </section>

      <section className="items-catalog">
        <div className="container">
          <div className="items-catalog__heading">
            <div>
              <span className="items-catalog__eyebrow">The armory</span>
              <h2>Choose an item</h2>
            </div>
            <p>
              {loading
                ? "Loading shop"
                : `${filteredItems.length} ${
                    filteredItems.length === 1 ? "item" : "items"
                  }`}
            </p>
          </div>

          <div className="items-toolbar">
            <label className="items-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search item"
                aria-label="Search item"
              />
            </label>

            <div className="items-filter" aria-label="Filter items by category">
              {visibleCategories.map((category) => (
                <button
                  key={category}
                  className={`items-filter__button ${
                    activeCategory === category ? "is-active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              className={`items-completed-button ${
                showCompletedOnly ? "is-active" : ""
              }`}
              onClick={() => setShowCompletedOnly((current) => !current)}
              aria-pressed={showCompletedOnly}
            >
              Completed items
            </button>
          </div>

          {loading ? (
            <div className="items-grid">{skeletonCards}</div>
          ) : (
            <div className="items-grid">
              {filteredItems.map((item) => {
                const bonuses = getItemBonuses(item);

                return (
                  <article className="item-card" key={item.id}>
                    <img
                      className="item-card__icon"
                      src={item.img}
                      alt={`${item.name} icon`}
                      loading="lazy"
                    />
                    <div className="item-card__body">
                      <div className="item-card__topline">
                        <span className="item-card__category">{item.category}</span>
                        <strong>{item.price}g</strong>
                      </div>
                      <h3>{item.name}</h3>
                      <p>{item.summary || item.description}</p>

                      <div className="item-card__bonuses" aria-label={`${item.name} stat bonuses`}>
                        {bonuses.length > 0 ? (
                          bonuses.map((bonus) => (
                            <span key={bonus.key}>
                              {bonus.label} +{formatBonusValue(bonus.value)}
                              {bonus.suffix || ""}
                            </span>
                          ))
                        ) : (
                          <span>No direct stats</span>
                        )}
                      </div>

                      <dl className="item-card__stats">
                        {itemStats.map((stat) => (
                          <div key={stat.label}>
                            <dt>{stat.label}</dt>
                            <dd>{stat.value(item)}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="item-card__actions">
                        {(item.buildsFrom > 0 || item.buildsInto > 0) && (
                          <div className="item-card__build">
                            {item.buildsFrom > 0 && <span>From {item.buildsFrom}</span>}
                            {item.buildsInto > 0 && <span>Into {item.buildsInto}</span>}
                          </div>
                        )}

                        <button onClick={() => setSelectedItem(item)}>
                          Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {error && <div className="items-page__error">{error}</div>}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="items-page__empty">
              No items found. Try another name or category.
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </main>
  );
};

export default ItemsPage;
