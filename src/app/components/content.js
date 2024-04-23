"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "./navigation";
import List from "./list";

/**
 * Content component acts as a bridge between the navigation controls and the list of items.
 * It manages the state of search filters, sorting preferences, and selected types.
 * @returns {JSX.Element} The JSX element representing the Content component.
 */
export default function Content() {
    // State variables to manage search filter, sort type, and selected types
    const [searchFilter, setSearchFilter] = useState("");
    const [isNumeric, setIsNumeric] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState([]);

    return (
        <div>
            {/* Navigation component for filtering and sorting */}
            <Navigation 
                setSearchFilter={setSearchFilter} 
                setSortType={setIsNumeric} 
                setTypes={setSelectedTypes}
            /> 
            {/* List component to display pokemons based on filters */}
            <List 
                searchFilter={searchFilter} 
                isNumeric={isNumeric} 
                selectedTypes={selectedTypes}
            />
        </div>
    )
}