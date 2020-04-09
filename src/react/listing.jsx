import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import lodash from 'lodash';
import "babel-polyfill";

import LoadingSpinner from "./loading";
import BusinessEntry from "./entry";
import ReactMap from "./map";

const apiurl = process.env.API_URL;

const business_types = [
    { value: "Restaurant", label: "Restaurant" },
    { value: "Groceries", label: "Groceries" },
    { value: "Electronics", label: "Electronics" },
    { value: "General Merchandise", label: "General Merchandise" }
];

class Listing extends React.Component {
    constructor(props) {
        super(props);

        this.allentries = [];
        this.alltags = [];
        this.searchTimeout = null;

        this.state = {
            loading: false,
            searchterm: "",
            filterType: "",
            filterTags: [],
            entries: [],
            error: null
        };
    }

    onFilterTypeChange = (e, action) => {
        if (action.action === "clear") {
            this.setState({
                filterType: "",
            });
        }

        if (action.action === "select-option") {
            let type = this.state.filterType;
            type = e.value;

            this.setState({
                filterType: type,
            });
        }

        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchTimeout = null;
            this.setState({
                entries: this.filterEntries()
            });
        }, 100);
    };

    onFilterTagChange = (e, action) => {
        if (action.action === "clear") {
            this.setState({
                filterTags: [],
            });
        }

        console.log(action.action);

        if (action.action === "select-option" || action.action === "remove-value" || action.action === "pop-value") {
            if (e) {
                const selectedTags = e.map((t) => {
                    return t.value;
                });

                this.setState({
                    filterTags: selectedTags,
                });            
            } else {
                this.setState({
                    filterTags: [],
                });
            }
            
            
            
        }

        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchTimeout = null;
            this.setState({
                entries: this.filterEntries()
            });
        }, 100);
    }

    getListing(coords, zipcode) {
        this.setState({
            loading: true
        });

        let fetchURL = apiurl + "/businesses?";
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
        })
            .then(async res => {
                if (res.ok) {
                    const result = await res.json();

                    this.allentries = result.businesses;
                    this.alltags = result.tags.map((tag) => {
                        return {value: tag, label: tag};
                    });

                    const entries = this.filterEntries();

                    this.setState({
                        loading: false,
                        entries
                    });
                } else {
                    const err_result = await res.text();
                    throw new Error(err_result);
                }
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err.message
                });
            });
    }

    onSearchFieldChange = e => {
        this.setState({
            searchterm: e.target.value
        });

        if (this.searchTimeout !== null) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.searchTimeout = null;
            this.setState({
                entries: this.filterEntries()
            });
        }, 600);
    };

    filterEntries = () => {
        const searchterm = this.state.searchterm;
        const filterByType = this.state.filterType;
        const filterByTags = this.state.filterTags;

        if (searchterm.length < 3  && filterByType === "" && filterByTags.length === 0) {
            return this.allentries;
        }

        const filtered = this.allentries.filter(entry => {            
            let includesName = false;

            if (searchterm === "") {
                includesName = true;
            } else {
                includesName = entry.name.toLowerCase().includes(searchterm.toLowerCase());
            }

            let includesType = false;
            
            if (filterByType === "") {
                includesType = true;
            } else {
                includesType = entry.type === filterByType;
            }

            let includesTags = false;            

            if (filterByTags.length === 0) {
                includesTags = true;
            } else {
                if (entry.tags) {
                    entry.tags.some((tag) => {
                        if (filterByTags.includes(tag.toLowerCase())) {
                            includesTags = true;
                            return true;
                        }
    
                        return false;
                    });
                }                
            }

            
            return includesName && includesType && includesTags;
        });

        return filtered;
    };

    onEntryHover = entry => {
        document.getElementById("marker-" + entry.id).classList.add("highlighted");
    };

    onEntryOut = entry => {
        document
            .getElementById("marker-" + entry.id)
            .classList.remove("highlighted");
    };

    render() {
        return (
            <div>
                <div className="filters">
                    <div className="type-filter">
                        <Select
                            className="dropdown"
                            classNamePrefix="react-select"
                            placeholder="Filter by Type"
                            isClearable={true}
                            isSearchable={false}
                            options={business_types}
                            onChange={this.onFilterTypeChange}
                        />
                    </div>
                    <div className="tag-filter">
                        <Select
                            className="dropdown"
                            classNamePrefix="react-select"
                            placeholder="Filter by Tags (select multiple)"                            
                            isMulti={true}
                            isClearable={true}
                            isSearchable={true}
                            options={this.alltags}                            
                            onChange={this.onFilterTagChange}
                        />
                    </div>
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
                        {this.state.entries.length === 0 ? (
                            <div className="empty">No businesses found in this area.</div>
                        ) : null}
                        {this.state.entries.map(entry => {
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
        <Listing
            ref={component => {
                window.listingComponent = component;
            }}
        />,
        mount_element
    );
}
