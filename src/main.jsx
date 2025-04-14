// src/main.jsx
import React from "react"; // Use React import style
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Ensure this path is correct for your project structure
import { store, persistor } from "./components/Redux/store.jsx";
import "./index.css"; // Make sure you have a basic CSS file
import App from "./App.jsx"; // Your main App component

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element"); // Error handling

const root = createRoot(container);

root.render(
  <React.StrictMode> {/* Keep StrictMode for development checks */}
    <Provider store={store}>
      {/* PersistGate delays rendering until persistence is complete */}
      {/* loading={null} shows nothing, you could put a loading spinner component here */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);