import React,{PureComponent} from 'react';
// import styles from './Slider.m.css';
class Slider extends PureComponent{
	constructor(props) {
		super(props);
		this.state={
			expanded:false
		}
		this.toggleExpanded=this.toggleExpanded.bind(this);
	}

	toggleExpanded(){
		this.setState({expanded:!this.state.expanded});
	}

	render(){
		return(
			<div className={(this.props.className || "")}>
			<div onClick={this.toggleExpanded} style={{textDecoration: "underline",cursor: "pointer"}}>
				{this.props.textComponent}
			</div>
			{this.state.expanded && this.props.children}
			</div>
			)
	}
}

export default Slider;