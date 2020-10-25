import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import HubCardSharedUsersListEntry from './ListEntries/HubCardSharedUsersListEntry';





const HubCard = props => {
    return (
        <View style={[appStyle.card, { paddingBottom:0 }]}>
        <View style={[appStyle.container, {paddingBottom:-20}]}>

                    {/* Render the hub icon */}
                    <Image
                        style={style.hubIcon}
                        source={require('../../assets/icons/hub.png')}
                    />

                    {/* Render the hub name */}
                    <AppHeaderText style={style.name}> {props.name}'s  Home</AppHeaderText>


                    {/* Start the hub's sharing view */}
                    <View style={appStyle.row}>
                        {/* Render the hub sharing description */}
                        <AppText style={appStyle.rowLeft, { marginTop: 17.5 }}>Shared Users</AppText>

                        <View style={appStyle.rowRight}>
                            {/* Render the hub sharing details */}
                            <TouchableOpacity onPress={() => props.OpenModal()  }>
                                {/* Render the hub icon */}
                                <Image
                                    style={style.addUserIcon}
                                    source={require('../../assets/icons/add-user.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

            <View style={ [appStyle.lineSeperatorFull, {marginBottom:10} ]}/>
                   
                    {props.sharedAccounts?props.sharedAccounts.map( (sharedAccount,index)=> {
                        console.log({ sharedAccount})
                        return(
                           
                            <HubCardSharedUsersListEntry  
                            key={index}  
                            move={() => props.navigation.navigate('User', sharedAccount)}
                            name={sharedAccount.name}/>
                            
                           
                        )
                    }
                   ):null}
            </View>
            </View>
    )
}






const style = StyleSheet.create({
    name: {
        fontSize:24,
        height:30,
        marginBottom: 5
    },
    hubIcon: {
        marginTop:10,
        height:150,
        width: 150,
    },
    addUserIcon: {
        height:35,
        width: 35,
        marginTop:10
    },
    sharedUsersContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignSelf:'stretch',
        paddingLeft:10,
        marginBottom:7.5
    }
 });


export default HubCard