import React,{PureComponent} from 'react';
import styles from './Departments.m.css';
import {connect} from 'react-redux';
import {request} from '../../utils/request';
import ReactTable from 'react-table';
import getLocaleText from '../../utils/locale';
import TreeView from 'react-treeview';
import {getConfirmModal} from '../../actions/actionCreator';
import Modal from 'react-modal';
import ModalEdit from '../Presentational/ModalEdit';
import Tabs from '../Presentational/Tabs';
class Departments extends PureComponent{
	constructor(props) {
		super(props);
		this.state={
			departments:[],
			department:null,
			departmentsList:[],
			assets:[],
			users:[],
			assetModalOpen:false,
			usersModalOpen:false,
			openModal:false,
  			errors:[],
  			formData:{
  				id:"",
  				name:"",
  				description:"",
  				parent:""
  			}}
	}

	componentWillMount() {
		this.getDepartments();
		request('api/users').then(users=>this.setState({users}));
		request('api/assets?view=kv').then(assets=>this.setState({assets}));
	}

	getDepartments(){
		request('api/departments/hierarchy').then(departments=>{this.setState({departments:departments})});
		request('api/departments').then(departments=>{
			this.setState({departmentsList:departments});
			if(this.state.department){
				this.setState({department:departments.find(dep=>dep.id===this.state.department.id)});
			}
		});
		
	}

	renderTrees(dep){
		const active=this.state.department && this.state.department.id===dep.id;
		const label=<span style={{cursor:"pointer",fontWeight:active?"bold":"normal"}} key={dep.id} onClick={this.handleTreeValueClick.bind(this,dep)}>{dep.name}</span>
		return (<TreeView key={dep.id} nodeLabel={label} >
			{dep.children.map(child=>{
				if(child.children.length>0){
					return this.renderTrees(child)
				}
				else{
					const active=this.state.department && this.state.department.id===child.id;
					return (<span style={{display:"block",marginTop:"5px",cursor:"pointer",fontWeight:active?"bold":"normal"}} key={child.id} onClick={this.handleTreeValueClick.bind(this,child)}>{child.name}</span>)
				}
				})}
			</TreeView>)
	}

	handleTreeValueClick(dep,e){
		request(`api/departments/${dep.id}`).then(dep=>this.setState({department:dep}))
		// this.setState({department:dep});
	}

	openDepartmentModal(row={id:null,parent:null,description:"",name:""}) {
	    this.setState({ formData: this.normalizeFormData(row), openModal: true })
	}

	normalizeFormData({ id, name, parent, description }) {
 	   return { id, name: name || "", parent: parent || null, description };

	}	
	onCancel(e) {
	    e.preventDefault();
	    this.closeDepartmentModal();
	}

	onChangeDepartmentData(e) {
    	e.preventDefault();
    	this.validate() && request(`api/departments/${this.state.formData.id}`, { method: "PUT", body: JSON.stringify(this.state.formData) }, 'json')
	        .then(res => {
	            if (res && res.error) {
	                this.setState({ errors: res.validationErrors || [] })
	                throw new Error(res.message);
	            } else {
	                this.setState({ errors: [] })
	            }
	        })
	        .then(this.closeDepartmentModal.bind(this))
	        .catch()
	}

	handleChangeDepartmentCollection(type){
		request(`api/departments/${this.state.department.id}/${type}`,{ method: "PUT", body: JSON.stringify(this.state.department[type].map(item=>item.id)) }, 'json')
	}

	onAddDepartmentData(e) {
	    e.preventDefault();
	    this.validate(true) && request(`api/departments`, { method: "POST", body: JSON.stringify(this.state.formData) }, 'json')
	        .then(res => {
	            if (res && res.error) {
	                this.setState({ errors: res.validationErrors || [] })
	                throw new Error(res.message);
	            } else {
	                this.setState({ errors: [] })
	            }
	        })
	        .then(this.closeDepartmentModal.bind(this))
	        .catch()
	}

