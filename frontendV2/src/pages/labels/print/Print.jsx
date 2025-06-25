import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import TopMenu from "../../../components/topmenu/TopMenu";
import LabelCard from "../../../utils/print/labelCard";
import './Print.css';

function Print({ purchase_order, setIsAuthenticated }) {
    const [labelData, setLabelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef();

    useEffect(() => {
        const fetchLabelData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/labels?purchase_order=${purchase_order}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 403) {
                        setIsAuthenticated(false);
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLabelData(data);
            } catch (error) {
                console.error("Error fetching label data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLabelData();
    }, [purchase_order]);

    const handlePrint = useReactToPrint({
        documentTitle: "Etiquetas",
        contentRef: componentRef,
    });

    if (labelData.length === 0 && !loading) {
        return <div>
            <TopMenu title="Print" className="no-print" />
            <p>There is nothing to print</p>
        </div>
    }

    return (
        <div className='print'>
            <TopMenu title="Print" className="no-print" />
            <button onClick={() => handlePrint()} className="">
                Imprimir
            </button>
            {loading ? <p>Cargando etiquetas...</p> :
                <div ref={componentRef} className='print__content'>
                    {labelData.map((label) => (
                        <LabelCard
                            key={label.id}
                            companyName="Company Name"
                            productName={label.product_name}
                            weight={label.quantity}
                            udmCode={label.uom_code}
                            barcode={label.barcode}
                            className="printable-area"
                        />
                    ))}
                </div>
            }
        </div>
    );
}

export default Print;
