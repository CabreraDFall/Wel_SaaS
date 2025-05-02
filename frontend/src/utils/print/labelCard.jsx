import React from 'react';
import Barcode from './Barcode';


const LabelCard = ({companyName,productName,weight,udmCode,barcode}) => {
    
  
  return (
    <div className="flex w-[508px] h-[305px] bg-white items-center flex-col justify-center">
        <div className='flex flex-col' style={{padding: '20px'}}>
<div style={{padding: '0 10px 10px 10px'}}>
<h4 className='flex justify-start'>{companyName}</h4>
    <div className='flex justify-between'>
        <p>{productName}</p> 
        <div className='flex'>
        <p>{weight}</p> <p>{udmCode}</p>
        </div>
    </div>
</div>
    
    <Barcode value={barcode}/>
    </div>
        </div>
  );
};

export default LabelCard;
