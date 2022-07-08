import React from 'react'
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import UserTable from './UserTable';



function Home(props) {
    const renderTooltip = props => (
        <Tooltip {...props}>Tooltip for the register button</Tooltip>
      );

  const AccountCTX = useContext(AccountInfoContext);

  useEffect(() => {AccountCTX.loginCheck();}, []);

  return AccountCTX.access_token? <UserTable /> :(
    <OverlayTrigger placement="top" overlay={renderTooltip}>
        <Button onClick={AccountCTX.connectWallet} className="btn-main" variant="outline-warning" >Login With MetaMask</Button>
    </OverlayTrigger>
  )
}



export default Home