import { useDispatch, useSelector } from "react-redux"
import { decrement, increment, incrementByAmount } from "../slices/counterSlice";

const ReduxCounter = () => {
    const dispatch = useDispatch();
    const count = useSelector((state) => state.counter.value)
    return(
        <div>
            <h1>Redux counter</h1>
            <h2>count : {count}</h2>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
        </div>
    )
}

export default ReduxCounter;