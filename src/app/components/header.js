"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header(){
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div id = "HEADER" className=" h-[50vh] bg-gradient-to-l from-[#F7D933] to-[#F8E580] relative overflow-hidden">
            <Image 
                src="/about_ball.svg" 
                alt="pokeball" 
                width={100} 
                height={100}
                className={`absolute top-1/2 w-[15vw] z-50 transition-left duration-1000 ease-in-out ${animate ? 'left-[25vw] rotate-0' : 'left-[75vw] rotate-180'} transform -translate-x-1/2 -translate-y-1/2`}
            />

            <Image 
                src="/Doodle.svg"
                width={100}
                height={100}
                className="absolute top-0 right-0 z-0 pr-[5vw] h-[50vh] w-[60vw]"
            />

            <Image
                src = "/shadow.svg"
                width={100}
                height={100}
                className="w-[20vw] absolute top-[38vh] left-[19vw] z-10 pr-[5vw]"
            />

            <div className={`absolute z-20 top-0 h-full w-[100vw] 
                ${animate ? 'bg-[#F8E580] transition-left duration-1000 ease-in-out left-[-100vw]' : 'bg-[#F7D933] transition-left duration-1000 ease-in-out left-[0vw]'}`} />

            <div className="absolute z-10 flex flex-col pl-[35vw] justify-center h-full">
            <div className="flex flex-row items-center pb-[5vh]">
                <h1 className="lalezar text-4xl font-bold text-[#333333] pr-[2vw]">Pokédexplorer</h1>
                <a href="https://github.com/EliasMojado/Pokedexplorer" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                    <Image src="/GitHub.svg" width={100} height={100} alt="github logo" className="h-[3rem]" />
                </a>
            </div>

                <p className="inter text-[#333333] w-[40vw]">A simple but complete Pokémon catalog online. Learn about each Pokémon species' traits and abilities. PokedExplorer is your Pokémon resource for beginners and experts.</p>
            </div>
            
        </div>
    )
}
