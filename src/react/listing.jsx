import React from "react";
import ReactDOM from "react-dom";
import 'babel-polyfill';

import LoadingSpinner from "./loading";
import BusinessEntry from "./entry";
import ReactMap from "./map";

const apiurl = process.env.API_URL;

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.allentries = [];
        this.searchTimeout = null;


        this.state = {
            loading: false,
            searchterm: "",
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
                this.allentries = await res.json();

                const entries = this.filterEntries();

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

    onSearchFieldChange = (e) => {
        this.setState({
            searchterm: e.target.value,
        });

        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchTimeout = null;
            this.setState({
                entries: this.filterEntries(),
            });
        }, 800);
    }

    filterEntries = () => {        
        const searchterm = this.state.searchterm;
        if (searchterm.length < 3) {
            return this.allentries;
        }

        const filtered = this.allentries.filter((entry) => {
            return entry.name.toLowerCase().includes(searchterm.toLowerCase());
        });

        return filtered;
    }

    onEntryHover = (entry) => {
        document.getElementById("marker-" + entry.id).classList.add("highlighted");
    }

    onEntryOut = (entry) => {
        document.getElementById("marker-" + entry.id).classList.remove("highlighted");
    }

    render() {
        return (
            <div>
                <div className="filters">
                    <div className="search">
                        <input 
                            type="search" 
                            placeholder="search..." 
                            value={this.state.searchterm}
                            onChange={this.onSearchFieldChange}
                        />
                    </div>
                </div>
                {this.state.loading ? (
                    <div className="loading">
                        <LoadingSpinner />
                    </div>
                ) : null}
                <div className="results">
                    <div className="listing">
                        {this.state.entries.length === 0 ?
                            <div className="empty">No businesses found in this area.</div>
                        : null }
                        {this.state.entries.map((entry) => {
                            return (
                            <BusinessEntry
                                key={entry.id} 
                                entry={entry} 
                                onHover={this.onEntryHover}   
                                onOut={this.onEntryOut}                            
                            />
                            );
                        })}
                    </div>
                    <div className="map">
                        <ReactMap entries={this.state.entries} />
                    </div>
                </div>                
            </div>
        );
    }
}

const mount_element = document.getElementById("react_listing");
if (mount_element) {
    ReactDOM.render(
        <Listing ref={(component) => { window.listingComponent = component }} />,
        mount_element
    );
}

