import React from "react";
import ReactDOM from "react-dom";
import Cleave from "cleave.js/react";
import Select from "react-select";
import Switch from "react-switch";
import TagsInput from "react-tagsinput";
import validate from "validate.js";
import lodash from 'lodash';

import { business_types } from "./misc";
import LoadingSpinner from "./loading";

const CorrectionsForm = {
  business_id: -1,
  name: "",
  type: "",
  tags: [],
  phone: "",
  details: "",
  hours: "",
  url: "",
  donateurl: "",
  giftcard: false,
  takeout: false,
  delivery: false,
  closed: false,
  notes: "",
}

const apiurl = process.env.API_URL;

const formConstraints = {
  type: { presence: true },
  phone: { presence: true, length: { maximum: 60 } },
  url: { url: true },
};

class UpdateForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchedBusiness: false,
      loading: true,
      completed: false,
      form: CorrectionsForm,
      error: null
    };

    this.getExistingEntry();
  }

  onCheckboxChange = (name, checked) => {
    const form = this.state.form;
    form[name] = checked;

    this.setState({
      form: form
    });
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

  getExistingEntry = async () => {
    const urlparams = lodash.trimStart(window.location.search, '?').split("&");
    const businessId = urlparams.reduce((acc, param) => {
      const keyval = param.split('=');
      if (keyval[0] === "id") {
        return keyval[1];
      }
      return acc;
    }, null);

    fetch(apiurl + "/businesses/" + businessId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      if (res.ok) {
        const entry = await res.json();
        console.log(entry);
        CorrectionsForm.business_id = entry.id;
        CorrectionsForm.name = entry.name;
        CorrectionsForm.type = entry.type;
        CorrectionsForm.tags = entry.tags ? entry.tags : [];
        CorrectionsForm.phone = entry.phone;
        CorrectionsForm.details = entry.details;
        CorrectionsForm.hours = entry.hours;
        CorrectionsForm.url = entry.url;
        CorrectionsForm.donateurl = entry.donateurl;
        CorrectionsForm.giftcard = entry.giftcard ? true : false;
        CorrectionsForm.takeout = entry.takeout ? true : false;;
        CorrectionsForm.delivery = entry.delivery ? true : false;;
        CorrectionsForm.closed = entry.closed ? true : false;;

        this.setState({
          loading: false,
          error: null,
          form: CorrectionsForm,
          fetchedBusiness: true,
        })
      } else {
        const err_result = await res.text();
        throw new Error(err_result);
      }
    }).catch((err) => {
      this.setState({
        loading: false,
        completed: false,
        fetchedBusiness: false,
        error: err.message
      });
    });
  }

  onFieldSubmit = e => {
    e.preventDefault();

    this.setState({
      loading: true,
      error: null
    });

    const form = this.state.form;
    const valid = validate(form, formConstraints);

    console.log(form);

    if (valid !== undefined) {
      let validationError = "";
      Object.keys(valid).forEach((field, index) => {
        validationError += "<li>" + field + ": " + valid[field] + "</li>";
      });
      this.setState({
        loading: false,
        error:
          "Your submission is not valid, check below: <br/><ul>" +
          validationError +
          "</ul>"
      });
      return;
    }

    this.sendForm(form);

    return false;
  }

  sendForm = (form) => {
    fetch(apiurl + "/businesses/" + form.business_id + "/correction", {
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
  }

  render() {
    return (
      <form onSubmit={this.onFieldSubmit}>
        {this.state.loading ? (
          <div className="loading">
            <LoadingSpinner />
          </div>
        ) : null}
        {this.state.error && this.state.fetchedBusiness === false ?
          (
            <div className="complete">
              <h2>
                Please try again - could not fetch entry from server.
            </h2>
            </div>
          ) :

          this.state.completed ? (
            <div className="complete">
              <h2>
                Thank you for your update! Your changes will be reviewed and posted shortly.
                </h2>
            </div>
          ) : (
              <>
                <div className="formrow">
                  <div className="field">
                    <label>Business Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={this.state.form.name}
                      disabled={true}
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
                      value={{ value: this.state.form.type, label: this.state.form.type }}
                      onChange={this.onSelectFieldChange}
                    />
                  </div>
                </div>
                <div className="formrow">
                  <div className="field">
                    <label>
                      <Switch onChange={(e) => {
                        this.onCheckboxChange('closed', e);
                      }} checked={this.state.form.closed} name="closed" />
                      <span>Is this business closed?</span>
                    </label>
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
                <div className="formrow">
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
                    <label>Website URL</label>
                    <Cleave
                      type="text"
                      name="url"
                      value={this.state.form.url}
                      onChange={this.onFormFieldChange}
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
                    <label>
                      <Switch onChange={(e) => {
                        this.onCheckboxChange('giftcard', e);
                      }} checked={this.state.form.giftcard} name="giftcard" />
                      <span>Do you offer online giftcards?</span>
                    </label>
                  </div>
                </div>
                <div className="formrow">
                  <div className="field">
                    <label>
                      <Switch onChange={(e) => {
                        this.onCheckboxChange('takeout', e);
                      }} checked={this.state.form.takeout} name="takeout" />
                      <span>Do you offer takeout?</span>
                    </label>
                  </div>
                </div>
                <div className="formrow">
                  <div className="field">
                    <label>
                      <Switch onChange={(e) => {
                        this.onCheckboxChange('delivery', e);
                      }} checked={this.state.form.delivery} name="delivery" />
                      <span>Do you offer delivery?</span>
                    </label>
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
                <div className="formrow">
                  <div className="field">
                    <label>Correction Notes</label>
                    <textarea
                      name="notes"
                      value={this.state.form.notes}
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
            )
        }


      </form>
    )
  }
}

const mount_element = document.getElementById("react_updateform");
if (mount_element) {
  ReactDOM.render(
    <UpdateForm
      ref={component => {
        window.listingComponent = component;
      }}
    />,
    mount_element
  );
}