import React from 'react';
import {Link} from 'react-router';

const renderList=(list,active)=>{
	return list.map(item=>active!==item.toLowerCase()? (
		<li className="nav-item" key={item}>
					<Link to={`/${item.toLowerCase()}`}>{item}</Link>
				</li>		
		):(<li  key={item} className="nav-item disabled"><a disabled>{item}</a></li>))
}

const WorkerMenu=({active})=>{
	return (<div className="nav-container">
				<div className="divider"/>
				<ul className="nav nav-bar">
					{renderList(["CheckIn","Dispatch","Inspect","CheckOut"],active)}
				</ul>
			</div>
		)
}
export default WorkerMenu;