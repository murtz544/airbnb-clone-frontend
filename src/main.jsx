import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import configureStore from './store/store.js'
import * as sessionActions from "./store/session";
import { csrfFetch, restoreCSRF } from './store/csrf.js'
import { Provider } from 'react-redux'
import { Modal, ModalProvider } from './context/Modal.jsx'

const store = configureStore();

// Initialize CSRF protection and expose debugging tools in non-production
if (import.meta.env.MODE !== 'production') {
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// Create a wrapper component to handle async initialization
function Root() {
  useEffect(() => {
    // Initialize CSRF protection when the app loads
    restoreCSRF()
      .then(() => {
        console.log("CSRF protection initialized");
      })
      .catch(error => {
        console.error("Failed to initialize CSRF protection:", error);
      });
  }, []);

  return (
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)