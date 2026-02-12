
import { useEffect, useState } from "react";
import './SearchDebounce.css';

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
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            setRecipeList(data?.recipes || []);
        }
        catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
                setRecipeList([]);
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

        const timer = setTimeout(fetchData(controller.signal), 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [inputText])

    return (
        <div className="search-debounce-container">
            <h1>Search + Debounce</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="search-input-box"
                />
                {loading && <p>Loading...</p>}
                {error && <p className="error-text">{error}</p>}
                {
                    !loading && !error && inputText.length >= 2 && recipeList.length === 0 && (
                        <p>No Result Found</p>
                    )
                }
                {
                    !loading && !error && recipeList.length > 0 && (
                        <ul className="recipe-list">
                            {
                                recipeList.map((item) => (
                                    <li className="recipe-item">{item.name}</li>
                                ))

                            }
                        </ul>
                    )
                }

            </div>
        </div>
    )
}

export default SearchDebounce;