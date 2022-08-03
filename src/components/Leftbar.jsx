import Groups from "./Groups";
import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { ImHome } from "react-icons/im";
import makeBlockie from "ethereum-blockies-base64";
import { BiCog } from "react-icons/bi";
import Control from "../assets/control.png";
import Logo from "../assets/logo.png";
import { useParams, Link } from "react-router-dom";

const Leftbar = ({ orbis, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [userGroups, setUserGroups] = useState();
  const [userDid, setUserDid] = useState();
  const { did } = useParams();
  const [user, setUser] = useState();
  const [userPfp, setUserPfp] = useState();
  const defaultImg =
    "https://data.lahatkab.go.id/sites/default/files/styles/group_medium/public/group.png?itok=C9137V0E";

  useEffect(() => {
    loadGroup();
  }, []);

  useEffect(() => {
    async function checkConnection() {
      let res = await orbis.isConnected();

      if (res.status == 200) {
        setUser(res.details.profile.username);
        console.log(res);
        setUserPfp(res.details?.profile?.pfp);
        setUserDid(res.did);
      } else {
        console.log("account is not connected", res);
        alert("wallet is not connected");
      }
    }
    checkConnection();
  }, []);

  async function loadGroup() {
    setLoading(true);
    let res = await orbis.isConnected();
    let { data, error } = await orbis.getProfileGroups(res.did);

    if (data) {
      setUserGroups(data);
      setLoading(false);
      console.log(data);
    }
  }

  return (
    <div
      className={` ${
        open ? "w-72" : "w-20"
      } flex flex-col flex-wrap duration-500 h-[98vh] p-2 pt-8 bg-dark-purple  z-50 fixed rounded-md m-2`}
    >
      <img
        src={Control}
        alt=""
        className={`absolute cursor-pointer rounded-full -right-3 top-6 w-7 border-2 border-dark-purple ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      />
      <Link to="/">
        <div className="flex gap-x-4 items-center cursor-pointer hover:bg-light-white hover:rounded-md">
          <img
            src={Logo}
            className={`cursor-pointer duration-500 w-16 ${
              !open && "rotate-[360deg]"
            } `}
          ></img>
          <h1
            className={`text-white origin-left font-medium text-xl duration-300 ${
              !open && "scale-0"
            }`}
          >
            QUB3
          </h1>
        </div>
      </Link>
      <ul className="pt-6">
        {userGroups && userGroups.length
          ? userGroups.map((item, index) => (
              <li className={`${!open && "max-w-[60px]"}`}>
                <Link key={index} to={`group/${item.group_id}`}>
                  <div
                    className={`text-gray-300 text-sm flex items-center max-w-full gap-x-4 cursor-pointer p-2 hover:bg-light-white hover:rounded-md`}
                  >
                    {item.group_details.pfp ? (
                      <img
                        alt=""
                        src={item.group_details.pfp}
                        className="rounded-full h-10 place-items-center"
                      ></img>
                    ) : (
                      <img
                        className="rounded-full max-h-10"
                        src={defaultImg}
                      ></img>
                    )}
                    <span
                      className={`duration-300 whitespace-nowrap origin-left ${
                        !open && "scale-0"
                      }`}
                    >
                      {item.group_details.name}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          : ""}

        {/* <li><Groups orbis={orbis} /></li> */}
      </ul>

      <div className={`${!open && "max-w-[60px]"} mt-auto`}>
        <Link to={`/profile/${userDid}`}>
          <div className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2  hover:bg-light-white hover:rounded-md">
            <img
              alt=""
              src={userPfp}
              className="rounded-full h-10 place-items-center aspect-square object-cover"
            ></img>

            <span
              className={`duration-300 whitespace-nowrap origin-left ${
                !open && "scale-0"
              }`}
            >
              {user}
            </span>
          </div>
        </Link>
        <Link to="/">
          <BiCog size={40} />
          <div className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2  hover:bg-light-white hover:rounded-md">
            <span
              className={`duration-300 whitespace-nowrap origin-left ${
                !open && "scale-0"
              }`}
            >
              {" "}
              Setting
            </span>
          </div>
        </Link>
      </div>

      {/* <div>Logo</div>
      <Link to="/">
        <div className="">
          <ImHome />
        </div>
      </Link>
      <div>Search</div>
      <div className="items-center">
        <Groups orbis={orbis} />
      </div>
      <div className="">
        <TiPlus />
      </div> */}
    </div>
  );
};

export default Leftbar;
