import { useState, useEffect } from 'react';
import { typeColorsMap, strengthsArray, resistanceArray, weaknessesArray } from '../constants';
import Image from 'next/image';

// Maybe I should have exported this function so i can reuse it
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

/**
 * Component representing a bar for displaying a statistical value.
 * @param {Object} props - The properties passed to the StatBar component.
 * @param {number} props.value - The current value of the statistic.
 * @param {number} props.max - The maximum value of the statistic.
 * @param {string} props.color - The color of the bar representing the statistic.
 * @returns {JSX.Element} The JSX element representing the StatBar component.
 */
const StatBar = ({ value, max, color }) => {
    const percentage = (value / max) * 100;

    return (
        <div className="flex flex-row bar-container" style={{ width: '400px',backgroundColor: '#D9D9D9', height: '100%', overflow: 'hidden'}}>
            <div className="" style={{ width: `${percentage}%`, backgroundColor: color, borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }}></div>
            <div className="px-2 bg-white">{value}</div>
        </div>
    );
};

/**
 * Retrieves the weaknesses of a Pokémon based on its types.
 * @param {string[]} types - An array containing the types of the Pokémon.
 * @returns {string[]} An array containing the weaknesses of the Pokémon.
 */
function getWeaknesses(types) {
    const weaknesses = types.flatMap(type => weaknessesArray[type.toLowerCase()] || []);
    const resistance = types.flatMap(type => resistanceArray[type.toLowerCase()] || []);

    // Subtract resistance from weaknesses
    const result = weaknesses.filter(type => !resistance.includes(type));

    return Array.from(new Set(result));
}

/**
 * Retrieves the strengths of a Pokémon based on its types.
 * @param {string[]} types - An array containing the types of the Pokémon.
 * @returns {string[]} An array containing the strengths of the Pokémon.
 */
function getStrengths(types) {
    const strengths = types.flatMap(type => strengthsArray[type.toLowerCase()] || []);
    return Array.from(new Set(strengths));
}


/**
 * Retrieves the image source for a given Pokémon type.
 * @param {string} type - The type of the Pokémon.
 * @returns {string} The image source for the Pokémon type.
 */
function getTypeImageSrc(type) {
    switch (type) {
        case 'normal':
            return '/0-Normal.png';
        case 'fire':
            return '/1-Fire.png';
        case 'water':
            return '/2-Water.png';
        case 'grass':
            return '/3-Grass.png';
        case 'electric':
            return '/4-Electric.png';
        case 'ice':
            return '/5-Ice.png';
        case 'poison':
            return '/A-Poison.png';
        case 'ground':
            return '/B-Ground.png';
        case 'flying':
            return '/C-Flying.png';
        case 'fighting':
            return '/D-Fighting.png';
        case 'psychic':
            return '/E-Psychic.png';
        case 'dark':
            return '/F-Dark.png';
        case 'bug':
            return '/I-Bug.png';
        case 'rock':
            return '/II-Rock.png';
        case 'ghost':
            return '/III-Ghost.png';
        case 'steel':
            return '/IV-Steel.png';
        case 'dragon':
            return '/V-Dragon.png';
        case 'fairy':
            return '/VI-Fairy.png';
        default:
            return '/0-Normal.png'; 
    }
}

/**
 * Component for displaying detailed information about a Pokémon.
 * Renders information such as name, types, description, stats, weaknesses, and strengths.
 * @param {Object} props - The properties passed to the InfoPane component.
 * @param {function} props.togglePane - Function to toggle the visibility of the InfoPane.
 * @param {Object} props.content - The content (Pokémon data) to display in the InfoPane.
 * @param {function} props.setContent - Function to set the content (Pokémon data) to display in the InfoPane.
 * @returns {JSX.Element} The JSX element representing the InfoPane component.
 */
