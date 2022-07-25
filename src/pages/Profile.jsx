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
    console.log(userGroups);
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
      console.log(data);
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
      <>
        <div>
          {userGroups && userGroups.length ? (
            userGroups.map((item, index) => (
              <div key={index}>
                group successfully loaded
                {/* <div>{parseDate(item.timestamp)}</div> */}
              </div>
            ))
          ) : (
            <p>No Group Joined by this user.</p>
          )}
        </div>
        <div>{profile.did}</div>
        <img className="pfp" src={profile.details?.profile?.pfp}></img>
        <div>
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
      </>
    );
  } else {
    return <p>No posts shared in this context.</p>;
  }
}
export default Profile;
