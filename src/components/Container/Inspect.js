import React, { Component } from 'react';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import { getInspectedOrders,setMapCenter } from '../../actions/actionCreator';
import { request } from '../../utils/request';
import Autocomplete from 'react-autocomplete';
import getLocaleText from '../../utils/locale';
class Inspect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "number": "",
      "finding":true,
      "id":"",
      "tag": "",
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

  componentDidMount() {
    this.props.getInspectedOrders();
  }

  renderOrders = () => {
    return this.props.orders.map((order, i) => (
      <option key={order.id} value={order.id}>{order.number}</option>
    ))
  }

  handleOrderSelect(e) {
    let value = e;
    let order = this.props.orders.find((order) => {
      return String(order.id) === String(value) });
    if (order) {
      this.setState({...order,finding:true  })
      this.attributes = {...order}
    }
  }

  handleOrderChange(e) {
    let value = e.target.value;
    this.setState({ number: value, id: "" ,finding:false})
  }


  async handleCheckInButton(type,e) {
    e.preventDefault();
    let state={...this.state};
    delete state.error;
    await request(`api/orders/${this.state.id}/operations/inspect?status=${type|| "Not Required"}`, { method: "POST", body: JSON.stringify(state) },'text');
    this.clearState();
  }

  handleCancelButton(e) {
    e.preventDefault();
    this.clearState();
  }

  clearState() {
    this.setState({
      "number": "",
      "id":"",
      "tag": "",
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
    },this.props.getInspectedOrders)
  }

  async handleClick(){
    if(this.state.number){
        let tag=this.state.tag;
        this.props.setMapCenter([tag.latitude, tag.longitude]);
        browserHistory.push({pathname:'/search',state:tag.serialNumber})
    }
  }

  render() {
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
                renderItem={(item)=>(<div >{item.number}</div>)}
                inputProps={{style:{height:'100%',width:'100%'}}}
                shouldItemRender={(state,value)=>{return this.state.finding?true:state.number.toLowerCase().includes(value.toLowerCase())}} 
                menuStyle={{color:'white',background:'#2c6834',position:"relative",zIndex:"999",border:"1px solid lightgrey",top:"0",left:"0"}} 
                wrapperStyle={{flex:"1"}}
                wrapperProps={{height:"100%",width:'100%'}}/>     
            <div className="markerIcon" style={{visibility:this.state.id?"visible":"hidden"}} onClick={this.handleClick.bind(this)}></div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("tagSerial")}</label>
              <div className="rowLabel">{this.state.tag.serialNumber}</div>
          </div>
          <div className="cell">
              <label>{getLocaleText("licensePlate")}</label>
              <div className="rowLabel">{attributes["License Plate"]}</div>
          </div>
        </div>
        <div className="row">
          <div className="cell">

              <label>{getLocaleText("productType")}</label>
              <div className="rowLabel">{attributes["Product Type"]}</div>
          </div>
          <div className="cell">
              <label>{getLocaleText("truckType")}</label>
              <div className="rowLabel">{attributes["Truck Type"]}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("driverName")}</label>
              <div className="rowLabel">{attributes["Driver Name"]}</div>
          </div>
        </div>
        <div className="row">
          <div className="cell">
              <label>{getLocaleText("scndShipOrder")}</label>
              <div className="rowLabel">{attributes["2nd Ship Order"]}</div>
          </div>
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
          <button type="submit" disabled={this.state.id===""} onClick={this.handleCheckInButton.bind(this,"Passed")}>{getLocaleText("pass")}</button>
          <button type="submit" disabled={this.state.id===""} onClick={this.handleCheckInButton.bind(this,"Failed")}>{getLocaleText("fail")}</button>
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
    tags: App.tags,
    locale:App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInspectedOrders: () => dispatch(getInspectedOrders()),
    setMapCenter:(position)=>dispatch(setMapCenter(position))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Inspect);