export default function InfoPane({ togglePane, content, setContent}) {
    const [isOpen, setIsOpen] = useState(true);
    const [themeColor, setThemeColor] = useState("#FFFFFF");
    const [description, setDescription] = useState('');
    const [stats, setStats] = useState(null);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(true);
    const [IsStatsLoading, setIsStatsLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [weaknesses, setWeaknesses] = useState([]);
    const [strengths, setStrengths] = useState([]);

    /**
     * Handler for image load event.
     * Sets isLoading state to false.
     */
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    /**
     * Closes the InfoPane.
     */
    const closePane = () => {
        setIsOpen(false);
        togglePane();
    };

    /**
     * Navigates to the next or previous Pokémon.
     * @param {boolean} isNext - Indicates whether to navigate to the next Pokémon (true) or previous Pokémon (false).
     */
    const navigatePokemon = async (isNext) => {
        const currentId = content.id;
        const nextId = isNext ? currentId + 1 : currentId - 1;
        setContent(nextId);
    };


    /**
     * Fetches description of the Pokémon.
     * https://pokeapi.co/api/v2/pokemon-species/${content.id}
     */
    const fetchDescription = async () => {
        try {
            setIsDescriptionLoading(true);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${content.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch description');
            }
            const data = await response.json();
            const englishTexts = data.flavor_text_entries.filter(entry => entry.language.name === 'en');
            if (englishTexts.length > 0) {
                const longestEnglishText = englishTexts.reduce((longest, current) => {
                    return current.flavor_text.length > longest.flavor_text.length ? current : longest;
                }, englishTexts[0]);
                const cleanedText = longestEnglishText.flavor_text.replace(/[\n\f]/g, ' ');
                setDescription(cleanedText);
            } else {
                setDescription('Description not available');
            }
        } catch (error) {
            console.error('Error fetching description:', error);
        } finally {
            setIsDescriptionLoading(false);
        }
    };
    
     /**
     * Fetches stats of the Pokémon.
     * https://pokeapi.co/api/v2/pokemon/${content.id}
     */
    const fetchStats = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${content.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            const data = await response.json();
            const stats = {
                health: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                specialAttack: data.stats[3].base_stat,
                specialDefense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat,
                weight: data.weight,
                height: data.height
            };
            setStats(stats);
            setIsStatsLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setIsStatsLoading(false);
        }
    };

    useEffect(() => {
        const bgColor = combineColors(content.types);
        setThemeColor(bgColor);
        const typeDiv = document.getElementById(`background_pane`);
        if (typeDiv) {
            typeDiv.style.backgroundColor = bgColor;
        }

        setWeaknesses(getWeaknesses(content.types));
        setStrengths(getStrengths(content.types));
        fetchDescription();
        fetchStats();
    }, [content]);

    return (
        <>
            {isOpen && (
                <>
                    <div className="info-pane-overlay fixed inset-0 bg-black opacity-50 z-50" onClick={closePane}></div>
                    <div className="info-pane fixed top-0 right-0 z-[100] h-full w-full max-w-[600px] bg-[#EEF2F3] transition-transform duration-300 ease-in-out transform translate-x-0 overflow-auto">
                        <div className='flex flex-row justify-between py-10 px-5 h-[5vh] items-center'>
                            <h1 className='text-4xl text-[#b2b2b2]'>#{String(content.id).padStart(3, '0')}</h1>
                            <Image
                                src='/close.svg'
                                width={100}
                                height={100}
                                className='h-[3vh] w-[3vh]'
                                onClick={closePane}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>

                        <div id="background_pane" className="w-full h-[25vh] relative flex items-center justify-center relative ">
                            <Image
                                src='/back.svg'
                                width={100}
                                height={100}
                                className='h-[4vw] w-[4vw] z-50 absolute left-[2vw]'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigatePokemon(false)}
                            />

                            <Image
                                src='/next.svg'
                                width={100}
                                height={100}
                                className='h-[4vw] w-[4vw] z-50 absolute right-[2vw]'
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigatePokemon(true)}
                            />

                            <img
                                src={content.photo}
                                alt={content.name}
                                className={`absolute top-[-5vh] z-10 ${isLoading ? 'hidden' : ''} h-[35vh] transition duration-300 ease-in-out transform hover:scale-110`}
                                onLoad={handleImageLoad}
                            />

                            <img
                                src={content.photo}
                                alt={content.name}
                                className={`absolute top-[-4vh] pl-5 ${isLoading ? 'hidden' : ''} h-[35vh]`}
                                style={{
                                    WebkitFilter: 'grayscale(100%) brightness(0)',
                                    filter: 'grayscale(100%) brightness(0)',
                                    opacity: 0.6
                                }}
                            />
                        </div>

                        <div className="h-[5vh] mt-[2vh] flex flex-row justify-between px-5">
                            <h1 className="text-5xl text-[#333333] font-bold mb-2">{content.name.toUpperCase()}</h1>

                            <div className="flex items-center">
                                {content.types.map((type, index) => {
                                    const typeImageSrc = getTypeImageSrc(type);
                                    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                                    return (
                                        <div key={index} className="relative">
                                            <img
                                                src={typeImageSrc}
                                                alt={type}
                                                className="w-10 h-10 mx-1"
                                            />
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-s px-1 py-0.5 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none">
                                                {capitalizedType}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='px-5 py-5'>

                            {/* DESCRIPTION */}
                            {isDescriptionLoading ? (
                                <p className="animate-pulse">Loading Pokemon&apos;s Description...</p>

                            ) : (
                                <p>{description}</p>
                            )}

                            {/* STATS */}
                            <div className="flex flex-col">
                                {IsStatsLoading ? (
                                    <div className="flex flex-col animate-pulse">
                                        {[{ label: 'Height', value: 0, max: 200 }, { label: 'Weight', value: 0, max: 10000 }, { label: 'Health', value: 0, max: 300 }, { label: 'Attack', value: 0, max: 200 }, { label: 'Defense', value: 0, max: 300 }, { label: 'Special Attack', value: 0, max: 200 }, { label: 'Special Defense', value: 0, max: 300 }, { label: 'Speed', value: 0, max: 200 }].map((stat, index) => (
                                            <div key={index} className='flex flex-row mt-[2vh] justify-between'>
                                                <p>{stat.label}: </p>
                                                <StatBar value={stat.value} max={stat.max} color={themeColor} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {stats && (
                                            <>
                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Height: </p>
                                                    <StatBar value={stats.height} max={200} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Weight: </p>
                                                    <StatBar value={stats.weight} max={10000} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Health: </p>
                                                    <StatBar value={stats.health} max={300} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Attack: </p>
                                                    <StatBar value={stats.attack} max={200} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Defense: </p>
                                                    <StatBar value={stats.defense} max={300} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Special Attack: </p>
                                                    <StatBar value={stats.specialAttack} max={200} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Special Defense: </p>
                                                    <StatBar value={stats.specialDefense} max={300} color={themeColor} />
                                                </div>

                                                <div className='flex flex-row mt-[2vh] justify-between'>
                                                    <p>Speed: </p>
                                                    <StatBar value={stats.speed} max={200} color={themeColor} />
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            
                            {/* WEAKNESSES */}
                            <h1 className='text-3xl text-[#333333] mt-[5vh]'>WEAKNESSES</h1>
                            <div className="flex items-center">
                                {weaknesses.map((weakness, index) => {
                                    const capitalizedWeakness = weakness.charAt(0).toUpperCase() + weakness.slice(1);
                                    const weaknessImageSrc = getTypeImageSrc(weakness);
                                    return (
                                        <div key={index} className="relative">
                                            <img
                                                src={weaknessImageSrc}
                                                alt={weakness}
                                                className="w-10 h-10 mx-1"
                                            />
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-s px-1 py-0.5 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none">
                                                {capitalizedWeakness}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* STRENGTHS */}
                            <h1 className='text-3xl text-[#333333] mt-[5vh]'>STRENGTHS</h1>
                            <div className="flex items-center">
                                {strengths.map((strength, index) => {
                                    const capitalizedStrength = strength.charAt(0).toUpperCase() + strength.slice(1);
                                    const strengthImageSrc = getTypeImageSrc(strength); 
                                    return (
                                        <div key={index} className="relative">
                                            <img
                                                src={strengthImageSrc}
                                                alt={strength}
                                                className="w-10 h-10 mx-1"
                                            />
                                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-s px-1 py-0.5 rounded-md opacity-0 transition-opacity duration-300 pointer-events-none">
                                                {capitalizedStrength}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    );
}
