import './assets/styles/style.scss'
import './assets/styles/fonts.scss'
import { useState } from 'react';
import { shortenAddress, useEthers } from '@usedapp/core';
import { useEffect } from 'react';
import Web3 from 'web3'
import { mint } from './utils/web3';


function App() {

  const [mintCnt, setMintCnt] = useState(1)

  const { chainId, account, library, activateBrowserWallet, deactivate} = useEthers()

  const handleConnect = async () => {
    if(account) {
      deactivate()
    }
    else {
      await activateBrowserWallet()
    }
  }

  const changeNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(1) }]
      });
    } catch (switchError) {
      console.log("ErrorCode: ", switchError.code)
      deactivate()
    }
  }

  const handleMint = async () => {
    if(!account || chainId !== 1) return
    let res = await mint(mintCnt, library.provider, account)
    window.alert(res)
  } 

  useEffect(() => {
    if(account && chainId !== 1) {
      changeNetwork()
    }
  }, [chainId, account])

  return (
    <div className="app">
      <div className="background">
        <img src="/images/element1.png" alt="bg" className="element1" />
        <img src="/images/element2.png" alt="bg" className="element2" />
      </div>
      <header>
        <div className='title'>GENZArtLab</div>
        <button onClick={handleConnect}>
          {
            account ? shortenAddress(account) : "CONNECT"
          }
        </button>
      </header>
      <main>
        <div className='control-group'>
          <div className='mint-cnt'>{mintCnt}</div>
          <div className='ctrl-buttons'>
            <button className='up' onClick={() => setMintCnt(2)}></button>
            <button className='down' onClick={() => setMintCnt(1)}></button>
          </div>
          <button className='mint-button' onClick={handleMint}>MINT</button>
        </div>
      </main>
    </div>
  );
}

export default App;
