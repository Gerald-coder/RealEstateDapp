import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Search from "./components/Search";
import Home from "./components/Home";

// ABIs
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";

// Config
import config from "./config.json";

function App() {
  const [account, setAccount] = useState("");

  const LoadBlockchainData = async () => {
    // ether enables our app to talk to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(provider);

    // automatically changing account
  };
  console.log(account);

  useEffect(() => {
    LoadBlockchainData();
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />{" "}
      <div className="cards__section">
        <h3>Welcome to Millow! you milk, let us get bread also</h3>
      </div>
    </div>
  );
}

export default App;
