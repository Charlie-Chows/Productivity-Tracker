
// https://dummyjson.com/products?limit=200

import { useEffect, useState } from "react";
import fallbackImg from '../../../assets/vite.svg'

import "./pagination.css"

const ProductCard = ({title, image}) => {

    const handleImg = (e) => {
        e.target.onerror = null;
        e.target.img = fallbackImg;
    }

    return(
        <div className="product-card-container">
            <img 
                src={image || fallbackImg}
                alt={title}
                onError={handleImg}
                className="product-card-img"
            />
            <span className="product-card-title">{title}</span>
        </div>
    )
}

const PAGE_SIZE = 10;

const Pagination = () => {

    const [productList, setProductList] = useState([]);
    const [totalpages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchData = async () => {
        const response = await fetch('https://dummyjson.com/products?limit=200');
        const data = await response.json();
        setProductList(data?.products || []);
        const total = Math.ceil((data?.total / PAGE_SIZE) || 0);
        setTotalPages(total);
    }

    useEffect(() => {
        fetchData();
    }, [])

    const handlePageChnage = (id) => {
        setCurrentPage((prev) => (prev === id ? prev : id))
    }

    const handlePrev = () => {
        if ( currentPage > 0 ) {
            setCurrentPage((prev) => prev - 1);
        }
    }

    const handleNext = () => {
        if ( currentPage < totalpages - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    }

    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return (
        <div className="pagination-container">
            <h1>Pagination</h1>
            
            <div className="pagination-num-container">
                <button onClick={handlePrev}>⬅️</button>
                {
                    [...Array(totalpages).keys()].map((index) =>(
                        <span 
                        onClick={()=>handlePageChnage(index)}
                        className={currentPage === index ? "activePage" : ""}
                        
                        > {index+1}</span>
                    ))
                }
                <button onClick={handleNext}>➡️</button>
            </div>

            <div className="product-list-container">
                {
                    productList.slice(start,end).map((item) => (
                        <ProductCard key={item.id} title={item.title} image={item.thumbnail} />
                    ))
                }
            </div>
        </div>
    )
}

export default Pagination;