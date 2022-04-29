import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Web3 from "web3";
import MandoXStaking from '../../contracts/MandoXStaking.json';
import Lacedameon from '../../contracts/Lacedameon.json';

function Home({wallet, contract, nftContract}) {
  const [stakedCount, setStakedCount] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    async function getStatus() {
      const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
      const web3 = new Web3(provider);
      let _contract = new web3.eth.Contract(MandoXStaking.abi, MandoXStaking.networks[4].address);
      let _totalStaked = await _contract.methods.totalNFTStaked().call();
      setStakedCount(_totalStaked);
      console.log('_totalStaked', _totalStaked);

      let _nftContract = new web3.eth.Contract(Lacedameon.abi, Lacedameon.networks[4].address);
      let _totalSupply = await _nftContract.methods.totalSupply().call();
      setTotalSupply(_totalSupply);
      console.log('_totalSupply', _totalSupply);
      // if (!!wallet && !!contract) {
      //
      // } else {
      //
      // }
      // if (!!wallet && !!nftContract) {
      //
      //
      // } else {
      //
      // }
    }
    getStatus();

  }, []);

  const startStaking = async() => {

  }
  return (
    <>
      <div className="stake-bar mr-5 ml-5 mb-5" style={{ marginTop: 200 }}>
        <h4>
          Pool
        </h4>
        <h4 className="float-right">
          LCDM
        </h4>
      </div>
      <div className="row">
        <div className="offset-md-1 col-md-4 stake-bar">
          <h4>Expected Rewards</h4>
          <div className="pl-2 mt-3 pb-3 pb-line">Daily Rewards for 30 days: 1.5B MandoX</div>
          <div className="pl-2 mt-3 pb-3 pb-line">Daily Rewards for 60 days: 3B MandoX</div>
          <div className="pl-2 mt-3 pb-3 pb-line">Daily Rewards for 90 days: 10B MandoX</div>
          <div className="pl-2 pt-3">Other Rewards Coming Soon</div>
        </div>
        <div className="offset-md-2 col-md-4 stake-bar">
          <h4>Staking Info</h4>
          <div className="pl-2 mt-3 pb-3 pb-line">Total NFTs: {stakedCount}</div>
          <div className="pl-2 pt-3 pb-3 pb-line">Staked: {totalSupply}</div>
          <div className="pl-2 pt-3">Unstaked: {(totalSupply - stakedCount) >= 0 ? (totalSupply - stakedCount) : 0}</div>
        </div>
      </div>
      <div className="row">
        <div className="mt-5 mx-auto">
          <Link to='/stake' className="btn btn-connect">Start Staking</Link>
        </div>
      </div>

    </>
  );
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(Home);
