import { useEffect, useState } from "react";
import './AxisToggler.css'

const AxisToggler = () => {
    const [users, setUsers] = useState([]);
    const [isVertical, setIsVertical] = useState('vertical')

    const fetchUsers = async () => {
        const res = await fetch('https://dummyjson.com/users');
        const data = await res.json();
        setUsers(data?.users);

    }
    useEffect(() => {
        fetchUsers();
    }, [])

    const handleAxis = () => {
        setIsVertical((prev) => prev === "vertical" ? "horizontal" : "vertical");
    }

    return (
        <div>
            <h1>Axis Toggler</h1>
            <button onClick={handleAxis}>Switch Axis</button>
            <div className={`users ${isVertical}`}>
                {
                    users.map((u) => (
                        <li key={u.id}>{u.username}</li>
                    ))
                }
            </div>
        </div>
    )
}

export default AxisToggler;