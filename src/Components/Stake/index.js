import React, {useEffect, useState} from "react";

import largeLogo from '../../images/logo_large.png';
import {ethers} from "ethers";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'font-awesome/css/font-awesome.min.css';
import MandoXStaking from '../../contracts/MandoXStaking.json';
import Lacedameon from '../../contracts/Lacedameon.json';
import {Link} from "react-router-dom";
import axios from "axios";
import {submitWallet} from "../../Redux/actions/walletActions";
import {submitContract} from "../../Redux/actions/contractActions";
import {submitNftContract} from "../../Redux/actions/nftContractActions";
import {submitLoading} from "../../Redux/actions/loadingActions";

const nft_contract = "0x49A8E659a8F84Ab3B4bF9bE80c0B84DF4Aa152D6";

function Stake({wallet, contract, nftContract, setIsLoading}) {

  const [balance, setBalance] = useState(0);
  const [stakedCount, setStakedCount] = useState(0);
  const [approvedAll, setApprovedAll] = useState(false);
  // const [loading, setIsLoading] = useState(false);
  const [unstakedNFTs, setUnstakedNFTs] = useState([]);
  const [statusChanged, setStatusChanged] = useState(false);
  const [unstakeAllFlag, setUnstakeAllFlag] = useState(false);
  const [stake30AllFlag, setStake30AllFlag] = useState(false);
  const [stake45AllFlag, setStake45AllFlag] = useState(false);
  const [stake90AllFlag, setStake90AllFlag] = useState(false);
  const [tier, setTier] = useState(30);
  const [updatedStakeContract, setUpdatedStakeContract] = useState(false);
  const [stakedNFT, setStakedNFT] = useState([]);

  const getUnStakedNFTs = async () => {
    console.log('getUnStakedNFTs');
    let _tokenIds = await nftContract.tokensOfOwner(wallet);
    let _unstakedNFTs = [];
    console.log('_tokenIds', _tokenIds);
    for (let i = 0; i < _tokenIds.length; i++) {
      let _tokenURI = await nftContract.tokenURI(_tokenIds[i]);
      let _metadata = await axios.get(_tokenURI);
      if (_metadata.data.image) {
        _metadata.data.image = _metadata.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      _metadata.data.token_id = (parseFloat(ethers.utils.formatUnits(_tokenIds[i])) * Math.pow(10, 18));
      _metadata.data.selected = false;
      _unstakedNFTs.push(_metadata.data);
    }
    console.log('_unstakedNFTs', _unstakedNFTs);
    setBalance(_unstakedNFTs.length);
    setUnstakedNFTs(_unstakedNFTs);
  }

  const getApproval = async () => {
    let _approvedAll = await nftContract.isApprovedForAll(wallet, MandoXStaking.networks[4].address);
    setApprovedAll(_approvedAll);
  }

  const resetSystem = () => {
    setApprovedAll(false);
    setBalance(0);
    setStakedCount(0);
    setUnstakedNFTs([]);
    setStatusChanged(false);
    setUnstakeAllFlag(false);
    setStakedNFT([]);
  }

  const getStakedNFTs = async () => {
    let _stakedNft = await contract.getStaked(wallet);
    console.log('_stakedNft', _stakedNft);
    setStakedCount(_stakedNft.length);
    let _stakedNFTs = [];
    for (let i = 0; i < _stakedNft.length; i++) {
      let _tokenURI = await nftContract.tokenURI(_stakedNft[i].tokenId);
      console.log('_tokenURI', _tokenURI);
      let _metadata = await axios.get(_tokenURI);
      console.log('_metadata', _metadata);
      if (_metadata.data.image) {
        _metadata.data.image = _metadata.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      _metadata.data.token_id = parseFloat(ethers.utils.formatUnits(_stakedNft[i].tokenId) * Math.pow(10, 18));
      _metadata.data.tier = _stakedNft[i].tier;
      _metadata.data.stakeTime = new Date(parseFloat(ethers.utils.formatUnits(_stakedNft[i].stakeTime) * Math.pow(10, 18)) * 1000);
      _metadata.data.stakeTime = _metadata.data.stakeTime.toLocaleDateString();
      _metadata.data.lockTime = new Date(parseFloat(ethers.utils.formatUnits(_stakedNft[i].lockTime) * Math.pow(10, 18)) * 1000);
      _metadata.data.lockTime = _metadata.data.lockTime.toLocaleDateString();
      _metadata.data.selected = false;
      _stakedNFTs.push(_metadata.data);
    }
    console.log('_stakedNFTs', _stakedNFTs);
    setStakedNFT(_stakedNFTs);
  }

  useEffect(() => {
    async function getStatus() {
      if (!!wallet && !!contract) {
        await getStakedNFTs();
      }
      if (!!wallet && !!nftContract) {
        await getUnStakedNFTs();

        await getApproval();

      } else {
        resetSystem();
      }
    }

    getStatus();
  }, [wallet, contract, nftContract, updatedStakeContract]);

  const approvedNft = async () => {
    if (!wallet || !nftContract) {
      toast.error("CONNECT WALLET FIRST!");
    } else {
      try {
        setIsLoading(true);
        setIsLoading(true);
        const approvalResult = await nftContract.setApprovalForAll(MandoXStaking.networks[4].address, true);
        await approvalResult.wait();
        console.log('approvalResult', approvalResult);
        if (approvalResult?.code === 4001) {
          await toast.success("NFT's linked successfully!");
        } else if (approvalResult?.code) {
          await toast.error("Link failed!");
        } else {
          await toast.success("Link Status updated!");
        }
        setApprovedAll(true);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.log('setApprovalForAll Error', e);
      }
    }
  }

  // useEffect(() => {
  //   if (approvedAll === true) {
  //     var config = {
  //       method: "get",
  //       url: `https://deep-index.moralis.io/api/v2/${wallet}/nft/0x49A8E659a8F84Ab3B4bF9bE80c0B84DF4Aa152D6?chain=rinkeby&format=decimal`,
  //       headers: {
  //         "x-api-key":
  //           "YdfQ8HLEMAOyhK7jKFSwjbIHqLQEaBT3UjSTyXrBED6hdaO7SaXa1lqdoAdMAv1Z",
  //       },
  //     };
  //     axios(config)
  //       .then(function (response) {
  //         console.log('response', response);
  //         let _result = response.data.result;
  //         for (let i = 0; i < _result.length; i++) {
  //           if (!_result[i].metadata && !!_result[i].token_uri) {
  //             axios.get(_result[i].token_uri).then (function(resp) {
  //               _result[i].metadata = resp.data;
  //             });
  //           } else {
  //             _result[i].metadata = JSON.parse(_result[i].metadata);
  //           }
  //           _result[i].selected = false;
  //         }
  //         setUnstakedNFTs(_result);
  //         console.log('unstakedNFTs', _result);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }
  // }, [approvedAll, updatedStakeContract]);

  const toggleSelected = (index) => {
    let _unstakedNFTs = unstakedNFTs;
    _unstakedNFTs[index].selected = !_unstakedNFTs[index].selected;
    console.log('index', index);
    console.log('unstakedNFTs', unstakedNFTs);
    setUnstakedNFTs(_unstakedNFTs);
    setStatusChanged(!statusChanged);
  }

  const selectAllUnstakedNFT = () => {
    let _unstakedNFTs = unstakedNFTs;
    for (let i = 0; i < _unstakedNFTs.length; i++) {
      _unstakedNFTs[i].selected = !unstakeAllFlag;
    }
    setUnstakeAllFlag(!unstakeAllFlag);
    setUnstakedNFTs(_unstakedNFTs);
    setStatusChanged(!statusChanged);
  }

  async function estimateGas() {
    let responseValue;
    try {
      await axios.get(`https://ethgasstation.info/api/ethgasAPI.json?api-key=c94facbd2247d1a3d63557a1caf6d9e126c943e1a5294d0ccef18006651b`).then(res => {
        console.log('gasPrice', res.data);
        responseValue = res.data.average / 10 + 20;
      })
    } catch (e) {
      responseValue = 70;
    }
    return responseValue;
  }

  const stakeNFTs = async () => {
    console.log('tier', tier);
    console.log('unstakedNFTs', unstakedNFTs);
    if (!!wallet && !!contract) {
      let _stakeIDs = [];
      for (let i = 0; i < unstakedNFTs.length; i++) {
        if (unstakedNFTs[i].selected) {
          _stakeIDs.push(parseInt(unstakedNFTs[i].token_id));
        }
      }
      console.log('_stakeIDs', _stakeIDs);
      if (_stakeIDs.length === 0) {
        toast.error("No NFT is selected!");
        return;
      }
      try {
        setIsLoading(true);
        let gas = 70;
        await estimateGas().then(function (res) {
          gas = res;
        });
        const _transaction = await contract.addManyToRegister(_stakeIDs, tier, {
          from: wallet,
          gasPrice: ethers.utils.parseUnits(String(gas), 'gwei')
        });
        await _transaction.wait();
        toast.success("Staked Successfully!");
        setUpdatedStakeContract(!updatedStakeContract);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log('claim error', err);
        if (err.constructor !== Object) {
          if (String(err).includes('"code":-32000')) {
            toast.error('Error: insufficient funds for intrinsic transaction cost');
          } else {

            let startingIndex = String(err).indexOf('"message"');
            let endingIndex = String(err).indexOf('"data"');
            let sub1 = String(err).substring(startingIndex, endingIndex);

            let sub2 = sub1.replace('"message":"', '');
            let ret = sub2.replace('",', '');
            toast.error(ret.charAt(0).toUpperCase() + ret.slice(1));
          }
        } else if (err.code === -32000) {
          toast.error('Gas price is changing rapidly. if you try to mint now, minting might fail. please try again after a few mins.');
        }
      }
    }
  }

  const selectAllStakedNFT = (tier = 30) => {
    let _stakedNFT = stakedNFT;
    for (let i = 0; i < _stakedNFT.length; i++) {
      if (_stakedNFT[i].tier === tier) {
        _stakedNFT[i].selected = !_stakedNFT[i].selected;
      }
    }
    if (tier === 30) {
      setStake30AllFlag(!stake30AllFlag);
    } else if (tier === 45) {
      setStake45AllFlag(!stake45AllFlag);
    } else {
      setStake90AllFlag(!stake90AllFlag);
    }
    setStakedNFT(_stakedNFT);
    setStatusChanged(!statusChanged);
  }

  const getGasPrice = async () => {
    try {
      let {data} = await axios.get('https://ethgas.watch/api/gas');
      return `${data.normal.gwei}`;
    } catch (e) {

    }
    return 70;
  }

  const claimRewards = async (tier = 30, unstake = false) => {
    console.log('tier', tier);
    let _claimToken = [];
    for (let i = 0; i < stakedNFT.length; i++) {
      if (stakedNFT[i].selected && stakedNFT[i].tier === tier) {
        _claimToken.push(stakedNFT[i].token_id);
      }
    }
    if (_claimToken.length === 0) {
      toast.error("Select the Staked NFT first!");
      return;
    }
    try {
      setIsLoading(true);
      let gas = 70;
      await estimateGas().then(function (res) {
        gas = res;
      });
      console.log('gas', gas);
      const res = await contract.claimManyFromRegister(_claimToken, unstake, {from: wallet, gasPrice: ethers.utils.parseUnits(String(gas), 'gwei')});
      await res.wait();
      setUpdatedStakeContract(!updatedStakeContract);
      toast.success("Claimed Successfully")
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log('claim error', err);
      if (err.constructor !== Object) {
        if (String(err).includes('"code":-32000')) {
          toast.error('Error: insufficient funds for intrinsic transaction cost');
        } else {

          let startingIndex = String(err).indexOf('"message"');
          let endingIndex = String(err).indexOf('"data"');
          let sub1 = String(err).substring(startingIndex, endingIndex);

          let sub2 = sub1.replace('"message":"', '');
          let ret = sub2.replace('",', '');
          toast.error(ret.charAt(0).toUpperCase() + ret.slice(1));
        }
      } else if (err.code === -32000) {
        toast.error('Gas price is changing rapidly. if you try to mint now, minting might fail. please try again after a few mins.');
      }
    }

  }

  const selectTier = () => {

  }

  useEffect(() => {

  }, [statusChanged]);

  return (
    <>
      <div className="home large-container mt-5">
        <div className="text-center">

          {
            (stakedCount === 0) && (
              <>
                <img className="staked-nft" src={largeLogo}/>
                <h3>You do not have any staked NFTs</h3>
                <h6>Stake some NFTs from your unstaked NFTs section to start earning rewards</h6>
              </>
            )
          }
          {
            (stakedCount !== 0) && (
              <>
                {
                  stakedNFT.filter(each => each.tier === 30).length > 0 && (
                    <div className="row">
                      <div className="col-md-10 text-left">

                        <h4>30 Days:</h4>

                        <div className="row">
                          {
                            stakedNFT.map((nft, index) => {
                              if (nft.tier === 30) {
                                return (
                                  <div className="col-md-3 text-left" key={index}>
                                    <img
                                      className={`unstaked-card ${nft.selected ? "selected-card" : "unselected-card"}`}
                                      src={nft.image ? nft.image : largeLogo}
                                      alt={null}
                                      onClick={() => {
                                        nft.selected = !nft.selected;
                                        setStatusChanged(!statusChanged);
                                      }}
                                      style={{width: "100%"}}/>
                                    Token ID: #{nft.token_id}<br/>
                                    Lock Time: {nft.tier} Days<br/>
                                    Stake Date: {nft.stakeTime}<br/>
                                    UnStake Date: {nft.lockTime}<br/>
                                  </div>
                                )
                              }
                            })
                          }
                        </div>
                      </div>
                      <div className="col-md-2">
                        <a className="btn btn-connect full-width"
                           onClick={() => selectAllStakedNFT(30)}>{unstakeAllFlag ? "Deselect All" : "Select All"}</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(30)}>Claim Only</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(30, true)}>Claim With Unstake</a>
                      </div>
                    </div>
                  )
                }
                {
                  stakedNFT.filter(each => each.tier === 45).length > 0 && (
                    <div className="row mt-3">
                      <div className="col-md-10 text-left">

                        <h4>45 Days:</h4>

                        <div className="row">
                          {
                            stakedNFT.map((nft, index) => {
                              if (nft.tier === 45) {
                                return (
                                  <div className="col-md-3 text-left" key={index}>
                                    <img
                                      className={`unstaked-card ${nft.selected ? "selected-card" : "unselected-card"}`}
                                      src={nft.image ? nft.image : largeLogo}
                                      alt={null}
                                      onClick={() => {
                                        nft.selected = !nft.selected;
                                        setStatusChanged(!statusChanged);
                                      }}
                                      style={{width: "100%"}}/>
                                    Token ID: #{nft.token_id}<br/>
                                    Lock Time: {nft.tier} Days<br/>
                                    Stake Date: {nft.stakeTime}<br/>
                                    UnStake Date: {nft.lockTime}<br/>
                                  </div>
                                )
                              }
                            })
                          }
                        </div>
                      </div>
                      <div className="col-md-2">
                        <a className="btn btn-connect full-width"
                           onClick={() => selectAllStakedNFT(45)}>{unstakeAllFlag ? "Deselect All" : "Select All"}</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(45)}>Claim Only</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(45, true)}>Claim With Unstake</a>
                      </div>
                    </div>
                  )
                }
                {
                  stakedNFT.filter(each => each.tier === 90).length > 0 && (
                    <div className="row mt-3">
                      <div className="col-md-10 text-left">

                        <h4>90 Days:</h4>

                        <div className="row">
                          {
                            stakedNFT.map((nft, index) => {
                              if (nft.tier === 90) {
                                return (
                                  <div className="col-md-3 text-left" key={index}>
                                    <img
                                      className={`unstaked-card ${nft.selected ? "selected-card" : "unselected-card"}`}
                                      src={nft.image ? nft.image : largeLogo}
                                      alt={null}
                                      onClick={() => {
                                        nft.selected = !nft.selected;
                                        setStatusChanged(!statusChanged);
                                      }}
                                      style={{width: "100%"}}/>
                                    Token ID: #{nft.token_id}<br/>
                                    Lock Time: {nft.tier} Days<br/>
                                    Stake Date: {nft.stakeTime}<br/>
                                    UnStake Date: {nft.lockTime}<br/>
                                  </div>
                                )
                              }
                            })
                          }
                        </div>
                      </div>
                      <div className="col-md-2">
                        <a className="btn btn-connect full-width"
                           onClick={() => selectAllStakedNFT(90)}>{unstakeAllFlag ? "Deselect All" : "Select All"}</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(90)}>Claim Only</a>
                        <a className="btn btn-connect full-width mt-3"
                           onClick={() => claimRewards(90, true)}>Claim With Unstake</a>
                      </div>
                    </div>
                  )
                }

              </>
            )
          }
        </div>
        <div className="mt-5">
          <h3>
            Unstaked NFTs
          </h3>
        </div>
        <div className="text-center">
          {
            (balance === 0) && (
              <>
                <img className="staked-nft" src={largeLogo}/>
                <h3>You do not have any unstaked NFTs</h3>
              </>
            )
          }



        </div>
        {
          (balance !== 0) && (
            <div className="row mb-3">
              <div className="col-md-10">
                <div className="row">
                  {
                    unstakedNFTs.map((nft, index) => {
                      if (nft) {
                        return (
                          <div className="col-md-3 text-center" key={index}>
                            <img className={`unstaked-card ${nft.selected ? "selected-card" : "unselected-card"}`}
                                 src={nft.image ? nft.image : largeLogo}
                                 alt={null}
                                 onClick={() => toggleSelected(index)}
                                 style={{width: "100%"}}/>
                            Token ID #{nft.token_id}
                          </div>
                        )
                      }
                    })
                  }
                </div>
              </div>
              <div className="col-md-2">
                <a className="btn btn-connect full-width"
                   onClick={() => selectAllUnstakedNFT()}>{unstakeAllFlag ? "Deselect All" : "Select All"}</a>

                <select className="browser-default custom-select btn-connect text-center mt-4"
                        onChange={(e) => setTier(parseInt(e.target.value))}>
                  <option value="30">30 Days</option>
                  <option value="45">45 Days</option>
                  <option value="90">90 Days</option>
                </select>

                <a className="ml-auto mr-auto btn btn-connect full-width mt-4" onClick={() => stakeNFTs()}>Stake</a>
              </div>
            </div>
          )
        }
        {
          (!approvedAll) && (
            <h6 className="text-center">Approve your Lacedameon to Start Earning</h6>
          )
        }
        {
          (!approvedAll) && (
            <div className="row">
              <div className="mt-5 mx-auto">
                <a onClick={() => approvedNft()} className="btn btn-connect" style={{width: "120px"}}>Approve All</a>
              </div>
            </div>
          )
        }

      </div>
    </>
  )
}

const mapStateToProps = state => {
  return state;
}
export default connect(mapStateToProps)(Stake);

