import React, { useState, useEffect } from "react";
import "./Home.css";
import Posts from "../components/Posts";

export default function Home({ orbis }) {
  const [user, setUser] = useState();
  const [userPfp, setUserPfp] = useState();

  useEffect(() => {
    async function checkConnection() {
      let res = await orbis.isConnected();

      if (res.status == 200) {
        setUser(res.did);
        console.log(res);
        setUserPfp(res.details?.profile?.pfp);
      } else {
        console.log("account is not connected", res);
        alert("wallet is not connected");
      }
    }
    checkConnection();
  }, []);

  async function connect() {
    let res = await orbis.connect();

    if (res.status == 200) {
      setUser(res.did);
      setUserPfp(res.details?.profile?.pfp);
    } else {
      console.log("Error connecting to Ceramic: ", res);
      alert("Error connecting to Ceramic.");
    }
  }

  return (
    <div className=" relative overflow-y-auto border-dotted border-2 border-black m-2 h-full overflow-x-hidden rounded-md">
      <div className="absolute top-0 left-[12px] my-2 max-w-full p-2 rounded-md h-[98vh] ">
        {user ? (
          <div className=" max-w-full">
            <div className=" border-2 border-black border-solid max-w-[650px] rounded-md">
              <Share orbis={orbis} />
            </div>
            <div className="">
              <Posts orbis={orbis} className="" />
            </div>
          </div>
        ) : (
          <button onClick={() => connect()}>Connect your wallet</button>
        )}
      </div>
    </div>
  );
}

function Share({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState();

  async function share() {
    setLoading(true);

    let res = await orbis.createPost({
      body: text,
      context: "0xBulls Local Host",
    });

    if (res.status == 200) {
      console.log("Shared post with stream_id: ", res.doc);
      alert("Post shared with stream id: " + res.doc);
      setText();
    } else {
      console.log("Error sharing post: ", res);
      alert("Error sharing post, look at the logs.");
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-row justify-items-center m-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your post here..."
        className="w-[80%] rounded-md mr-4 font-thin p-2 placeholder:"
      />
      {/* <div className="w-[100px] h-[60px]" contentEditable="true">
        </div> */}

      {loading ? (
        <button>Loading...</button>
        ) : (
          <button
          onClick={() => share()}
          className="bg-white rounded-md border-black border-2 px-6"
          >
          Share
        </button>
      )}
    </div>
  );
}
