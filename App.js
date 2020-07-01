
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AWSAppSyncClient from 'aws-appsync'
import { ApolloProvider } from 'react-apollo'
import { Rehydrated } from 'aws-appsync-react'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import RegisterScreen from './screens/RegisterScreen'

import Amplify from '@aws-amplify/core';
import config from './aws-exports';
Amplify.configure(config);

// const client = new AWSAppSyncClient({
//   url: config.aws_appsync_graphqlEndpoint,
//   region: config.aws_appsync_region,
//   auth: {
//     type: config.aws_appsync_authenticationType,
//     jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
//   }
// })

// const test = () => {
//   <ApolloProvider client={client}>
//     <Rehydrated>
//       <HomeScreen/>
//     </Rehydrated>
//   </ApolloProvider>
// }

const AppStack = createStackNavigator({
  Home: HomeScreen
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);

// class App extends React.Component {

//   state = {
//     username: 'yeet@yolo.com',
//     password: '123456789',
//     name: null,
//     phone_number: '0000000000',
//     email: null,
//     authCode: '',
//     user: null,
//     error: null,
//     message: null,
//     isAuth: false
//   }

//   signUp = async () => {
//     const response = await Auth.signUp({
//       'username': 'jasondhillon419@icloud.com',
//       'password': '123456789',
//       attributes: {
//         'name': 'Jason',
//       }
//     })
//     .then((response) => {
//       this.setState({error: null, email:'yeet@yolo.com', username: response.userSub ,message:'A verification code was sent to your email! '});
//       console.log('sign up successful!');
//       console.log(response.userSub);
//     })
//     .catch(error => {
//       this.setState({error: error.message, message: null});
//       console.log('Error', error.message);
//     });
//   }

//   // Verify sign up code
//   confirmSignUp = async() => {
//     const { username, authCode } = this.state
//     if(authCode !== '')
//     {
//       const user = await Auth.confirmSignUp(username, authCode)
//       .then(user => {
//         console.log('confirmed sign up successful!');
//         this.setState({name: user.name, isAuth: true});
//       })
//       .catch((err) => {
//         this.setState({error: err.message});
//       });
      
//     }
//     // Form validation
//     else
//     {
//       this.setState({message: 'Please enter the code sent to your email'});
//     }
//   }

//   // Sign into cognito
//   signIn = async() => {
//     await Auth.signIn('yeet@yolo.com', '123456789')
//     .then(() => {
//       Auth.currentSession().
//       then(data => {
//         console.log(data.getIdToken());
//         this.setState({
//           error: null,
//           user: data.getIdToken(), 
//           name: data.getIdToken().payload.name,
//           email: data.getIdToken().payload.email,
//           isAuth: true
//         });
//         console.log('sign in successful!' + '\n');
//       })
//       .catch((error) => {
//         this.setState({error: error.message})
//         console.log('Error', error.message);
//       })
//     });
//   }

//   render() 
//   {
//     return (
//       <View style={styles.container}>
//         {this.state.error && <Text style={{color: 'red', alignSelf: 'center'}}>{this.state.error}</Text>}
//         {this.state.message && <Text style={{color:'black', alignSelf: 'center'}}>{this.state.message}</Text>}
//         {this.state.name && <Text style={{alignSelf: 'center'}}>Hello {this.state.name}!</Text>}

//         <View style={styles.form}>
//           <TouchableOpacity style={styles.button1} onPress={this.signUp}>
//             <Text style={{color: '#FFF', fontWeight: '500'}}>Sign Up</Text>
//           </TouchableOpacity>

//           <Text style={styles.input}></Text>

//           <TouchableOpacity style={styles.button2} onPress={this.signIn}>
//             <Text style={{color: '#FFF', fontWeight: '500'}}>Sign In</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.form}>
//           <Text style={styles.inputTitle}>Auth Code</Text>
//           <TextInput 
//             style={styles.input} 
//             onChangeText={authCode => this.setState({authCode})}>
//           </TextInput>

//           <TouchableOpacity style={styles.button} onPress={this.confirmSignUp}>
//               <Text style={{color: '#FFF', fontWeight: '500'}}>Confirm Code</Text>
//           </TouchableOpacity>
//         </View>
//       </View> 
//     );
//   }
// }

// export default (App);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   button: {
//     marginTop: 30,
//     marginHorizontal: 30,
//     backgroundColor: '#E9446A',
//     borderRadius: 4,
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   button1: {
//     marginTop: 30,
//     marginHorizontal: 30,
//     backgroundColor: '#00BFA5',
//     borderRadius: 4,
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   button2: {
//     marginTop: 30,
//     marginHorizontal: 30,
//     backgroundColor: '#0336FF',
//     borderRadius: 4,
//     height: 52,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   errorMessage: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 30
//   },
//   error: {
//     color: '#E9446A',
//     fontSize: 13,
//     fontWeight: '600',
//     textAlign: 'center'
//   },
//   input: {
//     borderBottomColor: '#8A8F9E',
//     borderBottomWidth: 1,
//     height: 40,
//     fontSize: 15,
//     color: '#161F3D'
//   },
//   inputTitle: {
//     marginTop: 10,
//     color: '#8A8F9E',
//     fontSize: 10,
//     textTransform: 'uppercase'
//   },
//   form: {
//     marginBottom: 48,
//     marginHorizontal: 30
//   }
// });