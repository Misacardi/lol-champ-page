import { TransitionGroup, CSSTransition } from "react-transition-group";
import ChampionListItem from "../championListCard";
import {
  fetching,
  fetched,
  fetchingError,
  changeFilter,
} from "../../redux/reducers";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useChampionService from "../../services/championsService";
import "./championList.css";

const filterButtons = [
  "all",
  "assassin",
  "fighter",
  "mage",
  "marksman",
  "support",
  "tank",
];

const ChampionCardSkeleton = () => (
  <article className="card card--skeleton" aria-hidden="true">
    <div className="card-skeleton__image skeleton-shimmer" />
    <div className="card-skeleton__content">
      <div className="card-skeleton__roles">
        <span className="skeleton-shimmer" />
        <span className="skeleton-shimmer" />
      </div>
      <span className="card-skeleton__title skeleton-shimmer" />
      <span className="card-skeleton__link skeleton-shimmer" />
    </div>
  </article>
);

const ChampionList = () => {
  const { getChampionList } = useChampionService();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const champions = useSelector((state) => state.champions);
  const filterStatus = useSelector((state) => state.filterStatus);
  const loadingStatus = useSelector((state) => state.loadingStatus);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    document.title = "Champions";
    dispatch(fetching());
    getChampionList()
      .then((data) => dispatch(fetched(data)))
      .catch(() =>
        dispatch(
          fetchingError(
            "Unable to load champions. Check your connection and refresh the page."
          )
        )
      ); // eslint-disable-next-line
  }, []);

  const filteredChampions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return champions.filter((champion) => {
      const matchesRole =
        filterStatus === "all" || champion.roles.includes(filterStatus);
      const matchesSearch = champion.name
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesRole && matchesSearch;
    });
  }, [champions, filterStatus, searchQuery]);

  const cards = filteredChampions.map(({ id, name, img, roles }) => (
    <CSSTransition key={id} classNames="fade" timeout={500}>
      <ChampionListItem name={name} img={img} id={id} roles={roles} />
    </CSSTransition>
  ));
  const isInitialLoading = loadingStatus && champions.length === 0;
  const skeletonCards = Array.from({ length: 12 }, (_, index) => (
    <ChampionCardSkeleton key={index} />
  ));

  return (
    <div className="championlist">
      <section className="champion-hero">
        <div className="champion-hero__glow champion-hero__glow--one" />
        <div className="champion-hero__glow champion-hero__glow--two" />

        <div className="container champion-hero__inner">
          <div className="champion-hero__copy">
            <span className="champion-hero__eyebrow">
              League of Legends · Champion archive
            </span>
            <h1 className="champion-hero__title">
              Find your
              <span>legend.</span>
            </h1>
            <p className="champion-hero__description">
              Explore every champion, discover their abilities and find the
              playstyle that feels unmistakably yours.
            </p>

            <a className="champion-hero__cta" href="#champion-roster">
              Explore roster
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="champion-hero__stats">
            <div>
              <strong>{champions.length || "170+"}</strong>
              <span>Champions</span>
            </div>
            <div>
              <strong>6</strong>
              <span>Playstyles</span>
            </div>
            <div>
              <strong>1</strong>
              <span>Your main</span>
            </div>
          </div>
        </div>
      </section>

      <section className="roster" id="champion-roster">
        <div className="container">
          <div className="roster__heading">
            <div>
              <span className="roster__eyebrow">The roster</span>
              <h2>Choose your champion</h2>
            </div>
            <p>
              {isInitialLoading
                ? "Loading roster"
                : `${filteredChampions.length} ${
                    filteredChampions.length === 1 ? "champion" : "champions"
                  }`}
            </p>
          </div>

          <div className="champion-toolbar">
            <label className="champion-search">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="champion-search__icon"
              >
                <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search champion"
                aria-label="Search champion"
              />
            </label>

            <div className="filter" aria-label="Filter champions by role">
              {filterButtons.map((item) => (
                <button
                  key={item}
                  className={`filter__button ${
                    filterStatus === item ? "role-active" : ""
                  }`}
                  onClick={() => dispatch(changeFilter(item))}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {isInitialLoading ? (
            <div className="cards cards--skeleton">{skeletonCards}</div>
          ) : (
            <TransitionGroup className="cards">{cards}</TransitionGroup>
          )}
          {error && <div className="championlist__error">{error}</div>}
          {!loadingStatus && !error && cards.length === 0 && (
            <div className="championlist__empty">
              No champions found. Try another name or role.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ChampionList;
