import React,{PureComponent} from 'react';
import styles from './ModalEdit.m.css';
import Modal from 'react-modal';
import getLocaleText from '../../utils/locale';

class ModalEdit extends PureComponent{
	constructor(props) {
		super(props);
		this.state={
			collection:[],
			outCollection:[]
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({collection:nextProps.collection.filter(item=>!nextProps.inCollection.find(initem=>initem.id===item.id)),outCollection:nextProps.inCollection})
	}

	addToIn(col){
		this.setState({outCollection:[...this.state.outCollection,col],collection:this.state.collection.filter(collection=>collection!==col)});	
	}

	removeFromIn(col){
		this.setState({collection:[...this.state.collection,col],outCollection:this.state.outCollection.filter(collection=>collection!==col)});
	}

	removeAllFromIn(){
		this.setState({outCollection:[],collection:[...this.state.collection,...this.state.outCollection]})
	}

	removeAllFromColl(){
		this.setState({collection:[],outCollection:[...this.state.collection,...this.state.outCollection]})
	}

	renderList(list,cb){
		return list.map((item,id)=><li className={styles.item} key={id} onClick={cb.bind(this,item)}>{item[this.props.displayName || 'id'] || item[this.props.displayNameAlt]}</li>)
	}

	onEdit(){
		this.props.onEdit(this.state.outCollection);
		this.props.onRequestClose();
	}

	render(){
			const formStyles = {
	  content: {
	    background: '#356a35',
	    top: "15%",
	    left: "15%",
	    bottom: "auto",
	    right: "15%",
	    padding: "40px"
	  },
	  overlay:{
	  	zIndex:99999
	  }
	}
		return (<Modal
			isOpen={this.props.isOpen}
			contentLabel="Modal"
			onRequestClose={this.props.onRequestClose}
			style={formStyles}
		 >
		 <div className={styles.content}>
			<ul className={styles.in}>
				{this.renderList(this.state.collection,this.addToIn.bind(this))}
			</ul>			
			<ul className={styles.out}>
				{this.renderList(this.state.outCollection,this.removeFromIn.bind(this))}
			</ul>
		</div>
		<div className={styles.modalActions}>
			<button className={styles.actionBtn} onClick={this.onEdit.bind(this)}>{getLocaleText("edit")}</button>
			<button className={styles.actionBtn} onClick={this.props.onRequestClose}>{getLocaleText("cancel")}</button>
		</div>
		</Modal>)
			}
	

}

export default ModalEdit