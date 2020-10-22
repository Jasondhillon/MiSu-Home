import { ToastAndroid } from "react-native";
  // This creates little popups on the screen for Android phones
export const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.LONG);
};

