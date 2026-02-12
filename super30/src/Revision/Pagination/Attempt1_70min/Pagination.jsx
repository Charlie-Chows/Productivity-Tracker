
// https://dummyjson.com/products?limit=200

import { useEffect, useState } from "react";
import fallbackImg from '../../../assets/vite.svg'
import './Pagination.css'

const ProductCard = ({ name, img }) => {
    const handleImg = (e) => {
        e.target.onerror = null;
        e.target.img = fallbackImg;
    }

    return (
        <div className="product-card-container">
            <img 
                className="product-card-img" 
                src={img || fallbackImg} 
                alt={name} 
                onError={handleImg} 
            />
            <span className="product-card-name">{name}</span>
        </div>
    )
}


const PAGE_SIZE = 10;

const Pagination = () => {

    const [productList, setProductList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageNum, setPageNum] = useState(0);

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

    const handlePrev = () => {
        if (pageNum > 0) {
            setPageNum((prev) => prev - 1);
        }
    }

    const handleNext = () => {
        if (pageNum < totalPages - 1) {
            setPageNum((prev) => prev + 1)
        }
    }

    const handlePageNum = (id) => {
        setPageNum((prev) => (prev === id ? prev : id))
    }

    const start = pageNum * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return (
        <div className="pagiation-container">
            <h1 className="pagination-title">
                Pagination
            </h1>

            <div className="pageNum-container">
                <div>
                    <button 
                        className="prev-btn" 
                        onClick={handlePrev}
                        disabled={pageNum === 0}
                    >
                        ⬅️
                    </button>
                </div>
                <div>
                    {
                        [...Array(totalPages).keys()].map((index) => (
                            <span
                                key={index}
                                className={`paginated-num ${pageNum === index ? "active" : ""}`}
                                role="button"
                                onClick={() => handlePageNum(index)}
                            >
                                {index + 1}
                            </span>
                        ))
                    }
                </div>
                <div>
                    <button 
                        className="next-btn" 
                        onClick={handleNext}
                        disabled={pageNum === totalPages-1}
                    >
                        ➡️
                    </button>
                </div>

            </div>


            <div className="product-list-container">
                {
                    productList.slice(start, end).map((item) => (
                        <ProductCard key={item.id} name={item.title} img={item.thumbnail} />
                    ))
                }
            </div>
        </div>
    )
}

export default Pagination;