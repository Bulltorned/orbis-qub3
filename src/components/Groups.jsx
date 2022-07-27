import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Groups.css";

const Group = ({ orbis }) => {
  const [loading, setLoading] = useState(false);
  const [userGroups, setUserGroups] = useState();
  const { did } = useParams();
  const defaultImg = 'https://data.lahatkab.go.id/sites/default/files/styles/group_medium/public/group.png?itok=C9137V0E'

  useEffect(() => {
    loadGroup();
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
  if (loading) {
    return <p>...</p>;
  }

  return (
    <div className="border-solid ">
      {userGroups && userGroups.length ? (
        userGroups.map((item, index) => (
          
            <Link key={index} to={`group/${item.group_id}`} className="p-4 place-items-center">
              {item.group_details.pfp ? (
                <img alt="" src={item.group_details.pfp} className="rounded-full max-h-10 place-items-center"></img>
              ) : (
                <img className="rounded-full max-h-10" src={defaultImg}></img>
              )}
              
            </Link>
          
        ))
      ) : (
        <p>No Group Joined by this user.</p>
      )}
    </div>
  );
};

export default Group;
