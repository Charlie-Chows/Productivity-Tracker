
import { useEffect, useState } from 'react';
import fallbackImg from '../../assets/vite.svg'
import './Pagination.css';

const ProductCard = ({ image, title }) => {
    const handleImageFallback = (e) => {
        e.target.onerror = null;
        e.target.src = fallbackImg
    }
    return (
        <div className="product-card">
            <img
                src={image || fallbackImg}
                alt={title} onError={handleImageFallback}
                className='product-image'
            />
            <span className="product-title">{title}</span>
        </div>
    )
}

const PAGE_SIZE = 10;

const Pagination = () => {
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchData = async () => {
        const response = await fetch(`https://dummyjson.com/products?limit=200`);
        const data = await response.json();
        setProductList(data?.products || []);
        const total = data?.total || 0;
        setTotalPages(Math.ceil(total / PAGE_SIZE));
    }

    useEffect(() => {
        fetchData();
    }, []);


    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const handlePageChange = (pageNum) => {
        setCurrentPage((prev) => (prev === pageNum ? prev : pageNum))
    }

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => (prev - 1))
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    }

    return (
        <div className="pagination-container">
            <h1>Pagination</h1>


            <div className='page-numbers-cotainer'>
                <button
                    className="prev-button"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    ⬅️
                </button>
                {
                    [...Array(totalPages).keys()].map((index) => (
                        <span
                            key={index}
                            className={`page-number ${currentPage === index ? "active-page" : ""}`}
                            onClick={() => handlePageChange(index)}
                        >
                            {index + 1}
                        </span>
                    ))
                }
                <button
                    className="next-button"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                >
                    ➡️
                </button>
            </div>


            {productList.length > 0 && (
                <div className='product-container'>
                    {
                        productList.slice(start, end).map((item) => (
                            <ProductCard key={item.id} image={item.thumbnail} title={item.title} />
                        ))
                    }
                </div>
            )}


        </div>
    )
}

export default Pagination