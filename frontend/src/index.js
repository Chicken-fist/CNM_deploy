import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./Context/ChatProvider";
import { BrowserRouter, HashRouter } from "react-router-dom";

ReactDOM.render(
  
  <ChakraProvider>
    <BrowserRouter>
    <ChatProvider>
        <App />
    </ChatProvider> 
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById("root")
);
reportWebVitals();
