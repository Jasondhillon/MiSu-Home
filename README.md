# SmartShare

I recommend to install 
> https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight 

if using VS studio which highlights TODO comments left behind for others

> Majority of the code is found under the screens folder, login/register/home

## Setup Android Nonsense (This is all for Windows btw)
https://reactnative.dev/docs/environment-setup
1. Install Android Studio

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidStudioWelcomeWindows.png "Android Splash")

2. Configure->SDK Manager->Show Package Details
3. Select Android SDK Platform 28 and Android SDK Platform 28
4. Under SDK Platforms->Show Package Details-> Android SDK Build-Tools 28.0.3
5. Configure the ANDROID_HOME environment variable

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidEnvironmentVariableANDROID_HOME.png "Android HOME")

6. On Android Studio, navigate to the upper right for an icon like so

![alt text](https://reactnative.dev/docs/assets/GettingStartedAndroidStudioAVD.png "Android SVD")

7. Create a new AVD, any phone(I chose pixel 3) and select Pie/API Level 28, hit next until finish

## Run the code
> In the root directory, "yarn install"

> To run the code,  "npm run android"
