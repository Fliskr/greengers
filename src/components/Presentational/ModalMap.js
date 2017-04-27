import React,{PureComponent} from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, FeatureGroup, LayersControl, Polygon, Tooltip } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";

class ModalMap extends PureComponent{
	constructor(props) {
		super(props);
		this.state={zone:props.zone};
		
	}
 reverseCoordinates(coords) {
    return coords.map(coord => {
      return typeof coord[0] !== 'number' ? this.reverseCoordinates(coord) : [coord[1], coord[0]]
    })
  }
onEditZones(e) {
    let zones = e.layers.getLayers().map(newZone => {
        return {...newZone.toGeoJSON() }
    })
    let zone={...this.state.zone,geometry:zones[0].geometry};
    this.props.formDataChange({
        target: {
            name: "geometry",
            value: zone.geometry
        }
    });
    this.setState({zone:zone});
    e.layers.getLayers()[0].setLatLngs(this.reverseCoordinates(zone.geometry.coordinates))
}

renderGeoJSONData() {
    if (this.props.geoJson.features.length > 0 && this.state.zone) {
      return this.props.geoJson.features.filter(item=>this.props.zone.id===item.id)
      .map((item) => (
        <Polygon className="geoJSONPolygon" weight={1} color={'rgba(40,130,20,1.0)'} fillOpacity={0.3+item.lvl/5} fillColor={'rgb(40,130,20)'} id={item.id} item={item} key={item.id} positions={this.reverseCoordinates(item.geometry.coordinates)} >
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

	render(){

	return (
      <div style={{width:this.props.width,height:this.props.height}}>
     {this.props.settings &&  (<Map   onMousemove={(e)=>{document.getElementById('mapLatitudeModal').innerHTML="Lat: "+e.latlng.lat;
                          document.getElementById('mapLongitudeModal').innerHTML="Lng: "+e.latlng.lng;}}
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
						// onCreated={this.props.onAddZone}
						onEdited={this.onEditZones.bind(this)}
						// onDeleted={this.props.onDeleteZone}
      					position='topright'
      					draw={{rectangle:false,circle:false,point:false,marker:false,polyline:false,polygon:false}}
      					edit={{
      						remove:false
      					}}
    				/>
    				{this.renderGeoJSONData()}
    				
    			</FeatureGroup>
			</LayersControl>    		

			<div className="positionControl">
            <div id="mapLatitudeModal"></div>
            <div id="mapLongitudeModal"></div>
          </div>
		</Map>) 
	}
	</div>
    );
	}
}

const mapStateToProps = (state) => {
  return {
    geoJson: state.App.geoJson,
    zones: state.App.geoJson.features,
    settings: state.App.settings,
    center: state.App.center
  }
}
export default connect(mapStateToProps)(ModalMap)

