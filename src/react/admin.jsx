import React from "react";
import ReactDOM from "react-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseui from "firebaseui";
import firebase from "firebase";

import { ToastsContainer, ToastsStore } from "react-toasts";
import { AgGridReact } from "ag-grid-react";

const apiurl = process.env.API_URL;

const fbConfig = {
  apiKey: "AIzaSyDeAoR37sTvrDeT0MfrZnPxqjMkzTCS9-Q",
  authDomain: "open-for-takeout.firebaseapp.com",
  databaseURL: "https://open-for-takeout.firebaseio.com",
  projectId: "open-for-takeout",
  storageBucket: "open-for-takeout.appspot.com",
  messagingSenderId: "9250955004",
  appId: "1:9250955004:web:049917b925a63ce4f5c179",
  measurementId: "G-3LMMJ7Y9EX",
};

firebase.initializeApp(fbConfig);
firebase.analytics();

class Admin extends React.Component {
  constructor(props) {
    super(props);

    const columns = [
      {
        field: "id",
        headerName: "ID",
        pinned: "left",
        width: 75,
      },
      {
        field: "name",
        headerName: "Name",
        pinned: "left",
        editable: true,
      },
      {
        field: "type",
        headerName: "Type",
        width: 120,
        editable: true,
      },
      {
        field: "tags",
        headerName: "Tags",
        editable: true,
        cellEditor: "agLargeTextCellEditor",
        cellEditorParams: {
          cols: 35,
        },
      },
      {
        field: "phone",
        headerName: "Phone",
        width: 150,
        editable: true,
      },
      {
        field: "email",
        headerName: "Email",
        width: 225,
        editable: true,
      },
      {
        field: "details",
        headerName: "Details",
        editable: true,
        width: 320,
        cellEditor: "agLargeTextCellEditor",
        cellEditorParams: {
          cols: 30,
        },
      },
      {
        field: "hours",
        headerName: "Hours",
        editable: true,
      },
      {
        field: "url",
        headerName: "Url",
        editable: true,
      },
      {
        field: "address",
        headerName: "Address",
        editable: true,
      },
      {
        field: "address2",
        headerName: "Address 2",
        editable: true,
      },
      {
        field: "city",
        headerName: "City",
        editable: true,
      },
      {
        field: "state",
        headerName: "state",
        editable: true,
        width: 75,
      },
      {
        field: "zipcode",
        headerName: "Zipcode",
        editable: true,
        width: 100,
      },
      {
        field: "donateurl",
        headerName: "Donate URL",
        editable: true,
      },
      {
        field: "giftcard",
        headerName: "Giftcard",
        editable: true,
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
        },
        valueFormatter: this.booleanValueFormatter,
        valueParser: this.booleanValueParser,
      },
      {
        field: "takeout",
        headerName: "Takeout",
        editable: true,
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
        },
        valueFormatter: this.booleanValueFormatter,
        valueParser: this.booleanValueParser,
      },
      {
        field: "delivery",
        headerName: "Delivery",
        editable: true,
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
        },
        valueFormatter: this.booleanValueFormatter,
        valueParser: this.booleanValueParser,
      },
      {
        field: "closed",
        headerName: "Closed",
        editable: true,
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
        },
        valueFormatter: this.booleanValueFormatter,
        valueParser: this.booleanValueParser,
      },
      {
        field: "active",
        headerName: "Is Active",
        editable: true,
        width: 125,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [true, false],
        },
        valueFormatter: this.booleanValueFormatter,
        valueParser: this.booleanValueParser,
      },
    ];

    this.state = {
      auth: null,
      user: null,
      columns: columns,
      loadng: true,
      error: null,
      data: [],
    };

    this.uiConfig = {
      signInFlow: "popup",
      // We will display Google and Facebook as auth providers.
      signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
      },
    };
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ auth: !!user, user: user }, () => {
        this.getBusinesses();
      });
    });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  getBusinesses = async () => {
    const token = await firebase.auth().currentUser.getIdToken();

    const fetchURL = apiurl + "/admin";
    fetch(fetchURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization-Token": token,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const result = await res.json();
          this.setState({
            data: result.businesses,
            loading: false,
            error: null,
          });
        } else {
          const err_result = await res.text();
          throw new Error(err_result);
        }
      })
      .catch((err) => {
        this.setState(
          {
            loading: false,
            error: err.message,
          },
          () => {
            ToastsStore.error(err.message);
          }
        );
      });
  };

  saveBusiness = async (row) => {
    const token = await firebase.auth().currentUser.getIdToken();

    if (!Array.isArray(row.tags)) {
      row.tags = row.tags.split(",");
    }

    const fetchURL = apiurl + "/admin";
    fetch(fetchURL, {
      method: "PUT",
      body: JSON.stringify(row),
      headers: {
        "Content-Type": "application/json",
        "Authorization-Token": token,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          ToastsStore.success("Row saved successfully");
          this.getBusinesses();
        } else {
          const err_result = await res.text();
          throw new Error(err_result);
        }
      })
      .catch((err) => {
        this.setState(
          {
            loading: false,
            error: err.message,
          },
          () => {
            ToastsStore.error(err.message);
          }
        );
      });
  };

  onRowCellChanged = (event) => {
    if (event.oldValue !== event.newValue) {
      this.saveBusiness(event.data);
    }
  };

  booleanValueFormatter = (params) => {
    if (params.value !== null) {
      return params.value ? "Yes" : "No";
    }
    return "No";
  };

  booleanValueParser = (params) => {
    if (params.newValue === "Yes") {
      return true;
    }

    return false;
  };

  render() {
    if (!this.state.auth) {
      return (
        <div className="headline">
          <h2>Administration Required</h2>
          <p>
            For access, email{" "}
            <a href="mailto:info@wereopenfortakeout.com">
              info@wereopenfortakeout.com
            </a>
          </p>

          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      );
    }

    return (
      <>
        <div className="headline">
          <h2>Administration</h2>
          <p>Edit a cell and the row is saved automatically.</p>
        </div>
        <div
          className="ag-theme-balham"
          style={{ height: "600px", width: "100%" }}
        >
          <AgGridReact
            defaultColDef={{
              onCellValueChanged: this.onRowCellChanged,
            }}
            columnDefs={this.state.columns}
            rowData={this.state.data}
            onGridReady={(params) => {
              // params.api.sizeColumnsToFit();
            }}
          />
        </div>
        <ToastsContainer store={ToastsStore} />
      </>
    );
  }
}

const mount_element = document.getElementById("react_admin");
if (mount_element) {
  ReactDOM.render(<Admin />, mount_element);
}
