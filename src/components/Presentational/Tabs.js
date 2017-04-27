import React,{PureComponent} from 'react';
import styles from './Tabs.m.css';


class Tabs extends PureComponent{

	constructor(props) {
		super(props);
		this.state={nav:0};
	}

	renderPage(){
		return (<div className={this.props.tabPage || styles.tabPage}>
				{this.props.children[this.state.nav]}
			</div>)
	}

	renderNav(){
		return this.props.navs.map((nav,id)=>(<div key={id} className={`${this.props.navItem || styles.navItem} ${id===this.state.nav?this.props.active || styles.active:""}`} onClick={e=>this.setState({nav:id})} >{nav}</div>))
	}

	render(){
		return (
			<div className={styles.tabs}>
				<div className={this.props.tabsNav || styles.tabsNav}>
					{this.renderNav()}
				</div>
				<div className={this.props.tabPages || styles.tabPages}>
					{this.renderPage()}
				</div>
			</div>
			)
	}
}

export default Tabs;