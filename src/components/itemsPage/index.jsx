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

const ItemsPage = () => {
  const { getItemList } = useChampionService();
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

            <label className="items-completed-toggle">
              <input
                type="checkbox"
                checked={showCompletedOnly}
                onChange={(event) => setShowCompletedOnly(event.target.checked)}
              />
              <span className="items-completed-toggle__track" aria-hidden="true">
                <span />
              </span>
              <span className="items-completed-toggle__label">Completed only</span>
            </label>
          </div>

          {loading ? (
            <div className="items-grid">{skeletonCards}</div>
          ) : (
            <div className="items-grid">
              {filteredItems.map((item) => (
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

                    <dl className="item-card__stats">
                      {itemStats.map((stat) => (
                        <div key={stat.label}>
                          <dt>{stat.label}</dt>
                          <dd>{stat.value(item)}</dd>
                        </div>
                      ))}
                    </dl>

                    {(item.buildsFrom > 0 || item.buildsInto > 0) && (
                      <div className="item-card__build">
                        {item.buildsFrom > 0 && <span>From {item.buildsFrom}</span>}
                        {item.buildsInto > 0 && <span>Into {item.buildsInto}</span>}
                      </div>
                    )}
                  </div>
                </article>
              ))}
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
    </main>
  );
};

export default ItemsPage;
