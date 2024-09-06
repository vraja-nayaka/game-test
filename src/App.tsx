import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";
import "./App.css";
import "./firebaseInit";
import { Game1 } from "./game1/game1";
import { Game2 } from "./game2/game2";
import { Home } from "./Home";
import { Game2Online } from "./game2online";

const App: React.FC = () => {
  return (
    <div className="App">
      <Link to={"/"}>Home</Link>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/game1" element={<Game1 />}></Route>
        <Route path="/game2" element={<Game2 />}></Route>
        <Route path="/game2online" element={<Game2Online />}></Route>
      </Routes>
    </div>
  );
};

export default App;
