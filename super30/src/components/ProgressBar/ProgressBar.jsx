
import { useEffect, useState } from 'react'
import './ProgressBar.css'

const ProgressBar = ({ progress }) => {

    const [animatedProgress, setAnimatedProgress] = useState(0);
    const safeProgress = Math.min(100, Math.max(0, progress))

    useEffect(() => {
        setTimeout(() => setAnimatedProgress(safeProgress), 100)
    }, [safeProgress])

    return (
        <div className="progress-bar-container">
            {/* <h1 className='progress-bar-title'>Progress Bar</h1> */}
            <div className="progress-bar-shell">
                <div
                    className={`progress-percentage ${animatedProgress >= 5 ? "" : "low"}`}
                    style={{
                        transform: `translateX(${animatedProgress - 100}%)`
                    }}
                    role='progressbar'
                    aria-valuenow={safeProgress}
                    aria-valuemax={100}
                    aria-valuemin={0}
                >
                    {safeProgress}%
                </div>
            </div>
        </div>
    )
}
export default ProgressBar;