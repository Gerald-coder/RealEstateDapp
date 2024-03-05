import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Home = ({ home, provider, escrow, togglePurchase }) => {
  //   console.log(escrow, "escrow");
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [lender, setLender] = useState(null);

  const [hasbought, setHasBought] = useState(false);
  const [hassold, setHasSold] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);
  const [hasLended, setHasLended] = useState(false);

  const fetchDetails = async () => {
    // buyer
    const buyer = await escrow.buyer(home.id);
    setBuyer(buyer);
    const hasbought = await escrow.approval(home.id, buyer);
    setHasBought(hasbought);

    // seller
    const seller = await escrow.seller();
    setSeller(seller);
    const hassold = await escrow.approval(home.id, seller);
    setHasSold(hassold);

    //inspector
    const inspector = await escrow.inspector();
    setInspector(inspector);
    const hasinspected = await escrow.inspectionPassed(home.id);
    setHasInspected(hasinspected);

    // lender
    const lender = await escrow.lender();
    setLender(lender);
    const haslended = await escrow.approval(home.id, lender);
    setHasLended(haslended);
  };
  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt={home.desc} />
        </div>
        <div className="home__overview">
          <h2>{home.name}</h2>
          <p>
            <strong>{home.attributes[2].value}</strong> bds |
            <strong>{home.attributes[3].value}</strong> ba |
            <strong>{home.attributes[4].value}</strong> sqFt |
          </p>
          <p> {home.address}</p>
          <h1>{home.attributes[0].value} ETH</h1>

          <div>
            <button className="home__buy">Buy Home</button>
            <button className="home__contact">Contact</button>
            <hr />
            <h2>{"overview"}</h2>
            <p>{home.description}</p>
            <hr />
            <h2>Facts and Features</h2>
            <ul>
              {home.attributes.map((att, ind) => {
                return (
                  <li key={ind}>
                    <strong>{att.trait_type}</strong>: {att.value}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="home__close">
          <img src={close} alt="close" onClick={togglePurchase} />
        </div>
      </div>
    </div>
  );
};

export default Home;
