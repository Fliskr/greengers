import React from 'react';
import { Link } from 'react-router';

const renderList = (list, active,permissions) => {
  return Object.entries(list).map(([k,v]) => permissions.find(perm=>perm.source.toLowerCase()===k.toLowerCase())?( active !== k ? (
    <li className="nav-item" key={k}>
					<Link to={`/${k}`}>{v}</Link>
				</li>
  ) : (<li key={k} className="nav-item disabled"><a disabled>{v}</a></li>)):null)
}

const NavMenu = ({ list,active=false,permissions=[] }) => {
  return (
    <div className="nav-container">
				<div className="divider"/>
				<ul className="nav nav-bar">
					{renderList(list,active,permissions)}
				</ul>
			</div>
  )
}
export default NavMenu;
