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
  const [provider, setProvider] = useState({});
  const [escrow, setEscrow] = useState(null);
  const [homes, setHomes] = useState([]);

  const LoadBlockchainData = async () => {
    // ether enables our app to talk to the blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // console.log(provider);
    setProvider(provider);

    const network = await provider.getNetwork();

    const realEstate = new ethers.Contract(
      config[network.chainId].realEstate.address,
      RealEstate,
      provider
    );
    const totalSupply = await realEstate.totalSupply();
    const Homes = [];

    const escrow = new ethers.Contract(
      config[network.chainId].escrow.address,
      Escrow,
      provider
    );
    setEscrow(escrow);
    // console.log(typeof escrow);

    for (let i = 1; i <= totalSupply; i++) {
      const uri = await realEstate.tokenURI(i);
      const response = await fetch(uri);
      const metadata = await response.json();
      Homes.push(metadata);
    }
    setHomes(Homes);

    // console.log(network, "network");

    // automatically changing account
    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };
  // console.log(account, "account");
  console.log("homes", homes);

  useEffect(() => {
    LoadBlockchainData();
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} /> <Search />
      <div className="cards__section">
        <h3>Homes for you</h3>
        <hr />
        {homes.map((home, index) => (
          <div className="cards">
            <div className="card">
              <div className="card__image">
                <img src={home.image} alt="home" />
              </div>
              <div className="card__info">
                <h4> {home.attributes[0].value}</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqFt |
                </p>
                <p> {home.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
