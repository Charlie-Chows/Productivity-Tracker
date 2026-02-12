import { useEffect, useRef, useState } from 'react';
import './AutoComplete.css'

const AutoComplete = () => {
    const [inputText, setInputText] = useState('');
    const [recipeList, setRecipeList] = useState([]);
    const [showRes, setShowRes] = useState(false);
    const [cache, setCache] = useState({});
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef(null);

    // fetch data + cache
    const fetchData = async () => {
        if (cache[inputText]) {
            console.log(`CACHE RETURNED : ${inputText}`)
            setRecipeList(cache[inputText]);
            return;
        }

        const response = await fetch(`https://dummyjson.com/recipes/search?q=${inputText}`);
        const data = await response.json();
        setRecipeList(data?.recipes);
        console.log(`API CALL : ${inputText}`);
        setCache((prev) => ({ ...prev, [inputText]: data?.recipes }));
    }

    // search debounce + empty guard
    useEffect(() => {
        if (!inputText) {
            setRecipeList([]);
            return;
        }
        setActiveIndex(-1);
        const timer = setTimeout(fetchData, 300);
        return () => clearTimeout(timer);
    }, [inputText])


    // click outside 
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowRes(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    // Keyboard Navigation
    const handleKeyDown = (e) => {
        if (!showRes) return;

        if (e.key === "ArrowDown") {
            setActiveIndex((prev) => prev < recipeList.length - 1 ? prev + 1 : 0);
        }

        else if (e.key === "ArrowUp") {
            setActiveIndex((prev) => prev > 0 ? prev - 1 : recipeList.length - 1);
        }
        else if (e.key === "Enter") {
            if (activeIndex >= 0) {
                setInputText(recipeList[activeIndex].name);
                setShowRes(false);
                setActiveIndex(-1);
            }
        }
        else if (e.key === "Escape") {
            setShowRes(false);
            setActiveIndex(-1);
        }
    }

    return (
        <div className="auto-complete-container" ref={containerRef}>
            <div >
                <h1>Auto Complete Search Bar</h1>
                <div className="input-box">
                    <input
                        className='search-input'
                        placeholder="Search Recipe..."
                        value={inputText}
                        onChange={(e) => {setInputText(e.target.value); setShowRes(true)}}
                        onFocus={() => setShowRes(true)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <ul className='result-container'>
                    {
                        showRes && recipeList.length > 0 && recipeList.map((item, index) => (
                            <li
                                key={item.id}
                                className={index === activeIndex ? "active" : ""}
                            >
                                {item.name}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default AutoComplete;