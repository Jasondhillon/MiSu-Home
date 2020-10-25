import { combineReducers } from 'redux';
import { currentSessionReducer } from './Reducer/currentSessionReducer';
import { exitHubReducer } from './Reducer/exitHubReducer';
import { getHubInfoReducer } from './Reducer/getHubInfoReducer';
import { getSharedAccountsReducer } from './Reducer/getSharedAccountsReducer';
import { getSharedDevicesReducer } from './Reducer/getSharedDevicesReducer';
import { listDevicesReducer } from './Reducer/listDevicesReducer';
import { registerHubReducer } from './Reducer/registerHubReducer';
import { updateInvitationReducer } from './Reducer/updateInvitationReducer';

export default combineReducers({

  exitHubData:exitHubReducer,
  devicesData:listDevicesReducer,
  hubInfoData: getHubInfoReducer,
  sessionData: currentSessionReducer,
  sharedDevicesData:  getSharedDevicesReducer,
  sharedAccountsData:  getSharedAccountsReducer,
  updateInvite:  updateInvitationReducer,
  registerData:registerHubReducer

});