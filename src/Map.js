import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker
} from "react-leaflet";
import L from "leaflet";
import './leaflet.css'

function Map(props) {
 
  const position = props.position;
  const zoom = props.zoom;
  const locationIcon = new L.Icon({
    iconUrl: "/images/map-marker-black.png",
    iconRetinaUrl:"/images/map-marker-black.png",
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(28, 40),
    className: "location-icon",
  });

  const clickHandler = () => {
    console.log("clicked");
  };
  
  const style = {
    border: 'solid 1px lightblue',
    backgroundColor: '#333333',    
    marginTop: '-15px',  
    width: '100vw',
    height: '100vh',
    zIndex: '0',
    overflow:'hidden'
  };
  return (
    <div style={{ width: "100%", height: "100%" }} >
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} style={style}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />     
        <Marker
          key={Math.random().toString()}
          position={[position[0], position[1]]}
          eventHandlers={{ click: clickHandler }}
          icon={locationIcon} 
          />        
    </MapContainer>
    </div>
  );
}

export default Map;
