import React, { Component } from 'react';
import {connect} from 'react-redux';
import {request} from '../../utils/request';
import {getUsersAsync,getConfirmModal,setErrorText} from '../../actions/actionCreator';

import ReactTable from 'react-table';
import TreeView from 'react-treeview';
import Tabs from '../Presentational/Tabs';
import Modal from 'react-modal';
import getLocaleText from '../../utils/locale';
import styles from './Users.m.css';
class Users extends Component {

  constructor(props) {
  	super(props);
  	this.state={
  		openModal:false,
  		errors:[],
  		roles:[],
  		departments:[],
  		formData:{
  			name:"",
  			email:"",
  			id:"",
  			login:"",
  			password:"",
  			roles:[],
  			departments:[],
  		}
  	};
  }
componentWillMount() {
  this.props.getUsersAsync();
  request('api/roles').then(roles=>this.setState({roles:roles || []}));
  request('api/departments/hierarchy').then(departments=>this.setState({departments:departments || []}));
}

normalizeFormData(row){
	for (let i in row){
		if(i){
			row[i]=row[i]?row[i]:""
		}
	}

	return row;
}

openUserModal(row){
	this.setState({openModal:true})
	if(row){
		this.setState({formData:this.normalizeFormData(row)})
	}
}

onCancel(e){
	e.preventDefault();
	this.closeUserModal();
}

onChangeUserData(e){
	e.preventDefault();
	this.validate() && request(`api/users/${this.state.formData.id}`,{method:"PUT",body:JSON.stringify(this.state.formData)},'json')
	.then(res=>{
		if(res && res.error){
			this.setState({errors:res.validationErrors || []})
			throw new Error(res.message);
		}else{
			this.setState({errors:[]})
		}
	})
	.then(this.closeUserModal.bind(this))
	.catch()
}

onAddUserData(e){
	e.preventDefault();
	this.validate(true) && request(`api/users`,{method:"POST",body:JSON.stringify(this.state.formData)},'json')
	.then(res=>{
		if(res && res.error){
			this.setState({errors:res.validationErrors || []})
			throw new Error(res.message);
		}else{
			this.setState({errors:[]})
		}
	})
	.then(this.closeUserModal.bind(this))
	.catch()
}

renderDepartmentsTree(dep){

const label=<span className={styles.treeLabel}>{dep.name}<input className={styles.treeCb} type="checkbox" checked={this.isDepChecked(dep,this.state.formData.departments)} onChange={this.handleDepartmentChange.bind(this,dep)}/></span>
return (<TreeView 
      	key={dep.id}
      	nodeLabel={label}
      	>
      	{dep.children.map(this.renderDepartmentsTree.bind(this))}
      	</TreeView>)
}

handleDepartmentChange(dep,e){
	let departments=[];
	if(!e.target.checked){
		departments=[...this.state.formData.departments].filter(fdep=>fdep.id!==dep.id);
	}else{
		departments=[...this.state.formData.departments,{id:dep.id,name:dep.name}]
	}
	this.setState({formData:{...this.state.formData,departments:departments}})
}

isDepChecked(deps,dep){
	return this.idInArray(dep,deps);
}

isRoleChecked(role,roles){
	return this.idInArray(roles,role);
}

idInArray(arr,obj){
	return arr.find(item=>item.id===obj.id);
}

closeUserModal(){
	this.setState({openModal:false,
	  		formData:{
  			name:"",
  			email:"",
  			id:"",
  			login:"",
  			password:"",
  			departments:[],
  			roles:[]
  		}},this.props.getUsersAsync)
}

handleEditUser(row){
	this.openUserModal(row.row)
}

handleDeleteUser(row) {
	this.props.getConfirmModal({
		body:(<div className="modalFormRow">
             <label>{getLocaleText("sure")}</label>
             </div>),
		callback:()=>{request(`api/users/${row.row.id}`, { method: "DELETE" }, 'json').then(this.props.getUsersAsync)},
		open:true})
  
}
handleAddUser() {
  this.openUserModal()
}

handleFormDataChange(e){
	this.setState({formData:{...this.state.formData,[e.target.name]:e.target.value}})
}
handleFormDataChangeRoles(e){
	this.setState({formData:{...this.state.formData,[e.target.name]:e.target.value.split(" ")
		.map(role=>{return {name:role}})}})
}

validate(password=false) {

    let errors=[];
    let formData = this.state.formData;
    if (!formData.name) {
        errors.push("name")
    }
    if (!formData.email) {
        errors.push("email")
    }
    if (!formData.login) {
        errors.push("login")
    }
    if (!formData.password && password) {
        errors.push("password");
    }

    this.setState({errors})
    if (errors.length===0) {
        return true;
    }
    this.props.setErrorText(errors.reduce((text,err)=>{return text+=err+","},"Please fill ")+"and push 'Create User' button again.");
    return false
}

changeRoleState(role,e){
	let roles=[];
	if(!e.target.checked){
		roles=[...this.state.formData.roles].filter(frole=>frole.id!==role.id);
	}else{
		roles=[...this.state.formData.roles,{id:role.id,name:role.name}]
	}
	this.setState({formData:{...this.state.formData,roles:roles}})
}



render() {
  	const columns = [{className:"react-table-cell", header: "ID", "accessor": 'id',minWidth:20 },
  				{className:"react-table-cell", header:getLocaleText("name"),"accessor":"name"},
  				{className:"react-table-cell", header:getLocaleText("login"),"accessor":"login"},
  				{className:"react-table-cell", header:getLocaleText("email"),"accessor":"email"},
  				{className:"react-table-cell",sortable:false, header:getLocaleText("roles"),"accessor":"roles",render:(row)=>row.value.reduce((str,role,i,arr)=>{return str+role.name+" "},"")},
  				{className:"react-table-cell",minWidth:40,render:(row)=>{return (<div>
  					<button className="editBtn" onClick={this.handleEditUser.bind(this,row)}><span className="halflings halflings-edit-sign"></span></button>
  					<button className="deleteBtn" onClick={this.handleDeleteUser.bind(this,row)}><span className="halflings halflings-remove-sign"></span></button>
  				</div>)}}
  				];
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
      <div className="searchContainer">
      		<div className="action">
      			<button className="addBtn" onClick={this.handleAddUser.bind(this)}>{getLocaleText("addUser")} <span className="halflings halflings-plus-sign"></span></button>
      		</div>
      		{this.state.openModal && (<Modal 
      		isOpen={this.state.openModal}
			contentLabel="Modal"
			onRequestClose={this.closeUserModal.bind(this)}
			style={formStyles}
      		>
				<form className="modalForm" ref={ref=>this.form=ref}>
						<Tabs navs={["Info","Roles","Departments"]} >
						<div>{formData.id && (<div className="modalFormRow">
							<label htmlFor="id">ID</label>
							<input disabled  onChange={this.handleFormDataChange.bind(this)} value={formData.id} type="text" name="id" />
						</div>)}
						<div className="modalFormRow">
							<label htmlFor="name">{getLocaleText("name")}</label>
							<input type="text" style={{border:errors.includes("name")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.name} name="name" />
						</div>
						<div className="modalFormRow">
							<label htmlFor="login">{getLocaleText("login")}</label>
							<input type="text" style={{border:errors.includes("login")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.login} name="login" />
						</div>
						<div className="modalFormRow">
							<label htmlFor="email">{getLocaleText("email")}</label>
							<input type="text" style={{border:errors.includes("email")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.email} name="email" />
						</div>
						{!formData.id && (<div className="modalFormRow">
							<label htmlFor="password">{getLocaleText("password")}<div className="supTooltip">*<span>Password should contain at least number,letter,capitalized letter and its length should be longer than 8 characters</span></div></label>
							<input type="password" style={{border:errors.includes("password")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.password} name="password" />
						</div>)}
						</div>
							<ul className={styles.rolesList}>
							{this.state.roles.map((role,key)=>(
								<li key={key}>
									<input 
										type="checkbox" 
										onChange={this.changeRoleState.bind(this,role)} 
										checked={this.isRoleChecked(role,formData.roles)}
									 />
								{role.name}
								</li>))}				
      						</ul>
      						<div className={styles.departmentsTree} >
      							{this.state.departments.map(this.renderDepartmentsTree.bind(this))}		
      						</div>
						</Tabs>
						<div className="modalFormActions">
						{this.state.formData.id?
							(<button className="formBtn" onClick={this.onChangeUserData.bind(this)}>{getLocaleText("editUser")}</button>):
							(<button className="formBtn" onClick={this.onAddUserData.bind(this)}>{getLocaleText("createUser")}</button>)}
							
							<button className="formBtn" onClick={this.onCancel.bind(this)}>{getLocaleText("cancel")}</button>
						</div>

				</form>
      		</Modal>)}
			<ReactTable defaultSorting={[{id:"id",desc:false}]} data={this.props.users} columns={columns} defaultPageSize={10} ref={ref=>this.table=ref} />
		</div>
    )
  }
}

const mapStateToProps=({App})=>{
	return {
		users:App.users,
		locale:App.locale
	}
}

const mapDispatchToProps=(dispatch)=>{
	return {
		getUsersAsync:()=>dispatch(getUsersAsync()),
		getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
		setErrorText:(text)=>dispatch(setErrorText(text,5000))
		
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Users);
