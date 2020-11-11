import Amplify from '@aws-amplify/core';
import React, { Component } from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// ************************************************ */
// Redux ****************************************** */
// ************************************************ */
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import config from './aws-exports';
import appDataReducer from './redux/AppDataReducer';
import AccountScreen from './screens/Application/AccountScreen';
import DeviceScreen from './screens/Application/DeviceScreen';
import LogScreen from './screens/Application/LogScreen';
import UserScreen from './screens/Application/UserScreen';
//************************************************** */
// Auth Stack ************************************** */
//************************************************** */
// Login/Register screens hold the code that mess with the firebase auth(login)
import LoginScreen from './screens/Authentication/LoginScreen';
import RegisterScreen from './screens/Authentication/RegisterScreen';
//************************************************** */
// App Stack *************************************** */
//************************************************** */
// Main screen holding all the logic essentially
import HomeScreen from './screens/index';
//************************************************** */
// Loading Stack *********************************** */
//************************************************** */
// Routing container which swaps screens and adds them to the navigation stack(back button function properly on Android)
import LoadingScreen from './screens/LoadingScreen';

Amplify.configure(config);

const store = createStore(appDataReducer,applyMiddleware(thunk));


const AppStack = createStackNavigator({
  Home: HomeScreen,
  Account: AccountScreen,
  Device: DeviceScreen,
  User: UserScreen,
  Log: LogScreen
},
{
  mode: 'card',
  navigationOptions: params => ({
    gesturesEnabled: true,
    gesturesDirection: 'inverted',
    headerMode: 'float'
  },
  {
    transitionConfig: customAnimationFunc,
  })
});


const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forHorizontal(sceneProps);
  },
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
},
{
  mode: 'card',
  navigationOptions: params => ({
    gesturesEnabled: true,
    gesturesDirection: 'inverted',
    headerMode: 'float'
  },
  {
    transitionConfig: customAnimationFunc,
  })
});


// Create App Navigator
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      Auth: AuthStack,
      App: AppStack
    },
    {
      // Starts the app off on the loading screen?
      initialRouteName: "Loading"
    }
  )
);

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }


  setLoadingTrue() {
    this.setState({ loading: true})
  }


  setLoadingFalse() {
    this.setState({ loading: false})
  }


  render () {
    return (
      <Provider store={store}>
        <View style={{ flex:1}}>
        <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={ {
            color: '#FFF'
          }}
         />
        <AppContainer

screenProps={{
  setLoadingFalse:this.setLoadingFalse.bind(this),
  setLoadingTrue:this.setLoadingTrue.bind(this)
}}

        
        />
        </View>
      </Provider>
    )
  }
}