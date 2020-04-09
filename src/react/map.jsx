import React from "react";
import mapboxgl from 'mapbox-gl';
import lodash from 'lodash';

mapboxgl.accessToken = "pk.eyJ1IjoidGhlcHJvZHVjZXIiLCJhIjoiczBvODhOMCJ9.CtNj7d3gId88Sc4M4fi_MQ";

export default class ReactMap extends React.Component {
    constructor(props) {
        super(props);

        this.map = null;   
        this.markers = [];     

        this.state = {
            lat: 38.0000,
            lng: -97.0000,
            zoom: 2
        }
    }

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: "mapbox://styles/theproducer/ck7xxh069082r1iqvwh0wdjju",
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        this.map.scrollZoom.disable();
        this.map.addControl(new mapboxgl.NavigationControl());

        this.map.resize();       

        this.map.on("move", () => {
            this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
            })
        });

        window.onresize = () => {
            const viewportHeight = window.innerHeight;
            this.mapContainer.parentElement.style.height = (viewportHeight - 120) + "px";
        }

        window.onresize();
    }

    componentDidUpdate() {
        console.log("perform an update on the map");
        if (this.map) {
            this.map.resize();
        }

        this.processMapEntries(this.props.entries);
    }

    shouldComponentUpdate(nextProps) {
        if (lodash.isEqual(this.props.entries, nextProps.entries)) {
            return false;
        }

        return true;
    }

    processMapEntries(entries) {
        // clear any existing markers
        this.markers.forEach((marker) => {
            marker.remove();
        });

        this.markers = [];

        let bounds = new mapboxgl.LngLatBounds();

        entries.forEach((entry) => {
            const markerElement = document.createElement("div");
            // const markerLabel = document.createElement("label");
            // markerLabel.innerText = entry.name;

            markerElement.className = "marker";
            markerElement.id = "marker-" + entry.id;
            // markerElement.appendChild(markerLabel);
            

            const offersGiftcard = entry.giftcard ? "Yes" : "No";
            const needsDonations = entry.donateurl !== "" ? "<a target='_blank' href='" + entry.donateurl + "'>Donate Here</a>" : "No";

            let msg = "<div class='entry'>";
            msg += "<header>";
            msg += "<h1>" + entry.name + "</h1>";
            msg += "</header>";
            msg += "<div class='business_type'>" + entry.type + "</div>";
            msg += "<div class='address'>";
            msg += entry.address + " " + entry.address2 + "<br/>";
            msg += entry.city + ", " + entry.state + " " + entry.zipcode;            
            msg += "</div>";
            msg += "<div class='hours'><strong>Hours: </strong>" + entry.hours + "</div>";
            msg += "<div class='contact'>";
            msg += "<div class='phone'><span class='icon'></span><a href='tel:" + entry.phone + "'>" + entry.phone + "</a></div>";
            if (entry.url !== "") {
                msg += "<div class='web'><span class='icon'></span><a target='_blank' href='" + entry.url + "'>Visit Website</a></div>";
            }                        
            msg += "</div>";
           
            msg += "<div class='details'>" + entry.details + "</div>";
            msg += "</div>";

            const marker = new mapboxgl.Marker(markerElement);
            marker.setLngLat([entry.location.lng, entry.location.lat]);
            marker.setPopup(
                new mapboxgl.Popup({ offset: 25, anchor: "left" }).setHTML(msg)
            );
            marker.addTo(this.map);

            bounds.extend([entry.location.lng, entry.location.lat]);

            this.markers.push(marker);
        });

        if (entries.length > 0) {
            this.map.fitBounds(bounds, {
                maxZoom: 14,
                padding: 30,
            });
        }        
    }

    render() {
        return (
            <div id="map" ref={el => this.mapContainer = el}></div>
        )
    }
}