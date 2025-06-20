import React from 'react'
import TopMenu from '../../../components/topmenu/TopMenu'
import "./fixed-barcode.css"
import Btn from '../../../components/button/Btn'
function FixedBarcode() {
    return (
        <div className='fixedBarcode'>
            <TopMenu title={"Barcode"} />
            <div className="fixedBarcode__content">
                <div className='fixedBarcode__card'>

                    <div className="fixedBarcode__header">
                        <h4>producto name</h4>
                    </div>
                    <div className="fixedBarcode__body">

                        <h4>almacen</h4>
                        <h4>cantidad</h4>
                    </div>
                    <div className="fixedBarcode__footer">
                        <Btn text={"Crear"} />
                        <span>cancelar</span>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default FixedBarcode