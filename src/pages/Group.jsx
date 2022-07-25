import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";



const Group = ({orbis}) => {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState()
  const {group_id} = useParams();

  useEffect(() => {
    getGroup();
  },[group_id])

  async function getGroup() {
    setLoading(true);
    let { data, error } = await orbis.getGroup(group_id);

    if (data) {
      setGroup(data)
      setLoading(false)
      console.log(data);
    }

  }

  return (
    <div>{group && group.content.name}</div>
  )
}

export default Group