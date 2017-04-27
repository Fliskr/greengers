import React,{PureComponent} from 'react';
import styles from './Assets.m.css';
// import {connect} from 'react-redux';
import Modal from 'react-modal';
import {request} from '../../utils/request';
import ReactTable from 'react-table';
import getLocaleText from '../../utils/locale';
import Tabs from '../Presentational/Tabs';
import TreeView from 'react-treeview';

class Assets extends PureComponent{
	constructor(props) {
		super(props);
		this.state={
			assets:[],
			asset:{},
			openModal:false,
			errors:[],
			categories:[],
			departments:[],
			formData:{
				order:{},
				categories:[],
				departments:[],
				name:"",
				id:null,
				attributes:{}
			}
		}
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

	renderCategoriesTree(dep){

	const label=<span className={styles.treeLabel}>{dep.name}<input className={styles.treeCb} type="checkbox" checked={this.isDepChecked(dep,this.state.formData.categories)} onChange={this.handleCategoriesChange.bind(this,dep)}/></span>
	return (<TreeView 
	      	key={dep.id}
	      	nodeLabel={label}
	      	>
	      	{dep.category.map(this.renderCategoriesTree.bind(this))}
	      	</TreeView>)
	}

	isDepChecked(deps,dep){
		return this.idInArray(dep,deps);
	}

	idInArray(arr,obj){
		if(Array.isArray(arr)){
			return arr.find(item=>item.id===obj.id);
		}
		return false;
	}

	componentWillMount() {
		this.getAssets();
		request('api/departments/hierarchy').then(departments=>this.setState({departments}));
		request('api/categories/hierarchy').then(categories=>this.setState({categories}));
	}

	getAssets(){
		request('api/assets').then(assets=>this.setState({assets}));
	}

	handleCategoriesChange(dep,e){
		let categories=[];
		if(!e.target.checked){
			categories=[...this.state.formData.categories].filter(fdep=>fdep.id!==dep.id);
		}else{
			categories=[...this.state.formData.categories,{id:dep.id,name:dep.name}]
		}
		this.setState({formData:{...this.state.formData,categories:categories}})
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

	handleFormDataChange(e){
		this.setState({formData:{...this.state.formData,[e.target.name]:e.target.value}})

	}

	closeModal(){
		this.setState({
			openModal:false,
			errors:[],
			formData:{
				order:{},
				categories:[],
				departments:[],
				name:"",
				id:null,
				attributes:{}
			}},this.getAssets);
	}

	openModal(asset){
		if(asset){
			this.setState({openModal:true,formData:asset});
		}else{
			this.setState({openModal:true});
		}
	}

	onChangeUserData(e) {
		e.preventDefault();
	    let data = this.state.formData;
	    request(`api/assets/${data.id}`, { method: "PUT", body: JSON.stringify(data)})
	    .then(this.closeModal.bind(this))
	}

	onAddUserData(e) {
		e.preventDefault();
	    let data = this.state.formData;
	    request('api/assets', { method: "POST", body: JSON.stringify(data)}).then(this.closeModal.bind(this))
	}

	onCancel() {
	    this.closeModal();
	}

	handleEditUser(row){
		this.openModal(row);
	}

	handleDeleteUser(row){
		request(`api/assets/${row.id}`,{method:"DELETE"}).then(this.getAssets.bind(this));
	}

	render(){

		const columns=[
                {
                	className:"react-table-cell", 
                	header: getLocaleText("name"),
                	"accessor":"name",
                	minWidth:300,
                	render:row=>(<div className={styles.assetsTh} onClick={e=>{this.setState({asset:row.row}) } } >{row.row.name}</div>)
				},
				{className:"react-table-cell", header: getLocaleText('shipOrder'),"accessor":"order.number"},
				{className:"react-table-cell", header: getLocaleText('status'),"accessor":"order.status"},
				{className:"react-table-cell", header: getLocaleText('serialNumber'),"accessor":"order.tag.serialNumber"},
				{className:"react-table-cell", header: getLocaleText('battery'),"accessor":"order.tag.batteryCharge",render:({value})=>value && value.toFixed(2)+"%"},
				{className:"react-table-cell",minWidth:60,render:({row})=>{return (<div>
  					<button className="editBtn" onClick={this.handleEditUser.bind(this,row)}><span className="halflings halflings-edit-sign"></span></button>
  					<button className="deleteBtn" onClick={this.handleDeleteUser.bind(this,row)}><span className="halflings halflings-remove-sign"></span></button>
  				</div>)}}
		];
		const columns1=[
			{className:"react-table-cell", header: "Attribute","accessor":"key",minWidth:150},
			{className:"react-table-cell", header: "Value","accessor":"value",minWidth:150},
		]
		const columns2=[
			{className:"react-table-cell", header: "Attribute","accessor":"key"},
			{className:"react-table-cell", header: "Value","accessor":"value"},
		]
		const formStyles = {
	  		content: {
	    		background: '#356a35',
	    		top: "15%",
	    		left: "15%",
	    		bottom: "auto",
	    		right: "15%",
	    		padding: "40px"
	 		}
		};
		const formData=this.state.formData;
		const errors=this.state.errors;
		return (
			<div className={styles.container}>
				<div className={styles.actions}>
					<button className="addBtn" onClick={this.openModal.bind(this,null)}>
						{getLocaleText("addAsset")}<span className="halflings halflings-plus-sign" ></span>
					</button>
				</div>
				<div className={styles.assets}>
					{this.state.openModal && (<Modal 
			      		isOpen={this.state.openModal}
						contentLabel="Modal"
						onRequestClose={this.closeModal.bind(this)}
						style={formStyles}
			      		>
						<form className="modalForm" ref={ref=>this.form=ref}>
								<Tabs
								tabPage={styles.tabPage}
								tabPages={styles.tabPages}
								navs={["Info","Categories","Departments","Attributes"]} >
								<div>
									<div className="modalFormRow">
										<label htmlFor="name">{getLocaleText("name")}</label>
										<input type="text" style={{border:errors.includes("name")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.name} name="name" />
									</div>
									{formData.order &&(<div className="modalFormRow">
										<label htmlFor="order">{getLocaleText("order")}</label>
										<input disabled type="text" style={{border:errors.includes("order")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.order.number} name="order" />
									</div>)}
									{formData.order && formData.order.tag && (<div className="modalFormRow">
										<label htmlFor="tag">{getLocaleText("tag")}</label>
										<input disabled type="text" style={{border:errors.includes("tag")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.order.tag.serialNumber} name="tag" />
									</div>)}

								</div>
		      					<div className={styles.departmentsTree} >
		      						{this.state.categories.map(this.renderCategoriesTree.bind(this))}		
		      					</div>
		      					<div className={styles.departmentsTree} >
		      						{this.state.departments.map(this.renderDepartmentsTree.bind(this))}		
		      					</div>
		      					<div className={styles.attributesModal}>
		      						<ReactTable 
									data={
										(formData.attributes && 
										Object.entries(formData.attributes)
										.map(items=>{return {key:items[0],value:items[1]}})) || []} 
									className={styles.attributesTable}
									columns={columns2}
				  					defaultPageSize={10}
									 />
		      					</div>
								</Tabs>
								<div className="modalFormActions">
								{this.state.formData.id?
									(<button className="formBtn" onClick={this.onChangeUserData.bind(this)}>{getLocaleText("edit")}</button>):
									(<button className="formBtn" onClick={this.onAddUserData.bind(this)}>{getLocaleText("edit")}</button>)}
									
									<button className="formBtn" onClick={this.onCancel.bind(this)}>{getLocaleText("cancel")}</button>
								</div>

						</form>
	      			</Modal>)}
					<ReactTable 
						data={this.state.assets} 
						className={styles.assetsTable}
						columns={columns}
						getTrProps={(state,rowInfo,column)=>{
							return {style:{
								border: (rowInfo && rowInfo.row.id===this.state.asset.id)? '1px solid grey' : '1px solid transparent',
							}}}
						} />
					<ReactTable 
						data={(this.state.asset &&  this.state.asset.attributes && Object.entries(this.state.asset.attributes).map(items=>{return {key:items[0],value:items[1]}})) || []} 
						columns={columns1}
						showPagination={false}
	  					showPageSizeOptions={false}
	  					defaultPageSize={20}
						 />
				</div>
			</div>
			)
	}

}

export default Assets;