import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Blockie from "../components/Blockie";

const GroupChannel = ({ orbis }) => {
  const [loading, setLoading] = useState(false);
  const [channel, setChannel] = useState();
  const [channelPost, setChannelPost] = useState();
  const [channelId, setChannelId] = useState();
  let { group_id, channel_id = false } = useParams();

  useEffect(() => {
    getChannel();
    getChannelPosts();
    console.log(channel_id);
  }, [channel_id]);

  async function getChannel() {
    setLoading(true);
    let { data, error } = await orbis.getChannel(channel_id);

    if (data) {
      setChannel(data);
      setChannelId(data.stream_id);
      setLoading(false);
    }
  }

  async function getChannelPosts() {
    setLoading(true);
    let { data, error } = await orbis.getPosts({context: channel_id });

    if (data) {
      setChannelPost(data);
      console.log(data);
    }
  }

  if (loading) {
    return <p>Loading... </p>;
  }

  return (
    <div>
      <div>
        {channelPost && channelPost.length ? (
          channelPost.map((items, index) => (
            <>
            {items.creator_details.profile?.pfp ? (
                <Link to={`/profile/${items.creator}`}>
              <img
                className="pfp"
                alt=""
                src={items.creator_details.profile.pfp}
              ></img>
              </Link>
              
            ) : (
                <Link to={`/profile/${items.creator}`}>
              <div className="pfp">
                <Blockie seed={items.creator_details?.metadata?.address} />
              </div>
              </Link>
            )}
              <div key={index} className="border-b-2 border-black border-solid">
                <div>{items.creator_details.profile?.username}</div>
                <div> {items.content.body} </div>
              </div>
            </>
          ))
        ) : (
          <p>No posts shared in this channel. </p>
        )}
      </div>
    </div>
  );
};

export default GroupChannel;
