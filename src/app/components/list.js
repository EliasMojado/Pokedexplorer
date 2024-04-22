"use client";
import React, { useState, useEffect } from 'react';
import Card from "./card";
import InfoPane from './infopane';

export default function List({searchFilter, isNumeric, selectedTypes}) {
    const [allPokemonData, setAllPokemonData] = useState([]);
    const [detailedPokemonData, setDetailedPokemonData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isSticky, setIsSticky] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const toggleInfoPane = (pokemon) => {
        setSelectedCard(pokemon)
    };

    const closeInfoPane = () => {
        setSelectedCard(null);
    };

    const setContent = async (id) => {
        if(id < 1 || id > 1025) return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon data');
            }
            const data = await response.json();
            const updatedPokemon = {
                id: data.id,
                name: data.name,
                photo: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(data.id).padStart(3, '0')}.png`,
                types: data.types.map(type => type.type.name),
            };

            setSelectedCard(updatedPokemon);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
        }
    };

    const fetchAllPokemonData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0`);
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon data');
            }
            const data = await response.json();
            const newPokemonData = await Promise.all(data.results.map(async ({ name, url }) => {
                const pokemonResponse = await fetch(url);
                if (!pokemonResponse.ok) {
                    throw new Error('Failed to fetch detailed data for ' + name);
                }
                const pokemonData = await pokemonResponse.json();
                return {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    photo: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(pokemonData.id).padStart(3, '0')}.png`,
                    types: pokemonData.types.map(type => type.type.name),
                };
            }));
            setAllPokemonData(newPokemonData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            setIsLoading(false);
        }
    };

    const initialFetch = async () => {
        setIsLoading(true);
        try {
            // Fetch more data based on the current page number
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // Process the fetched data
            const newPokemonData = await Promise.all(data.results.map(async ({ name, url }) => {
                const pokemonResponse = await fetch(url);
                if (!pokemonResponse.ok) {
                    throw new Error('Failed to fetch detailed data for ' + name);
                }
                const pokemonData = await pokemonResponse.json();
                return {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    photo: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(pokemonData.id).padStart(3, '0')}.png`,
                    types: pokemonData.types.map(type => type.type.name),
                };
            }));;

            setDetailedPokemonData(prevData => [...prevData, ...newPokemonData]); // Merge with existing data
            setIsLoading(false);
            setPage(page + 1); // Increment page number
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    }

    const fetchMoreData = async () => {
        setIsLoading(true);
        try {
            const startIndex = (page - 1) * 10;
            const endIndex = startIndex + 10;
            const newData = allPokemonData.slice(startIndex, endIndex);
            setDetailedPokemonData(prevData => [...prevData, ...newData]); // Merge with existing data
            setIsLoading(false);
            setPage(page + 1); // Increment page number
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        // Apply search filter
        let filteredData = allPokemonData.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchFilter.toLowerCase()) || // Check if name matches
            pokemon.id.toString().includes(searchFilter) // Check if ID matches
        );

        // Apply type filter
        if (selectedTypes.length > 0) {
            const lowercaseSelectedTypes = selectedTypes.map(type => type.toLowerCase());
            filteredData = filteredData.filter(pokemon =>
                // Check if the Pokémon's types exactly match the selected types
                pokemon.types.length === selectedTypes.length &&
                pokemon.types.every(type => lowercaseSelectedTypes.includes(type.toLowerCase()))
            );
        }

        // Apply sorting
        if (isNumeric) {
            // Sort by ID
            filteredData.sort((a, b) => a.id - b.id);
        } else {
            // Sort by name
            filteredData.sort((a, b) => a.name.localeCompare(b.name));
        }

        return filteredData;
    };

    useEffect(() => {
        initialFetch(); 
        fetchAllPokemonData();
    }, []);

    useEffect(() => {
        setDetailedPokemonData([])
        setPage(1);

        if(searchFilter === "" && selectedTypes.length === 0) {
            fetchMoreData();
        }else{
            const filteredData = applyFilters();
            setDetailedPokemonData(filteredData);
        }
    }, [searchFilter, selectedTypes, isNumeric]);

    useEffect(() => {
        let timeoutId;

        if (searchFilter !== "" || selectedTypes.length !== 0) {
            return;
        }

        const handleScroll = () => {
            const loadingDiv = document.getElementById('loading');
            if (!loadingDiv || isLoading) return;

            const { top } = loadingDiv.getBoundingClientRect();

            if (top - window.innerHeight <= 0) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    fetchMoreData();
                }, 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, [isLoading, page]);

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

    return (
        <div>
            {selectedCard && <InfoPane togglePane={closeInfoPane} content={selectedCard} setContent={setContent} />}

            <div className={`flex items-center justify-center w-[100vw] pt-[5vh] pb-[5vh] ${isSticky ? 'pt-[15vh]' : ''}`}>
                <div className="grid grid-cols-5 gap-4 justify-center">
                    {detailedPokemonData.map((pokemon, index) => (
                        <div key={index}>
                            <Card
                                id_number={pokemon.id}
                                name={pokemon.name}
                                photo={pokemon.photo}
                                types={pokemon.types}
                                toggleInfoPane={() => toggleInfoPane(pokemon)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {searchFilter === "" && page <= 102 && (
                <div id="loading" className='flex flex-row justify-center items-center mt-[5vh] h-[5vh] mx-[10vw]'>
                    <div role="status" className='pt-2'>
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
}
