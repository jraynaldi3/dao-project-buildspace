import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";

//import 3rdWeb
import {ThirdwebWeb3Provider} from '@3rdweb/hooks';

//Included Chain You wanna support
//Rinkeby Chain Id = 4
const supportedChainIds = [4];

//included what type wallet you wanna support
//in this case metamask is injected wallet
const connectors = {
  injected:{},
}
// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider 
      connectors = {connectors}
      supportedChainIds = {supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
