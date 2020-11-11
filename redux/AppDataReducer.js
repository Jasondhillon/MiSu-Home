import { combineReducers } from 'redux';
import { currentSessionReducer } from './Reducer/currentSessionReducer';
import { exitHubReducer } from './Reducer/exitHubReducer';
import { getHubInfoReducer } from './Reducer/getHubInfoReducer';
import { getSharedAccountsReducer } from './Reducer/getSharedAccountsReducer';
import { getSharedDevicesReducer } from './Reducer/getSharedDevicesReducer';
import { listDevicesReducer } from './Reducer/listDevicesReducer';
import { modifyAccessReducer } from './Reducer/modifyAcessStateReducer';
import { registerHubReducer } from './Reducer/registerHubReducer';
import { shareReducer } from './Reducer/shareReducer';
import { stopSharingReducer } from './Reducer/stopSharingReducer';
import { updateInvitationReducer } from './Reducer/updateInvitationReducer';

export default combineReducers({
  StopShareState: stopSharingReducer,
  AccessState: modifyAccessReducer,
  shareState: shareReducer,
  exitHubData:exitHubReducer,
  devicesData:listDevicesReducer,
  hubInfoData: getHubInfoReducer,
  sessionData: currentSessionReducer,
  sharedDevicesData:  getSharedDevicesReducer,
  sharedAccountsData:  getSharedAccountsReducer,
  updateInviteState:  updateInvitationReducer,
  registerData:registerHubReducer

});