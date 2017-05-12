import React,{PureComponent} from 'react';

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
			<div>
			<div onClick={this.toggleExpanded}>{this.props.textComponent}</div>
			{this.state.expanded && this.props.children}
			</div>
			)
	}
}

export default Slider;