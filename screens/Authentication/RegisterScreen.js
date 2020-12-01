import React from 'react';
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView} from 'react-native';
import { Auth } from 'aws-amplify';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup'
export default class RegisterScreen extends React.Component 
{
    state = 
    {
        name: '',
        username: '',
        password: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        userId: null,
        errorMessage: null,
        message: null,
        signedUp: false,
        authCode: '',
        confirmingCode: false,
        isLoading : false
    }

    handleSignUp = async () => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        this.setState({isLoading: true});
        const {username, password, name, phone, street, city, state} = this.state;
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
                    'email': username,
                    'phone_number': '+' + phone,
                    'address': street,
                    'custom:city': city,
                    'custom:state': state
                }
            })
            .then((response) => {
                this.setState({error: null, userId: response.userSub, signedUp:true, message:'A confirmation code was sent to your email! '});
                this.setState({errorMessage: ''});
                this.setState( { confirmingCode : true });  // According to Mamtaj's feedback, open confirm code popup to save user time. 
                console.log('sign up successful!');
                console.log(response.userSub);
            })
            .catch(error => {
                this.setState({errorMessage: error.message});
                console.log('Error', error.message);
            });
        }
        this.setState({isLoading: false});
    }

    // Verify sign up code
    confirmSignUp = async(username, authCode) => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        this.setState({confirmingCode: false});

        // Form validation
        if(username == '')
        {
            this.setState({message: 'Please enter the email you\'re verifying' });
            this.setState({errorMessage: ''});
        }
        else if(authCode == '')
        {
            this.setState({message: 'Please enter the code sent to your email'});
            this.setState({errorMessage: ''});
        }
        else
        {
            this.setState({isLoading: true});
            const user = await Auth.confirmSignUp(username, authCode)
            .then(async user =>  {
                console.log('confirmed sign up successful!');
                
                this.setState({errorMessage: ''});
                this.setState({message: 'Confirm successful, please sign in.'});
                this.setState({isLoading: false});
            })
            .catch((err) => {
                this.setState({errorMessage: err.message});
                this.setState({message: ''});
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

        // The confirm code popup will appear if there is actually an error
        let confirmPopupElement = null;
        if(this.state.confirmingCode)
        {
            confirmPopupElement = (
            <ConfirmCodePopup 
                onCancel = { () => this.setState({ confirmingCode : false })}
                onSubmit = { this.confirmSignUp }
                username = { this.state.username }
            />)
        }

        return(
            <KeyboardAvoidingView enabled={true} behavior='height' style={authStyle.container}>
                <ScrollView style={authStyle.container} bounces={false}>

                    {/* Render the loading element */}
                    { loadingElement }

                    {/* Render the Confirm Popup */}
                    { confirmPopupElement }

                    {/* Render the app icon */}
                    <View style={authStyle.iconHolder}>
                        <Image
                            style={authStyle.icon}
                            source={require('../../assets/MISU.png')}
                        />
                    </View>
                
                    {/* Render the greeting */}
                    <Text style={authStyle.greeting}>{`Sign up to`}<Text style={authStyle.appName}> { 'MiSu' } </Text></Text>

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
                                keyboardType="email-address"
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

                        <View>
                            <TextInput 
                                style={authStyle.authFormInput} 
                                autoCapitalize="none"
                                keyboardType='phone-pad'
                                onChangeText={phone => this.setState({phone})} 
                                value={this.state.phone}
                                placeholder="Phone">
                            </TextInput>
                        </View>

                        <View>
                            <TextInput 
                                style={authStyle.authFormInput} 
                                autoCapitalize="words" 
                                onChangeText={street=> this.setState({street})} 
                                value={this.state.street}
                                placeholder="Street Address">
                            </TextInput>
                        </View>

                        <View style={{flex: 1, flexDirection: "row", justifyContent: "space-evenly"}}>
                            <View style={{flex: 1, paddingRight: 5}}>
                                <TextInput 
                                    style={authStyle.authFormInput} 
                                    autoCapitalize="words" 
                                    onChangeText={city => this.setState({city})} 
                                    value={this.state.city}
                                    placeholder="City">
                                </TextInput>
                            </View>

                            <View style={{flex: 1, paddingLeft: 5}}>
                                <TextInput 
                                    style={authStyle.authFormInput} 
                                    autoCapitalize="words"
                                    onChangeText={state => this.setState({state})} 
                                    value={this.state.state}
                                    placeholder="State">
                                </TextInput>
                            </View>
                        </View>

                    </View>

                    {/* Render the submit button */}
                    <View style={authStyle.authFormButtonHolder}>
                        <TouchableOpacity style={authStyle.authFormButton} onPress={this.handleSignUp}>
                            <Text style={{color: '#FFF', fontWeight: '500'}}>Sign up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Render the error message */}
                    { errorElement }

                    {/* Render the message */}
                    { messageElement }

                    {/* Render the confirm code toggle */}
                    <View>
                        <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => { this.setState( { confirmingCode : true }); }}>
                            <Text style={{color: '#414959', fontSize: 13}}Password> 
                                Have a confirmation code? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Confirm</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Render the register toggle */}
                    <View>
                        <TouchableOpacity style={{alignSelf: 'center', marginTop: 6}} onPress={() => this.props.navigation.navigate("Login")}>
                            <Text style={{color: '#414959', fontSize: 13}}Password> 
                                Already have an account? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>  
            </KeyboardAvoidingView>
        );
    }
}