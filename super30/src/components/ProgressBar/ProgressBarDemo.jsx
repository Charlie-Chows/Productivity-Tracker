
import ProgressBar from "./ProgressBar";

const ProgressBarDemo = () => {

    const arr = [1, 5, 15, 20, 30, 50, 70, 80, 100];

    return (
        <div>
            {
                arr.map((num, index) => (
                    <ProgressBar key={index} progress={num} />
                ))
            }
        </div>
    )
}

export default ProgressBarDemo;