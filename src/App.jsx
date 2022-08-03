import { useState } from "react";
// import "./App.css";
import Rightbar from "./components/Rightbar";
import Leftbar from "./components/Leftbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import Group from "./pages/Group";
import GroupChannel from "./components/GroupChannel";
import { Routes, Route, Link } from "react-router-dom";
import { Orbis } from "@orbisclub/orbis-sdk";
let orbis = new Orbis();

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div className="">
        <Leftbar setOpen={setOpen} open={open} orbis={orbis} />
      </div>

      <div className={`${open ? "left-52" : "left-0" } ml-[100px] absolute w-[50vw] h-[98vh] transition-all duration-500`}>
        <Routes>
          <Route path="/" element={<Home orbis={orbis} className="" />} />
          <Route path="/profile/:did" element={<Profile orbis={orbis} />} />
          <Route path="/group/:group_id" element={<Group orbis={orbis} />} />
          <Route
            path="/group/:group_id/channel/:channel_id"
            element={<GroupChannel orbis={orbis} />}
          />
        </Routes>
      </div>
      <div>
        <Rightbar />
      </div>
    </div>
  );
}

export default App;
