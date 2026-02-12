
import { useEffect, useState } from 'react';
import './ProgressBar.css'

const ProgressBar = ({ progress }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);

    const safeProgress = Math.min(100, Math.max(0, progress));

    useEffect(() => {
        const id = setTimeout(() => setAnimatedProgress(safeProgress), 300);
        return () => clearTimeout(id);
    }, [safeProgress])

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-shell">
                <div
                    className="progress-bar-text"
                    style={{ transform: `translateX(${animatedProgress - 100}%)` }}
                    role="progressbar"
                    aria-valuenow={safeProgress}
                    aria-valuemax={100}
                    aria-valuemin={0}
                >{safeProgress}%</div>
            </div>
        </div>
    )
}

export default ProgressBar;