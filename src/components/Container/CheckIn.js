import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCheckinOrders,getTagsAsync } from '../../actions/actionCreator';
import { request } from '../../utils/request';
import Autocomplete from 'react-autocomplete';
import getLocaleText from '../../utils/locale';
class CheckIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "errors":[],
      finding:true,
      //TODO DELETE
      "trucks":{
        "default":[
          "Closed box parquet",
          "Closed box granel",
          "Open cage simple",
          "Open cage full",
          "Hopper(tolva)",
          "Container",
          "Pipe"
        ]
      },
      "number": "",
      "id": "",
      "tag": {serialNumber:""},
      "status":"",
      "attributes": {
        "License Plate": "",
        "Product Type": "",
        "Truck Type": "",
        "Driver Name": "",
        "2nd Ship Order": "",
        "Checked-In": "",
        "Inspection Status": "",
        "Dispatched": "",
        "Last Updated": "",
        "Checked-Out": "",

      }
    }
  }

  componentWillMount() {
    this.props.getCheckinOrders();
    this.props.getTagsAsync();
    
  }

//TODO DELETE
  componentDidMount(){
    request('api/attributes/trucks',{},'json').then(j=>this.setState({trucks:{...this.state.trucks,...j}}))
  }

  renderOrders = () => {
    return this.props.orders.map((order, i) => (
      <option key={order.id} value={order.id}>{order.number}</option>
    ))
  }

  renderTags = () => {
    return this.props.tags.map((tag, i) => (
      <option key={tag.id} value={tag.serialNumber}>{tag.serialNumber}</option>
    ))
  }
  renderOptions = (type) => {
    if (!this.props.attributes[type]) {
      return null
    }
    //TODO DELELE
    if(type==="Truck Type"){
      let trucks=this.state.trucks[this.state.attributes["Product Type"] || "default"] || [];
      return trucks.map((product, i) => (
      <option className="options" key={i} value={product}>{product}</option>
    ))
    }
    return this.props.attributes[type].map((product, i) => (
      <option className="options" key={i} value={product}>{product}</option>
    ))
  }

  handleOrderSelect(e) {
    let value = e;
    let order = this.props.orders.find((order) => {
      return String(order.id) === String(value) });
    if (order) {
      this.setState({...order,finding:true })
    }
  }

  handleOrderChange(e) {
    let value = e.target.value;
    this.setState({ number: value, id: "",finding:false })
  }

  handleTagChange(e,val) {

  console.log(arguments);
    if (e.target) {
      this.setState({ tag:{...this.state.tag, serialNumber:val},finding:false  })
    } else {
      this.setState({ tag: val,finding:true  })
    }
  }

  handleOptionChange(type, e) {
    this.setState({ attributes: {...this.state.attributes, [type]: e.target.value },finding:false  })
  }

  handleOptionSelect(type, e) {
    this.setState({ attributes: {...this.state.attributes, [type]: e },finding:true })
  }

  async handleCheckInButton(e) {
    e.preventDefault();
    let newOrder = {
      tag: this.state.tag,
      attributes: this.state.attributes,
      number: this.state.number
    }
    this.setState({errors:[]})
    let isError=false;
    if (!this.state.id) {
      try{
        isError=await request(`api/orders`, { method: "POST", body: JSON.stringify(newOrder) }, 'json')
        .then(res => {
          if(res.error){
            this.setState({errors:res.validationErrors || []})
            return true;
          }
          this.setState({ id: res.id,attributes:res.attributes })})
        .catch(err=>{
          this.setState({id:""})
        });
      }catch(err){
        this.setState({id:""})
      }
    }else{
      newOrder.id=this.state.id;
      isError=await request(`api/orders/${this.state.id}`, { method: "PUT", body: JSON.stringify(newOrder) }, 'json').then(res=>res.error);
    }
    if(!isError){

      await request(`api/orders/${this.state.id}/operations/checkIn`, { method: "POST", body: JSON.stringify(newOrder) }, 'json');
      this.clearState();
      
      this.props.getTagsAsync();
    }
      
  }

  handleCancelButton(e) {
    e.preventDefault();
    this.clearState();
  }

  handleAddTag() {
    //TODO: add fixedOverlay 
  }

  handleAddOrder(e) {
    e.preventDefault();
    if (this.state.number && !this.state.id) {

    }
  }

  clearState() {
    this.setState({
      "number": "",
      "id": "",
      "tag": {serialNumber:""},
      "status":"",
      "attributes": {
        "License Plate": "",
        "Product Type": "",
        "Truck Type": "",
        "Driver Name": "",
        "2nd Ship Order": "",
        "Checked-In": "",
        "Inspection Status": "",
        "Dispatched": "",
        "Last Updated": "",
        "Checked-Out": "",
      }
    }, this.props.getCheckinOrders)
  }

  shouldTagRender(state,value){
    if(this.state.finding){
      return true
    }
    return state.serialNumber.toLowerCase().includes(value.toLowerCase());
  }

  render() {
    const menuStyle = {
        color: 'white',
        background: '#2c6834',
        position: "relative",
        zIndex: "999",
        border: "1px solid lightgrey",
        top: "0",
        left: "0"
    };
    const attributes = this.state.attributes;
    return (
      <form className="form">
       <div className="row">
          <div className="cell">
              <label className="autocomplete">{getLocaleText("shipOrder")}</label>
              <Autocomplete  
                value={this.state.number} 
                items={this.props.orders} 
                onSelect={this.handleOrderSelect.bind(this)} 
                onChange={this.handleOrderChange.bind(this)} 
                getItemName={item=>String(item.number)} 
                getItemValue={item=>String(item.id)} 
                renderItem={(item)=>(<div >{item.number}|{item.status}</div>)}
                inputProps={{style:{height:'100%',width:'100%'}}}
                shouldItemRender={(state,value)=>{return this.state.finding?true:state.number.toLowerCase().includes(value.toLowerCase())}} 
                menuStyle={menuStyle} 
                wrapperStyle={{flex:"1",border:this.state.errors.includes("number")?"1px solid red":"none"}}
                wrapperProps={{height:"100%",width:'100%'}}/>        
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label className="autocomplete">{getLocaleText("tagSerial")}</label>
              <Autocomplete  
                value={this.state.tag.serialNumber} 
                items={this.props.tags} 
                onSelect={this.handleTagChange.bind(this)} 
                onChange={this.handleTagChange.bind(this)} 
                getItemName={item=>item} 
                getItemValue={item=>item.serialNumber} 
                renderItem={(item)=>(<div >{item.serialNumber}</div>)}
                shouldItemRender={this.shouldTagRender.bind(this)} 
                inputProps={{style:{height:'100%',width:'100%'}}}
                menuStyle={menuStyle} 
                wrapperStyle={{flex:"1",border:this.state.errors.includes("tag")?"1px solid red":"none"}}
                wrapperProps={{height:"100%",width:'100%'}}/>
          </div>
          <div className="cell">
              <label className="autocomplete">{getLocaleText("licensePlate")}</label>
                            <Autocomplete  
                value={attributes["License Plate"]} 
                items={this.props.attributes["License Plate"] || []} 
                onSelect={this.handleOptionSelect.bind(this,"License Plate")} 
                onChange={this.handleOptionChange.bind(this,"License Plate")}
                shouldItemRender={(state,value)=>{return this.state.finding?true:state.toLowerCase().includes(value.toLowerCase())}}  
                getItemName={item=>item} 
                getItemValue={item=>item} 
                renderItem={(item)=>(<div >{item}</div>)}
                inputProps={{style:{height:'100%',width:'100%'}}}
                menuStyle={menuStyle} 
                wrapperStyle={{flex:"1",border:this.state.errors.includes("License Plate")?"1px solid red":"none"}}
                wrapperProps={{height:"100%",width:'100%'}}/>
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("productType")}</label>
               <select style={{border:this.state.errors.includes("Product Type")?"1px solid red":"none"}} value={this.state.attributes["Product Type"]} onChange={this.handleOptionChange.bind(this,"Product Type")}>.
                  <option value=""></option>
                  {this.renderOptions("Product Type")}
              </select></div>
          <div className="cell">
              <label>{getLocaleText("truckType")}</label>
              <select style={{border:this.state.errors.includes("Truck Type")?"1px solid red":"none"}} value={this.state.attributes["Truck Type"]} onChange={this.handleOptionChange.bind(this,"Truck Type")}>.
                  <option value=""></option>
                  {this.renderOptions("Truck Type")}
              </select></div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="cell">
              <label className="autocomplete">{getLocaleText("driverName")}</label>
               <Autocomplete  
                value={this.state.attributes["Driver Name"]} 
                items={this.props.attributes["Driver Name"] || []} 
                onSelect={this.handleOptionSelect.bind(this,"Driver Name")} 
                onChange={this.handleOptionChange.bind(this,"Driver Name")}
                shouldItemRender={(state,value)=>{return this.state.finding?true:state.toLowerCase().includes(value.toLowerCase())}} 
                getItemName={item=>item} 
                getItemValue={item=>item} 
                renderItem={(item)=>(<div >{item}</div>)}
                inputProps={{style:{height:'100%',width:'100%'}}}
                menuStyle={menuStyle} 
                wrapperStyle={{flex:"1",border:this.state.errors.includes("Driver Name")?"1px solid red":"none"}}
                wrapperProps={{height:"100%",width:'100%'}}/></div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("scndShipOrder")}</label>
              <input type="text" style={{border:this.state.errors.includes("2nd Ship Order")?"1px solid red":"none"}}value={attributes["2nd Ship Order"]} onChange={e=>this.setState({...this.state,attributes:{...this.state.attributes,"2nd Ship Order":e.target.value}})} /></div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("orderStatus")}</label>
              <div className="rowLabel">{this.state.status}</div>
          </div>
          <div className="cell">
              <label>{getLocaleText("checkedIn")}</label>
              <div className="rowLabel">{attributes["Checked-In"]}</div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("inspectionStatus")}</label>
              <div className="rowLabel">{attributes["Inspection Status"]}</div>
          </div>
          <div className="cell">
              <label>{getLocaleText("dispatched")}</label>
              <div className="rowLabel">{attributes["Dispatched"]}</div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("lastUpdated")}</label>
              <div className="rowLabel">{attributes["Last Updated"]}</div>
          </div>
          <div className="cell">
              <label>{getLocaleText("checkedOut")}</label>
              <div className="rowLabel">{attributes["Checked-Out"]}</div>
          </div>
        </div>
        
        <div className="row">
          <button type="submit" onClick={this.handleCheckInButton.bind(this)}>{getLocaleText("checkIn")}</button>
          <button type="submit" onClick={this.handleCancelButton.bind(this)}>{getLocaleText("cancel")}</button>
        </div>

     </form>
    )
  }
}
const mapStateToProps = ({App}) => {

  return {
    token: App.token,
    orders: App.orders,
    tags: App.tagsAvailable,
    attributes: App.attributes,
    locale:App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCheckinOrders: () => dispatch(getCheckinOrders()),
    getTagsAsync:()=>dispatch(getTagsAsync())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckIn);



