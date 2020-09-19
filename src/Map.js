import React from "react";
import {Map as LeafletMap, TileLayer} from "react-leaflet"
import "./Map.css"
import {showDataOnMap} from "./Util";

function Map({countries, casesType, center, zoom}) {
    return (
        <div className={"map"}>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                           attribution='&copy; <a href ="htpp://osm.org/copyright">
                OpenStreetMap</a> contributors'/>
                {/*loop and draw circle on the screen*/}
                {showDataOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map;