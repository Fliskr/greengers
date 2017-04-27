import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplitContainer from './SplitContainer';


import { Map, TileLayer, FeatureGroup, LayersControl, Polygon, Tooltip } from 'react-leaflet';
import { request } from '../../utils/request';
import { getGeoZonesAsync, setMapCenter,setErrorText } from '../../actions/actionCreator';

import ReactTable from 'react-table';
import { EditControl } from "react-leaflet-draw"
import Modal from 'react-modal';
import ModalMap from '../Presentational/ModalMap';
import getLocaleText from '../../utils/locale';
class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      zones:[],
      openModal: false,
      formData: {

        geometry: "",
        id: "",
        name: "",
        level: null,
        parentId:""
      }
    };
  }

  componentWillMount() {
    this.props.getGeoZonesAsync();
    request('api/zones?view=kv').then(zones=>this.setState({zones:zones || []}))
  }

  componentWillUnmount() {
    this.props.setMapCenter([this.props.settings.lat,this.props.settings.lng]);
  }

  componentDidUpdate() {
    this.map = this.refs.map;
  }

  handleNameClick(row) {
    this.setState({ openModal: true })
    if (row) {
      this.setState({ formData: {parentId:row.parentId || "", geometry: row.geometry, name: row.name, id: row.id, level: row.level } })
    }
  }
  handleReturnToDefault(){
    this.map.leafletElement.setView([this.props.settings.lat,this.props.settings.lng],this.props.settings.zoom);
    this.props.setMapCenter([this.props.settings.lat,this.props.settings.lng]);
    this.setState({id:""})
  }

  renderAside() {
    const columns = [
      { header: "ID", accessor: "id", minWidth: 25 },
      { header: getLocaleText("name"), accessor: "name"},
      { header: getLocaleText("level"), accessor: "level", minWidth: 35 },
      {className:"react-table-cell", header: "",minWidth:20,render:(row)=>(
                	<div className="actions">
  						<div className="editBtn" onClick={this.handleNameClick.bind(this,row.row)}>
  							<span className="halflings halflings-edit-sign"></span>
  						</div>
  					</div> ) }
  	]

    return (
      <div className="searchAside">
    			<div className="searchTitle">{getLocaleText("mapEditTool")}</div>
          <button className="asideBtn" onClick={this.handleReturnToDefault.bind(this)}>{getLocaleText("returnToDefault")}</button>
    			 <ReactTable defaultSorting={[{id:"id",desc:false}]} showPageSizeOptions={false} style={{width:"100%"}} defaultPageSize={10} columns={columns} data={this.props.zones} />
    		</div>
    );
  }

  async onAddZone(e) {
    let newZone = e.layer.toGeoJSON();
    console.log(e);
    newZone = { geometry: newZone.geometry, level: 1, name: "newZone" };
    let x = await request('api/zones', { method: "POST", body: JSON.stringify(newZone) }, 'json');
    if(x && x.error){
      this.props.setErrorText("Adding new zone failed",1500);
      return
    }
    e.layer.remove();
    this.props.getGeoZonesAsync();
    request('api/zones?view=kv').then(zones=>this.setState({zones:zones || []}))
    this.handleNameClick(x);
  }

  async onEditZone(e) {
    let zones = e.layers.getLayers().map(newZone => {
      return { name: newZone.options.item.name, id: newZone.options.id, geometry: newZone.toGeoJSON().geometry, level: 1 }
    })
    let promises = zones.map(zone => {
      if (zone.id) {
        return request(`api/zones/${zone.id}`, { method: "PUT", body: JSON.stringify(zone) }, 'json')
      }
      return request(`api/zones`, { method: "POST", body: JSON.stringify(zone) }, 'json')
    })
    await Promise.all(promises);
    this.props.getGeoZonesAsync();
    request('api/zones?view=kv').then(zones=>this.setState({zones:zones || []}))

  }

  async onDeleteZone(e) {
    let zones = e.layers.getLayers().map(zone => zone.options.id).map(zone => request(`api/zones/${zone}`, { method: "DELETE" }, 'json'))
    await Promise.all(zones);
    this.props.getGeoZonesAsync();
    request('api/zones?view=kv').then(zones=>this.setState({zones:zones || []}))
  }

  reverseCoordinates(coords) {
    return coords.map(coord => {
      return typeof coord[0] !== 'number' ? this.reverseCoordinates(coord) : [coord[1], coord[0]]
    })
  }

  closeZoneModal() {
    this.setState({
      openModal: false,
      formData: {

        geometry: "",
        id: "",
        name: "",
        level: null,
        parentId:""
      }
    }, this.props.getGeoZonesAsync)
  }
  handleFormDataChange(e) {
    let value = e.target.type==='number'  ? parseFloat(e.target.value) || 0 : e.target.value;
    this.setState({ formData: {...this.state.formData, [e.target.name]: value } })
  }
  onCancel(e) {
    e.preventDefault();
    this.closeZoneModal();
  }
  onChangeZoneData(e) {
    e.preventDefault();
    request(`api/zones/${this.state.formData.id}`, { method: "PUT", body: JSON.stringify(this.state.formData) }, 'json')
      .then(this.closeZoneModal.bind(this))
  }


  renderGeoJSONData() {
    if (this.props.geoJson.features.length > 0) {
      return this.props.geoJson.features.map((item) => (
        <Polygon id={item.id} className="geoJSONPolygon" weight={1} color={'rgba(40,130,20,1.0)'} fillOpacity={0.3+item.lvl/5} fillColor={'rgb(40,130,20)'} item={item} key={item.id} positions={this.reverseCoordinates(item.geometry.coordinates)} >
        	<Tooltip><div><p><b>Name:</b>{item.name}</p><p><b>ID:</b>{item.id}</p></div></Tooltip>
        </Polygon>
      ))
    }
    return null
  }

  renderLayers() {
    if (this.props.settings && this.props.settings.layers) {
      return this.props.settings.layers.map(layer => (
        <LayersControl.BaseLayer name={layer.name}  key={layer.name}>
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
     {this.props.settings &&  (<Map   onMousemove={(e)=>{document.getElementById('mapLatitude').innerHTML="Lat: "+e.latlng.lat;
                          document.getElementById('mapLongitude').innerHTML="Lng: "+e.latlng.lng;}}
      		ref="map"
			center={this.props.center || [this.props.settings.lat,this.props.settings.lng]}
			zoom={this.props.settings.zoom}
			maxZoom={20}
			>		
			<LayersControl position='topright'>
			  <LayersControl.BaseLayer name={this.props.settings.name || "default"} checked={true}>
			    <TileLayer maxZoom={this.props.settings.maxZoom} url={this.props.settings.tilingEngineUrl} attribution={this.props.settings.contributions}/>
			  </LayersControl.BaseLayer>
			  {this.renderLayers()}
			 
			    <FeatureGroup >
					<EditControl
						onCreated={this.onAddZone.bind(this)}
						// onEdited={this.onEditZone.bind(this)}
						onDeleted={this.onDeleteZone.bind(this)}
      					position='topright'
                edit={{edit:false}}
      					draw={{rectangle:false,circle:false,point:false,marker:false,polyline:false}}
    				/>
    				{this.renderGeoJSONData()}
    				
    			</FeatureGroup>
			</LayersControl>    		

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
        zIndex: 99999
      }
    }
    const formData = this.state.formData;
    return (
      <div className="searchContainer">
			<SplitContainer 
				left={this.renderAside()} 
				right={this.renderMap()}>
			</SplitContainer>
			{this.state.openModal && (<Modal 
        isOpen={this.state.openModal}
        contentLabel="Modal"
        onRequestClose={this.closeZoneModal.bind(this)}
        style={formStyles}
            >
          <form className="modalForm" ref={ref=>this.form=ref} >
            {formData.id && (<div className="modalFormRow">
              <label htmlFor="id">ID</label>
              <input disabled  onChange={this.handleFormDataChange.bind(this)} value={formData.id} type="text" name="id" />
            </div>)}
            <div className="modalFormRow">
              <label htmlFor="name">{getLocaleText("name")}</label>
              <input type="text" onChange={this.handleFormDataChange.bind(this)} value={formData.name} name="name" />
           </div>
            <div className="modalFormRow">
              <label htmlFor="level">{getLocaleText("level")}</label>
              <input type="number" onChange={this.handleFormDataChange.bind(this)} value={formData.level} name="level" />
            </div>
            <div className="modalFormRow">
              <label htmlFor="parentId">{getLocaleText("parentId")}</label>
              <select type="number" onChange={this.handleFormDataChange.bind(this)} value={formData.parentId} name="parentId">
                <option value="" />
                {this.state.zones.map(zone=>(<option key={zone.id} value={zone.id}>{zone.name}</option>))}
              </select>
            </div>
            <div className="modalFormRow">
              <ModalMap width="100%" height="300px" zone={formData} formDataChange={this.handleFormDataChange.bind(this)}  />
           </div>
            <div className="modalFormActions">
              <button disabled={!this.state.formData.name} className="formBtn" onClick={this.onChangeZoneData.bind(this)}>{getLocaleText("editZone")}</button>        
              <button className="formBtn" onClick={this.onCancel.bind(this)}>{getLocaleText("cancel")}</button>
            </div>
          </form>
            </Modal>)}
		</div>
    )
  }
}

const mapStateToProps = ({App}) => {
  return {
    geoJson: App.geoJson,
    zones: App.geoJson.features,
    settings: App.settings,
    center: App.center,
    locale: App.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getGeoZonesAsync: () => dispatch(getGeoZonesAsync()),
    setMapCenter: (pos) => dispatch(setMapCenter(pos)),
    setErrorText:(text)=>dispatch(setErrorText(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
