import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

export default class HomeScreen extends React.Component 
{
    state = 
    {
        email: '',
        displayName: '',
        database: null
    }

    onResult = (QuerySnapshot)  =>
    {
        console.log(QuerySnapshot.docs.map(doc => doc.data()));
        const data = [];
        QuerySnapshot.forEach((doc) => 
        {
            data.push('Name: ' + doc.get('name') + '\n' + doc.get('age') + "\n\n");
        });
        
        this.setState({database: data});
    }
      
    onError = (error) =>
    {
        console.error(error);
    }

    componentDidMount()
    {
        const {email, displayName} = auth().currentUser;
        this.setState({email, displayName});

        this.readDatabase();
    }

    signOutUser = () =>
    {
        auth().signOut();
    }

    testDatabase = () =>
    {
        firestore()
        .collection('Test')
        .add({
            name: this.state.email,
            age: uuidv4(),
        })
        .then(() => {
            console.log('Document added!');
        });

    }


    readDatabase = () =>
    {
        firestore()
        .collection('Test')
        .onSnapshot(this.onResult, this.onError);
    }

    render()
    {
        return(
          <View style={styles.container}>

            <View style={styles.errorMessage}>
                    {this.state.database && <Text style={{fontSize:15}}>Test Database</Text>} 
                    {this.state.database && <Text style={styles.errorMessage}>{this.state.database}</Text>}
            </View>

            <Text style={{alignSelf: 'center'}}>Hello {this.state.email}</Text>

            <TouchableOpacity style={styles.button2} onPress={this.testDatabase}>
                <Text style={{color: '#FFF', fontWeight: '500'}}>Create Database Document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={this.signOutUser}>
                <Text style={{color: '#FFF', fontWeight: '500'}}>Log Out</Text>
            </TouchableOpacity>
          </View> 
        );
    }
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        justifyContent: 'center',
   },
   button: {
        marginTop: 30,
        marginHorizontal: 30,
        backgroundColor: '#E9446A',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button2: {
        marginHorizontal: 30,
        backgroundColor: '#0336FF',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorMessage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center'
    }
});