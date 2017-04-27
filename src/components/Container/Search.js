import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitContainer from './SplitContainer';
import {divIcon} from 'leaflet';
import { Map, TileLayer, Marker, Tooltip, GeoJSON,LayersControl } from 'react-leaflet';
import { request } from '../../utils/request';
import { getGeoZonesAsync,setMapCenter} from '../../actions/actionCreator';
import Autocomplete from 'react-autocomplete';
import ReactTable from 'react-table';
import getLocaleText from '../../utils/locale';
class Search extends Component {

  constructor(props) {
    super(props);
    this.state = { orders: [], number: "", id: "",order:"" };
  }

 componentWillMount() {
    this.props.getGeoZonesAsync();
  }

componentWillUnmount() {
	this.props.setMapCenter([this.props.settings.lat,this.props.settings.lng]);
}

  componentDidMount() {
    request('api/orders?view=geo').then(json => {
      this.setState({ orders: json || []});
      if(this.props.location.state && json.find){
        let active = json.find(order=> order.tag.serialNumber===this.props.location.state);
        this.setState({id:active.id})
      }
    }).catch(e => console.log(e));

  }

  componentDidUpdate(){
  	this.map=this.refs.map;
  }

  handleShowOnMap(position,id){
  	this.setState({id},this.renderMarkers);
  	this.map.leafletElement.setView([position.latitude,position.longitude],this.map.leafletElement.getZoom())
  }

  handleReturnToDefault(){
  	this.map.leafletElement.setView([this.props.settings.lat,this.props.settings.lng],this.props.settings.zoom);
  	this.props.setMapCenter([this.props.settings.lat,this.props.settings.lng]);
  	this.setState({id:""})
  }

  renderMarkers() {
    return this.state.orders.filter(item=>item.tag).map(item => {
      const position = [parseFloat(item.tag.latitude), parseFloat(item.tag.longitude)];
		if(!item.tag.latitude || !item.tag.longitude){

			return null;
		}
    let className="";
    switch(item.attributes["Truck Type"]){
      case "Pipe":
        className+="pipe";
        break;
      case "Hopper(tolva)":
      case "Closed box parquet":
      case "Closed box granel":
        className+="truck";
        break;
      case "Container":
        className+="longtruck";
        break;
      case "Open cage full":
      case "Open cage simple":
        className+="opentruck";
        break;
      default:
        className+="";

    }
		if(item.id===this.state.id){
        className+=" active";
      }
			const icon=divIcon({className:className,iconSize:[30,30],iconAnchor:[15,30]})
			return (

        <Marker icon={icon} key={item.tag.serial+"mark"+Math.random()} position={position} onClick={e=>{this.handleShowOnMap(item.tag,item.id) }} >
      <Tooltip>
        <div>
          <p><b>{getLocaleText("shipOrder")}: </b> {item.number}</p>
          <p><b>{getLocaleText("orderStatus")}: </b> {item.status}</p>
          <p><b>{getLocaleText("truckType")}: </b>{item.attributes["Truck Type"]}</p>
          <p><b>{getLocaleText("licensePlate")}: </b>{item.attributes["License Plate"]}</p>
          <p><b>{getLocaleText("driverName")}: </b>{item.attributes["Driver Name"]}</p>
          <p><b>{getLocaleText("battery")}: </b>{item.tag.batteryCharge && item.tag.batteryCharge.toFixed(0)+"%"}</p>
        </div>
      </Tooltip>
		</Marker>
      )
    })
  }
  handleOrderSelect(e) {
    let value = e;
    let order = this.state.orders.find((order) => {
      return String(order.id) === String(value)
    });
    if (order) {
      this.setState({ number: order.number})
    }
  }

  handleOrderChange(e) {
    let value = e.target.value;
    this.setState({ number: value})
  }

  handleSearch() {
    let query={properties:[{
          "name": "status",
          "op": "neq",
          "value": "Closed"
  }]};

    if(this.state.number){
      query.properties=query.properties.concat([
        {
          "name": "number",
          "op": "like",
          "value": "%" + this.state.number.toString().trim() + "%",
          operator:"OR"
  },    {
          "name": "Truck Type",
          "op": "like",
          "value": "%" + this.state.number.toString().trim() + "%",
          operator:"OR"
  },    {
          "name": "License Plate",
          "op": "like",
          "value": "%" + this.state.number.toString().trim() + "%",
          operator:"OR"
  },    {
          "name": "Drive Name",
          "op": "like",
          "value": "%" + this.state.number.toString().trim() + "%",
          operator:"OR"
  }
 ])
    }
    request('api/orders/query?view=geo', { method: "POST", body: JSON.stringify(query || []) }, 'json').then(json => this.setState({ orders: json.error?[]:json}))
  }

