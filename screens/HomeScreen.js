import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

export default class HomeScreen extends React.Component 
{
    _isMounted = false;

    state = 
    {
        email: '',
        uid: '',
        gateway: '',
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
        QuerySnapshot.forEach((doc) => 
        {
            // Check if there is a user document for this user
            if(doc.get("uid") === this.state.uid)
            {
                // console.log("This entry is: " + doc.get("uid"));
                userData.push(doc.get('name') + '\n' + doc.get('hub_url') + "\n\n");
                gateway = doc.get('hub_url');
                user = doc.get('hub_email');
                pass = doc.get('hub_password');
            }
        });

        // If there is no user's document associated with this account, create
        if(userData.length === 0)
        {
            firestore()
            .collection('Users')
            .add({
                uid: this.state.uid,
                name: this.state.email,
                hub_url: 'https://cop4934.mozilla-iot.org/',
                hub_email: 'test@cop4934test.com',
                hub_password:'1234'

            })
            .then(() => {
                console.log('User added!');
            });

        }
        this.setState({database: userData, gateway, user, pass}, () => {});
    }

    // Adds the shared users to the UI
    getSharedData = (QuerySnapshot)  =>
    {
        // console.log('Got Users collection result.');
        // console.log(QuerySnapshot.docs.map(doc => doc.data()));
        const data = [];
        const shared_with_me = [];
        QuerySnapshot.forEach((doc) => 
        {   
            if(doc.get("sharer_id") === this.state.uid)
            {
                data.push(doc.get('name'));
            }
            if(doc.get("sharee_id") === this.state.uid)
            {
                shared_with_me.push(doc.get("sharer_name") + "'s Gateway" + "\n\n");
            }
        });
        
        this.setState({shared_database: data, shared_with_me});
    }
      
    onError = (error) =>
    {
        console.error(error);
    }

    componentDidMount()
    {
        this._isMounted = true;
        // console.log(uid);
        if(this._isMounted)
        {
            const { email, uid } = auth().currentUser;
            this.setState( { email, uid }, () => { 
                firestore()
                .collection('Users')
                .onSnapshot(this.getUserInfo, this.onError);
            });

            firestore()
            .collection('Shared_Accounts')
            .onSnapshot(this.getSharedData, this.onError);
        }
    }

    componentWillUnmount()
    {
        this._isMounted = false;
    }
   
    signOutUser = () =>
    {
        auth().signOut();
    }

    createSharedAccount = () =>
    {
        var sharee_id = null;
        var pass = uuidv4();
        firestore()
        .collection('Users').where("hub_email", "==", "test@account.com")
        .get()
        .then((QuerySnapshot)  => {
            QuerySnapshot.forEach((doc) => {
                sharee_id = doc.get("uid");

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
            
            // Create a user with this login
            // Login to the hub from the host account
            const gateway = this.state.gateway;
            var jwt = '';
            fetch(gateway+"/login", {
            method: 'POST',
            headers: 
            {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.user,
                password: this.state.pass
            }),
            })
            .then(response => response.json())
            .then(data => {
                // Create the new account on the gateway for the shared account
                fetch(gateway+"/users/", {
                method: 'POST',
                headers: 
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + data.jwt
                },
                    body: JSON.stringify({
                    email: 'test@account.com',
                    name: 'Mr. Roger',
                    password: pass
                }),
                })
                .then(response => response.json())
                .catch((error) => {
                console.error('Error:', error);
                });
            })
            .catch((error) => {
            console.error('Error:', error);
            });

            }, this.onError);


        });
    }

    deleteSharedAccount = () => 
    {
        // Remove from the database
        firestore()
        .collection('Shared_Accounts').where("hub_email", "==", "test@account.com").get()
        .then((QuerySnapshot) => {
            QuerySnapshot.forEach(function(doc) {
                doc.ref.delete();
              });
        });

        // Delete user with email test@account.com from the gateway
        // Login to the hub from the host account
        const gateway = this.state.gateway;
        var jwt = '';
        fetch(gateway+"/login", {
        method: 'POST',
        headers: 
        {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.state.user,
            password: this.state.pass
        }),
        })
        .then(response => response.json())
        .then(data => {
            jwt = data.jwt;
            // Search for the account id to delete
            fetch(gateway+"/users/info", {
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
                // Returns the id of the account to delete
                const del = data.find( entry => entry.email === "test@account.com");
                // Delete the account from the gateway
                fetch(gateway+"/users/"+ del.id, {
                method: 'DELETE',
                headers:
                {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                },
                body: JSON.stringify({})
                })
                .then((res) => res.text())
	            .then((text) => text.length ? JSON.parse(text) : {})
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
        console.error('Error:', error);
        });


    }
    render()
    {
        return(
          <View style={styles.container}>

            <View style={styles.errorMessage}>
                {this.state.database && <Text style={{fontSize:20}}>Your Gateway</Text>} 
                {this.state.database && <Text style={styles.errorMessage}>{this.state.database}</Text>}
                {/* <Text>────────────────────────</Text> */}

                {this.state.database && <Text style={{fontSize:20}}>People you are sharing with</Text>} 
                
                <View style={{flexDirection: 'row'}}>
                    {this.state.shared_database && this.state.shared_database.length > 0 && 
                    <TouchableOpacity style={styles.button4} onPress={this.deleteSharedAccount}>
                        <Text style={{fontSize:20}}>X</Text>
                    </TouchableOpacity>}
                    <Text style={styles.errorMessage}>{this.state.shared_database}</Text>
                </View>
                {/* <Text>────────────────────────</Text> */}

                {this.state.database && <Text style={{fontSize:20}}>Gateway's shared with you</Text>} 
                {this.state.shared_with_me && <Text style={styles.errorMessage}>{this.state.shared_with_me}</Text>}
                {/* <Text>────────────────────────</Text> */}
            </View>

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

 