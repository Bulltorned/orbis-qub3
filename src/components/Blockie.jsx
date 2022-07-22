import React from 'react'
import {useRef, useEffect} from "react"
import blockies from "ethereum-blockies";

function Blockie({ seed }) {
    const iconWrapper = useRef(null)

    useEffect(() => {
        var icon = blockies.create({
            seed,
            size: 8,
            scale: 8,
        })
        iconWrapper.current.innerHTML = ""
        iconWrapper.current.appendChild(icon)
    },[])


    return (
        <div ref={iconWrapper}/>
    )
}
export default Blockie