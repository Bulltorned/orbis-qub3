import React, { useState, useEffect } from "react";
import { Orbis } from "@orbisclub/orbis-sdk";
import "./Home.css";
import { Link } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import { FcLike } from "react-icons/fc";
import { AiTwotoneDislike } from "react-icons/ai";
import { FaLaughSquint } from "react-icons/fa";
import { BsFillReplyFill } from "react-icons/bs";



export default function Home({orbis}) {
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
    <>
      <div className="mx-28 my-10">
        {user ? (
          <>
            <div className=" border-2 border-black border-solid max-w-[650px] rounded-md">
              <Link to={`/profile/${user}`}>
                {userPfp ? (
                  <img className="pfp" src={userPfp}></img>
                ) : (
                  ""(<img src={makeBlockie(user)} className="pfp p-2"></img>)
                )}
              </Link>
              <p>{user}</p>
              <Share orbis={orbis} />
            </div>
            <div className="">
              {/* <h2 className="border-b-2">Posts shared</h2> */}
              <Posts orbis={orbis} className="" />
            </div>
          </>
        ) : (
          <button onClick={() => connect()}>Connect your wallet</button>
        )}
      </div>
    </>
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
        className="w-[80%] rounded-md mr-4"
      />
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

function Posts({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    let { data, error, status } = await orbis.getPosts();

    if (data) {
      console.log(data);
      setPosts(data);
      setLoading(false);
    }
  }

  const shortAddress = (address) => {
    const start = address.substr(0, 4);
    const end = address.substr(address.length - 4, address.length);
    return start + "-" + end;
  };

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length > 0) {
    return posts.map((post, key) => {
      const strings = post.creator_details.did.split(":");
      const FixAddress = strings[strings.length - 1];

      return (
        <div
          key={key}
          className="border-2 border-black border-solid max-w-[650px] my-4 rounded-xl"
        >
          <div className="profile items-center flex-row">
            <div className="flex h-16 border-b-2 border-black">
              {post.creator_details.profile?.pfp ? (
                <Link to={`/profile/${post.creator}`}>
                  <img
                    className="pfp p-2"
                    alt=""
                    src={post.creator_details.profile.pfp}
                  ></img>
                </Link>
              ) : (
                <Link to={`/profile/${post.creator}`}>
                  <div>
                    <img
                      // src=""
                      src={makeBlockie(FixAddress)}
                      className="pfp p-2"
                    ></img>
                  </div>
                </Link>
              )}
              <div className=" flex-row mt-4">
                <Link to={`/profile/${post.creator}`}>
                  <div className="flex">
                    <span className="font-bold mx-2">
                      {post.creator_details.profile
                        ? post.creator_details?.profile?.username
                        : shortAddress(post.creator_details.did.split(":")[4])}
                    </span>
                    <div className="bg-white rounded-full px-4 items-center">
                      {post.creator_details?.metadata?.ensName
                        ? post.creator_details?.metadata?.ensName
                        : shortAddress(post.creator_details.did.split(":")[4])}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center max-h-[100px] h-16 m-4">
            {post.content?.body}
          </div>

          <div className=" bg-white flex place-items-center justify-items-end p-1 max-w-[650px] rounded-b-xl">
            <div className="mx-2">
              <FcLike />
              {/* {post.count_likes} */}
            </div>
            <div className="mx-2">
              <FaLaughSquint />
              {/* {post.count_haha} */}
            </div>
            <div>
              <AiTwotoneDislike className="mx-2" />
              {/* {post.count_downvotes} */}
            </div>
            <div className="mx-2">
              <BsFillReplyFill />
              {/* {post.count_replies} */}
            </div>
          </div>
        </div>
      );
    });
  } else {
    return <p>No posts shared in this context.</p>;
  }
}
