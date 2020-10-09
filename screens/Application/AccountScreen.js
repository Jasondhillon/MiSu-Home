import React from 'react';
import {View, Text, ToastAndroid, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator} from 'react-native';
import appStyle from '../../styles/AppStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AccountCard from '../../components/cards/AccountCard/AccountCard'; 
import { Auth } from 'aws-amplify';

export default class AccountScreen extends React.Component 
{
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

    // Checks if component is mounted(implemented due to warnings during emulation)
    _isMounted = false;

    // Holds information retrieved from firestore(DB) to display on UI
    state = 
    {
        // Email of the person logged in
        email: '',
        // Unique Identification 
        uid: '',
        // URL to the gateway
        gateway: '',
        // 
        database: null,
        shared_database: null,
        shared_with_me: null,

        refreshing:false,

        id:null,
        idToken:null,
        accessToken:null,
        email:null,
        name:null,

        loaded:false
    }
    
    // Error handler
    onError = (error) =>
    {
        console.error(error);
    }

    // Called when the component is mounted, refreshes information when screen is shown
    componentDidMount()
    {
        // Stops async calls from changing state when the component is hidden
        this._isMounted = true;
        if(this._isMounted)
        {
            Auth.currentSession().
            then(data1 => {
            this.setState({
                id: data1.getIdToken().payload.sub,
                idToken: data1.getIdToken().getJwtToken(),
                accessToken: data1.getAccessToken().getJwtToken(),
                email: data1.getIdToken().payload.email,
                name: data1.getIdToken().payload.name
            });
            })
            .then(() => {
            this.getHubInfo();
            });
        }
    }

    // Stops async calls from changing state when the component is hidden
    componentWillUnmount()
    {
        this._isMounted = false;
    }
   
    render()
    {
        // The loading element will restrict input during networked operations
        let loadingElement = null;
        if(this.state.isLoading)
        {
            loadingElement = (
                <View style={[appStyle.loadingHolderNoColor]}>
                    <ActivityIndicator size="large" style = {[appStyle.loadingElement]} />
                </View>
            )
        }

        return(
            <ScrollView style={{flex:1}}
                refreshControl={
                <RefreshControl refreshing={this.state.refreshing}  onRefresh={this.onRefresh}/>
            }>

                <View style={appStyle.container}>
                    { this.state.loaded &&
                        <View style={appStyle.cardContainer}>
                            <ScrollView style={appStyle.scrollView}>
                                <AccountCard 
                                    name={this.state.name}
                                    hub_url = {this.state.hub_url}
                                    hub_email = {this.state.hub_email}
                                    setHubInfo = {this.setHubInfo} 
                                    navigation= {this.props.navigation } />
                            </ScrollView>
                        </View>
                    }

                    {/* Render the loading element */}
                    { this.state.loaded == false && 
                        loadingElement 
                    }
                    
                </View> 
            </ScrollView>
        );
    }

    onRefresh = async () => {
        await this.getHubInfo();
        this.setState({refreshing:false});
    }

    // Gets user's hub information from User's table through ID in idToken
    getHubInfo = async () => {
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getUserInfo', {
          method: 'GET',
          headers: 
          {
              Authorization: 'Bearer ' + this.state.idToken
          }
        })
        .then(response => response.json())
        .then(data => {
          // This is just a way to check if the user has a hub listed at all, if not there's no hub linked to this account and therefore no hub information exists to display
          if(data.hub_url !== undefined && data.hub_url !== null && data.hub_url !== "")
          {
            this.setState({hub_url: data.hub_url, hub_email: data.hub_email, error: null});
          }
         // console.log('got hub info: ' + JSON.stringify(data));
        })
        .catch((error) => {
          console.error('getHubInfo error: %j', error);
          this.showToast(error);
          this.setState({error});
        });

        this.setState({loaded:true});
    }

    // Sets/updates the user's hub info, probably won't be used in production but useful for debugging, adds the hardcoded hub information to the user
    setHubInfo = async (hub_url, hub_email, hub_password) => {
        hub_url += '.mozilla-iot.org'
        //console.log("Sending set hub info for " + hub_url + ', ' + hub_email + ', ' + hub_password);
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/updatehubinfo', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
            },
            body: JSON.stringify({
                hub_url: hub_url,
                hub_email: hub_email,
                hub_password: hub_password
            })
        })
        .then(response => response.json())
        .then(data => {
            this.setState({error: null});
            this.showToast("Info successfully updated!");
            this.getHubInfo();
        })
        .catch((error) => {
            console.error('setHubInfo error: %j', error);
            this.showToast(error);
            this.setState({error});
        });
    }

    // This creates little popups on the screen for Android phones
    showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.LONG);
    };

}