import React, { useState } from 'react';
import { format } from 'date-fns';
import ActionMenu from '../../../components/ActionMenu/ActionMenu';

function TabsViews({ receptionsData }) {

    console.log(receptionsData);

    return (
        <div className='tabsViews'>
            <div className="tabsViews__header"></div>
            <div className="tabsViews__content">
                {receptionsData.map((data, index) => (
                    <div key={index} className='card'>
                        <div>
                            <div className='line'>
                                <a href={`http://localhost:5173/recepciones/${data.purchase_order}`}><h4>{data.purchase_order}</h4></a>
                                <span className='date'>
                                    {format(new Date(data.reception_date), 'dd/MM/yyyy')}
                                </span>
                            </div>
                            <div>
                                <span className='items'>{data.items} items </span>
                            </div>
                        </div>

                        <div className='line'>
                            <div className='line__bubble'>
                                <span className='bubble'>{data.status} </span>
                                <span className='bubble'>{data.vehicle} </span>

                            </div>
                            <ActionMenu />
                        </div>

                    </div>
                ))}
            </div>
            <div className="tabsViews__footer"></div>
        </div>
    );
}

export default TabsViews;
