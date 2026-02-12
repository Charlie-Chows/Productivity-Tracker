import { useRef, useState } from "react";

const StopWatch = () => {
    const [time, setTime] = useState(0);
    const intervelRef = useRef(null);

    const handleStart = () => {
        if (intervelRef.current) return;

        intervelRef.current = setInterval(() => {
            setTime((prev) => prev + 1);
        }, 1000)
    }

    const handleStop = () => {
        clearInterval(intervelRef.current);
        intervelRef.current = null;
    }

    const handleReset = () => {
        handleStop();
        setTime(0);
    }

    return (
        <div className="stopwatch-container">
            <h1>StopWatch</h1>
            <h2>{time}</h2>
            <button onClick={handleStart}>Start</button>
            <button onClick={handleStop}>Stop</button>
            <button onClick={handleReset}>Reset</button>
        </div>
    )
}

export default StopWatch;