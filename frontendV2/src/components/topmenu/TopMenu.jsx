import React from 'react'
import { UserIcon } from '../../assets/icons'
import "./topmenu.css"
function TopMenu({ title }) {
    return (

        <div className="header__content">
            <h4>{title}</h4>
            <UserIcon />
        </div>

    )
}

export default TopMenu