import React,{PureComponent} from 'react';
import styles from './Categories.m.css';
import {connect} from 'react-redux';
import {request} from '../../utils/request';
import ReactTable from 'react-table';
import getLocaleText from '../../utils/locale';
import TreeView from 'react-treeview';
import {getConfirmModal} from '../../actions/actionCreator';
import Modal from 'react-modal';
import ModalEdit from '../Presentational/ModalEdit';
class Categories extends PureComponent{
	constructor(props) {
		super(props);
		this.state={
    	categories: [],
    	categoriesList:[],
    	category: null,
    	openModal: false,
    	errors: [],
    	assets:[],
    	formData: {
    	    id: "",
    	    name: "",
    	    description: "",
    	    parent: ""
    		}
    	}
	}

	componentWillMount() {
	    this.getCategories();
		request('api/assets?view=kv').then(assets=>this.setState({assets}));

	}

	renderTrees(cat){
		const active=this.state.category && this.state.category.id===cat.id;
		const label=<span style={{cursor:"pointer",fontWeight:active?"bold":"normal"}} key={cat.id} onClick={this.handleTreeValueClick.bind(this,cat)}>{cat.name}</span>
		return (<TreeView  key={cat.id} nodeLabel={label} >
			{cat.category.map(child=>{
				if(child.category.length>0){
					return this.renderTrees(child)
				}
				else{
					const active=this.state.category && this.state.category.id===child.id;
					return (<span style={{display:"block",marginLeft:"12px",marginTop:"5px",cursor:"pointer",fontWeight:active?"bold":"normal"}} key={child.id} onClick={this.handleTreeValueClick.bind(this,child)}>{child.name}</span>)
				}
				})}
			</TreeView>)
	}


	handleTreeValueClick(cat,e){
		request(`api/categories/${cat.id}`).then(cat=>this.setState({category:cat}))
		// this.setState({category:dep});
	}

	openCategoryModal(row={id:null,parent:null,description:"",name:""}) {
	    this.setState({ formData: this.normalizeFormData(row), openModal: true })
	}

	normalizeFormData({ id, name, parent, description }) {
 	   return { id, name: name || "", parent: parent || null, description };

	}	
	onCancel(e) {
	    e.preventDefault();
	    this.closeCategoryModal();
	}

	handleChangeCategoryCollection(){
		request(`api/categories/${this.state.category.id}/assets`,{ method: "PUT", body: JSON.stringify(this.state.category.assets.map(asset=>asset.id)) }, 'json')
	}

	onChangeCategoryData(e) {
    	e.preventDefault();
    	this.validate() && request(`api/categories/${this.state.formData.id}`, { method: "PUT", body: JSON.stringify(this.state.formData) }, 'json')
	        .then(res => {
	            if (res && res.error) {
	                this.setState({ errors: res.validationErrors || [] })
	                throw new Error(res.message);
	            } else {
	                this.setState({ errors: [] })
	            }
	        })
	        .then(this.closeCategoryModal.bind(this))
	        .catch()
	}

	onAddCategoryData(e) {
	    e.preventDefault();
	    this.validate(true) && request(`api/categories`, { method: "POST", body: JSON.stringify(this.state.formData) }, 'json')
	        .then(res => {
	            if (res && res.error) {
	                this.setState({ errors: res.validationErrors || [] })
	                throw new Error(res.message);
	            } else {
	                this.setState({ errors: [] })
	            }
	        })
	        .then(this.closeCategoryModal.bind(this))
	        .catch()
	}

	closeCategoryModal() {
	    this.setState({
	        openModal: false,
	        formData: {
	            id: "",
    	        name: "",
        	    description: "",
            	parent: ""
        	}
    	},this.getCategories);
	}

	getCategories(){
		request('api/categories/hierarchy').then(categories=>{this.setState({categories:categories})})
		request('api/categories').then(categories=>{
			this.setState({categoriesList:categories});
			if(this.state.category){
				this.setState({category:categories.find(cat=>cat.id===this.state.category.id)})
			}
		})
	}

	handleEditCategory() {
	    this.openCategoryModal(this.state.category)
	}

	handleDeleteCategory(row) {
        this.props.getConfirmModal({
                body: (<div className="modalFormRow">
                    <label>{getLocaleText("sure")}</label></div>),
                    callback: () => { request(`api/categories/${this.state.category.id}`, { method: "DELETE" }, 'json').then(this.getCategories.bind(this))},
                    open: true
                })
    }
    handleAddCategory() {
        this.openCategoryModal()
    }

