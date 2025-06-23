import React from 'react';
import Barcode from './Barcode.jsx';


const LabelCard = ({ companyName, productName, weight, udmCode, barcode }) => {


    return (
        <div className="label-card-container print-label" style={{ width: '508px', height: '305px', pageBreakAfter: 'always' }}>
            <div className="flex w-[508px] h-[305px] bg-white items-center flex-col justify-center label-card-content">
                <div className='flex flex-col' style={{ padding: '10px' }}>
                    <h4 className='flex justify-start'>{companyName}</h4>
                    <div className='flex justify-between items-center'>
                        <p>{productName}</p>
                        <div className='flex'>
                            <p>{weight}</p> <p>{udmCode}</p>
                        </div>
                    </div>
                    <Barcode value={barcode} />
                </div>
            </div>
        </div>
    );
};

export default LabelCard;
