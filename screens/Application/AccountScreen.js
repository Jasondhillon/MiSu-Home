import { Auth } from 'aws-amplify';
import React from 'react';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import AppText from '../../components/app/AppText';
import AccountCard from '../../components/cards/AccountCard';
import { getHubInfoAction } from '../../redux/Action/getHubInfoAction';
import { registerHubAction } from '../../redux/Action/registerHubAction';
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


    UNSAFE_componentWillReceiveProps(props){
        if(props.registerData){
            this.props.getHub(this.props.sessionData.idToken) 
        }
    }
   
   
    render()
    {
        return(
            <View style={{flex:1}}>
                <View style={appStyle.container}>
                    <AccountCard 
                        register={this.props.register}
                        idToken={this.props.sessionData.idToken}
                        user={this.props.hubInfoData}
                        hub_url = {this.props.hubInfoData.hub_url}
                        hub_email = {this.props.hubInfoData.hub_email}
                        navigation= {this.props.navigation } />
                              
                              
  
                    <TouchableOpacity style={[{marginHorizontal:50, marginBottom: 10}, appStyle.redButton]} onPress={this.signOut}>
                        <AppText>Log out</AppText>
                    </TouchableOpacity> 

                </View>       
            </View>       
        );
    }
}

const mapStateToProps = (state) => {
    const { hubInfoData ,sessionData ,sharedAccountsData  ,registerData} = state
    return { hubInfoData  ,sessionData ,sharedAccountsData ,registerData}
  };

const mapDispatchToProps = dispatch =>  {
    return {
        register : (data,idToken) => dispatch(registerHubAction(data,idToken)),
        getHub : (idToken) => dispatch(getHubInfoAction(idToken)),
   }
}

export default  connect(mapStateToProps,mapDispatchToProps)(AccountScreen)