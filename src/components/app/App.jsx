import Navbar from "../navbar";
import ChampionList from "../championList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import SingleChampion from "../singleChampion";
import Footer from "../footer";
import "./app.css";

const App = () => {
  const { darkTheme } = useSelector((state) => state);
  const theme = darkTheme ? 'App dark': 'App'
  return (
    <div className={theme}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<ChampionList />}>
            {" "}
          </Route>
          <Route path="/:heroId" element={<SingleChampion />}>
            {" "}
          </Route>
        </Routes>
        <Footer/>
      </Router>
    </div>
  );
};

export default App;