	closeDepartmentModal() {
	    this.setState({
	        openModal: false,
	        formData: {
	            id: "",
    	        name: "",
        	    description: "",
            	parent: null
        	}
    	},this.getDepartments);

	}

	handleEditDepartment() {
	    this.openDepartmentModal(this.state.department)
	}

	handleDeleteDepartment(row) {
        this.props.getConfirmModal({
                body: (<div className="modalFormRow">
                    <label>{getLocaleText("sure")}</label></div>),
                    callback: () => { request(`api/departments/${this.state.department.id}`, { method: "DELETE" }, 'json').then(this.getDepartments.bind(this)) },
                    open: true
                })
    }
    handleAddDepartment() {
        this.openDepartmentModal()
    }

    handleFormDataChange(e) {
        this.setState({ formData: {...this.state.formData, [e.target.name]: e.target.value } })
    }

    handleFormDataSelect(e){
    	this.setState({formData:{...this.state.formData,[e.target.name]:this.state.departmentsList.find(dep=>dep.id===parseFloat(e.target.value))}})
    }

    handleFormDataChangeRoles(e) {
    	this.setState({
            formData: {...this.state.formData,
                [e.target.name]: e.target.value.split(" ")
                    .map(role => {
                        return { name: role } })
            }
        })
    }

    validate(password = false) {
        let errors = [];
        let formData = this.state.formData;
        if (!formData.name) {
            errors.push("name")
        }

        this.setState({ errors })
        if (errors.length === 0) {
            return true;
        }
        this.props.setErrorText(errors.reduce((text, err) => {
            return text += err + "," }, "Please fill ") + "and push 'Create User' button again.");
        return false
    }

