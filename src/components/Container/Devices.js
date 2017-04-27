import React, { Component } from 'react';
import {connect} from 'react-redux';
import {request} from '../../utils/request';
import {getTagsAsync,setMapCenter,getConfirmModal,setErrorText} from '../../actions/actionCreator';
import {browserHistory} from 'react-router';
import ReactTable from 'react-table';
import getLocaleText from '../../utils/locale';

import Modal from 'react-modal';

class Devices extends Component {

  constructor(props) {
  	super(props);
  	this.state={
  		openModal:false,
  		errors:[],
  		formData:{
  			
  			type:"",
  			serialNumber:"",
  			name:"",
  			latitude:"",
  			longitude:""
  		}
  	};
  }
componentWillMount() {
  this.props.getTagsAsync();
}

componentDidMount() {
	this.interval=setInterval(this.props.getTagsAsync,1000*15)
}

componentWillUnmount() {
	clearInterval(this.interval)
}

handleClick(row, e) {
  this.props.setMapCenter([row.row.latitude, row.row.longitude]);
browserHistory.push({pathname:'/search',state:row.row.serialNumber});
}

openTagModal(row){
	this.setState({openModal:true})
	if(row){
		this.setState({formData:row})
	}
}
closeTagModal(){
	this.setState({openModal:false,
			errors:[],
  			formData:{
  			
  			type:"",
  			serialNumber:"",
  			name:"",
  			latitude:"",
  			longitude:""
  		}},this.props.getTagsAsync)
}

handleFormDataChange(e){
	let value = e.target.value;
	if(e.target.name==="type" && value!=="BEACON"){
		this.setState({formData:{...this.state.formData,latitude:"",longitude:"",[e.target.name]:value}})
		return
	}
	this.setState({formData:{...this.state.formData,[e.target.name]:value}})
}

onCancel(e){
	e.preventDefault();
	this.closeTagModal();
}

onChangeTagData(e){
	e.preventDefault();
	let data=this.state.formData;
	if(data.longitude){
		data.longitude=parseFloat(data.longitude.toString().replace(',','.'));
	}
	if(data.latitude){
		data.latitude=parseFloat(data.latitude.toString().replace(',','.'));
	}

	this.validate() && request(`api/tags/${this.state.formData.id}`,{method:"PUT",body:JSON.stringify(data)},'json')
	.then(res=>{
		if(res && res.error){
			this.setState({errors:res.validationErrors || []})
			throw new Error(res.message);
		}else{
			this.setState({errors:[]})
		}
	})
	.then(this.closeTagModal.bind(this))
	.catch()
}

onAddTagData(e){
	e.preventDefault();
	this.validate() && request(`api/tags`,{method:"POST",body:JSON.stringify(this.state.formData)},'json')
	.then(res=>{
		if(res && res.error){
			this.setState({errors:res.validationErrors || []})
			throw new Error(res.message);
		}else{
			this.setState({errors:[]})
		}
	})
	.then(this.closeTagModal.bind(this))
	.catch()
}

handleEditTag(row){
	this.openTagModal(row.row);
}

handleDeleteTag(row) {
	this.props.getConfirmModal({
		body:(<div className="modalFormRow">
             <label>Are you sure?</label>
             </div>),
		callback:()=>{request(`api/tags/${row.row.id}`, { method: "DELETE" }, 'json').then(this.props.getTagsAsync)},
		open:true})
  
}

handleChangeMode(row){
	request(`api/tags/${row.row.id}`,{method:"PUT",body:JSON.stringify({...row.row,mode:row.row.mode?0:1})},'json').then(this.props.getTagsAsync)
}

handleAddTag() {
	this.openTagModal()  
}

validate() {
    let errorMessage = "";
    let errors=[];
    let formData = this.state.formData;
	let regexp=/^-?\d+(\.|,)?\d*$/g;
    if (!(formData.type === "BEACON" || formData.type === "TAG")) {
        errorMessage += "Choose tag type. ";
        errors.push("type")
    }
    if (!formData.serialNumber) {
        errorMessage += "Fill tag's serial number. ";
        errors.push("serialNumber")
    }
    if (!formData.name) {
        errorMessage += "Fill tag's name. ";
        errors.push("name")
    }
    console.log(parseFloat(formData.latitude))
    if (formData.type === "BEACON" && (!formData.latitude.toString().match(regexp) || parseFloat(formData.latitude)<-91 || parseFloat(formData.latitude)>91)) {
        errorMessage += "Latitude should be valid coordinates between -90 and 90.";
        errors.push("latitude");
    }
    if (formData.type === "BEACON" && (!formData.longitude.toString().match(regexp) || parseFloat(formData.longitude)<-181 || parseFloat(formData.longitude)>181)) {
        errorMessage += "Longitude should be valid coordinates between -180 and 180.";
        errors.push("longitude");
    }
    this.setState({errors})
    if (!errorMessage) {
        return true;
    }
    this.props.setErrorText(errorMessage);
    return false
}

