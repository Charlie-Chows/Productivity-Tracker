
import { useEffect, useRef, useState } from 'react';
import './AutoComplete.css'


const AutoComplete = () => {

    const [recipeList, setRecipeList] = useState([]);
    const [inputText, setInputText] = useState("");
    const [showList, setShowList] = useState(false);
    const [cache, setCache] = useState({});
    const [activeIndex, setActiveIndex] = useState(-1);

    const containerRef = useRef(null);


    // api + cache
    const fetchData = async () => {
        if (cache[inputText]) {
            console.log(`CACHED API : ${inputText}`)
            setRecipeList(cache[inputText]);
            return;
        }
        const response = await fetch(`https://dummyjson.com/recipes/search?q=${inputText}`);
        const data = await response.json();
        setRecipeList(data?.recipes)
        setCache((prev) => ({ ...prev, [inputText]: data?.recipes }))
        console.log(`API CALL : ${inputText}`);
    }


    // debounce + empty guard
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
                setShowList(false)
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [])

    //keyboard navigation 
    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => prev <= 0 ? recipeList.length - 1 : prev - 1)
        }
        else if (e.key === "ArrowDown") {
            setActiveIndex((prev) => prev === recipeList.length - 1 ? 0 : prev + 1);
        }
        else if (e.key === "Enter") {
            if (activeIndex >= 0 && activeIndex < recipeList.length) {
                setInputText(recipeList[activeIndex].name);
                setActiveIndex(-1);
                setShowList(false);
            }
        }
        else if (e.key === "Escape") {
            setActiveIndex(-1);
            setShowList(false);
        }
    }

    return (
        <div className="auto-complete-container" ref={containerRef}>
            <h1>Auto Complete</h1>

            <div>
                <input type='text'
                    className="search-input-box"
                    placeholder='Search recipe here...'
                    value={inputText}
                    onChange={(e) => {
                        setInputText(e.target.value)
                        setShowList(true)
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                />
                {
                    showList && recipeList.length > 0 && (
                        <ul className="recipe-list">
                            {
                                recipeList.map((item, index) => (
                                    <li
                                        // className='recipe-item'
                                        key={item.id}

                                        className={activeIndex === index ? "active-item" : ""}
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