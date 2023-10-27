// React
import { createRoot } from "react-dom/client";
import App from "./App";

// NEAR
import { Wallet } from "./near-wallet";

let CONTRACT_ADDRESS = process.env.CONTRACT_NAME;

let wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS });
let container = document.getElementById("root");
let root = createRoot(container); // createRoot(container!) if you use TypeScript

// Setup on page load
window.onload = async () => {
  let isSignedIn = await wallet.startUp();

  root.render(
    <App
      isSignedIn={isSignedIn}
      contractId={CONTRACT_ADDRESS}
      wallet={wallet}
    />
  );
};
