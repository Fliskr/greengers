import React, { Component } from 'react';
import {connect} from 'react-redux';
import {request} from '../../utils/request';
import {getUsersAsync,getConfirmModal,setErrorText} from '../../actions/actionCreator';
import styles from './Roles.m.css';
import getLocaleText from '../../utils/locale';
import Modal from 'react-modal';

class Roles extends Component {

 constructor(props) {
  	super(props);
  	this.state={
  		role:null,
  		roles:[],
  		permissions:[],
		openModal:false,
  		errors:[],
  		formData:{
  			name:"",
  			id:""
  		}

  	};
  }

openRoleModal(row,e){
	e.stopPropagation();
	e.preventDefault();
	this.setState({openModal:true})
	if(row){
		this.setState({formData:row})
	}
}
closeRoleModal(){
	this.setState({openModal:false,
			errors:[],
  			role:null,
  			formData:{
  			id:"",
  			name:"",
  		}},()=>{request('api/roles').then(roles=>this.setState({roles:roles || []}))});
}

deleteRole(id,e){
	e.stopPropagation();
	e.preventDefault();
	request(`api/roles/${id}`,{method:"DELETE"}).then(()=>request('api/roles').then(roles=>this.setState({roles:roles || [],role:null})));
}

componentWillMount() {
	request('api/roles').then(roles=>this.setState({roles:roles || []}));
	request('api/roles/permissions').then(permissions=>this.setState({permissions:permissions || []}));
	// request('api/settings');
	// request('api/assets')
	// request('api/departments')
	// request('api/categories')
}

renderRoles(){

	return this.state.roles.map((role,key)=>(
		<li key={key} className={styles.permRow+" "+(this.state.role && role.id===this.state.role.id?styles.activeRow:"")} onClick={()=>this.setState({role})}>
			<div>{role.name}</div>
			<button className={styles.editBtn} onClick={this.openRoleModal.bind(this,role)}>
				<span className="halflings halflings-edit-sign"></span>
			</button>
			<button className={styles.deleteBtn} onClick={this.deleteRole.bind(this,role.id)}>
				<span className="halflings halflings-remove-sign"></span>
			</button>
		</li>
		))
}

changeRoleState(key){
	let permissions=this.state.role.permissions;
	permissions[key]={...permissions[key],checked:!permissions[key].checked};
	this.setState({role:{...this.state.role,
						permissions:permissions}},
						()=>{
							request(`api/roles/${this.state.role.id}`,{method:"PUT",body:JSON.stringify(this.state.role)},'json')
						})
}

renderPermissions(){
	return this.state.role.permissions.map((perm,key)=>(
		<li key={key}><input type="checkbox" onChange={this.changeRoleState.bind(this,key)} checked={perm.checked}/>{perm.note}</li>
		))
}

async onChangeRoleData(e){
	e.preventDefault();
	await request(`api/roles/${this.state.formData.id}`,{method:"PUT",body:JSON.stringify(this.state.formData)})
	this.closeRoleModal();
}
async onAddRoleData(e){
	e.preventDefault();
	let data=this.state.formData;
	data.permissions=this.state.permissions.map(perm=>{return {...perm,checked:false}})
	await request('api/roles',{method:"POST",body:JSON.stringify(data)})
	this.closeRoleModal();
}
onCancel(){
	this.closeRoleModal();
}

handleFormDataChange(e){
	this.setState({formData:{...this.state.formData,[e.target.name]:e.target.value}})
}

render() {
	const formData = this.state.formData;
	const formStyles = {
	  content: {
	    background: '#356a35',
	    top: "15%",
	    left: "15%",
	    bottom: "auto",
	    right: "15%",
	    padding: "40px"
	  }
	}

	let errors=this.state.errors;

    return (
      <div className={styles.container}>

      		<ul className={styles.roles}>
      		<button onClick={this.openRoleModal.bind(this,null)} className={styles.addRole}>{getLocaleText("addRole")}<span className="halflings halflings-plus-sign"></span></button>
      		{this.renderRoles()}
      		</ul>
      		<ul className={styles.permissions}>
      		{this.state.role && this.renderPermissions()}
      		</ul>
			{this.state.openModal && (<Modal 
      		isOpen={this.state.openModal}
			contentLabel="Modal"
			onRequestClose={this.closeRoleModal.bind(this)}
			style={formStyles}
      		>
				<form className="modalForm" ref={ref=>this.form=ref} >
					{formData.id && (<div className="modalFormRow">
						<label htmlFor="id">ID</label>
						<input disabled  onChange={this.handleFormDataChange.bind(this)} value={formData.id} type="text" name="id" />
					</div>)}
					<div className="modalFormRow">
						<label htmlFor="name">{getLocaleText("name")}</label>
						<input type="text" style={{border:errors.includes("name")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.name} name="name" />
					</div>
					<div className="modalFormActions">
					{this.state.formData.id?
						(<button className="formBtn" disabled={!formData.name} onClick={this.onChangeRoleData.bind(this)}>{getLocaleText("editRole")}</button>):
						(<button className="formBtn" disabled={!formData.name} onClick={this.onAddRoleData.bind(this)}>{getLocaleText("addRole")}</button>)}
						
						<button className="formBtn" onClick={this.onCancel.bind(this)}>{getLocaleText("cancel")}</button>
					</div>
				</form>
      		</Modal>)}
		</div>
    )
  }
}

const mapStateToProps=({App})=>{
	return {
		roles:[{id:1,name:"admin",permissions:[{id:1,note:"Search"}]}],
		permissions:[{source:"Search",id:1}]
	}
}

const mapDispatchToProps=(dispatch)=>{
	return {
		getUsersAsync:()=>dispatch(getUsersAsync()),
		getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
		setErrorText:(text)=>dispatch(setErrorText(text,5000))
		
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Roles);
// {id:int,name:str,permissions:[{id:int}]}