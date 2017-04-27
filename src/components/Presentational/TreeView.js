import React,{PureComponent} from 'react';
import styles from './TreeView.m.css';

class TreeView extends PureComponent{

	constructor(props) {
		super(props);
		this.state={
			expanded:props.checked
		}
		this.toggle=this.toggle.bind(this)

	}

	toggle(){
		this.setState({expanded:!this.state.expanded})
	}

	render(){
		const state=this.state;
		let active={};
		if(this.props.active){
			active.style={fontWeight:"bold"};
		}
		let icon;
		if(this.props.icon){
			icon=(<span style={{
				display:"flex",
				padding:"10px",
				backgroundSize:"100% auto",
				backgroundRepeat:"no-repeat",
				backgroundImage:"url('data:image/jpeg;base64,"+this.props.icon+"')"}}></span>)
		}
		return (<div className={this.props.className || styles.tree}>
					<div>
						<span 
						className={[styles.expander,  state.expanded?styles.open:"" ,this.props.children && !this.props.children.length>0 && styles.empty:""].filter(a=>a).join(" ")}
						onClick={this.props.valueClick}
							{...active} >
								{icon} {this.props.value}
						</span>

					{this.props.handleCheckbox && (<input checked={this.props.checked} className={styles.checkbox} type="checkbox" onChange={this.props.handleCheckbox} />)}
					</div>
					<span className={styles.clicker} onClick={this.toggle} />
					<div className={styles.childTree}>
						{state.expanded && this.props.children.length>0 && this.props.children}
					</div>

			</div>)
	}
		
}

export default TreeView;