import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Rightbar from "./components/Rightbar";
import Leftbar from "./components/Leftbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Group from "./pages/Group";
import { Routes, Route, Link } from "react-router-dom";
import { Orbis } from "@orbisclub/orbis-sdk";
let orbis = new Orbis();

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="page">
      <div>
        <Leftbar orbis={orbis}/>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:did" element={<Profile orbis={orbis} />} />
          <Route path="/group/:group_id" element={<Group orbis={orbis} />} />
        </Routes>
      </div>
      <div>
        <Rightbar />
      </div>
    </div>
  );
}

export default App;
