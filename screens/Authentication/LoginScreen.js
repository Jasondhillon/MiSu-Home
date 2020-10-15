import React from 'react';
import {View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Auth } from 'aws-amplify';
import authStyle from '../../styles/AuthStyle';
import appStyle from '../../styles/AppStyle';

export default class LoginScreen extends React.Component 
{
    state = 
    {   
        // TODO: Remove this: alt account secondary@example.com
        username: 'primary@example.com',
        password: '#Cop4935',
        errorMessage: null,
        isLoading: false
    }

    handleLogin = async () =>
    {
        this.setState({errorMessage: ''});
        const {username, password} = this.state;

        if(username === '')
            this.setState({errorMessage: 'Missing email address'});
        else if(password === '')
            this.setState({errorMessage: 'Missing password'});
        else
        {
            this.setState({isLoading: true});
            await Auth.signIn(username, password)
            .then(() => {
                this.props.navigation.navigate("App");
            })
            .catch((error) => {
                this.setState({errorMessage: error.message})
                this.setState({isLoading: false});
            });
        }
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

        // The error element will be set if there is actually an error
        let errorElement = null;
        if(this.state.errorMessage)
        {
            errorElement = (
            <View style={authStyle.errorMessage}>
                {this.state.errorMessage && <Text style={authStyle.errorMessage}>{this.state.errorMessage}</Text>}
            </View>
            )
        }

        return(
            <View style={authStyle.container}>
                {/* Render the app icon */}
                <View style={authStyle.iconHolder}>
                    <Image
                        style={authStyle.icon}
                        source={require('../../assets/icons/logo.png')}
                    />
                </View>
                
                {/* Render the greeting */}
                <Text style={authStyle.greeting}>{`Login to`} <Text style={authStyle.appName}> { 'Misu' } </Text></Text>
                
                {/* Render the login form */}
                <View style={authStyle.authForm}>
                    <View>
                        <TextInput 
                            style={authStyle.authFormInput} 
                            autoCapitalize="none" 
                            onChangeText={username => this.setState({username})} 
                            value={this.state.username}
                            placeholder="Email">
                        </TextInput>
                    </View>

                    <View>
                        <TextInput 
                            style={authStyle.authFormInput} 
                            secureTextEntry 
                            autoCapitalize="none" 
                            onChangeText={password => this.setState({password})} 
                            value={this.state.password}
                            placeholder="Password">
                        </TextInput>
                    </View>
                </View>
                
                {/* Render the submit button */}
                <View style={authStyle.authFormButtonHolder}>
                    <TouchableOpacity style={authStyle.authFormButton} onPress={this.handleLogin}>
                        <Text style={{color: '#FFF', fontWeight: '500'}}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* Render the error message */}
                { errorElement }

                {/* Render the register toggle */}
                <View>
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate("Register")}>
                        <Text style={{color: '#414959', fontSize: 13}}Password> 
                            Need an account? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Sign Up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
                
                {/* Render the loading element */}
                { loadingElement }

            </View>  
        );
    }
}
