import { combineReducers } from 'redux';
import { currentSessionReducer } from './Reducer/currentSessionReducer';
import { getHubInfoReducer } from './Reducer/getHubInfoReducer';
import { getSharedAccountsReducer } from './Reducer/getSharedAccountsReducer';
import { getSharedDevicesReducer } from './Reducer/getSharedDevicesReducer';
import { listDevicesReducer } from './Reducer/listDevicesReducer';
import { updateInvitationReducer } from './Reducer/updateInvitationReducer';
/*
const INITIAL_STATE = {
  id: null,
  idToken: null,
  accessToken: null,
  email: null,
  name: null,
  sharedAccounts: null,
  sharedDevices: null,
  hub_url: null,
  hub_email: null,
  devices: null,
  initialized: false
};

const appDataReducer = (state = INITIAL_STATE, action) => {
  const tempState = state;
  switch (action.type) {

   
    default:
      return state
  }
};*/

export default combineReducers({
 // appData: appDataReducer,
  devicesData:listDevicesReducer,
  hubInfoData: getHubInfoReducer,
  sessionData: currentSessionReducer,
  sharedDevicesData:  getSharedDevicesReducer,
  sharedAccountsData:  getSharedAccountsReducer,
  updateInvite:  updateInvitationReducer

});