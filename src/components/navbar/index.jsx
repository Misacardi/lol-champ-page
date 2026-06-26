import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { change } from "../../redux/reducers";
import moon from "./../../images/moon-icon.png";
import sun from "./../../images/sun-icon.png";
import "./navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const { darkTheme } = useSelector((state) => state);
  const setIcon = darkTheme ? sun : moon;

  return (
    <nav className="nav">
      <div className="container">
        <div className="header">
          <NavLink className="nav__brand" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="league"
              viewBox="0 0 30 32"
              aria-hidden="true"
            >
              <path d="M1.806 9.75A14.46 14.46 0 0 0 0 16.768c0 2.542.655 4.933 1.806 7.02V9.75ZM15 2.022c-1.217 0-2.398.147-3.531.414v2.321A12.97 12.97 0 0 1 15 4.267c7.022 0 12.715 5.58 12.715 12.464 0 3.1-1.158 5.935-3.069 8.115l-1.165 4.087C27.418 26.276 30 21.82 30 16.77 30 8.624 23.284 2.022 15 2.022Z" />
              <path d="M11.469 24.421h11.756c1.947-2 3.146-4.708 3.146-7.69 0-6.156-5.09-11.145-11.371-11.145-1.233 0-2.418.196-3.531.55V24.42Z" />
              <path d="M10.109 0H1.55l1.616 3.298v25.406L1.55 32h19.642l1.781-6.243H10.11V0Z" />
            </svg>
            <span>
              Rift
              <small>Champion archive</small>
            </span>
          </NavLink>

          <div className="nav__actions">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav__link is-active" : "nav__link"
              }
              to="/items"
            >
              Items
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "nav__link is-active" : "nav__link"
              }
              to="/calculator"
            >
              Calculator
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                isActive ? "nav__link is-active" : "nav__link"
              }
              to="/compare"
            >
              Compare
            </NavLink>

            <button
              onClick={() => dispatch(change())}
              className="button__theme"
              aria-label={
                darkTheme ? "Switch to light theme" : "Switch to dark theme"
              }
            >
              <img src={setIcon} alt="" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
