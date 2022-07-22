import React, { useState, useEffect } from "react";
import { Orbis } from "@orbisclub/orbis-sdk";
import "./Home.css";
import { Link } from "react-router-dom";
import Blockie from "../components/Blockie";
import { FcLike } from "react-icons/fc";
import { AiTwotoneLike } from "react-icons/ai";

let orbis = new Orbis();

export default function Home() {
  const [user, setUser] = useState();
  const [userPfp, setUserPfp] = useState();


  async function connect() {
    let res = await orbis.connect();
    let _res = await orbis.isConnected();
    

    if (res.status == 200) {
      setUser(res.did);
      setUserPfp(_res.details.profile.pfp);

    } else {
      console.log("Error connecting to Ceramic: ", res);
      alert("Error connecting to Ceramic.");
    }
  }

  return (
    <>
      <div>
        {user ? (
          <>
            <div className="menu">
              <Link to="/">
                <div className="menuItem">Home</div>
              </Link>
              <div>
                <Link to={`/profile/${user}`}>Profile</Link>
              </div>
              <div>
                <Link to="/group">Group</Link>
              </div>
            </div>
            <div className="userProfile">
              <Link to={`/profile/${user}`}>
                { userPfp ? 
                <img className="pfp" src={userPfp}></img>
                : <Blockie seed={user} />}
              </Link>
              <p>Connected with: {user}</p>
            </div>
            <Share orbis={orbis} />
            <div className="posts">
              <h2>Posts shared</h2>
              <Posts orbis={orbis} />
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
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your post here..."
      />
      {loading ? (
        <button>Loading...</button>
      ) : (
        <button onClick={() => share()}>Share</button>
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
      return (
        <div key={key}>
          <div className="profile">
            
            {post.creator_details.profile?.pfp ? (
                <Link to={`/profile/${post.creator}`}>
              <img
                className="pfp"
                alt=""
                src={post.creator_details.profile.pfp}
              ></img>
              </Link>
              
            ) : (
                <Link to={`/profile/${post.creator}`}>
              <div className="pfp">
                <Blockie seed={post.creator_details?.metadata?.address} />
              </div>
              </Link>
            )}
            <Link to={`/profile/${post.creator}`}>
              <span>
                {post.creator_details.profile
                  ? post.creator_details?.profile?.username
                  : shortAddress(post.creator_details.did.split(":")[4])}
              </span>
            <div>
              {post.creator_details?.metadata?.ensName
                ? post.creator_details?.metadata?.ensName
                : shortAddress(post.creator_details.did.split(":")[4])}
            </div>
            </Link>
          </div>
          <p>{post.content?.body}</p>
          <div className="flex-container">
            <b>
              <FcLike />
              {post.count_likes}
            </b>
            <b>HAHA{post.count_haha}</b>
            <b>
              <AiTwotoneLike />
              {post.count_downvotes}
            </b>
            <b>Replies{post.count_replies}</b>
          </div>
        </div>
      );
    });
  } else {
    return <p>No posts shared in this context.</p>;
  }
}
