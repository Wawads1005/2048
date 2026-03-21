import "@/styles/globals.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import Homepage from "@/app/page";

const rootNode = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootNode);

root.render(React.createElement(Homepage));
