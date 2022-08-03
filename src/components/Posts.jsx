import React, { useState, useEffect } from "react";
import { Orbis } from "@orbisclub/orbis-sdk";
import { Link } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import { FcLike } from "react-icons/fc";
import { AiTwotoneDislike } from "react-icons/ai";
import { FaLaughSquint } from "react-icons/fa";
import { BsFillReplyFill } from "react-icons/bs";

export default function Posts({ orbis }) {
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
            className="border-2 border-black border-solid max-w-[650px] my-4 rounded-xl h-full"
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
  