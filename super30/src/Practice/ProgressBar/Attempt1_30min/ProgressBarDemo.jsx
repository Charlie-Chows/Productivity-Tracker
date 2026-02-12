
import ProgressBar from "./ProgressBar";

const ProgressBarDemo = () => {
    const arr = [10,20,50,80,100]
    return (
        <div>
            {
                arr.map((num,index) => (
                    <ProgressBar key={index} progress={num}/>
                ))
            }
        </div>
    )
}

export default ProgressBarDemo;