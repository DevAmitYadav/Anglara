import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom"; // Import HashRouter
import store from "./redux/store"; // Import Redux store
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your app in Provider */}
      <HashRouter> {/* Use HashRouter to prevent 404 issues */}
        <App />
      </HashRouter>
    </Provider>
  </StrictMode>
);
