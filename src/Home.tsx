import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="App">
      <Link to={"/game1"}>Game 1</Link>
      <Link to={"/game2"}>Game 2</Link>
      <Link to={"/game2online"}>Game 2 online</Link>
    </div>
  );
};
