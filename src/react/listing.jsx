import React from "react";
import ReactDOM from "react-dom";
import 'babel-polyfill';

import LoadingSpinner from "./loading";

const apiurl = process.env.API_URL;

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            entries: []
        };
    }

    getListing(coords, zipcode) {
        let fetchURL = apiurl + "/restaurants/?";
        if (coords) {            
            fetchURL += "lat=" + coords.latitude;
            fetchURL += "&lng=" + coords.longitude;
        } else {
            fetchURL += "zipcode=" + zipcode;
        }

        fetch(fetchURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res) => {
            if (res.ok) {
                const entries = await res.json();
                console.log(entries);
                this.setState({
                    loading: false,
                    entries,
                });
            }
        }).catch((err) => {
            alert("Problems getting entries")
        });        
    }

    render() {
        return (
            <div>
                <div className="map"></div>
                <header className="table_header">
                    <div className="name_header">Name</div>
                    <div className="location_header">Location</div>
                    <div className="hours_header">Hours</div>
                    <div className="details_header">Details</div>                    
                </header>                
                <div className="table_listing">
                    {this.state.loading ? <LoadingSpinner /> : null }
                    {this.state.entries.map((entry, index) => {
                        return (<ListingEntry entry={entry} key={index} />);
                    })}
                    {this.state.entries.length === 0 ?
                        <div className="empty">
                            No entries found in this area.
                        </div>
                        : null 
                    }
                </div>
            </div>
        );
    }
}

function ListingEntry(props) {
    return (
        <div className="entry">
           <div className="name">{props.entry.name}</div>
           <div className="phone">{props.entry.city}, {props.entry.state}</div>
           <div className="hours">{props.entry.hours}</div>
           <div className="details">{props.entry.details}</div>
        </div>
    );
}

const mount_element = document.getElementById("react_listing");
if (mount_element) {
    ReactDOM.render(
        <Listing ref={(component) => { window.listingComponent = component }} />, 
        mount_element
    );
}

