import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Auth } from 'aws-amplify';
export default class RegisterScreen extends React.Component 
{
    state = 
    {
        name: 'Jackson',
        username: 'jackson@example.com',
        password: '123456789',
        userId: null,
        errorMessage: null,
        message: null,
        signedUp: false
    }

    handleSignUp = async () => {
        const {username, password, name} = this.state;
        if(this.state.name === '')
            this.setState({errorMessage: 'Missing name'});
        else if(this.state.email === '')
            this.setState({errorMessage: 'Missing email address'});
        else if(this.state.password === '')
            this.setState({errorMessage: 'Missing password'});
        else
        {

            console.log(username, password, name);
            const response = await Auth.signUp({
                'username': username,
                'password': password,
                attributes: {
                'name': name,
                }
            })
            .then((response) => {
                this.setState({error: null, userId: response.userSub, signedUp:true, message:'A verification code was sent to your email! '});
                console.log('sign up successful!');
                console.log(response.userSub);
            })
            .catch(error => {
                this.setState({error: error.message, message: null});
                console.log('Error', error.message);
            });
        }
    }

    // Verify sign up code
    confirmSignUp = async() => {
        const { username, authCode } = this.state
        if(authCode !== '')
        {
            const user = await Auth.confirmSignUp(username, authCode)
            .then(user => {
            console.log('confirmed sign up successful!');
            this.setState({name: user.name, isAuth: true});
            })
            .catch((err) => {
            this.setState({error: err.message});
            });
            
        }
        // Form validation
        else
        {
            this.setState({message: 'Please enter the code sent to your email'});
        }
    }

    render()
    {
        return(
          <View style={styles.container}>
                <Text style={styles.greeting}>{`Welcome,\nSign up to get started.`}</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.message}>
                    {this.state.message && <Text style={styles.message}>{this.state.message}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputTitle}>Full Name</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            onChangeText={name => this.setState({name})} 
                            value={this.state.name}>
                        </TextInput>
                    </View>
                    
                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Email Address</Text>
                        <TextInput 
                            style={styles.input} 
                            autoCapitalize="none" 
                            onChangeText={username => this.setState({username})} 
                            value={this.state.username}>
                        </TextInput>
                    </View>

                    <View style={{marginTop: 32}}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <TextInput 
                            style={styles.input} 
                            secureTextEntry 
                            autoCapitalize="none" 
                            onChangeText={password => this.setState({password})} 
                            value={this.state.password}>
                        </TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={{color: '#FFF', fontWeight: '500'}}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={{color: '#414959', fontSize: 13}}Password> 
                        Already a user? <Text style={{color: '#E9446A', fontWeight: '500'}}>Login</Text>
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop:48}}></View>

                <View style={styles.form}>
                    <Text style={styles.inputTitle}>Confirm Code</Text>
                    <TextInput 
                        style={styles.input} 
                        autoCapitalize="none" 
                        onChangeText={authCode => this.setState({authCode})} 
                        value={this.state.authCode}>
                    </TextInput>

                    <TouchableOpacity style={styles.button1} onPress={this.confirmSignUp}>
                    <Text style={{color: '#FFF', fontWeight: '500'}}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
          </View>  
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    },
    message: {
        height: 32,
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    errorMessage: {
        height: 32,
        color: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    error: {
            color: '#E9446A',
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center'
    },
    form: {
        marginBottom: 32,
        marginHorizontal: 30
    },
    inputTitle: {
        color: '#8A8F9E',
        fontSize: 10,
        textTransform: 'uppercase'
    },
    input: {
            borderBottomColor: '#8A8F9E',
            borderBottomWidth: 1,
            height: 40,
            fontSize: 15,
            color: '#161F3D'
    },
    button: {
            marginHorizontal: 30,
            backgroundColor: '#E9446A',
            borderRadius: 4,
            height: 52,
            alignItems: 'center',
            justifyContent: 'center'
    },
    button1: {
        marginTop: 5,
        marginHorizontal: 30,
        backgroundColor: '#00BFA5',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button2: {
        marginTop: 30,
        marginHorizontal: 30,
        backgroundColor: '#0336FF',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
});