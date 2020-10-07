import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
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

        isLoading:false,

        id:null,
        idToken:null,
        accessToken:null,
        email:null,
        name:null
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
                <View style={[appStyle.loadingHolder]}>
                    <ActivityIndicator size="large" style = {[appStyle.loadingElement]} />
                </View>
            )
        }

        return(
            <View style={appStyle.container}>

                {/* Render the loading element */}
                { loadingElement }

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
            </View> 
        );
    }

    // Gets user's hub information from User's table through ID in idToken
    getHubInfo = async () => {
        this.setState({ isLoading: true});
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
            this.setState({hub_url: data.hub_url, hub_email: data.email, error: null});
          }
        })
        .catch((error) => {
          console.error('getHubInfo error: %j', error);
          this.showToast(error);
          this.setState({error});
        });
        this.setState({ isLoading: false});
    }

    // Sets/updates the user's hub info, probably won't be used in production but useful for debugging, adds the hardcoded hub information to the user
    setHubInfo = async (hub_url, hub_email, hub_password) => {
        this.setState({ isLoading: true});
        await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/updatehubinfo', {
            method: 'POST',
            headers: 
            {
                Authorization: 'Bearer ' + this.state.idToken,
                hub_url: hub_url,
                hub_email: hub_email,
                hub_password: hub_password
            }
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
        this.setState({ isLoading: false});
    }

    // This creates little popups on the screen for Android phones
    showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.LONG);
    };

}