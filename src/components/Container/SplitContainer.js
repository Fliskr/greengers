import React,{Component} from "react";

class SplitContainer extends Component{

	constructor(props) {
		super(props);
		this.state={percent:180}
		
	}

	componentDidMount() {
		window.addEventListener('dragstart',this.handleDragStart.bind(this))
		window.addEventListener('drag',this.handleMouseMove.bind(this));
		window.addEventListener('dragend',this.handleDragEnd.bind(this));
	}

	handleDragStart(e){
		this.target=(e.target===this.refs.drag ||e.target.parentElement===this.refs.drag ) && this.refs.drag;
	}

	handleMouseMove(e){
		if(!this.target){
			return ;
		}
		const parentWidth =this.refs.drag.parentElement.getBoundingClientRect().width-150;
		let percent=0;
		if(this.state.percent+e.offsetX<150){
			percent=150;
		}else if (this.state.percent+e.offsetX>parentWidth){
			percent=parentWidth;
		}else{
			percent=this.state.percent+e.offsetX;
		}
		this.setState({percent})
	}

	handleDragEnd(e){
		if(e.target!==this.refs.drag){
			return;
		}
		const parentWidth =this.refs.drag.parentElement.getBoundingClientRect().width-150;
		let percent=0;
		if(this.state.percent+e.offsetX<150){
			percent=150;
		}else if (this.state.percent+e.offsetX>parentWidth){
			percent=parentWidth;
		}else{
			percent=this.state.percent+e.offsetX;
		}
		this.setState({percent})
		this.target=null;
	}

	render(){
		return (
			<div className="split">
				<div  className="splitContainer">
					<div style={{"minWidth":this.state.percent+'px'}}>{this.props.left}</div>
					<div ref="drag" className="splitContainerDivider">
							<span/>
							<span/>
							<span/>
					</div>
					<div >{this.props.right}</div>
				</div>
			</div>
			)
	}
}

export default SplitContainer;