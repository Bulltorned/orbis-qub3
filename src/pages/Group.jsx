import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Group({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState();
  const { did } = useParams();

  useEffect(() => {
    loadGroup(did);
  }, [did]);

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  async function loadGroup() {
    setLoading(true);
    let { data, error } = await orbis.getProfileGroups(did);

    if (data) {
      setGroups(data);
      console.log(data);
      setLoading(false);
    }
    if (loading) {
      return <p>Loading groups...</p>;
    }

    // if (groups.length > 0) {
    //   return groups.map((group) => {
    //     return <div>{group.group_detail.name}</div>;
    //   });
    // }
  }
}
export default Group;
