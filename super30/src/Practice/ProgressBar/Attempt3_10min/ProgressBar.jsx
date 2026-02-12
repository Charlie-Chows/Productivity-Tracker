
import { useEffect, useState } from 'react';
import './ProgressBar.css'

const ProgressBar = ({ progress = 0 }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const safeProgress = Math.min(100, Math.max(0, progress));

    useEffect(() => {
        const id = setTimeout(() => setAnimatedProgress(safeProgress),1000);
        return () => clearTimeout(id);
    }, [safeProgress])
    
    return (
        <div className="progress-bar-container">
            <div className="progress-bar-shell">
                <div
                    className="progress-bar-text"
                    style={{ transform: `translateX(${animatedProgress - 100}%)` }}
                >
                    {safeProgress}%
                </div>
            </div>
        </div>
    )
}

export default ProgressBar;