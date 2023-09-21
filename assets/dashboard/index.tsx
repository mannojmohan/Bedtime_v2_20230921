'use strict';
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const domContainer = document.getElementById('dashboard');
const root = createRoot(domContainer);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
