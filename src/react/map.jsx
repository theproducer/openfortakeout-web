import React from "react";
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = "pk.eyJ1IjoidGhlcHJvZHVjZXIiLCJhIjoiczBvODhOMCJ9.CtNj7d3gId88Sc4M4fi_MQ";

export default class ReactMap extends React.Component {
    constructor(props) {
        super(props);

        this.map = null;

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

        this.map.resize();       

        this.map.on("move", () => {
            this.setState({
                lng: this.map.getCenter().lng.toFixed(4),
                lat: this.map.getCenter().lat.toFixed(4),
                zoom: this.map.getZoom().toFixed(2)
            })
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (this.map) {
            this.map.resize();
        }

        this.processMapEntries(nextProps.entries);
    }

    processMapEntries(entries) {
        let bounds = new mapboxgl.LngLatBounds();

        entries.forEach((entry) => {
            const markerElement = document.createElement("div");
            markerElement.className = "marker";

            const offersGiftcard = entry.giftcard ? "Yes" : "No";
            const needsDonations = entry.donate_url !== "" ? "<a target='_blank' href='" + entry.donate_url + "'>Donate Here</a>" : "No";

            let msg = "";
            msg += "<h1>" + entry.name + "</h1>";
            msg += "<div class='type'>" + entry.type + "</div>";
            msg += "<div class='address'>";
            msg += entry.address + " " + entry.address_2 + "<br/>";
            msg += entry.city + ", " + entry.state + " " + entry.zipcode;            
            msg += "</div>";
            msg += "<div class='hours'><strong>Hours: </strong>" + entry.hours + "</div>";
            msg += "<div class='contact'>";
            if (entry.url !== "") {
                msg += "<strong>Website: </strong><a target='_blank' href='" + entry.url + "'>" + entry.url + "</a><br/>";
            }            
            msg += "<strong>Phone: </strong>" + entry.phone + "<br/>";
            msg += "</div>";
            msg += "<table cellspacing='0' border='1'><thead><tr><th>Features</th><th>&nbsp;</th></tr></thead><tbody>";
            msg += "<tr><td><strong>Online Giftcard</strong></td><td>" + offersGiftcard + "</td></tr>";
            msg += "<tr><td><strong>Needs Donations</strong></td><td>" + needsDonations + "</td></tr>";
            msg += "</tbody></table>";
            msg += "<div class='details'>" + entry.details + "</div>";

            const marker = new mapboxgl.Marker(markerElement);
            marker.setLngLat([entry.latlng.lng, entry.latlng.lat]);
            marker.setPopup(
                new mapboxgl.Popup({ offset: 25, anchor: "left" }).setHTML(msg)
            );
            marker.addTo(this.map);

            bounds.extend([entry.latlng.lng, entry.latlng.lat]);
        });

        if (entries.length > 0) {
            this.map.fitBounds(bounds, {
                maxZoom: 14,
            });
        }        
    }

    render() {
        return (
            <div id="map" ref={el => this.mapContainer = el}></div>
        )
    }
}