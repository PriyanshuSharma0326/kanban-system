import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

import { Provider } from "react-redux";
import { store } from "./app/store";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { setUser } from "./features/auth/authSlice";

let rendered = false;

onAuthStateChanged(auth, (firebaseUser) => {
    store.dispatch(
        setUser(
            firebaseUser
                ? {
                    uid:         firebaseUser.uid,
                    email:       firebaseUser.email,
                    displayName: firebaseUser.displayName,
                }
                : null
        )
    );

    if (!rendered) {
        rendered = true;

        ReactDOM.createRoot(document.getElementById("root")).render(
            <React.StrictMode>
                <Provider store={store}>
                    <App />
                </Provider>
            </React.StrictMode>
        );
    }
});
