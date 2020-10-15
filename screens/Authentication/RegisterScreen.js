import React from 'react';
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Auth } from 'aws-amplify';
import authStyle from '../../styles/AuthStyle';

export default class RegisterScreen extends React.Component 
{
    state = 
    {
        name: 'Bob',
        username: 'primary@example.com',
        password: '#Cop4935',
        userId: null,
        errorMessage: null,
        message: null,
        signedUp: false,
        authCode: ''
    }

    handleSignUp = async () => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        const {username, password, name} = this.state;
        if(this.state.name === '')
            this.setState({errorMessage: 'Missing name'});
        else if(this.state.username === '')
            this.setState({errorMessage: 'Missing email address'});
        else if(this.state.password === '')
            this.setState({errorMessage: 'Missing password'});
        else
        {

            console.log(username, password, name);
            const response = await Auth.signUp({username,
                password,
                attributes: {
                    name,
                    email: username,
                    phone_number: "+4070000000",
                    address: "1234 Address Way"
                }
            })
            .then((response) => {
                this.setState({error: null, userId: response.userSub, signedUp:true, message:'A verification code was sent to your email! '});
                this.setState({errorMessage: ''});
                console.log('sign up successful!');
                console.log(response.userSub);
            })
            .catch(error => {
                this.setState({errorMessage: error.message});
                console.log('Error', error.message);
            });
        }
    }

    // Verify sign up code
    confirmSignUp = async() => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        const { username, authCode } = this.state
        // Form validation
        if(authCode == '')
        {
            this.setState({message: 'Please enter the code sent to your email'});
            this.setState({errorMessage: ''});
        }
        else
        {
            const user = await Auth.confirmSignUp(username, authCode)
            .then(user => {
                console.log('confirmed sign up successful!');
                this.setState({name: user.name, isAuth: true});
            })
            .catch((err) => {
                this.setState({errorMessage: err.message});
                this.setState({message: ''});
            });
        }
    }

    render()
    {
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
        // The message element will be set if there is actually an error
        let messageElement = null;
        if(this.state.message)
        {
            messageElement = (
            <View style={authStyle.message}>
                {this.state.message && <Text style={authStyle.message}>{this.state.message}</Text>}
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
                <Text style={authStyle.greeting}>{`Sign up to`} <Text style={authStyle.appName}> { 'Misu' } </Text></Text>

                {/* Render the register form */}
                <View style={authStyle.authForm}>
                    <View>
                        <TextInput 
                            style={authStyle.authFormInput} 
                            autoCapitalize="none" 
                            onChangeText={name => this.setState({name})} 
                            value={this.state.name}
                            placeholder="Name">
                        </TextInput>
                    </View>

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

                {/* Render the error message */}
                { errorElement }

                {/* Render the message */}
                { messageElement }

                {/* Render the submit button */}
                <View style={authStyle.authFormButtonHolder}>
                    <TouchableOpacity style={authStyle.authFormButton} onPress={this.handleSignUp}>
                        <Text style={{color: '#FFF', fontWeight: '500'}}>Sign up</Text>
                    </TouchableOpacity>
                </View>

                {/* Render the register toggle */}
                <View>
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate("Login")}>
                        <Text style={{color: '#414959', fontSize: 13}}Password> 
                            Already have an account? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Render the confirmation code form */}
                <View style={authStyle.authForm}>

                    <TextInput 
                            style={authStyle.authFormInput} 
                            autoCapitalize="none" 
                            onChangeText={authCode => this.setState({authCode})} 
                            value={this.state.authCode}
                            placeholder="Confirm Code">
                    </TextInput>
                </View>

                {/* Render the confirm button */}
                <View style={authStyle.authFormButtonHolder}>
                    <TouchableOpacity style={authStyle.authFormButton} onPress={this.confirmSignUp}>
                        <Text style={{color: '#FFF', fontWeight: '500'}}>Confirm Code</Text>
                    </TouchableOpacity>
                </View>
          </View>  
        );
    }
}