	render(){
		const columns=[
  				{className:"react-table-cell", header: getLocaleText('name'),"accessor":"name"},
				{className:"react-table-cell", header: getLocaleText('shipOrder'),"accessor":"order.number"},
				{className:"react-table-cell", header: getLocaleText('status'),"accessor":"order.status"},
				{className:"react-table-cell", header: getLocaleText('serialNumber'),"accessor":"order.tag.serialNumber"},
				{className:"react-table-cell", header: getLocaleText('battery'),"accessor":"order.tag.batteryCharge",render:({value})=>value && value.toFixed(2)+"%"},
		];
		const formStyles = {
		    content: {
		        background: '#356a35',
		        top: "15%",
		        left: "15%",
		        bottom: "auto",
		        right: "15%",
		        padding: "40px"
		    },
		    overlay: {
		        zIndex: 9999
		    }
		}


		const columns1=[
  				{className:"react-table-cell", header: "Name","accessor":"name"},
				{className:"react-table-cell", header: "Login","accessor":"login"},
				{className:"react-table-cell", header: "E-mail","accessor":"email"},
		]
		const {formData,errors}=this.state;
		return (
			<div className={styles.departments}>
				<div className={styles.departmentsTree}>
					<h1> {getLocaleText('departments')}<button onClick={this.handleAddDepartment.bind(this)} className="addBtn">{getLocaleText("addDepartment")}<span className="halflings halflings-plus-sign"></span></button> </h1>
					<div className={styles.treesContainer}>{Array.isArray(this.state.departments)?this.state.departments.map(this.renderTrees.bind(this)):this.renderTrees(this.state.departments)}
					</div>
				</div>
				<div className={styles.departmentsTables} >
					<h2 className={styles.headings}>{getLocaleText("description")}</h2>
					<div className={styles.customProperties}>
						<div className={styles.description}>{this.state.department && "Description:"+this.state.department.description}</div>
						<div className={styles.actions}>
							Actions:
							<button disabled={!this.state.department} className="editBtn" onClick={this.handleEditDepartment.bind(this)}><span className="halflings halflings-edit-sign"></span></button>
  							<button disabled={!this.state.department} className="deleteBtn" onClick={this.handleDeleteDepartment.bind(this)}><span className="halflings halflings-remove-sign"></span></button>
					</div>
					</div>
					<div className={styles.departmentsTabs}>
					<Tabs 
					active={styles.activeTab} 
					navItem={styles.navItem}
					tabPages={styles.tabPages}
					tabPage={styles.tabPage}
					tabsNav={styles.tabsNav}
					navs={[getLocaleText("assets"),getLocaleText("users")]}>
						<div>
						<button 
						disabled={!this.state.department} 
						onClick={e=>this.setState({assetModalOpen:true})} 
						className="addBtn" >{getLocaleText("manageAssets")}
						<span className="halflings halflings-edit-sign"></span>
					</button>
					<ReactTable 
						data={(this.state.department && this.state.department.assets) || []} 
						columns={columns}
						defaultPageSize={10}
					 /></div>
					<div>
					<button 
						disabled={!this.state.department} 
						onClick={e=>this.setState({usersModalOpen:true})} 
						className="addBtn" >{getLocaleText("manageUsers")}
						<span className="halflings halflings-edit-sign"></span>
					</button>
					<ReactTable 
						data={(this.state.department && this.state.department.users) || []} 
						columns={columns1}
						defaultPageSize={10}
					 /></div>
					</Tabs>
					</div>
				</div>
				<ModalEdit 
				collection={this.state.assets}
				inCollection={(this.state.department && this.state.department.assets) || []}
				displayName={'name'}
				isOpen={this.state.assetModalOpen}
				onEdit={(assets)=>{this.setState({department:{...this.state.department,assets}},this.handleChangeDepartmentCollection.bind(this,"assets"))}}
				onRequestClose={()=>{this.setState({assetModalOpen:false})}}
				/>
				<ModalEdit 
				collection={this.state.users}
				inCollection={(this.state.department && this.state.department.users) || []}
				displayName={'name'}
				displayNameAlt={'login'}
				isOpen={this.state.usersModalOpen}
				onEdit={(users)=>{this.setState({department:{...this.state.department,users}},this.handleChangeDepartmentCollection.bind(this,"users"))}}
				onRequestClose={()=>{this.setState({usersModalOpen:false})}}
				/>
				{this.state.openModal && (<Modal 
				isOpen={this.state.openModal}
				contentLabel="Modal"
				onRequestClose={this.closeDepartmentModal.bind(this)}
				style={formStyles} >
					<form className="modalForm" ref={ref=>this.form=ref} >
						<div className="modalFormRow">
							<label htmlFor="name">{getLocaleText("name")}</label>
							<input type="text" style={{border:errors.includes("name")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.name} name="name" />
						</div>
						<div className="modalFormRow">
							<label htmlFor="description">{getLocaleText("description")}</label>
							<input type="text" style={{border:errors.includes("description")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.description} name="description" />
						</div>
						<div className="modalFormRow">
							<label htmlFor="parent">{getLocaleText("parent")}</label>
							<select type="text" style={{border:errors.includes("parent")?"1px solid red":"none"}} onChange={this.handleFormDataSelect.bind(this)} value={(formData.parent && formData.parent.id) || ""} name="parent" >
								<option value={null}></option>
								{this.state.departmentsList.filter(dep=>formData.id!==dep.id).map(dep=>(<option key={dep.id} value={dep.id}>{dep.name}</option>))}
							</select>
						</div>
						<div className="modalFormActions">
						{this.state.formData.id?
							(<button className="formBtn" onClick={this.onChangeDepartmentData.bind(this)}>{getLocaleText("editDepartment")}</button>):
							(<button className="formBtn" onClick={this.onAddDepartmentData.bind(this)}>{getLocaleText("createDepartment")}</button>)}
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
		departments:[]
	}
}

const mapDispatchToProps=(dispatch)=>{
	return {
		getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
		
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Departments);