import React from "react";
import ReactDOM from "react-dom";
import Cleave from "cleave.js/react";
import CleavePhone from "cleave.js/dist/addons/cleave-phone.us";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import validate from "validate.js";

import { state_options, business_types } from "./misc";

import LoadingSpinner from "./loading";

const ApplicationForm = {
  name: "",
  type: "",
  tags: [],
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zipcode: "",
  url: "",
  donateurl: "",
  hours: "",
  details: "",
  giftcard: false,
  takeout: false,
  delivery: false,
};

const apiurl = process.env.API_URL;

const formConstraints = {
  name: { presence: true },
  type: { presence: true },
  phone: { presence: true, length: { maximum: 14 } },
  email: { presence: true, email: true },
  url: { url: true },
  address: { presence: true },
  city: { presence: true },
  state: { presence: true },
  zipcode: { presence: true, length: { is: 5 }, numericality: true }
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

  onTagFieldChange = newTags => {
    const form = this.state.form;
    form.tags = newTags;

    this.setState({
      form: form
    });
  };

  onSelectFieldChange = (e, action) => {
    if (action.action === "select-option") {
      const form = this.state.form;
      form[action.name] = e.value;

      this.setState({
        form: form
      });
    }
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
        error:
          "Your entry is not valid, check below: <br/><ul>" +
          validationError +
          "</ul>"
      });
      return;
    }

    this.sendForm(form);

    return false;
  };

  sendForm = form => {
    fetch(apiurl + "/businesses", {
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
              <div className="formrow">
                <div className="field">
                  <label>Business Type *</label>
                  <Select
                    className="dropdown"
                    classNamePrefix="react-select"
                    name="type"
                    options={business_types}
                    onChange={this.onSelectFieldChange}
                  />
                </div>
              </div>
              <div className="formrow">
                <div className="field">
                  <label>Tags</label>
                  <TagsInput
                    name="tags"
                    value={this.state.form.tags}
                    onChange={this.onTagFieldChange}
                    renderLayout={(tagComponents, inputComponent) => {
                      return (
                        <div>
                          {inputComponent}
                          <small>Type in a tag, and press enter.</small>
                          <div>{tagComponents}</div>
                        </div>
                      );
                    }}
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
                    name="address2"
                    value={this.state.form.address2}
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
                  <Select
                    className="dropdown"
                    classNamePrefix="react-select"
                    name="state"
                    options={state_options}
                    onChange={this.onSelectFieldChange}
                  />
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
                    name="donateurl"
                    value={this.state.form.donateurl}
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
                  <input
                    name="giftcard"
                    type="checkbox"
                    defaultChecked={this.state.form.giftcard}
                    onChange={this.onFormFieldChange}
                  />
                </div>
              </div>
              <div className="formrow">
                <div className="field">
                  <label>Do you offer takeout?</label>
                  <input
                    name="takeout"
                    type="checkbox"
                    defaultChecked={this.state.form.takeout}
                    onChange={this.onFormFieldChange}
                  />
                </div>
              </div>
              <div className="formrow">
                <div className="field">
                  <label>Do you offer delivery?</label>
                  <input
                    name="delivery"
                    type="checkbox"
                    defaultChecked={this.state.form.delivery}
                    onChange={this.onFormFieldChange}
                  />
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
                <div
                  className="errors"
                  dangerouslySetInnerHTML={{ __html: this.state.error }}
                ></div>
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
