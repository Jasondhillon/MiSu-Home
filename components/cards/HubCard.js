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
                {/*<View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    {/* Render the hub icon }
                    <Image
                        style={[style.hubIcon, {alignSelf: 'flex-start'}]}
                        source={require('../../assets/icons/hub.png')}
                    />

                    {/* Render the hub name }
                    <AppHeaderText style={style.name}> {props.name}'s  Home</AppHeaderText>
                </View>*/}
                <View style={appStyle.rowLeft}>
                    <Image style={{width:30, height:30, marginRight:20}} source={require('../../assets/home.png')} />
                    <AppHeaderText>Your Home</AppHeaderText>    
                </View>


                {/* Start the hub's sharing view */}
                <View style={appStyle.row}>
                    {/* Render the hub sharing description */}
                    <AppText style={appStyle.rowLeft, { marginTop: 17.5 }}>Shared Users</AppText>

                    <View style={appStyle.rowRight}>
                        {/* Render the hub sharing details */}
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => props.OpenModal()  }>
                                {/* Render the hub icon */}
                                <Image
                                    style={style.addUserIcon}
                                    source={require('../../assets/icons/add-user.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={ [appStyle.lineSeperatorFull, {marginBottom:10} ]}/>
                    {props.sharedAccounts.length <= 0 && 
                        <View style={appStyle.row}><AppText style={{marginBottom:10, marginTop:-2}}>{props.loading ? 'Loading...' : 'No users...'}</AppText></View>
                    }
                    {props.sharedAccounts?props.sharedAccounts.map( (sharedAccount,index)=> {
                        return(
                            <HubCardSharedUsersListEntry  
                                key={index}  
                                move={() => props.navigation.navigate('User', {sharedAccount: {sharedAccount}})}
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
        height:50,
        width: 50,
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