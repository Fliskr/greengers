import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import {setErrorText} from '../../actions/actionCreator';

class PopupError extends PureComponent{

	render(){
		if(!this.props.errorText){
			return null;
		}

		return (<div onClick={this.props.setErrorText}
				style={{
					display:"flex",
					position:"fixed",
					bottom:"20%",
					border:"1px solid rgba(200,40,40,0.8)",
					backgroundColor:"rgba(200,40,40,0.6)",
					color:"white",
					padding:"15px",
					width:"200px",
					fontSize:"1.2rem",
					flex:"0 1 200px",
					alignSelf:"center",
					justifyContent:"center",
					zIndex:"999999"
				}}
				>{this.props.errorText}
			</div>) 
	}
}

const mapStateToProps = (state) => {
  return {
  	errorText:state.App.errorText
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  	setErrorText:()=>dispatch(setErrorText("",0))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupError);
