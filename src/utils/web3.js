const tokenAddress = "0xD13F71c96ad056d18905767F165Ffc359A6eEF95"
const mintPrice = 0.008
const freeMint = 1200
const maxMint = 3000

import abi from './abi.json'
import Web3 from 'web3'

export const mint = (mintCnt, provider, account) => new Promise(async (resolve, reject) => {
  try {
    const web3 = new Web3(provider)
    const contract = new web3.eth.Contract(abi, tokenAddress, {from: account})

    let totalSupply = parseInt(await contract.methods.totalSupply().call())
    
    if(totalSupply + mintCnt > maxMint) {
      resolve('Not Enough NFTs to be minted')
    }

    let byebye = await  contract.methods.byebye().call()
    if(!byebye) {
      resolve('Error: Mint is not live')
    }

    let price = 0
    if(totalSupply + mintCnt >= freeMint) {
      price = mintPrice * mintCnt
    }


    let data = contract.methods.makingGZAL(mintCnt).encodeABI()
    let tx = {
      data: data,
      from: account,
      to: tokenAddress,
      value: Web3.utils.toWei(price + '')
    }

    let gas = await web3.eth.estimateGas(tx)
    console.log("gas: ", gas)
    await web3.eth.sendTransaction({
      ...tx,
      gas
    })

    resolve('success')
  } catch (error) {
    resolve('error')
  }
})