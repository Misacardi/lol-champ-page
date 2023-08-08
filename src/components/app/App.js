import Navbar from "../navbar";
import HeroList from "../heroesList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SingleChampion from "../singleChampion";
import Footer from "../footer";
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
        <Footer/>
      </Router>
    </div>
  );
};

export default App;
