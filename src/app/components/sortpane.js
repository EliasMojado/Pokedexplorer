import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Component for rendering a sorting and filtering pane.
 * @param {Object} props - The properties passed to the SortPane component.
 * @param {Function} props.togglePane - Function to toggle the visibility of the pane.
 * @param {boolean} props.isNumeric - Boolean indicating whether the sorting is already numeric (by ID) or alphabetical (by name).
 * @param {Function} props.toggleIsNumeric - Function to toggle the sorting type between numeric and alphabetical.
 * @param {Array} props.Types - Array containing the already selected Pokémon types.
 * @param {Function} props.setTypes - Function to set the selected Pokémon types.
 * @returns {JSX.Element} The JSX element representing the SortPane component.
 */
export default function SortPane({ togglePane, isNumeric, toggleIsNumeric, Types, setTypes }) {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortByID, setSelectedSort] = useState(isNumeric);
    const [errorMessage, setErrorMessage] = useState("");
    
    // Function to close the pane
    const closePane = () => {
        togglePane();
    };

    // Function to handle click on a Pokémon type
    const handleTypeClick = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((selectedType) => selectedType !== type));
        } else if (selectedTypes.length < 2) {
            setSelectedTypes([...selectedTypes, type]);
        }else {
            setErrorMessage("Pokemons can only have up to two types.");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000); // Hide error message after 3 seconds
        }
    };

    // Function to check if a type is selected
    const isTypeSelected = (type) => {
        return selectedTypes.includes(type);
    };

    // Function to handle changing the sorting option
    const handleOptionChange = () => {
        setSelectedSort(!sortByID); // Update the selected sorting option
    };

    // Function to apply the selected changes
    const applyChanges = () => {
        toggleIsNumeric(sortByID);
        setTypes(selectedTypes); // Update the types

        togglePane();
    };
    
    // Effect to initialize the selected types when Types prop changes
    useEffect(() => {
        setSelectedTypes([...Types.flat().slice(0, 2)]); // Only select the first 2 types
    }, [Types]);

    return (
        <>
            <div className="info-pane-overlay fixed inset-0 bg-black opacity-50 z-50" onClick={closePane}></div>
            <div className="info-pane fixed px-[2vw] top-0 left-0 z-[100] h-full w-full max-w-[450px] bg-[#EEF2F3] transition-transform duration-300 ease-in-out transform translate-x-0 overflow-auto">
                <div className='flex flex-row py-10 h-[5vh] items-center justify-end'>
                    <button onClick={closePane} className='h-[3vh] w-[3vh] cursor-pointer'>
                        <Image
                            src='/close.svg'
                            width={100}
                            height={100}
                            className='h-[3vh] w-[3vh]'
                            style={{ cursor: 'pointer' }}
                        />
                    </button>
                </div>

                <p className='text-2xl font-bold'>SORT</p>

               <div className="flex flex-col space-y-2 my-[2vh] pb-4 pl-4 border-b-2 border-[#333333]">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="sortingOption" value="name" checked={!sortByID} onChange={handleOptionChange} className="form-radio" />
                        <p className="text-lg">Name</p>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="sortingOption" value="id" checked={sortByID} onChange={handleOptionChange} className="form-radio" />
                        <p className="text-lg">ID Number</p>
                    </label>
                </div>

                <p className='text-2xl font-bold'>TYPES</p>

                <div className="flex flex-col items-center space-y-2 my-[2vh] pb-4 pl-4 ">
                    {[['Normal', 'Fighting'], ['Flying', 'Poison'], ['Ground', 'Rock'], ['Bug', 'Ghost'], ['Steel', 'Fire'], ['Water', 'Grass'], ['Electric', 'Psychic'], ['Ice', 'Dragon'], ['Dark', 'Fairy']].map((row, rowIndex) => (
                        <div key={rowIndex} className='flex flex-row space-x-2'>
                            {row.map((type, index) => (
                                <button
                                    key={index}
                                    className={`w-[10vw] py-2 rounded-full ${isTypeSelected(type) ? 'bg-red-500 text-white' : 'bg-[#D9D9D9] text-black'}`}
                                    onClick={() => handleTypeClick(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <button className='w-full bg-[#ED263A] py-4 mt-4 rounded-full' onClick={applyChanges}>Apply</button>

                {errorMessage && (
                    <div className="pt-5 text-xl text-red-500">{errorMessage}</div>
                )}

            </div>
        </>
    );
};
