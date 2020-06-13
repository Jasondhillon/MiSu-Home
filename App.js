import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

// Main screen holding all the logic essentially
const AppStack = createStackNavigator({
  SmartShare: HomeScreen
});

// Login/Register screens hold the code that mess with the firebase auth(login)
const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
});

// Routing container which swaps screens and adds them to the navigation stack(back button function properly on Android)
export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      // Starts the app off on the loading screen?
      initialRouteName: "Loading"
    }
  )
);