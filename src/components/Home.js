import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Home = ({ home, provider, escrow, togglePurchase }) => {
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
