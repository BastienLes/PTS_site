import react, { useEffect, useState, useReducer } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
//import Web3 from 'web3';
// import Web3Provider from 'react-web3-provider';


import NFTree_contract from './contracts/NFTree_contract_abi.json';
import NFTree_erc20 from './contracts/NFTree_ERC20_abi.json';

const NFTree_contract_abi = NFTree_contract.abi;
const NFTree_erc20_abi = NFTree_erc20.abi;

const NFTree_contract_address = "0x2E8a2AC06bcb99A0Cbe03247d6429bCa6128CeB2";
const NFTree_erc20_address = "0x6CdfFc313F6f7647E180d9EA15ffC2CE04015F90";


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
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }

  }
  connectWalletHandler()


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
        <h1>Comment ??a marche ?</h1>
        <span>NFTree est une platfome permettant ?? des poss??seur de parcelle de vendre leurs droits de coupe sous forme de NFT. <br /><br />
        <b>Pour utiliser NFTree : </b> <br /><br /> - Vous allez devoir pour vous connecter, cr??er un wallet MetaMask : <a href="https://metamask.io/" target="_blank"><b>cliquez ici pour en cr??er un.</b></a> <br /><br />
        - Maintenant, connectez-vous ?? l'aide de votre wallet MetaMask, cliquez sur le boutton <b>"Connect Wallet"</b> en haut ?? droite de la page. <br /><br />
        - Une fois connect??, vous pourrez tok??niser le droit de coupe de votre parcelle en remplissant le formulaire NFT,  pour cela rendez-vous dans <b>"NOUVEAU NFTREE"</b> en haut de la page. <br /><br />
        - Lorsque votre NFT sera valid?? par notre ??quipe, vous pourrez consulter vos NFT dans <b>"MES NFTREES".</b> <br /><br /><br /><br />
        <h1>Qui sommes nous ?</h1>
        Nous sommes trois ??tudiants dans une ??cole d'ingenieur qui avions un projet ?? r??aliser. <br /> <br />
        Andy GUERIN, ESILV A4 Majeur FINTECH <br /><br />
        Th??o EVERAERE, ESILV A4 Majeur FINTECH  <br /><br />
        Bastien LESUSEUR, ESILV A4 Majeur FINTECH 
        </span>
      </div>
    )
  }


  const ListFakeNeftDesc = (i, val) => {
    console.log("ListFakeNeftDesc(", i, ", ", val, ")")
  }
  
  const insertValue = (id, clss, val) => {
    if(val == "") val = "undefined"
    try{
      document.getElementById(id).getElementsByClassName(clss)[0].innerHTML = val;
    } catch {}
  }

  const redirectToSell = (e) => {
    let id = e.target.parentNode.parentNode.parentNode.parentNode.id.split("#")[1]
    window.location.replace("./myNFTrees/sell/" + id);
  }

  const burnNFTree = async (e) => {
    let id = e.target.parentNode.parentNode.parentNode.parentNode.id.split("#")[1]

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

        let nftTxn = await nftContrat.burn(id)
        await nftTxn.wait();
        alert("Votre NFT a bien ??t?? burn");
        window.location.replace("../");
      }
    } catch (err) {
      console.log(err);
    }
  }


  const buyNFTree = async (e) => {
    let id = e.target.parentNode.parentNode.parentNode.parentNode.id.split("#")[1]

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const erc20_contract = new ethers.Contract(NFTree_erc20_address, NFTree_erc20_abi, signer);
        let price = e.target.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("sell_price")[0].innerHTML
        // price = ethers.utils.parseEther(price)
        price = price * (10 ** 9)
        console.log(price)
        erc20_contract.buyToken(id, price).then(console.log);
        // let nftTxn = await erc20_contract.buyToken(id, {value: val});
        // await nftTxn.wait();
        // alert("F??licitation, vous avez achet?? ce NFTree");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const ShowNFTree = (id, usage, onlyBuyable = false, onlyAddress = "ALL") => {
    let obj_id = "NFTree#" + id;

    let showBuy = false;
    let showSell = false;
    let showBurn = false;
    if(usage == "market"){
      showBuy = true;
    } else if (usage == "myNFTrees"){
      showSell = true;
      showBurn = true;
    }
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);

        nftContrat.parcelNumber(id).then((val) => { insertValue(obj_id, "np_value", val) });
        nftContrat.size(id).then((val) => { insertValue(obj_id, "s_value", val) });
        nftContrat.geolocalisation(id).then((val) => { insertValue(obj_id, "geo_value", val) });
        nftContrat.horizonCoupe(id).then((val) => { 
          val = new Date(val)
          val = val.toLocaleString('default', { month: 'long' }) + " " + val.getFullYear()
          insertValue(obj_id, "hc_value", val) 
        });
        nftContrat.isOnSale(id).then((val) => { 
          try{
            insertValue(obj_id, "sell_bool", val ? "Oui" : "Non");
            if(!val){
                let sell_p = document.getElementById(obj_id).getElementsByClassName("sell_price")[0];
                sell_p.parentNode.parentNode.removeChild(sell_p.parentNode);

                let sell_t = document.getElementById(obj_id).getElementsByClassName("sell_time")[0];
                sell_t.parentNode.parentNode.removeChild(sell_t.parentNode);

                if(onlyBuyable){
                  let a = document.getElementById(obj_id)
                  a.parentNode.removeChild(a)                
                }
            } else {
              if(showSell){
                let sell_b = document.getElementById(obj_id).getElementsByClassName("sell_NFTree")[0];
                sell_b.parentNode.parentNode.removeChild(sell_b.parentNode);
              }
            }
          } catch {}
        });
        nftContrat.sellingPrice(id).then((val) => { insertValue(obj_id, "sell_price", val / 10 ** 9) });
        nftContrat.inSaleUntil(id).then((val) => {
          val = new Date(val*1000)
          val = val.getDay() + " " + val.toLocaleString('default', { month: 'long' }) + " " + val.getFullYear()
          insertValue(obj_id, "sell_time", val)
        });

        nftContrat.ownerOf(id).then((val) => { 
          insertValue(obj_id, "own_value", val)
          if(!showSell && val != currentAccount){
            try {
              let sell_b = document.getElementById(obj_id).getElementsByClassName("sell_NFTree")[0];
              sell_b.parentNode.parentNode.removeChild(sell_b.parentNode);

            } catch {}
          }
        })

        nftContrat.firstOwner(id).then((val) => { 
          val = val.toLowerCase()
          if(showBurn && val != currentAccount){
            try {
              let burn_b = document.getElementById(obj_id).getElementsByClassName("burn_NFTree")[0];
              burn_b.parentNode.parentNode.removeChild(burn_b.parentNode);
            } catch {}
          }
        })

        nftContrat.ownerOf(id).then((val) => {
            // console.log("NFTContract " + id + " exists")
            val = val.toLowerCase()
            // en vente mais le votre, on empeche l'achat
            if(val == currentAccount){
              try{
                let buy_b = document.getElementById(obj_id).getElementsByClassName("buy_NFTree")[0];
                buy_b.parentNode.removeChild(buy_b)
              } catch {}
            }
            if(onlyAddress != "ALL" && onlyAddress != val){
              let a = document.getElementById(obj_id)
              a.parentNode.removeChild(a)              
            } 
          }, (raison) => {
            // si le token existe pas ne l'affiche pas
            let a = document.getElementById(obj_id)
            a.parentNode.removeChild(a)
        });


      }
      
    } catch (err) {
      console.log(err);
    }

    return (
      <fieldset className="NFTreeUnit" id={obj_id}>
        <ul> 
          <div>
            <li>NFTree #{id}</li>
            <li>Propri??taire (addresse) :</li><div className="own_value"></div><br/>
            <li>Num??ro de parcelle :&nbsp;<div className="np_value"></div></li>
            <li>Taille de la parcelle (en km2) :&nbsp;<div className="s_value"></div></li>
            <li>Geolocalisation :&nbsp;<div className="geo_value"></div></li>
            <li>Horizon de coupe :&nbsp;<div className="hc_value"></div></li>
            <li>Parcelle en vente ? :&nbsp;<div className="sell_bool"></div></li>
            <li>Prix de vente : &nbsp;<div className="sell_price"></div></li>
            <li>En vente jusuq'au :&nbsp;<div className="sell_time"></div></li>
          </div>
          <div className="actionButtons">
            {showSell ? <li><button type="button" className="cta-button sell_NFTree" onClick={redirectToSell}>Vendre</button></li> : ""}
            {showBurn ? <li><button type="button" className="cta-button burn_NFTree" onClick={burnNFTree}>Burn</button></li> : ""}
            {showBuy ? <li><button type="button" className="cta-button buy_NFTree" onClick={buyNFTree}>Acheter</button></li> : ""}
          </div>
          {}
        </ul>
      </fieldset>
    )
  }


  const ListMyNFTrees_redirect = () => {
    if(!currentAccount){
      alert("Please connect yourself with the button on the top-right hand corner")
      window.location.replace("../");
    } else {
      return ListMyNFTrees(currentAccount);
    }
  }

  const NFTreeMarket = () => {
    return (<div className="NFTreeList_market">
        { ShowNFTree_bcl(1, "market", true) }
      </div>);
  }

  const SellMyNFTree = () => {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);
    // mapping(uint => uint256) public sellingPrice;
    // mapping(uint => uint256) public inSaleUntil;

    const handleChange2 = e => {
      
      setFormData({
        number: e.target.number,
        geoloc: e.target.geoloc,
        size: e.target.size,
        horizon: e.target.horizon,
      });
    }

    const handleSubmit2 = async e => {
      e.preventDefault();
      let price = e.target.SellingPrice.value * 10 ** 9;
      let dateTs = Date.parse(e.target.inSaleUntil.value) / 1000;
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const nftContrat = new ethers.Contract(NFTree_contract_address, NFTree_contract_abi, signer);
          let nftTxn = await nftContrat.setOnSale(e.target.tokenId.value, price, dateTs);
          await nftTxn.wait();
          alert('Votre NFT est bien en ventre pour ' + price + " eth jusqu'au " + dateTs);
        }
      } catch (err) {
        console.log(err);
      }
      
    }

    const location = useLocation();
    let path_words = location.pathname.split("/");
    let id = path_words[path_words.length - 1];
    return (
    <div>
      <h1>Page du NFTree #{id}</h1>
      <div>{ShowNFTree(id, "none")}</div>
      <form onSubmit={handleSubmit2}>
            <fieldset className="form">
            <label> Id du Token :
                <input className="greyId" name="tokenId" type="text" readOnly value={id} />
              </label>
              <label> Prix de vente de votre NFT (en ETH) :
                <input name="SellingPrice" type="number" step="0.00001" onChange={handleChange2} />
              </label>
              <label> Date de vente maximum :
                <input name="inSaleUntil" type="datetime-local"  onChange={handleChange2} />
              </label>
            </fieldset>
            <button  on className="cta-button SellButton" type="submit">Vendre mon NFT</button>
          </form>
      
    </div>)
  }

  const formReducer = (state, event) => {
    return {
      ...state,
      [event.name]: event.value
    }
  }

  const NewNFTree = () => {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [submitting, setSubmitting] = useState(false);


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

    const handleSubmit = e => {
      e.preventDefault();
      sendEmail(e)
      alert('Formulaire envoy?? avec : number = ' + e.target.number.value + " | geoloc = " + e.target.geoloc.value + " | size = " + e.target.size.value + " | horizon = " + e.target.horizon.value)
    }

      return (
        <div className="wrapper">
          <h1>Formulaire pour NFT</h1>
          <span>Ce formulaire a pour but de nous donner des informations ?? propos de votre parcelle, suite ?? la validation de ce formulaire nous ??tudirons celui-ci et emmeterons un NFT poss??dant les informations de votre parcelle</span>
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
          <form onSubmit={handleSubmit}>
            <fieldset className="form">
              <label> Num??ro de parcelle :
                <input name="number" onChange={handleChange} />
              </label>
              <label> G??olocalisation :
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

    const ShowNFTree_bcl = (id_to, usage, onlyBuyable, onlyAddress) => {
      let res = [];
      for(let i = 0; i < id_to; i++){
        res[i] = ShowNFTree(i, usage, onlyBuyable, onlyAddress)
      }
      return res;
    }

    const ListMyNFTrees = (address = null) => {
      const location = useLocation();
      if(address == null){
        let path_words = location.pathname.split("/");
        let address = path_words[path_words.length - 1]
      }

      return (
        <div >
          <h1>Ici, vous pouvez consulter vos NFT </h1><h3>(addresse : {address})</h3>
          <div className="NFTreeList_market">
            { ShowNFTree_bcl(10, "myNFTrees", false, address) }
          </div>
        </div>
      )
    }


    return (
      <BrowserRouter>
        <div className="nav-back">
          <div className="nav-main nav">
            <ul className="nav">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/market">March??</Link></li>
              <li><Link to="/myNFTrees">Mes NFTrees</Link></li>
              <li><Link to="/newNFTree">Nouveau NFTree</Link></li>
            </ul>
            {currentAccount ? <h1>Connect??</h1> : connectWalletButton()}
          </div>
        </div>
        <div className='main-app'>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/market/" element={<NFTreeMarket />} />
            <Route exact path="/newNFTree/" element={<NewNFTree />} />
            <Route exact path="/myNFTrees/" element={<ListMyNFTrees_redirect />} />
            <Route exact path="/myNFTrees/:address" element={<ListMyNFTrees />} />
            <Route exact path="/myNFTrees/sell/:id" element={<SellMyNFTree />} />
          </Routes>
        </div>
      </BrowserRouter>
      
    )

  }
  // https://dev.to/rounakbanik/building-a-web3-frontend-with-react-340c
  export default App;