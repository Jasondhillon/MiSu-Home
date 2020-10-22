// Redux imports
import { connect } from 'react-redux';
import { getHubInfoAction } from '../redux/Action/getHubInfoAction';
import { getSharedAccountsAction } from '../redux/Action/getSharedAccountsAction';
import { getSharedDevicesAction } from '../redux/Action/getSharedDevicesAction';
import { listDevicesAction } from '../redux/Action/listDevicesAction';
import { updateInvitationAction } from '../redux/Action/updateInvitationAction';
import HomeScreen from './Application/HomeScreen';


const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData ,sharedDevicesData  } = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,sharedDevicesData}
  };
  

  const mapDispatchToProps = dispatch =>  {
        return {
        getHub : (idToken) => dispatch(getHubInfoAction(idToken)),
        getDevices: (idToken) => dispatch(listDevicesAction(idToken)),
        getAccounts: (idToken) => dispatch(getSharedAccountsAction(idToken)),
        getSharedDevices: (idToken) => dispatch(getSharedDevicesAction(idToken)),
        updateInvite : (account, value ,idToken) => dispatch(updateInvitationAction(account, value ,idToken))
      }
  }
 
  
  
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
