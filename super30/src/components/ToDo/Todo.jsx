
/* 
    - Add ✅
    - Delete ✅
    - Edit inline
    - check / uncheck toggle ✅
    - strike through line for completed ✅ 
    - filter for ( all / active / done ) ✅
    - local storage ✅ 
    - once completed it moved to last ✅ 

*/

import { useEffect, useState } from 'react';
import './Todo.css'

const Todo = () => {
    const [todoText, setTodoText] = useState("");
    const [todoList, setTodoList] = useState(() => {
        const savedTodos = localStorage.getItem('todoList');
        return savedTodos ? JSON.parse(savedTodos) : []
    });
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");


    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(todoList));
    }, [todoList])

    const handleAdd = () => {
        if (!todoText.trim()) return;

        setTodoList((prev) => (
            [
                ...prev,
                {
                    id: Date.now(),
                    text: todoText,
                    completed: false
                }
            ]
        ));
        setTodoText("");
    }

    const toggleHandleCompleted = (id) => {
        setTodoList((prev) => (
            prev.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        ))
    }


    const handleDelete = (id) => {
        setTodoList((prev) => (
            prev.filter((item) => (
                item.id !== id
            ))
        ))
    }

    const handleEdit = (id, text) => {
        setEditText(text);
        setEditingId(id);
        console.log(`id : ${id} , text : ${text}`);
    }

    const handleSave = (id) => {
        setTodoList((prev) =>
            prev.map((todo) => (
                todo.id === id ? { ...todo, text: editText } : todo
            ))
        );
        setEditText("");
        setEditingId(null);
    }


    const filteredTodos = todoList.filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "done") return todo.completed;
        return true;
    })

    if (filter === 'all') {
        filteredTodos.sort((a, b) => a.completed - b.completed);
    }

    return (
        <div className="todo-container">
            <h1 className="todo-header">Todo List</h1>

            <input
                type="text"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                placeholder='Enter todo...'
            />
            <button
                onClick={handleAdd}
            >
                Add
            </button>

            <div className="todo-filter">
                <button onClick={() => setFilter('all')}>All</button>
                <button onClick={() => setFilter('active')}>Active</button>
                <button onClick={() => setFilter('done')}>Done</button>
            </div>

            <ul>
                {
                    filteredTodos.map((t) => (
                        <li key={t.id}>
                            <input
                                type='checkbox'
                                checked={t.completed}

                                onChange={() => toggleHandleCompleted(t.id)}
                            />
                            {
                                editingId === t.id ? (
                                    <>
                                        <input
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                        <button onClick={() => handleSave(t.id,)} >Save</button>
                                    </>

                                ) : (
                                    <>
                                        <span
                                            className={t.completed ? "todo-item completed" : "todo-item"}
                                        >
                                            {t.text}
                                        </span>
                                        <button onClick={() => { handleEdit(t.id,) }}>Edit</button>
                                    </>
                                )
                            }

                            <button onClick={() => handleDelete(t.id)}>Delete</button>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Todo;