import { useMemo, useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount((prev) => prev + 1);
    }

    const handleDecrement = () => {
        if (count > 0) {
            setCount((prev) => prev - 1);
        }
    }

    const handleReset = () => {
        setCount(0);
    }

    // no need of state or optimization due to small count 
    const numbers = [...Array(10).keys()];
    const even = numbers.filter((n) => n % 2 === 0);
    const odd = numbers.filter((n) => n % 2 !== 0);


    // useMemo for large calc 
    const largeNum = useMemo(() => {
        return [...Array(100000).keys()];
    }, []);

    const { largeEven, largeOdd } = useMemo(() => {
        const even = [];
        const odd = [];
        for (let i = 0; i < largeNum.length; i++) {
            const n = largeNum[i];
            if (n % 2 === 0) even.push(n);
            else odd.push(n);
        }
        return {
            largeEven: even,
            largeOdd: odd
        };
    }, [largeNum])


    return (
        <div className="counter-container">
            <h1>Counter</h1>
            <h2>{count}</h2>
            <button onClick={handleIncrement}>+</button>
            <button
                onClick={handleDecrement}
                disabled={count === 0}
            >
                -
            </button>
            <button onClick={handleReset}>Reset</button>

             <hr />

            <>
                {
                    even.map((num) => (
                        <span key={num}>{num}</span>
                    ))
                }
            </>
             <hr />
            <>
                {
                    odd.map((num) => (
                        <span key={num}>{num}</span>
                    ))
                }
            </>
                <hr />
            <>
                {
                    largeEven.map((n,index) =>(
                        <div key={index}>{n}</div>
                    ))
                }
            </>
        </div>
    )
}

export default Counter;