  renderAside() {
  	const columns=[
  	{header:getLocaleText("shipOrder"),accessor:"number"},
  	{header:getLocaleText("status"),minWidth:70,accessor:"status"},
  	{header:getLocaleText("tagSerial"),accessor:"tag.serialNumber",render:row=>(<div>{row.row.tag && row.row.tag.serialNumber}</div>)},
  	// {header:"Coordinates",sortable:false,render:row=>(<div>{row.row.tag.latitude} {row.row.tag.longitude}</div>)},
  	{minWidth:25,header:"",render:row=>row.row.tag &&  row.row.tag.latitude && row.row.tag.longitude && (<div onClick={this.handleShowOnMap.bind(this,row.row.tag,row.row.id)} className={`markerIcon ${this.state.id===row.row.id?"active":""}`} alt="Show on map" />
			)}
  	]
    return (
      <div className="searchAside">
    			<div className="searchTitle">{getLocaleText("search")}</div>
    			<button className="asideBtn" onClick={this.handleReturnToDefault.bind(this)}>{getLocaleText("returnToDefault")}</button>
    			<div style={{width: "80%",margin: "0 0 0 auto",display:"flex",flexDirection:"row"}}>
    				<Autocomplete
                		value={this.state.number} 
                		items={this.state.orders} 
                		onSelect={this.handleOrderSelect.bind(this)} 
                		onChange={this.handleOrderChange.bind(this)} 
                		getItemName={item=>String(item.number)} 
                		getItemValue={item=>String(item.id)} 
                		renderItem={(item)=>(<div >{item.number}</div>)}
                		inputProps={{style:{width:'100%'},onKeyDown:e=>e.which===13 && this.handleSearch()}}
                		shouldItemRender={(state,value)=>{return state.number.toLowerCase().includes(value.toLowerCase())}} 
                		menuStyle={{color:'white',background:'#2c6834',zIndex:"9999",border:"1px solid lightgrey",position:"absolute",transform:"translateY(-10px) translateX(-10px)"}} 
                		wrapperStyle={{flex:"1 0 40px"}}
                		wrapperProps={{width:'100%'}}
                 		placeholder="Shipping order"/><button className="searchBtn asideBtn" onClick={this.handleSearch.bind(this)}>{getLocaleText("search")}</button>
                </div>
    			

    			 <ReactTable defaultSorting={[{id:"number",desc:false}]} showPageSizeOptions={false} style={{width:"100%"}} defaultPageSize={10} columns={columns} data={this.state.orders} />
    		</div>
    );
  }

  onEachFeature(feature,layer){
  	layer.bindTooltip(` <div>
          <p><b>Name : </b>${feature.name}</p></div>`)
    console.log(layer);
    layer.options={
      ...layer.options,
      color:'rgba(40,130,20,1.0)',
      weight:1,
      fillColor:'rgba(40,130,20,1.0)',
      fillOpacity:0.3+feature.lvl/5
    }

  }
 renderLayers() {
    if (this.props.settings && this.props.settings.layers) {
      return this.props.settings.layers.map(layer => (
        <LayersControl.BaseLayer name={layer.name} key={layer.name}>
			   <TileLayer 
         maxZoom={layer.maxZoom}
			   url={layer.tilingEngineUrl} 
			   attribution={layer.contributions}/>
			</LayersControl.BaseLayer>
      ))
    }
    return null;
  }

  renderMap() {
    return (
      <div style={{width:'100%',height:'100%'}}>
     {this.props.settings &&  (<Map 
        onMousemove={(e)=>{document.getElementById('mapLatitude').innerHTML="Lat: "+e.latlng.lat;
                          document.getElementById('mapLongitude').innerHTML="Lng: "+e.latlng.lng;}}
     		ref="map"
			center={this.props.center || [this.props.settings.lat,this.props.settings.lng]}
			zoom={this.props.settings.zoom}
			maxZoom={20}
			>

			{this.props.geoJson.features.length>0 && <GeoJSON onEachFeature={this.onEachFeature} data={ this.props.geoJson} ></GeoJSON>}
			<LayersControl position='topright'>
			  <LayersControl.BaseLayer name={this.props.settings.name || "default"} checked={true}>
			    <TileLayer maxZoom={this.props.settings.maxZoom} url={this.props.settings.tilingEngineUrl} attribution={this.props.settings.contributions}/>
			  </LayersControl.BaseLayer>
			  {this.renderLayers()}	 
			</LayersControl>    		
			  {this.renderMarkers()}
            <div className="positionControl">
            <div id="mapLatitude"></div>
            <div id="mapLongitude"></div>
          </div>
		</Map>) 
	}

	</div>
    );
  }

  render() {
    return (
      <div className="searchContainer">
			<SplitContainer 
				left={this.renderAside()} 
				right={this.renderMap()}>
			</SplitContainer>
		</div>
    )
  }
}

const mapStateToProps = ({App}) => {
  return {
    geoJson: App.geoJson,
    settings: App.settings,
    center:App.center,
    locale:App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getGeoZonesAsync: () => dispatch(getGeoZonesAsync()),
    setMapCenter:(pos)=>dispatch(setMapCenter(pos))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
