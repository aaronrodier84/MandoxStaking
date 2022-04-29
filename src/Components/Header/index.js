import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import logoImg from "../../images/logo_1.png";
import { initOnboard } from "../../hook/walletService"
import {ethers} from "ethers";
import { connect } from 'react-redux';
import MandoXStaking from '../../contracts/MandoXStaking.json';
import Lacedameon from '../../contracts/Lacedameon.json';
import {submitWallet} from "../../Redux/actions/walletActions";
import {submitContract} from "../../Redux/actions/contractActions";
import {submitNftContract} from "../../Redux/actions/nftContractActions";

function Header({onSubmitWallet, onSubmitContract, onSubmitNftContract}) {

  const [onboard, setOnboard] = useState();
  const [walletAddr, setWalletAddr] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  useEffect(() => {
    const _onboard = initOnboard({
      address: (address) => {
        console.log('address callback: ', address);
        if (!!address) {
          onSubmitWallet(address);
          setWalletAddr(
            shortenHex(address)
          );
        } else {
          onSubmitWallet(null);
          setWalletConnected(false);
        }
      },
      network: (network) => {
        console.log('network callback: ', network)
      },
      balance: (balance) => {
        console.log('balance', balance);
      },
      wallet: async (wallet) => {
        console.log('wallet', wallet);
        if (wallet.provider) {
          let ethersProvider = new ethers.providers.Web3Provider(wallet.provider);
          let _contract = new ethers.Contract(MandoXStaking.networks[4].address, MandoXStaking.abi, ethersProvider.getUncheckedSigner());
          let _nftContract = new ethers.Contract(Lacedameon.networks[4].address, Lacedameon.abi, ethersProvider.getUncheckedSigner());
          onSubmitContract(_contract);
          onSubmitNftContract(_nftContract);
        } else {
          onSubmitNftContract({});
          onSubmitContract({});
        }
      }
    })

    setOnboard(_onboard)
  }, []);

  const shortenHex = (hex, length = 4) => {
    return `${hex.substring(0, length + 2)}…${hex.substring(
      hex.length - length
    )}`;
  }

  const connectWallet = async () => {
    console.log('connectWallet');
    if (onboard) {
      const walletSelected = await onboard.walletSelect()
      if (!walletSelected) return

      console.log('wallet selected: ', walletSelected)
      const readyToTransact = await onboard.walletCheck()
      console.log('Wallet selected: ', walletSelected, ' Ready to transact: ', readyToTransact)
      if (walletSelected && readyToTransact) {
        setWalletConnected(true);
      }
    }
  }

  const disconnectWallet = async () => {
    if (onboard) {
      onboard.walletReset();
    }
  }
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <Link className="navbar-brand ml-5" to="/"><img src={logoImg} /></Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item  ml-5">
              <Link to="/"><h5>HOME</h5></Link>
            </li>
            <li className="nav-item ml-5">
              <Link to="/stake"><h5>STAKING</h5></Link>
            </li>
          </ul>
        </div>
        <span className="navbar-text">
          {
            !walletConnected && (
              <a className="btn btn-connect mr-5" onClick={() => connectWallet()}>CONNECT WALLET</a>
            )
          }
          {
            walletConnected && (
              <a className="btn btn-connect mr-5" onClick={() => disconnectWallet()}>DISCONNECT WALLET</a>
            )
          }
        </span>
      </nav>
    </>
  );
}

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    contract: state.contract
  };
};


const mapActionsToProps = {
  onSubmitWallet: submitWallet,
  onSubmitContract: submitContract,
  onSubmitNftContract: submitNftContract
}
export default connect(mapStateToProps, mapActionsToProps)(Header);

