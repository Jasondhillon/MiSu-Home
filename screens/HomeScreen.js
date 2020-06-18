import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

export default class HomeScreen extends React.Component 
{
    // Checks if component is mounted(implemented due to warnings during emulation)
    _isMounted = false;

    // Holds information retrieved from firestore(DB) to display on UI
    state = 
    {
        // Email of the person logged in
        email: '',
        // Unique Identification 
        uid: '',
        // URL to the gateway
        gateway: '',
        // 
        database: null,
        shared_database: null,
        shared_with_me: null
    }

    // Adds the users to the UI
    getUserInfo = (QuerySnapshot)  =>
    {
        // console.log('Got Users collection result.');
        // console.log(QuerySnapshot.docs.map(doc => doc.data()));
        const userData = [];
        var gateway = '';
        var user = '';
        var pass = '';
        //Iterates through the documents found by the query
        QuerySnapshot.forEach((doc) => 
        {
            // Check if there is a user document for this user
            if (doc.get('uid') === this.state.uid)
            {
                // Display information about the logged in user's name and hub url
                userData.push(doc.get('name') + '\n' + doc.get('hub_url') + '\n\n');
                // Store the information about the user into the component state
                gateway = doc.get('hub_url');
                user = doc.get('hub_email');
                pass = doc.get('hub_password');
            }
        });

        // If there is not a User document associated with this firebase account, create one
        if(userData.length === 0)
        {
            firestore()
            .collection('Users')
            .add({
                uid: this.state.uid,
                name: this.state.email,
                // Currently hardcoded to my Pi, will change once there is a UI entry
                hub_url: 'https://cop4934.mozilla-iot.org/',
                hub_email: 'test@cop4934test.com',
                hub_password:'1234'

            })
            // Debug purposes
            .then(() => {
                console.log('User added!');
            });

        }
        // Change the state to save information about the user
        this.setState({database: userData, gateway, user, pass});
    }

    // Adds information about shared users to the UI/state
    getSharedData = (QuerySnapshot)  =>
    {
        const users_shared_to = [];
        const shared_with_me = [];
        //Iterates through the documents found by the query
        QuerySnapshot.forEach((doc) => 
        {   
            if(doc.get('sharer_id') === this.state.uid)
            {
                users_shared_to.push(doc.get('name'));
            }
            if(doc.get('sharee_id') === this.state.uid)
            {
                shared_with_me.push(doc.get('sharer_name') + '\'s Gateway' + '\n\n');
            }
        });
        // Change the state to save information about the shared users
        this.setState({shared_database: users_shared_to, shared_with_me});
    }
    
    // Error handler
    onError = (error) =>
    {
        console.error(error);
    }

    // Called when the component is mounted, refreshes information when screen is shown
    componentDidMount()
    {
        // Stops async calls from changing state when the component is hidden
        this._isMounted = true;
        if(this._isMounted)
        {
            // Gets information from firebase auth and loads DB information for the user
            const { email, uid } = auth().currentUser;
            // Waits till the state is set before loading user information from User Collection DB
            this.setState( { email, uid }, () => { 
                firestore()
                .collection('Users')
                .onSnapshot(this.getUserInfo, this.onError);
            });

            // Loads information from Shared_Accounts Collection DB
            firestore()
            .collection('Shared_Accounts')
            .onSnapshot(this.getSharedData, this.onError);
        }
    }

    // Stops async calls from changing state when the component is hidden
    componentWillUnmount()
    {
        this._isMounted = false;
    }
   
    // Signs the user out and changes screens to the auth stack
    signOutUser = () =>
    {
        auth().signOut();
    }

