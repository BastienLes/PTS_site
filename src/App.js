import react, { useEffect, useState, useReducer } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
// import Web3 from 'web3';
// import Web3Provider from 'react-web3-provider';


import NFTree_contract from './contracts/NFTree_contract_abi.json';
const NFTree_contract_abi = NFTree_contract.abi;

const NFTree_contract_address = "0x4e5b4677BF2Dc0c34457A0472583E5FB9E4d0960";


let mintPrice = undefined;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure metamask is installed!");
      return;
    } else {
      console.log("Wallet exists.");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Install metamask please");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an annount! Address : ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }

  }


  const W_NewNFT = (val) => {
    let old = val - 1;
    alert("Your know own " + old + " NFTrees");
    // W_FakeBaycNumber(val);
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

        console.log("init payment");
        let nftTxn = await nftContrat.safeMint(currentAccount, "test");

        console.log("mining...");
        await nftTxn.wait();

        console.log("Nft Mined");
        nftContrat.balanceOf(currentAccount).then(W_NewNFT);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  const Home = () => {
    return (
      <div className="Aboutus">
        <h1>Comment ça marche ?</h1>
        <span>NFTree est une platfome permettant à des posséseur de parcelle de vendre leurs droits de coupe sous forme de NFT. <br /><br />
        <b>Pour utiliser NFTree : </b> <br /><br /> - Vous allez devoir pour vous connecter, créer un wallet MetaMask : <a href="https://metamask.io/" target="_blank"><b>cliquez ici pour en créer un.</b></a> <br /><br />
        - Maintenant, connectez-vous à l'aide de votre wallet MetaMask, cliquez sur le boutton <b>"Connect Wallet"</b> en haut à droite de la page. <br /><br />
        - Une fois connecté, vous pourrez tokéniser le droit de coupe de votre parcelle en remplissant le formulaire NFT,  pour cela rendez-vous dans <b>"NOUVEAU NFTREE"</b> en haut de la page. <br /><br />
        - Lorsque votre NFT sera validé par notre équipe, vous pourrez consulter vos NFT dans <b>"MES NFTREES".</b> <br /><br /><br /><br />
        <h1>Qui sommes nous ?</h1>
        Nous sommes trois étudiants dans une école d'ingenieur qui avions un projet à réaliser. <br /> <br />
        Andy GUERIN, ESILV A4 Majeur FINTECH <br /><br />
        Théo EVERARE, ESILV A4 Majeur FINTECH  <br /><br />
        Bastien LESUSEUR, ESILV A4 Majeur FINTECH 
        </span>
      </div>
    )
  }


  const ListFakeNeftDesc = (i, val) => {
    console.log("ListFakeNeftDesc(", i, ", ", val, ")")
  }


  const ListMyNFT_i = (address, total) => {
    try {
      const { ethereum } = window;
      total = parseInt(total)

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

        let obj = document.getElementById("FakeNeftList");
        let div_p = document.createElement("div");
        for (let i = 0; i < total; i++) {
          let div = document.createElement("div");
          div.id = "FakeNeftList-" + i;
          div.class = "FakeNeftList_unit";
          div_p.appendChild(div)
          nftContrat.tokenOfOwnerByIndex(address, i).then((val) => { ListFakeNeftDesc(i, val); });
        }
        obj.replaceChildren(div_p)
      }
    } catch (err) {
      console.log(err);
    }
  }


  const ListMyNFTrees_redirect = () => {
    return <div><h1>Page d'accueil</h1></div>
  }

  const NFTreeMarket = () => {
    return <div><h1>Page des NFTrees en ventes</h1></div>
  }

  const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
  }

  // const NewNFTree = () => { return <div></div> }
  const NewNFTree = () => {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = e => {
      e.preventDefault();
      alert('Formulaire envoyé avec : number = ' + e.target.number.value + " | geoloc = " + e.target.geoloc.value + " | size = " + e.target.size.value + " | horizon = " + e.target.horizon.value)
    }

    const handleChange = e => {
      setFormData({
        number: e.target.number,
        geoloc: e.target.geoloc,
        size: e.target.size,
        horizon: e.target.horizon,
      });
    }

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_un41x57', 'template_njudgbs', e.target, 'XhIeZbIo3zHwA0zWo')
          .then((result) => {
            console.log(result.text);
          }, (error) => {
            console.log(error.text);
          });
        e.target.reset()
    }

      return (
        <div className="wrapper">
          <h1>Formulaire pour NFT</h1>
          <span>Ce formulaire a pour but de nous donner des informations à propos de votre parcelle, suite à la validation de ce formulaire nous étudirons celui-ci et emmeterons un NFT possédant les informations de votre parcelle</span>
          {submitting &&
            <div>
              You are submitting the following:
              <ul>
                {Object.entries(formData).map(([name, value]) => (
                  <li key={name}><strong>{name}</strong>:{value.toString()}</li>
                ))}
              </ul>
            </div>
          }
          <form onSubmit={handleSubmit} onSubmit={sendEmail}>
            <fieldset class="form">
              <label> Numéro de parcelle :
                <input name="number" onChange={handleChange} />
              </label>
              <label> Géolocalisation :
                <input name="geoloc" onChange={handleChange} />
              </label>
              <label> Superficie :
                <input name="size" onChange={handleChange} />
              </label>
              <label> Horizon de coupe :
                <input name="horizon" onChange={handleChange} />
              </label>
            </fieldset>
            <button className="buttton" type="submit">Valider</button>
          </form>
        </div>
      )
    }

    const ListMyNFTrees = () => {
      const location = useLocation();
      let path_words = location.pathname.split("/");
      let address = path_words[path_words.length - 1]
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

          nftContrat.balanceOf(address).then((val) => { ListMyNFT_i(address, val) })
        }
      } catch (err) {
        console.log(err);
      }
      return <div>
        <h1>Fake Nefturians tokens for {address}</h1>
        <div id="FakeNeftList"></div>
      </div>
    }


    return (
      <div className='main-app'>
        <BrowserRouter>
          <div class="nav-main">
            <ul class="nav">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/market">Marché</Link></li>
              <li><Link to="/myNFTrees">Mes NFTrees</Link></li>
              <li><Link to="/newNFTree">Nouveau NFTree</Link></li>
            </ul>
            {currentAccount ? <h1>Connected</h1> : connectWalletButton()}
          </div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/market/" element={<NFTreeMarket />} />
            <Route exact path="/newNFTree/" element={<NewNFTree />} />
            <Route exact path="/myNFTrees" element={<ListMyNFTrees_redirect />} />
            <Route exact path="/myNFTrees/:address" element={<ListMyNFTrees />} />
          </Routes>
        </BrowserRouter>
      </div>
    )

  }
  // https://dev.to/rounakbanik/building-a-web3-frontend-with-react-340c
  export default App;