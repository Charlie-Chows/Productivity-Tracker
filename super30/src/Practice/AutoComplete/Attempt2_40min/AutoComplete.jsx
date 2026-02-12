/* 

- controlled input
- render list based on query 
- added css
- outSideClick
- Keyboard Navigation
- Cache


NOTES : 
- revise how to setCache 
- conditional classes along norma class
- css box sizing

*/


import { useEffect, useRef, useState } from "react";

import './AutoComplete.css'
const AutoComplete = () => {

    const [inputText, setInputText] = useState('');
    const [recipeList, setRecipeList] = useState([]);
    const [showList, setShowList] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [cache, setCache] = useState({});

    const containerRef = useRef(null);

    const fetchData = async () => {
        if (cache[inputText]) {
            console.log(`CACHE API : ${inputText}`);
            setRecipeList(cache[inputText]);
            return;
        }
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${inputText}`);
        const data = await response.json();
        setRecipeList(data?.recipes);
        setCache((prev) => ({ ...prev, [inputText]: data?.recipes }))
        console.log(`API CALLED : ${inputText}`);
    }


    // debounce + empty gaurd
    useEffect(() => {
        if (!inputText) {
            setRecipeList([]);
            return;
        }
        const timer = setTimeout(fetchData, 300);
        return () => clearTimeout(timer);
    }, [inputText])

    // outside click
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowList(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [])

    // keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => (prev <= 0 ? recipeList.length - 1 : prev - 1))
        }
        else if (e.key === "ArrowDown") {
            setActiveIndex((prev) => (prev < recipeList.length - 1 ? prev + 1 : 0))
        }
        else if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < recipeList.length) {
                setInputText(recipeList[activeIndex].name);
                setShowList(false);
                setActiveIndex(-1);
            }
        }
        else if (e.key === "Escape") {
            setShowList(false);
            setActiveIndex(-1);
        }
    }

    return (
        <div className="autocomplete-container" ref={containerRef}>
            <h1>Auto Complete</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value)
                        setShowList(true)
                        setActiveIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                    className="search-input-box"
                />
                {
                    showList && recipeList.length > 0 && (
                        <ul className="recipe-list">
                            {
                                recipeList.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className={`recipe-item ${activeIndex === index ? "active" : ""}`}
                                    >
                                        {item.name}
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
        </div>
    )
}

export default AutoComplete;