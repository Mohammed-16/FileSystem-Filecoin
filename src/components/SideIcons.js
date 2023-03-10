import React from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import { List, ListItem } from '@material-ui/core';
import { AccountBalanceWallet } from '@material-ui/icons';

function SideIcons (props) {
  const { deployer, account } = props;

  let history = useHistory();

  return (
    <div className='sideIcons'>
      <div className="sideIcons__top">
        <List>
          {/* <br />
          {
            deployer === account &&
            <ListItem button onClick={() => history.push("/admin")}>
              <AccountBalanceWallet fontSize="large" color="primary" />
            </ListItem>
          } */}
        </List>
      </div>
    </div>
  )
}

export default SideIcons;
