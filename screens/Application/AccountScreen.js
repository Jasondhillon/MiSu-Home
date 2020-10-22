import { Auth } from 'aws-amplify';
import React from 'react';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AppText from '../../components/app/AppText';
import AccountCard from '../../components/cards/AccountCard';
import { unregisterHubAction } from '../../redux/Action/unregisterHubAction';
import appStyle from '../../styles/AppStyle';

class AccountScreen extends React.Component {
    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: 'Account',
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => ( <View></View>)
    });
    
    // Signs the user out and sends them back to the login screen
    signOut = async () => {
        ToastAndroid.show("Signing out!", ToastAndroid.LONG);
        Auth.signOut()
        .then(this.props.navigation.navigate("Auth"));
    }

   
   
    render()
    {
        return(
            <View style={{flex:1}}>
                <View style={appStyle.container}>
                    <AccountCard 
                        register={this.props.unregister}
                        idToken={this.props.sessionData.idToken}
                        name={this.props.hubInfoData.name}
                        hub_url = {this.props.hubInfoData.hub_url}
                        hub_email = {this.props.hubInfoData.hub_email}
                        navigation= {this.props.navigation } />
                              
                              
  
                    <TouchableOpacity style={[{marginHorizontal:50, marginBottom: 10}, appStyle.regularButton]} onPress={this.signOut}>
                        <AppText>Log out</AppText>
                    </TouchableOpacity> 

                </View>       
            </View>       
        );
    }
}




const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData } = state
    return { hubInfoData  ,sessionData ,sharedAccountsData}
  };

const mapDispatchToProps = dispatch =>  {
    return {
        unregister : (data,idToken) => dispatch(unregisterHubAction(data,idToken))
   }
}

export default  connect(mapStateToProps,mapDispatchToProps)(AccountScreen)