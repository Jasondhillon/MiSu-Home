// Redux imports
import { connect } from 'react-redux';
import { exitHubAction } from '../redux/Action/exitHubAction';
import { getHubInfoAction } from '../redux/Action/getHubInfoAction';
import { getSharedAccountsAction } from '../redux/Action/getSharedAccountsAction';
import { getSharedDevicesAction } from '../redux/Action/getSharedDevicesAction';
import { listDevicesAction } from '../redux/Action/listDevicesAction';
import { updateInvitationAction } from '../redux/Action/updateInvitationAction';
import HomeScreen from './Application/HomeScreen';


const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData ,sharedDevicesData , exitHubData ,shareState, updateInviteState } = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,sharedDevicesData ,exitHubData ,shareState, updateInviteState}
  };
  

  const mapDispatchToProps = dispatch =>  {
        return {
        exitHub: (id, idToken) => dispatch(exitHubAction(id, idToken)), 
        getHub : (idToken) => dispatch(getHubInfoAction(idToken)),
        getDevices: (idToken) => dispatch(listDevicesAction(idToken)),
        getAccounts: (idToken) => dispatch(getSharedAccountsAction(idToken)),
        getSharedDevices: (idToken) => dispatch(getSharedDevicesAction(idToken)),
        updateInvite : (account, value ,idToken) => dispatch(updateInvitationAction(account, value ,idToken))
      }
  }
 
  
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
