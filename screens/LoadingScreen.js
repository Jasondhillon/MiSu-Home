import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { Auth } from 'aws-amplify';
export default class LoadingScreen extends React.Component 
{
    async componentDidMount()
    {

        try 
        {
            const user = await Auth.currentAuthenticatedUser()
            this.props.navigation.navigate("App", {user: user});
        } 
        catch (err) 
        {
            this.props.navigation.navigate("Auth");
        }
    }

    render()
    {
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