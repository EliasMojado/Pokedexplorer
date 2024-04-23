import { useState, useEffect } from 'react';
import { typeColorsMap } from '../constants';

/**
 * Card component represents a single Pokémon card.
 * @param {Object} props - Component props.
 * @param {number} props.id_number - The ID number of the Pokémon.
 * @param {string} props.name - The name of the Pokémon.
 * @param {string} props.photo - The URL of the Pokémon's photo.
 * @param {string[]} props.types - An array of types associated with the Pokémon.
 * @param {Function} props.toggleInfoPane - Function to toggle the info pane for the card.
 */
export default function Card({ id_number, name, photo, types, toggleInfoPane}) {
    const [isLoading, setIsLoading] = useState(true);

     /**
     * Function to handle image load event and update isLoading state.
     */
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    /**
     * Function to combine colors based on Pokémon types.
     * @param {string[]} types - An array of types associated with the Pokémon.
     * @returns {string} Combined hexadecimal color value.
     */
    const combineColors = (types) => {
        let color1 = "#FFFFFF"; // Default color
        let color2 = "#FFFFFF"; // Default color
    
        if (types && types.length >= 2) {
            color1 = typeColorsMap[types[0].toLowerCase()];
            color2 = typeColorsMap[types[1].toLowerCase()];
        } else if (types && types.length === 1) {
            return typeColorsMap[types[0].toLowerCase()];
        }
    
        return mixColors(color1, color2);
    };

    /**
     * Function to mix two hexadecimal colors and return the average color.
     * @param {string} color1 - The first hexadecimal color value.
     * @param {string} color2 - The second hexadecimal color value.
     * @returns {string} Average hexadecimal color value.
     */
    const mixColors = (color1, color2) => {
        // Convert hex colors to RGB components
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
    
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
    
        // Calculate average RGB components
        const avgR = Math.round((r1 + r2) / 2);
        const avgG = Math.round((g1 + g2) / 2);
        const avgB = Math.round((b1 + b2) / 2);
    
        // Convert average RGB values back to hexadecimal
        const avgColor = `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
        
        return avgColor;
    };

    useEffect(() => {
        // Combine colors based on types and update the background color of the type div.
        const bgColor = combineColors(types);
        const typeDiv = document.getElementById(`type-${id_number}`);
        if (typeDiv) {
            typeDiv.style.backgroundColor = bgColor;
        }
    }, [types]);    

    return (
        <div className={`relative flex flex-col items-center w-[15vw] h-[43vh] bg-[#EEF2F3] rounded-xl transition duration-300 ease-in-out transform hover:shadow-lg hover:border-2 hover:border-gray-400`} onClick={() => toggleInfoPane()}>
            <h1 className="text-2xl text-[#B2B2B2]">
                #{String(id_number).padStart(3, '0')}
            </h1>

            <h1 className="text-3xl">
                {name.toUpperCase()}
            </h1>

            <div id = {`type-${id_number}`} className="w-[15vw] h-[23vh] relative mb-[5vh]">
                {isLoading && (
                    <div role="status" className='pt-[5vh] flex items-center justify-center'>
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                )}
                
                <img 
                    src={photo} 
                    alt={name} 
                    className={`absolute top-[-3vh] left-0 ${isLoading ? 'hidden' : ''} transition duration-300 ease-in-out transform hover:scale-110`}
                    onLoad={handleImageLoad} 
                /> 
            </div>
            
            <p>{types.join(', ')}</p>
        </div>
    );
}
