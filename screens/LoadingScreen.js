import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

export default class LoadingScreen extends React.Component 
{
    // Checks if component is mounted(implemented due to warnings during emulation)
    _isMounted = false;

    componentDidMount()
    {
        // Stops async calls from changing state when the component is hidden
        this._isMounted = true;
        if(this._isMounted)
        {
            auth().onAuthStateChanged(user => 
            {
                // Swaps between the home and login/register screens dependent on auth status
                this.props.navigation.navigate(user ? "App" : "Auth");
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
        // Shows a loading animation
        return(
          <View style={styles.container}>
              <Text>Loading...</Text>
              <ActivityIndicator size="large"/>
          </View>  
        );
    }
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center'
   } 
});