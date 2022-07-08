import { createContext, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

const api_host = "http://localhost:8000";

const AccountInfoContext = createContext({
    access_token: null,
    user_obj: null,
    connectWallet: () => {},
    signer: null,
    loginCheck: () => {},
    logout: () => {},
  });
  
  export function AccountInfoContextProvider(props) {
    const [accessToken, setAccessToken] = useState(null);
    const [user_obj, setUser_obj] = useState(null);
    const [web3signer, setWeb3signer] = useState(null);
  
    async function login(signer) {
      const address = await signer.getAddress();
      // get nounce for this user
      const meta = await axios.get(api_host + "/user_svc/get_captcha/?web3_address=" + address); //http://127.0.0.1:8000/user_svc/get_captcha/?web3_address=xyz
  
      // ask for sign
      let signature = null;
      try{
        signature = await signer.signMessage(meta.data.data.captcha);
      }catch(e){
        console.log("signature declined!",e)
      }
      
      // login
      if(signature){
        const data = {
          web3_address: address,
          signature: signature,
        };
        // console.log(data);
        // get token , is first_login
        axios.post(api_host + "/user_svc/web3_login/", data).then((response) => {
          if(response.status==200){
            console.log(response.data);
            // set access token
            let access_token = null
            if(response.data.token){
              access_token = "token "+response.data.token
            }
            
            setAccessToken(access_token);
            setUser_obj(response.data.data);
            setWeb3signer(signer);
            window.sessionStorage.setItem("user_obj", JSON.stringify(response.data.data));
            window.sessionStorage.setItem("access_token", access_token);
            // console.log("login successful");
          }else{
            alert("login failed try again!")
          }
        }).catch((err)=>{
            // console.log(err);
            alert("login failed");
        });;
        
      }else{
        alert("signature declined!")
      }
      
    }
  
    function logout() {
      setUser_obj(null);
      setAccessToken(null);
      setWeb3signer(null);
      window.sessionStorage.removeItem("user_obj");
      window.sessionStorage.removeItem("access_token");
      // remove access token
    }
    async function onAccountChange(accounts) {
      logout();
      // const signer = await setupWallet();
      // await login(signer);
    }
  
    async function onNetworkChange(chainId) {
      console.log("chainChanged",chainId);
      if(chainId !='0x539'){
        alert("network not supported!")
        // try {
        //   // check if the chain to connect to is installed
        //   await window.ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: '0x539' }], // chainId must be in hexadecimal numbers
        //   });
        // } catch (error) {
        //   // This error code indicates that the chain has not been added to MetaMask
        //   // if it is not, then install it into the user MetaMask
        //   if (error.code === 4902) {
        //     try {
        //       await window.ethereum.request({
        //         method: 'wallet_addEthereumChain',
        //         params: [
        //           {
        //             chainId: '0x539',
        //             rpcUrl: 'http://149.28.175.112:8545',
        //           },
        //         ],
        //       });
        //     } catch (addError) {
        //       console.error(addError);
        //     }
        //   }
        //   console.error(error);
        // }
      }
    }
  
    async function setupWallet() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
  
      connection.on("accountsChanged", (accounts) => {
        onAccountChange(accounts);
      });
  
      connection.on("chainChanged", (chainId) => {
        onNetworkChange(chainId)
      });
      
      // // Subscribe to provider connection
      // connection.on("connect", (info) => {
      //   console.log("connected",info);
      // });
      
      // // Subscribe to provider disconnection
      // connection.on("disconnect",(error) => {
      //   console.log("disconnect",error);
      // });
  
      const signer = provider.getSigner();
      return signer;
    }
  
    async function ConnectWalletHandler(props) {
      if (typeof window.ethereum !== "undefined") {
        // console.log("connect wallet cicked");
        const signer = await setupWallet();
        login(signer);
      }
      else{
        alert("metamask not installed!");
      }
    }
  
    async function LoginCheckSession() {
      const user_obj = window.sessionStorage.getItem("user_obj")?JSON.parse(window.sessionStorage.getItem("user_obj")):null;
      const access_token = window.sessionStorage.getItem("access_token");
  
      const signer = await setupWallet();
      const address = await signer.getAddress();
  
      // console.log(user_obj,address);
      if (user_obj && access_token) {
          if (user_obj.web3_address == address){
              setAccessToken(access_token);
              setUser_obj(user_obj);
              setWeb3signer(signer);
          }else{
              logout()
          }
        
      } else {
        logout();
      }
    }
  
    const context = {
      access_token: accessToken,
      user_obj: user_obj,
      connectWallet: ConnectWalletHandler,
      signer: web3signer,
      loginCheck: LoginCheckSession,
      logout: logout,
    };
    return (
      <AccountInfoContext.Provider value={context}>
        {props.children}
      </AccountInfoContext.Provider>
    );
  }
  
  export default AccountInfoContext;