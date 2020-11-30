
import { Auth } from 'aws-amplify';
import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { currentSessionAction } from '../../redux/Action/currentSessionAction';
import appStyle from '../../styles/AppStyle';
import authStyle from '../../styles/AuthStyle';
import ConfirmCodePopup from '../../components/popup/ConfirmCodePopup'
import ForgotPasswordPopup from '../../components/popup/ForgotPasswordPopup';

class LoginScreen extends React.Component 
{
    state = 
    {   
        // TODO: Remove this: alt account secondary@example.com
        username: 'primary@example.com',// 'secondary@example.com'
        password: '#Cop4935',
        errorMessage: null,
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

                await Auth.signIn(username, password)
                await this.props.getSession()

                this.props.screenProps.setLoadingFalse()
                
                this.props.navigation.navigate("App");
                
            } catch (error) {
                this.setState({errorMessage: error.message})
                this.setState({isLoading: false});
            }
          
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
            this.setState({isLoading: true});
            // const user = await Auth.confirmSignUp(username, authCode)
            // .then(async user =>  {
            //     console.log('confirmed sign up successful!');
                
            //     this.setState({errorMessage: ''});
            //     this.setState({message: 'Confirm successful, please sign in.'});
            //     this.setState({isLoading: false});
            // })
            // .catch((err) => {
            //     this.setState({errorMessage: err.message});
            //     this.setState({message: ''});
            //     this.setState({isLoading: false});
            // });
            await new Promise(resolve => setTimeout(resolve, 800));
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
                
                {/* Render the remember me toggle */}
                { /*<View style={{ flexDirection:'row', height:45, marginTop:-15, marginRight:30 }}>
                    <View style={{ flex:1, alignItems:'flex-end' }}></View>
                    <AppText style={{fontSize:14, marginTop:5}}>Remember Me</AppText>
                    <Switch
                        trackColor={{ false: "#767577", true: "#71ccf1" }}
                        thumbColor={this.state.rememberMe ? "#f2f2f2" : "#f2f2f2"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={ () => this.setState({rememberMe:!this.state.rememberMe}) }
                        value={this.state.rememberMe}
                        style={{marginTop:-15}}
                    />
                </View> */}

                {/* Render the submit button */}
                <View style={authStyle.authFormButtonHolder}>
                    <TouchableOpacity style={authStyle.authFormButton} onPress={this.handleLogin}>
                        <Text style={{color: '#FFF', fontWeight: '500'}}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                {/* Render the error message */}
                { errorElement }

                {/* Render the forgot popup */}
                { forgotPasswordPopupElement }

                {/* Render the confirm code toggle */}
                <View>
                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => { this.setState( { forgotPassword : true }); }}>
                        <Text style={{color: '#414959', fontSize: 13}}Password> 
                            Forgot your password? <Text style={{color: '#71ccf0', fontWeight: '500'}}>Reset</Text>
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