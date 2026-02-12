
/* 
- input box
- error
- loading
- empty state
- min char search
- debounce
- abort controller

*/
import { useEffect, useState } from "react";

const SearchDebounce = () => {
    const [inputText, setInputText] = useState("");
    const [recipeList, setRecipeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (signal) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://dummyjson.com/recipes/search?q=${inputText}`, { signal });
            if (!response.ok) {
                throw new Error("Fetch failed");
            }
            const data = await response.json();
            setRecipeList(data?.recipes || []);
        }
        catch (err) {
            if (err.name !== "AbortError") {
                setError(err.message);
                setLoading(false);
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (inputText.length < 2) {
            setRecipeList([]);
            return;
        }
        const controller = new AbortController();
        const timer = setTimeout(()=>fetchData(controller.signal), 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        }
    }, [inputText])
    return (
        <div className="search-debounce-container">
            <h1>Search + Debounce</h1>
            <input
                type="text"
                placeholder="Search..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {
                !loading && !error && inputText.length >= 2 && (<p>No Result Found</p>)
            }
            <ul>
                {
                    !loading && !error && recipeList.length > 0 && (
                        recipeList.map((item) => (
                            <li key={item.id}>{item.name}</li>
                        ))
                    )


                }
            </ul>
        </div>
    )
}

export default SearchDebounce;