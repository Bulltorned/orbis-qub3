import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const Group = ({ orbis }) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState();
  const { group_id } = useParams();

  useEffect(() => {
    getGroup();
  }, [group_id]);

  
  async function getGroup() {
    setLoading(true);
    let { data, error } = await orbis.getGroup(group_id);

    if (data) {
      setGroup(data);
      setLoading(false);
    }
  }
  if (loading) {
    return <p>Loading... </p>;
  }

  return (
    <div>
      {console.log(group)}
      <div className="flex flex-cols items-center">
        <img className="rounded-full w-10 h-10" src={group?.content?.pfp}></img>
        <div>{group && group.content.name}</div>
        <div>
          {group && group.channels ? (
            group.channels.map((items, index) => (
              <>
                <Link key={index} to={`channel/${items.stream_id}`}>
                  <div>{items.content.name}</div>
                </Link>
                {/* <div>{items.stream_id}</div> */}
              </>
            ))
          ) : (
            <p>there is no channel</p>
          )}
        </div>
        <div></div>
      </div>
      <div></div>
    </div>
  );
};

export default Group;
