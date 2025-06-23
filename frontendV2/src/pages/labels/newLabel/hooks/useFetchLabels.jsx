import { useState, useEffect } from 'react';

function useFetchLabels(selectedProduct) {
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        if (selectedProduct) {
            const fetchLabels = async (productCount) => {
                console.log("productCount:", productCount);
                console.log("selectedProduct:", selectedProduct);
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3000/api/labels?product_id=${selectedProduct}&count=${productCount}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log('Number of labels:', data.length);
                    setLabels(data);
                } catch (error) {
                    console.error("Could not fetch labels:", error);
                }
            };

            const countSelectedProduct = () => {
                return 0;
            };

            const productCount = countSelectedProduct();
            fetchLabels(productCount);
        }
    }, [selectedProduct]);

    return [labels];
}

export default useFetchLabels;
