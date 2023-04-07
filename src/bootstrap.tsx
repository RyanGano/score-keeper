import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { SkullKing } from "./games/skull-king";
import { RollThroughTheAges } from "./games/roll-through-the-ages";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="skullking" element={<SkullKing />}></Route>
          <Route
            path="rollthroughtheages"
            element={<RollThroughTheAges />}
          ></Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There’s nothing here!</p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
