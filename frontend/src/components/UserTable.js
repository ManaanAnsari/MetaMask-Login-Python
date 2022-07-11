import React from 'react'
import AccountInfoContext from "./ctx/account-context";
import { useEffect, useState, useContext } from "react";
import {Button, Table} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";



function UserTable(props) {
    const renderTooltip = props => (
        <Tooltip {...props}>Logout</Tooltip>
    );
    const AccountCTX = useContext(AccountInfoContext);

    useEffect(() => {AccountCTX.loginCheck();}, []);

  return AccountCTX.user_obj? (
    <>
    User Logged in! 
    <Table striped bordered hover>
    <tbody>
    
        {Object.keys(AccountCTX.user_obj).map(key => 
            <tr>
                <td>{key}</td>
                <td>{AccountCTX.user_obj[key]}</td>
            </tr>
        )}
       
    </tbody>
    </Table>
    <OverlayTrigger placement="top" overlay={renderTooltip}>
        <Button onClick={AccountCTX.logout} className="btn-main" >Logout</Button>
    </OverlayTrigger>
    </>
  ):""
}



export default UserTable