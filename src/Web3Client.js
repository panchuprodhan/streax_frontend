import Web3 from 'web3'
import Streax from 'contracts/StreaX.json';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

let selectedAccount;
let streaxContract;
let isInitialized = false;
let mintAmount;
let transferAmount, transferAddress;

export const init = async () => {
    let provider = window.ethereum;

    if (typeof provider !== 'undefined') {
    
    provider
    .request({method: 'eth_requestAccounts' })
    .then((accounts) => {
      selectedAccount = accounts[0];
      console.log(`Selected account is ${selectedAccount}`);
    })
    .catch((err) => {
      console.log(err);
    });
    window.ethereum.on('accountsChanged', function (accounts){
      selectedAccount = accounts[0];
      console.log(`Selected account changed to ${selectedAccount}`);
    });
  }
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  console.log(networkId);
  streaxContract = new web3.eth.Contract(Streax.abi, Streax.networks[networkId].address);
  isInitialized = true;
};

export const createToken = async() => {
  if (!isInitialized) {
    await init();
  }
  console.log(mintAmount)
  return streaxContract.methods
    .createToken(mintAmount)
    .send({from: selectedAccount})
}

export const MintForm = () => {

  const [minted, setMinted] = useState(false);
  // const [mintAmount] = useState('');

  const mint = (ev) => {
    ev.preventDefault();
    mintAmount = ev.target[0].value;
    console.log(mintAmount);
    createToken(mintAmount).then(tx => {
      console.log(tx);
      setMinted(true);
    }).catch(err => console.log(err));
  }

  const setValue = (e) => {
    console.log(e);
    // e.preventDefault();
  }
  const handleSubmit = event => {
    event.preventDefault();
    console.log(event.target[0].value);
  }

  return (
    <Card style={{width: '50rem', marginLeft: '5em', padding: '1em', background: 'azure'}}>
      <form onSubmit={mint}>
        <h2>Create the desired supply</h2>
        <br/>
        <div>
          <label style={{color: 'darkmagenta'}}>Amount of STXT tokens to be minted</label>
          <input
            style={{ marginLeft: '1vw' }}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button variant='primary' type="submit" style={{float: 'right'}}>Mint Token</Button>
        </div>
      </form>
    </Card>
  )
}

export const transferToken = async() => {
  if (!isInitialized) {
    await init();
  } 

  return streaxContract.methods
    .transferToken(transferAddress, transferAmount)
    .send({from: selectedAccount})
}

export const TransferForm = () => {

  const transfer = (ev) => {
    ev.preventDefault();
    transferAddress = ev.target[0].value;
    transferAmount = ev.target[1].value;
    console.log(ev);
    transferToken().then(tx => {
      console.log(tx);
    }).catch(err => console.log(err));
  }

  const setValue1 = (e) => {
    console.log(e);
    // e.preventDefault();
  }
  const setValue2 = (e) => {
    console.log(e);
    // e.preventDefault();
  }

  return (
    <Card style={{width: '50rem', marginLeft: '5em', padding: '1em', background: 'azure'}}>
      <form onSubmit={transfer}>
        <h2>Transfer desired amount to some address</h2>
        <br/>
        <div>
          <label style={{color: 'indigo'}}>Address of recepient to transfer STXT tokens</label>
          <input
            style={{ marginLeft: '1vw' }}
            onChange={(e) => setValue1(e.target.value)}
          />
        </div>
        <br/>
        <div>
          <label style={{color: 'darkmagenta'}}>Amount of STXT tokens to be transferred</label>
          <input
            style={{ marginLeft: '1vw' }}
            onChange={(e) => setValue2(e.target.value)}
          />
        </div>
        <Button type="submit" variant='primary' style={{float: 'right'}}>Transfer Token</Button>
      </form>
    </Card>
  )
}