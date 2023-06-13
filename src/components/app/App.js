import Navbar from "../navbar/navbar";
import HeroList from "../heroesList/heroesList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SingleChampion from "../singleChampion/singleChampion";

import "./app.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<HeroList />}>
            {" "}
          </Route>
          <Route path="/:heroId" element={<SingleChampion />}>
            {" "}
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
