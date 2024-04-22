"use client";

import React, { useState, useEffect } from 'react';
import Navigation from "./navigation";
import List from "./list";

export default function Content() {
    const [searchFilter, setSearchFilter] = useState("");
    const [isNumeric, setIsNumeric] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState([]);



    useEffect(() =>{
        
        
    }, [searchFilter]);

    return (
        <div>
            <Navigation setSearchFilter={setSearchFilter} setSortType={setIsNumeric} setTypes={setSelectedTypes}/> 
            <List searchFilter={searchFilter} isNumeric={isNumeric} selectedTypes={selectedTypes}/>
        </div>
    )
}