import React from "react";
import ReactDOM from "react-dom";
import 'babel-polyfill';

import LoadingSpinner from "./loading";
import ReactMap from "./map";

const apiurl = process.env.API_URL;

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            entries: [],
            error: null
        };
    }

    getListing(coords, zipcode) {
        this.setState({
            loading: true,
        });

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

                this.setState({
                    loading: false,
                    entries,
                });
            } else {
                const err_result = await res.text();
                throw new Error(err_result);
            }
        }).catch((err) => {
            this.setState({
                loading: false,                
                error: err.message
            });
        });
    }

    render() {
        return (
            <div>
                <div className="map"><ReactMap entries={this.state.entries} /></div>
                <header className="table_header">
                    <div className="name_header">Name</div>
                    <div className="location_header">Location</div>
                    <div className="hours_header">Hours</div>
                    <div className="type_header">Type</div>
                </header>
                {this.state.error !== null ? (
                    <div className="errors" dangerouslySetInnerHTML={{__html: this.state.error}}></div>
                ) : null}
                <div className="table_listing">
                    {this.state.loading ? <div className="loading"><LoadingSpinner /></div> : null}
                    {this.state.entries.map((entry, index) => {
                        return (
                            <ListingEntry 
                                entry={entry} 
                                key={index} 
                                onClick={(e) => {
                                    const currenttarget = e.currentTarget;
                                    const target = e.target;
                                    if (target.classList.contains("col")) {
                                        currenttarget.classList.toggle("active");
                                    }                                    
                                }}
                            />
                        );
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
        <div className="entry" onClick={props.onClick}>
            <div className="col name">{props.entry.name}</div>
            <div className="col phone">{props.entry.city}, {props.entry.state}</div>
            <div className="col hours">{props.entry.hours}</div>
            <div className="col type">{props.entry.type}</div>
            <div className="fulldetails">
                <div className="lcol">
                    <h1>{props.entry.name}</h1>
                    <div className="type">{props.entry.type}</div>
                    <div className="address">
                        {props.entry.address + " " + props.entry.address_2}<br />
                        {props.entry.city + ", " + props.entry.state + " " + props.entry.zipcode}
                    </div>
                    <div className="hours"><strong>Hours: </strong>{props.entry.hours}</div>
                    <div className="contact">
                        {props.entry.url !== "" ?
                            <><strong>Website: </strong><a target="_blank" href={props.entry.url}>{props.entry.url}</a><br /></>
                            : null}
                        <strong>Phone: </strong><a target="_blank" href={"tel:" + props.entry.phone}>{props.entry.phone}</a>
                    </div>
                    <table cellSpacing={0} border={1}>
                        <thead>
                            <tr>
                                <th colSpan={2}>Features</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Online Giftcard</strong></td>
                                <td>{props.entry.giftcard ? "Yes" : "No"}</td>
                            </tr>
                            <tr>
                                <td><strong>Needs Donations</strong></td>
                                <td>{props.entry.donate_url ? <a target="_blank" href={props.entry.donate_url}>Donate Here</a> : "No"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="rcol">
                    <div className="details">{props.entry.details}</div>
                </div>
            </div>
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

