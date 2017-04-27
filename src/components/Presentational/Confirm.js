import React,{PureComponent} from 'react';
import {connect} from 'react-redux';
import {getConfirmModal,setErrorText} from '../../actions/actionCreator';
import Modal from 'react-modal';
import getLocaleText from '../../utils/locale';
class Confirm extends PureComponent{

	async handleClose(){
		try{
			await this.props.confirm.callback(...arguments)
			this.props.closeConfirmModal();
		}catch(e){
			this.props.setErrorText(e.message);
		}
	}

	render(){
		const formStyles = {
		    overlay: {
		        zIndex: "9999"
		    },
		    content: {
		        background: '#356a35',
		        top: "15%",
		        left: "15%",
		        bottom: "auto",
		        right: "15%",
		        padding: "40px"
		    }
		}


		return this.props.confirm.open && (
			<Modal 
			style={formStyles} 
			onRequestClose={this.props.closeConfirmModal} 
			isOpen={this.props.confirm.open}
			contentLabel="Modal"

			>
			{this.props.confirm.body}
			<div className="modalFormActions">
				<button className="formBtn" onClick={this.handleClose.bind(this)}>Ok</button>
				<button className="formBtn" onClick={this.props.closeConfirmModal}>{getLocaleText("cancel")}</button>
					</div>
			</Modal>
			)
	}
}

const mapStateToProps = ({App}) => {
  return {
  	confirm:App.confirm,
  	locale:App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeConfirmModal:()=>dispatch(getConfirmModal({body:null,open:false,callback:()=>{}})),
	setErrorText:(text)=>dispatch(setErrorText(text,3000))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);
