import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Group from "./Group";
import { Link } from "react-router-dom";

function Profile({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [userPosted, setUserPosted] = useState();
  const [userGroups, setUserGroups] = useState();
  const { did } = useParams();

  useEffect(() => {
    loadProfile(did);
    loadUserGroup(userGroups);
  }, [did]);

  async function loadProfile(did) {
    setLoading(true);
    let { data, error, status } = await orbis.getProfile(did);

    if (data) {
      setProfile(data);
      loadUserPost(data.did);
      setLoading(false);
    }
    // if (_data) {
    //   console.log(_data)
    //   setLoading(false)
    // }
  }

  async function loadUserPost(did) {
    setLoading(true);
    let { data, error } = await orbis.getPosts({ did });
    // console.log(res)

    if (data) {
      setUserPosted(data);
      setLoading(false);
    }
  }

  async function loadUserGroup() {
    setLoading(true);
    let { data, error } = await orbis.getProfileGroups(did);

    if (data) {
      setUserGroups(data);
      setLoading(false);
    }
    if (loading) {
      return <p>Loading groups...</p>;
    }
  }

  function parseDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toDateString();
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (profile && userGroups) {
    return (
      <div className="flex relative w-full">
        <div className="profile-card border h-[50vh] w-full max-w-[300px] m-2 mr-5 fixed">
          {console.log(profile)}
          <img className="pfp" src={profile.details?.profile?.pfp}></img>
          <div>{profile.details.profile?.username}</div>
          <div>
            {profile.details.metadata?.ensName
              ? profile.details.metadata?.ensName
              : profile.details.metadata?.address}
          </div>
          <div>{profile.details.profile?.description}</div>
          <div className="flex">
            <div className="">
              <div className="font-bold">Followers</div>
              <div>{profile.count_followers} </div>
            </div>
            <div>
              <div className="font-bold">Following</div>
              <div>{profile.count_following} </div>
            </div>
          </div>
          <button className="border bg-white rounded-md border-black p-2">Update Profile</button>
        </div>
        <div className="ml-[340px] m-2 w-[80vw] border">
          {userPosted && userPosted.length ? (
            userPosted.map((item, index) => (
              <div key={index}>
                <div>{item.content.body}</div>
                <div>{parseDate(item.timestamp)}</div>
              </div>
            ))
          ) : (
            <p>No posts shared in this context.</p>
          )}
        </div>
      </div>
    );
  } else {
    return <p>No posts shared in this context.</p>;
  }
}
export default Profile;