    // Creates entry into the Shared_Accounts Collection
    createSharedAccount = () =>
    {
        var sharee_id = null;
        // Generates a random password
        var pass = uuidv4();

        // Finds the user we are adding to the hub (searches by their login email, user must have logged in at least once to the app, which happens by default upon registration)
        firestore()
        // Hardcoded the account to add until UI is updated
        .collection('Users').where('hub_email', '==', 'test@account.com')
        .get()
        .then((QuerySnapshot)  => {
            // Finds the UID generated by the firebase account for the user we are sharing to
            QuerySnapshot.forEach((doc) => {
                sharee_id = doc.get('uid');
            // Handle error
            }, this.onError);

            //Only add the user if they exist
            if (sharee_id !== null)
            {
                firestore()
                .collection('Shared_Accounts')
                .add({
                    sharer_id: this.state.uid,
                    sharer_name: this.state.email,
                    sharee_id: sharee_id,
                    name: 'Mr. Roger',
                    hub_url: 'https://cop4934.mozilla-iot.org/',
                    hub_email: 'test@account.com',
                    hub_password: pass

                })
                .then(() => {
                    console.log('User added!');
                });
            }

            // TODO: Add an error message or something to show if the user does not exist, add when UI is updated
            
            // Create an account on the hub we are sharing (same email associated to the firebase auth account) for person we are sharing to
            // Login to the hub from the host account
            const gateway = this.state.gateway;
            fetch(gateway + '/login', {
                method: 'POST',
                headers: 
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.user,
                    password: this.state.pass
                })
            })
            .then(response => response.json())
            .then(data => {
                // Nested fetch to create the new account on the gateway for the shared account with newly acquired JWT(found in data)
                fetch(gateway + '/users/', {
                    method: 'POST',
                    headers: 
                    {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + data.jwt
                    },
                        // Hardcoded user information until UI gets updated
                        body: JSON.stringify({
                        email: 'test@account.com',
                        name: 'Mr. Roger',
                        password: pass
                    })
                })
                .then(response => response.json())
                // Error handling for the POST create user fetch
                .catch((error) => {
                console.error('Error:', error);
                });
            })
            // Error handling for the POST login fetch
            .catch((error) => {
            console.error('Error:', error);
            });
        });
    }

    // Allows the host user to remove access of users who are sharing their hub
    deleteSharedAccount = () => 
    {
        // Remove from the database
        firestore()
        .collection('Shared_Accounts').where('hub_email', '==', 'test@account.com').get()
        .then((QuerySnapshot) => {
            QuerySnapshot.forEach(function(doc) {
                doc.ref.delete();
              });
        });

        // Delete user with email test@account.com from the gateway
        // Login to the hub from the host account
        const gateway = this.state.gateway;
        // Save the JWT for nested fetch calls down the line
        var jwt = '';
        fetch(gateway+'/login', {
            method: 'POST',
            headers: 
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.user,
                password: this.state.pass
            })
        })
        .then(response => response.json())
        .then(data => {
            // Save the token
            jwt = data.jwt;
            // Search for the account id (on the hub) associated with the user email which we are deleting
            fetch(gateway + '/users/info', {
                method: 'GET',
                headers: 
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt
                }
            })
            .then(response => response.json())
            .then(data => {
                // Extract the id from the JSON response returned by the GET, hardcoded for now
                const del = data.find( entry => entry.email === 'test@account.com');
                // Delete the account from the gateway by using the id linked to the account
                fetch(gateway + '/users/'+ del.id, {
                    method: 'DELETE',
                    headers:
                    {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + jwt,
                    }
                })
                // Response by the DELETE fetch returns weird non-JSON text so these two line fix that
                .then((res) => res.text())
                .then((text) => text.length ? JSON.parse(text) : {})
                // Error handling for the delete fetch
                .catch((error) => {
                    console.error('Error:', error);
                });
            })
            // Error handling for the GET fetch which retrieves the account id's
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        // Error handling for the POST login fetch
        .catch((error) => {
        console.error('Error:', error);
        });
    }

    render()
    {
        return(
          <View style={styles.container}>
            
            {/* This view contains all the text information */}
            <View style={styles.errorMessage}>
                {this.state.database && <Text style={{fontSize:20}}>Your Gateway</Text>} 
                <Text>─────────────</Text>
                {this.state.database && <Text style={styles.errorMessage}>{this.state.database}</Text>}
                

                {this.state.database && <Text style={{fontSize:20}}>People you are sharing with</Text>}
                <Text>────────────────────────</Text>
                
                <View style={{flexDirection: 'row'}}>
                    {this.state.shared_database && this.state.shared_database.length > 0 && 
                    <TouchableOpacity style={styles.button4} onPress={this.deleteSharedAccount}>
                        <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity>}
                    <Text style={styles.errorMessage}>{this.state.shared_database}</Text>
                </View>
                

                {this.state.database && <Text style={{fontSize:20}}>Gateway's shared with you</Text>} 
                <Text>───────────────────────</Text>
                {this.state.shared_with_me && <Text style={styles.errorMessage}>{this.state.shared_with_me}</Text>}
            </View>
            
            {/* Code below is for the two buttons */}
            {/* Hardcoded to remove the share button with Mr. Roger as that doesn't make sense */}
            {this.state.uid !== 'Y30JO2CDGQXgkCi4hrJMjzxsREd2' && <TouchableOpacity style={styles.button2} onPress={this.createSharedAccount}>
                <Text style={{color: '#FFF', fontWeight: '500'}}>Share Gateway with Mr.Rogers!</Text>
            </TouchableOpacity>}

            <TouchableOpacity style={styles.button} onPress={this.signOutUser}>
                <Text style={{color: '#FFF', fontWeight: '500'}}>Log Out</Text>
            </TouchableOpacity>
          </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: .8,
        justifyContent: 'center',
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: '#E9446A',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button2: {
        marginHorizontal: 30,
        backgroundColor: '#1E88E5',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        marginBottom: 30,
    },
    button3: {
        marginHorizontal: 30,
        backgroundColor: '#00897B',
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button4: {
        marginHorizontal: 10,
        backgroundColor: '#E9446A',
        borderRadius: 4,
        paddingHorizontal: 15,
        justifyContent: 'center'
    },
    errorMessage: {
        textAlign:"center",
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30
    },
    error: {
        color: '#E9446A',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    }
});

 