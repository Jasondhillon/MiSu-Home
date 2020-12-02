
import { Auth } from 'aws-amplify';
import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { currentSessionAction } from '../../redux/Action/currentSessionAction';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup'
import ForgotPasswordPopup from '../../components/popup/ForgotPasswordPopup';
import ForgotPasswordConfirmPopup from '../../components/popup/ForgotPasswordConfirmPopup';

class LoginScreen extends React.Component 
{
    state = 
    {   
        // TODO: Remove this: alt account secondary@example.com
        username: 'secondary@example.com',// 'secondary@example.com'
        password: '#Cop4935',
        errorMessage: null,
        message: null,
        isLoading: false,
        rememberMe: false,
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
            try {
               
                this.props.screenProps.setLoadingTrue()

                const user = await Auth.signIn(username, password)
                    .then(async user =>  {
                        console.log('Login successful!');
                        
                        this.setState({errorMessage: ''});
                        this.setState({message: 'Login successful!'});
                        this.setState({isLoading: false});
                        
                        await this.props.getSession()

                        this.props.screenProps.setLoadingFalse()
                        
                        this.props.navigation.navigate("App");
                    })
                    .catch((err) => {
                        this.setState({errorMessage: err.message});
                        this.setState({message: ''});
                        this.setState({isLoading: false});
                        this.props.screenProps.setLoadingFalse()
                    });
                
            } catch (error) {
                this.setState({errorMessage: error.message})
                this.setState({message: ''});
                this.setState({isLoading: false});
                this.props.screenProps.setLoadingFalse()
            }
            this.setState({isLoading: false});
        }
    }

    // Complete the forgot password auth
    forgotPassword = async(username) => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        this.setState({forgotPassword: false});

        // Form validation
        if(username == '')
        {
            this.setState({message: 'Please enter the email address of your account' });
            this.setState({errorMessage: ''});
        }
        else
        {
            console.log(username);
            console.log('-----------');
            this.setState({isLoading: true});
            const user = await Auth.forgotPassword(username)
            .then(async user =>  {
                console.log('forgot password request successful!');
                
                this.setState({errorMessage: ''});
                this.setState({message: 'Request successful, check your email for further instructions.'});
                this.setState({isLoading: false});
            })
            .catch((err) => {
                this.setState({errorMessage: err.message});
                this.setState({message: ''});
                this.setState({isLoading: false});
            });
            this.setState({isLoading: false});
        }
    }

    // Complete the forgot password auth
    forgotPasswordConfirm = async(username, code, password) => {
        this.setState({errorMessage: ''});
        this.setState({message: ''});
        this.setState({forgotPasswordConfirm: false});

        console.log('attempting to confirm password ' + username + ', ' + code + ', ' + password);
        // Form validation
        if(username == '')
        {
            this.setState({message: 'Please enter the email address of your account' });
            this.setState({errorMessage: ''});
        }
        else
        {
            this.setState({isLoading: true});
            const user = await Auth.forgotPasswordSubmit(username, code, password)
            .then(async user =>  {
                console.log('forgot password successful!');
                
                this.setState({errorMessage: ''});
                this.setState({message: 'Reset successful, login with your new credentials.'});
                this.setState({isLoading: false});
            })
            .catch((err) => {
                this.setState({errorMessage: err.message});
                this.setState({message: ''});
                this.setState({isLoading: false});
            });
            this.setState({isLoading: false});
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

        // The confirm code popup will appear if there is actually an error
        let forgotPasswordPopupElement = null;
        if(this.state.forgotPassword)
        {
            forgotPasswordPopupElement = (
            <ForgotPasswordPopup 
                onCancel = { () => this.setState({ forgotPassword : false })}
                onSubmit = { this.forgotPassword }
                username = { this.state.username }
            />)
        }

        // The confirm code popup will appear if there is actually an error
        let forgotPasswordConfirmPopupElement = null;
        if(this.state.forgotPasswordConfirm)
        {
            forgotPasswordConfirmPopupElement = (
            <ForgotPasswordConfirmPopup 
                onCancel = { () => this.setState({ forgotPasswordConfirm : false })}
                onSubmit = { this.forgotPasswordConfirm }
                username = { this.state.username }
            />)
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
                        source={require('../../assets/MISU.png')}
                    />
                </View>
                
                {/* Render the greeting */}
                <Text style={[authStyle.greeting]}>{`Login to`}<Text style={authStyle.appName}> {'MiSu'} </Text></Text>
                
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

                {/* Render the message */}
                { messageElement }

                {/* Render the forgot popup */}
                { forgotPasswordPopupElement }

                {/* Render the forgot confirm popup */}
                { forgotPasswordConfirmPopupElement }

                {/* Render the forgot password btn */}
                <View>
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => { this.setState( { forgotPassword : true }); }}>
                        <Text style={{color: '#414959', fontSize: 13}}Password> 
                            Forgot your password? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Get code</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Render the confirm forgot password confirm btn */}
                <View>
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 2}} onPress={() => { this.setState( { forgotPasswordConfirm : true }); }}>
                        <Text style={{color: '#414959', fontSize: 13}}Password> 
                            Have a forgot password confirm code? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Confirm</Text>
                        </Text>
                    </TouchableOpacity>
                </View>

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




const mapDispatchToProps = dispatch =>  {
    return  {
        getSession: () => dispatch(currentSessionAction()),
    } 
}



export default connect(undefined,mapDispatchToProps)(LoginScreen)