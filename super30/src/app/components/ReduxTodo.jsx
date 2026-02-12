import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../slices/todoSlice";
import { useState } from "react";
const ReduxTodo = () => {
    const [todoText, setTodoText] = useState("")
    const dispatch = useDispatch();
    const todo = useSelector((state) => state.todo.todos)
    return (
        <div>
            <h1>Redux Todo</h1>
            <input value={todoText} onChange={(e) => setTodoText(e.target.value)} />
            <button onClick={() => {
                dispatch(addTodo(todoText));
                setTodoText("");
            }}>Add</button>

            <ul>
                {
                    todo.map((t) => (
                        <li key={t.id}>{t.text}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ReduxTodo;