    handleFormDataChange(e) {
        this.setState({ formData: {...this.state.formData, [e.target.name]: e.target.value } })
    }

    handleFormDataSelect(e){
    	this.setState({formData:{...this.state.formData,[e.target.name]:this.state.categoriesList.find(cat=>parseFloat(e.target.value)===cat.id)}})
    }

    handleFormDropFile(e){
   	var input = e.target;

    var reader = new FileReader();
    reader.onload = ()=>{
      let dataURL = reader.result;
      console.log(dataURL.split(",")[0])
      dataURL=dataURL.split(",")[1];
      this.setState({formData:{...this.state.formData,icon:dataURL}})
    };
    reader.readAsDataURL(input.files[0]);
    // console.log(input.files[0])
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

		const {formData,errors}=this.state;
		return (
			<div className={styles.categories}>
				<div className={styles.categoriesTree}>
					<h1> {getLocaleText('categories')}<button onClick={this.handleAddCategory.bind(this)} className="addBtn">{getLocaleText("addCategory")}<span className="halflings halflings-plus-sign"></span></button> </h1>
					<div className={styles.treesContainer}>{Array.isArray(this.state.categories)?this.state.categories.map(this.renderTrees.bind(this)):this.renderTrees(this.state.categories)}
					</div>
				</div>
				<div className={styles.categoriesTables} >
					<h2 className={styles.headings}>{getLocaleText("description")}</h2>
					<div className={styles.customProperties}>
						<div className={styles.description}>{this.state.category && "Description:"+this.state.category.description}</div>
						{this.state.category && this.state.category.icon && (<div className={styles.iconImg} style={{backgroundImage:"url('"+(this.state.category && this.state.category.icon)+"')"}} />)}
						<div className={styles.actions}>
						Actions:
						<button disabled={!this.state.category} className="editBtn" onClick={this.handleEditCategory.bind(this)}><span className="halflings halflings-edit-sign"></span></button>
  						<button disabled={!this.state.category} className="deleteBtn" onClick={this.handleDeleteCategory.bind(this)}><span className="halflings halflings-remove-sign"></span></button>
						</div>
					</div>
					<h2 className={styles.headings}>
						{getLocaleText("assets")}
						<button 
						disabled={!this.state.category} 
						onClick={e=>this.setState({assetModalOpen:true})} 
						className="addBtn" >
							{getLocaleText("manageAssets")}
							<span className="halflings halflings-edit-sign"></span>
						</button>
 					</h2>
					<ReactTable 
						data={(this.state.category && this.state.category.assets) || []} 
						columns={columns}
						defaultPageSize={10}
						 />
				</div>

					
				<ModalEdit 
				collection={this.state.assets}
				inCollection={(this.state.category && this.state.category.assets) || []}
				displayName={'name'}
				isOpen={this.state.assetModalOpen}
				onEdit={(assets)=>{this.setState({category:{...this.state.category,assets}},this.handleChangeCategoryCollection.bind(this))}}
				onRequestClose={()=>{this.setState({assetModalOpen:false})}}
				/>


				{this.state.openModal && (<Modal 
				isOpen={this.state.openModal}
				contentLabel="Modal"
				onRequestClose={this.closeCategoryModal.bind(this)}
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
							<select style={{border:errors.includes("parent")?"1px solid red":"none"}} onChange={this.handleFormDataSelect.bind(this)} value={formData.parent && formData.parent.id} name="parent" >
								<option value="null"></option>
								{this.state.categoriesList.filter(cat=>cat.id!==formData.id).map(cat=>(<option key={cat.id} value={cat.id}>{cat.name}</option>))}
							</select>
						</div>
						<div className="modalFormRow">
							<label htmlFor="icon">{getLocaleText("icon")}</label>
							<input type="file" style={{border:errors.includes("parent")?"1px solid red":"none"}} onChange={this.handleFormDropFile.bind(this)} name="icon" />
						</div>
						<div className="modalFormRow">
							<div className={styles.imgPreview} style={{backgroundImage:"url('data:image/png;base64,"+(formData.icon || "")+"')"}} />
						</div>	
						<div className="modalFormActions">
						{this.state.formData.id?
							(<button className="formBtn" onClick={this.onChangeCategoryData.bind(this)}>{getLocaleText("editCategory")}</button>):
							(<button className="formBtn" onClick={this.onAddCategoryData.bind(this)}>{getLocaleText("createCategory")}</button>)}
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
		categories:[]
	}
}

const mapDispatchToProps=(dispatch)=>{
	return {
		getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
		
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Categories);