import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Amplify from '@aws-amplify/core';
import config from './aws-exports';
Amplify.configure(config);


//************************************************** */
// App Stack *************************************** */
//************************************************** */
// Main screen holding all the logic essentially
import HomeScreen from './screens/Application/HomeScreen';

const AppStack = createStackNavigator({
  Home: HomeScreen,
});

//************************************************** */
// Auth Stack ************************************** */
//************************************************** */
// Login/Register screens hold the code for logging in and registering for cognito accounts
import LoginScreen from './screens/Authentication/LoginScreen';
import RegisterScreen from './screens/Authentication/RegisterScreen';

const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    return CardStackStyleInterpolator.forVertical(sceneProps);
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
  },
  {
    transitionConfig: customAnimationFunc,
  })
});

//************************************************** */
// Loading Stack *********************************** */
//************************************************** */
// Routing container which swaps screens and adds them to the navigation stack(back button function properly on Android)
import LoadingScreen from './screens/LoadingScreen';

// Create App Navigator
export default createAppContainer(
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