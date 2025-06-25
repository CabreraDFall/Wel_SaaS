import React from 'react';
import Barcode from './Barcode.jsx';
import "./labelCard.css"

const LabelCard = ({ companyName, productName, weight, udmCode, barcode }) => {


    return (
        <div className="label-card-container print-label" >
            <div className="flex w-[508px] h-[305px] bg-white items-center flex-col justify-center label-card-content">
                <div className='label-card-container__header'>
                    <h4 className='flex justify-start'>{companyName}</h4>
                    <div className='label-card-container__product'>
                        <p>{productName}</p>
                        <div className='label-card-container__product-weight'>
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
