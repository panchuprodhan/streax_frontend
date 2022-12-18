import React, {useEffect} from 'react';
import {init, createToken, MintForm, TransferForm} from './Web3Client';

function App() {
  
  useEffect(() => {
    init();
  }, []);

  return (
  <div className='App' style={{background: 'silver', padding: '2em'}}>
    <MintForm />
    <br/><br/>
    <TransferForm />
  </div>
  );
}
export default App;