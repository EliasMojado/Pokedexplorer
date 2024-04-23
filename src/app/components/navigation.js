"use client";

import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import SortPane from './sortpane';

const typeColorsMap = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD"
};

export default function Navigation({setSearchFilter, setSortType, setTypes}) {
    const [isSticky, setIsSticky] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isSortPaneOpen, setIsSortPaneOpen] = useState(false); 
    const [isNumeric, setIsNumeric] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            const header = document.getElementById('HEADER');
            if (!header) {
                console.error('Header element not found');
                return;
            }
            const headerHeight = header.offsetHeight;
    
            const scrollPosition = window.scrollY;
            if (scrollPosition >= headerHeight) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setTypes(selectedTypes);
    }, [selectedTypes]);

    useEffect(() => {
        setSortType(isNumeric);
    }, [isNumeric]);

    const toggleSortPane = () => {
        setIsSortPaneOpen(!isSortPaneOpen);
    };

    const removeType = (typeToRemove) => {
        setSelectedTypes(selectedTypes.filter(type => type !== typeToRemove));
    };    

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setSearchFilter(event.target.value);
    };

    const clearInput = () => {
        setInputValue('');
        setSearchFilter('');
    };

    return (
        <div id="navigation-container" className={`${isSticky ? 'bg-white fixed top-0 w-[100vw] z-50' : ''}`}>

            {isSortPaneOpen && (
                <SortPane
                    togglePane={toggleSortPane}
                    isNumeric={isNumeric}
                    toggleIsNumeric={setIsNumeric}
                    Types={selectedTypes}
                    setTypes={setSelectedTypes}
                />
            )}

            <div className="flex items-center justify-between h-[10vh] ml-[10vw] mr-[10vw] border-[#333333] border-b-2 py-[2vh]">
                <button className="flex items-center px-3 py-2 ml-2 border border-gray-300 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none" onClick={toggleSortPane}>
                    <HiOutlineFilter size={20}/>
                </button>

                <div id="filter_container" className="flex items-center w-[50vw]">
                    {selectedTypes.map((type, index) => (
                        <div key={index} className="flex justify-center items-center px-5 py-2 rounded-full mr-2" style={{ backgroundColor: typeColorsMap[type.toLowerCase()], color: 'white' }}>
                            <span className='text-xl px-2'>{type}</span>
                            <button className="px-2 py-2 text-white" onClick={() => removeType(type)}>x</button>
                        </div>
                    ))}
                </div>

                
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="px-4 py-2 border w-[20vw] border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <button
                        className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md hover:bg-gray-200 focus:outline-none"
                        onClick={clearInput}
                    >
                        <HiX size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
