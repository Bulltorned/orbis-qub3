import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Group from "./Group";

function Profile({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [userPosted, setUserPosted] = useState();
  const [groups, setGroups] = useState();
  const { did } = useParams();

  useEffect(() => {
    loadProfile(did);
  }, [did]);

  useEffect(() => {
    console.log(profile);
  }, [profile]);

  useEffect(() => {
    loadGroup(did);
    loadGroup(groups)
  }, [did]);

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  async function loadProfile(did) {
    setLoading(true);
    let { data, error, status } = await orbis.getProfile(did);
    // let { data:_data, _error } = await orbis.getProfileGroups(did);

    if (data) {
      setProfile(data);
      console.log(data);
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

  async function loadGroup() {
    setLoading(true);
    let { data, error } = await orbis.getProfileGroups(did);

    if (data) {
      setGroups(data);
      console.log(groups);
      setLoading(false);
    }
    if (loading) {
      return <p>Loading groups...</p>;
    }

    if (data.length > 0) {
      return data.map((group) => {
        return console.log(group);
      });
    }
  }

  function parseDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toDateString();
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }
  if (profile) {
    return (
      <>
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
