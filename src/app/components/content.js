"use client";

import React, { useState, useEffect } from 'react';
import Navigation from "./navigation";
import List from "./list";

export default function Content() {
    const [searchFilter, setSearchFilter] = useState("");

    useEffect(() =>{
        
        
    }, [searchFilter]);

    return (
        <div>
            <Navigation setSearchFilter={setSearchFilter}/>
            <List searchFilter={searchFilter}/>
        </div>
    )
}