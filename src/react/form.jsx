import React from "react";
import ReactDOM from "react-dom";
import Cleave from "cleave.js/react";
import CleavePhone from "cleave.js/dist/addons/cleave-phone.us";
import validate from "validate.js";

import LoadingSpinner from "./loading";

const ApplicationForm = {
    name: "Sample Restaurant",
    email: "jdoe@example.com",
    phone: "1234567890",
    address: "123 Main Street",
    address_2: "UNIT A",
    city: "Harrisburg",
    state: "SD",
    zipcode: "57032",
    url: "http://joeypender.com",
    donate_url: "",
    hours: "9am - 10pm",
    details: "Testing, testing, 1, 2, 3",
    giftcard: false
};

const apiurl = process.env.API_URL;
const state_hash = {
    AL: "Alabama",
    AK: "Alaska",
    AS: "American Samoa",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    DC: "District Of Columbia",
    FM: "Federated States Of Micronesia",
    FL: "Florida",
    GA: "Georgia",
    GU: "Guam",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MH: "Marshall Islands",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    MP: "Northern Mariana Islands",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PW: "Palau",
    PA: "Pennsylvania",
    PR: "Puerto Rico",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VI: "Virgin Islands",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming"
};

const formConstraints = {
    name: { presence: true },
    phone: { presence: true, length: { maximum: 14 } },
    email: { presence: true, email: true },
    url: { url: true },
    address: { presence: true },
    city: { presence: true },
    state: { presence: true },
    zipcode: { presence: true, length: { is: 5 }, numericality: true },
};

class SubmitForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            completed: false,
            form: ApplicationForm,
            error: null
        };
    }

    onFormFieldChange = e => {
        const form = this.state.form;
        if (e.target.name === "zipcode") {
            if (e.target.value.length > 5) {
                return;
            }
        }

        if (e.target.type === "checkbox") {
            form[e.target.name] = e.target.checked;
        } else {
            form[e.target.name] = e.target.value;
        }
        
        this.setState({
            form: form
        });
    };

    onFieldSubmit = e => {
        e.preventDefault();

        this.setState({
            loading: true,
            error: null
        });

        const form = this.state.form;
        const valid = validate(form, formConstraints);
        if (valid !== undefined) {            
            let validationError = "";
            Object.keys(valid).forEach((field, index) => {
                validationError += "<li>" + field + ": " + valid[field] + "</li>";
            });
            this.setState({
                loading: false,
                error: "Your entry is not valid, check below: <br/><ul>" + validationError + "</ul>"
            });
            return;
        }
        
        this.sendForm(form);

        return false;
    };

    sendForm = form => {
        fetch(apiurl + "/restaurants/", {
            method: "POST",
            body: JSON.stringify(form),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(async res => {
                if (res.ok) {
                    this.setState({
                        loading: false,
                        completed: true
                    });
                } else {
                    const err_result = await res.text();
                    throw new Error(err_result);
                }
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    completed: false,
                    error: err.message
                });
            });
    };

    render() {
        return (
            <form onSubmit={this.onFieldSubmit}>
                {this.state.loading ? (
                    <div className="loading">
                        <LoadingSpinner />
                    </div>
                ) : null}

                {this.state.completed ? (
                    <div className="complete">
                        <h2>
                            Thank you for your submission! Your entry should appear shortly.
            </h2>
                    </div>
                ) : (
                        <>
                            <div className="formrow">
                                <div className="field">
                                    <label>Business Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={this.state.form.name}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="formrow col-2">
                                <div className="field">
                                    <label>Email Address * (not displayed)</label>
                                    <input
                                        type="text"
                                        name="email"
                                        value={this.state.form.email}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                                <div className="field">
                                    <label>Phone *</label>
                                    <Cleave
                                        type="text"
                                        name="phone"
                                        value={this.state.form.phone}
                                        onChange={this.onFormFieldChange}
                                        options={{
                                            phone: true,
                                            phoneRegionCode: "US",
                                            delimiter: "-"
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={this.state.form.address}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Address 2</label>
                                    <input
                                        type="text"
                                        name="address_2"
                                        value={this.state.form.address_2}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="formrow col-3">
                                <div className="field">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={this.state.form.city}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                                <div className="field">
                                    <label>State *</label>
                                    <select
                                        name="state"
                                        value={this.state.form.state}
                                        onChange={this.onFormFieldChange}
                                    >
                                        <option>Select a State</option>
                                        {Object.keys(state_hash).map((state, index) => {
                                            return (
                                                <option key={index} value={state}>
                                                    {state_hash[state]}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Zipcode *</label>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={this.state.form.zipcode}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Website URL</label>
                                    <Cleave
                                        type="text"
                                        name="url"
                                        value={this.state.form.url}
                                        onChange={this.onFormFieldChange}
                                        options={{
                                            prefix: "https://"
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Donations URL</label>
                                    <Cleave
                                        type="text"
                                        name="donate_url"
                                        value={this.state.form.donate_url}
                                        onChange={this.onFormFieldChange}
                                        options={{
                                            prefix: "https://"
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Hours</label>
                                    <input
                                        type="text"
                                        name="hours"
                                        placeholder="example: 8:30am - 8pm"
                                        value={this.state.form.hours}
                                        onChange={this.onFormFieldChange}
                                    />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Do you offer online giftcards?</label>
                                    <input name="giftcard" type="checkbox" defaultChecked={this.state.form.giftcard} onChange={this.onFormFieldChange} />
                                </div>
                            </div>
                            <div className="formrow">
                                <div className="field">
                                    <label>Details</label>
                                    <textarea
                                        name="details"
                                        value={this.state.form.details}
                                        onChange={this.onFormFieldChange}
                                    ></textarea>
                                </div>
                            </div>

                            {this.state.error !== null ? (
                                <div className="errors" dangerouslySetInnerHTML={{__html: this.state.error}}></div>
                            ) : null}

                            <input type="submit" text="Submit" />
                        </>
                    )}
            </form>
        );
    }
}

const mount_element = document.getElementById("react_form");
if (mount_element) {
    ReactDOM.render(
        <SubmitForm
            ref={component => {
                window.listingComponent = component;
            }}
        />,
        mount_element
    );
}
