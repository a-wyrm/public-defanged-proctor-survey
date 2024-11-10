import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Debug from "./pages/Debug.jsx";
import SurveyPage from "./pages/surveyPage";
import EndingPage from "./pages/endingPage.jsx";

class CameraStartComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const content = document.createElement("div");
    content.className = "px-4 py-5 my-5 text-center";

    const h1 = document.createElement("h1");
    h1.className = "display-5 fw-bold";
    h1.textContent = "Welcome to our Survey";

    const col = document.createElement("div");
    col.className = "col-lg-6 mx-auto";

    const p = document.createElement("p");
    p.className = "lead mb-4";
    p.textContent =
      "When you are ready please click the button below to start.";

    col.appendChild(p);
    content.appendChild(h1);
    content.appendChild(col);

    shadow.appendChild(content);
  }
}

class ProctorStartComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const content = document.createElement("div");
    content.className = "px-4 py-5 my-5 text-center";

    const h1 = document.createElement("h1");
    h1.className = "display-5 fw-bold";
    h1.textContent = "Welcome to our Survey";

    const col = document.createElement("div");
    col.className = "col-lg-6 mx-auto";

    const p = document.createElement("p");
    p.className = "lead mb-4";
    p.textContent =
      "When you are ready please click the button below to start.";

    col.appendChild(p);
    content.appendChild(h1);
    content.appendChild(col);

    shadow.appendChild(content);
  }
}

class TrackingStartComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const content = document.createElement("div");
    content.className = "px-4 py-5 my-5 text-center";

    const h1 = document.createElement("h1");
    h1.className = "display-5 fw-bold";
    h1.textContent = "Welcome to our Survey";

    const col = document.createElement("div");
    col.className = "col-lg-6 mx-auto";

    const p = document.createElement("p");
    p.className = "lead mb-4";
    p.textContent =
      "When you are ready please click the button below to start.";

    col.appendChild(p);
    content.appendChild(h1);
    content.appendChild(col);

    shadow.appendChild(content);
  }
}

customElements.define("camera-start", CameraStartComponent);
customElements.define("proctor-start", ProctorStartComponent);
customElements.define("tracking-start", TrackingStartComponent);

//Note we can create a settings file to ensure we are allowed to debug
ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/debug" element={<Debug />} />
      <Route path="/survey" element={<SurveyPage />} />
      <Route path="/end" element={<EndingPage />} />
    </Routes>
  </Router>
);