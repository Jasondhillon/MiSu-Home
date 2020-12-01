import { StyleSheet } from 'react-native';

const authStyle = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 16,
        fontSize: 24,
        textAlign: 'center',
        fontWeight:'100'
    },
    appName: {
        fontSize: 28,
        textAlign: 'center',
        fontWeight:'bold'
    },
    icon: {
        height: 225,
        width: 225,
        marginBottom:-45,
        marginTop:-55
    },
    iconHolder: {
        marginTop: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorMessage: {
        color: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop:5,
        marginBottom:-5
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    },
    message: {
        color: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
        marginTop:5,
        marginBottom:-5
    },
    authForm: {
        marginBottom: 24,
        marginHorizontal: 30
    },
    authFormInput: {
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        borderColor: '#8A8F9E',
        borderWidth: 1,
        height: 40,
        fontSize: 15,
        paddingLeft: 15,
        marginTop: 10
    },
    authFormButtonHolder: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
    },
    authFormButton: {
        marginHorizontal: 30,
        marginTop:-10,
        backgroundColor: '#71ccf0',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4
    }
 });

 export default authStyle;