  render() {
  	const columns = [
  				{className:"react-table-cell", header: getLocaleText("type"),"accessor":"type",minWidth:30},
                {className:"react-table-cell", header: getLocaleText("serialNumber"), "accessor": 'serialNumber' },
                {className:"react-table-cell", header: getLocaleText("name"),"accessor":"name"},
                {className:"react-table-cell", header: getLocaleText("lat"), "accessor": 'latitude' },
                {className:"react-table-cell", header: getLocaleText("lng"), "accessor": 'longitude' }, 
                {className:"react-table-cell", header: getLocaleText("battery"),minWidth:30, "accessor": 'batteryCharge',render:({value})=>(<div>{value && value.toFixed(1)+' %'}</div>) },
                {className:"react-table-cell", header: "",minWidth:120,maxWidth:140,render:(row)=>(
                	<div className="actions">
						{row.row.itraqId && (<button className="editBtn" onClick={this.handleChangeMode.bind(this,row)}>
  							{row.row.mode ? "ON":"OFF"}
  						</button>)}
                		{row.row.itraqId && row.row.type==="TAG" && (<div className="markerIcon" onClick={this.handleClick.bind(this,row)}></div>)}
  						<button className="editBtn" onClick={this.handleEditTag.bind(this,row)}>
  							<span className="halflings halflings-edit-sign"></span>
  						</button>
  						<button className="deleteBtn" onClick={this.handleDeleteTag.bind(this,row)} >
  							<span className="halflings halflings-remove-sign"></span>
  						</button>
  					</div> ) }
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
      			<button className="addBtn" onClick={this.handleAddTag.bind(this)}>{getLocaleText("addTag")}<span className="halflings halflings-plus-sign"></span></button>
      		</div>
			<ReactTable defaultSorting={[{id:"id",desc:false}]} data={this.props.tags} columns={columns} defaultPageSize={10} ref={ref=>this.table=ref} />
			{this.state.openModal && (<Modal 
      		isOpen={this.state.openModal}
			contentLabel="Modal"
			onRequestClose={this.closeTagModal.bind(this)}
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
					<div className="modalFormRow">
						<label htmlFor="type">{getLocaleText("type")}</label>
						<select disabled={formData.id} style={{border:errors.includes("type")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.type} name="type" >
							<option value=""></option>
							<option value="TAG">TAG</option>
							<option value="BEACON">BEACON</option>
						</select>
					</div>
					<div className="modalFormRow">
						<label htmlFor="serialNumber">{getLocaleText("serialNumber")}</label>
						<input type="text" style={{border:errors.includes("serialNumber")?"1px solid red":"none"}} onChange={this.handleFormDataChange.bind(this)} value={formData.serialNumber} name="serialNumber" />
					</div>
					<div className="modalFormRow">
						<label htmlFor="latitude">{getLocaleText("lat")}</label>
						<input disabled={formData.type==='TAG'} style={{border:errors.includes("latitude")?"1px solid red":"none"}} type="text" onChange={this.handleFormDataChange.bind(this)} value={formData.latitude} name="latitude" />
					</div>
					<div className="modalFormRow">
						<label htmlFor="longitude">{getLocaleText("lng")}</label>
						<input disabled={formData.type==='TAG'} style={{border:errors.includes("longitude")?"1px solid red":"none"}} type="text" onChange={this.handleFormDataChange.bind(this)} value={formData.longitude} name="longitude" />
					</div>
					<div className="modalFormRow">
						<div className={this.state.modalError && "errorText"}>
							{this.state.modalError}
						</div>
					</div>
					<div className="modalFormActions">

					{this.state.formData.id?
						(<button className="formBtn" disabled={!formData.type} onClick={this.onChangeTagData.bind(this)}>{getLocaleText("editTag")}</button>):
						(<button className="formBtn" disabled={!formData.type} onClick={this.onAddTagData.bind(this)}>{getLocaleText("addTag")}</button>)}
						
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
		geoJson:App.geoJson,
		settings:App.settings,
		tags:App.tags,
		tagsAvailable:App.tagsAvailable,
		locale:App.locale
	}
}

const mapDispatchToProps=(dispatch)=>{
	return {
		getTagsAsync:()=>dispatch(getTagsAsync()),
		setMapCenter:(pos)=>dispatch(setMapCenter(pos)),
		getConfirmModal:(confirm)=>dispatch(getConfirmModal(confirm)),
		setErrorText:(text)=>dispatch(setErrorText(text,5000))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Devices);
