import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import ActionMenu from '../../../components/ActionMenu/ActionMenu';
import TableFilter from '../../../components/TableFilter/TableFilter';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../../../assets/icons';
function TabsViews({ receptionsData, searchQuery, setSearchQuery }) {

    const filteredReceptions = useMemo(() => {
        if (!searchQuery) {
            return receptionsData;
        }
        const searchLower = searchQuery.toLowerCase();
        return receptionsData.filter(reception => {
            return (
                reception.vehicle.toLowerCase().includes(searchLower) ||
                reception.purchase_order.toLowerCase().includes(searchLower)
            );
        });
    }, [receptionsData, searchQuery]);

    return (
        <div className='tabsViews'>
            <div className="tabsViews__header">
                <TableFilter placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <Link to={`/recepciones/new`}>
                    <button className="table__header-add">
                        <PlusIcon />
                    </button>
                </Link>
            </div>
            <div className="tabsViews__content">
                {filteredReceptions.map((data, index) => (
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
