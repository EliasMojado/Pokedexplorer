"use client";

import { HiOutlineFilter, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { typeColorsMap } from '../constants';
import SortPane from './sortpane';

/**
 * Component for rendering the navigation bar with search, filter, and sort functionalities.
 * @param {Object} props - The properties passed to the Navigation component.
 * @param {Function} props.setSearchFilter - Function to set the search filter.
 * @param {Function} props.setSortType - Function to set the sorting type (numeric or alphabetical).
 * @param {Function} props.setTypes - Function to set the selected Pokémon types for filtering.
 * @returns {JSX.Element} The JSX element representing the Navigation component.
 */
export default function Navigation({setSearchFilter, setSortType, setTypes}) {
    const [isSticky, setIsSticky] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isSortPaneOpen, setIsSortPaneOpen] = useState(false); 
    const [isNumeric, setIsNumeric] = useState(true);
    const [selectedTypes, setSelectedTypes] = useState([]);

    // Effect to handle sticky behavior of the navigation bar
    // The navigation bar goes sticky when the header is out of sight.
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

    // Effect to update the selected types when they change
    useEffect(() => {
        setTypes(selectedTypes);
    }, [selectedTypes]);

    // Effect to update the sorting type when it changes
    useEffect(() => {
        setSortType(isNumeric);
    }, [isNumeric]);

    // Function to toggle the sort pane
    const toggleSortPane = () => {
        setIsSortPaneOpen(!isSortPaneOpen);
    };

    // Function to remove a selected type from the filter
    const removeType = (typeToRemove) => {
        setSelectedTypes(selectedTypes.filter(type => type !== typeToRemove));
    };

    // Function to handle input change in the search input field
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        setSearchFilter(event.target.value);
    };

    // Function to clear the search input field
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
