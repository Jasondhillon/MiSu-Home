import * as React from 'react';
import { TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import AppTitleText from '../app/AppTitleText';

export const UserList = (props) => {
    return (
        <View style={[(appStyle.container)]}>
            <AppHeaderText style={{textAlign:'center', marginBottom:15, marginHorizontal:10, marginTop:-15}}>Who would you like to share with?</AppHeaderText>

            <TextInput  
            placeholder={'Search'} 
            style={appStyle.textInput}
            onChangeText={ text => props.setUser({guest_email: text})}
            placeholderTextColor={'black'}/>
            
            <View style={appStyle.row}>
                <View style={appStyle.rowLeft}>
                    <AppTitleText style={{marginTop:10}}>Currently sharing with...</AppTitleText>
                </View>
            </View>
            <View style={[(appStyle.container), {marginTop:-10, marginHorizontal:-20}]}>
                 { props.sharedAccounts?props.sharedAccounts.map((Account,index) =>{
                    return(
                    <TouchableOpacity key={index} onPress={()=> props.setUser(Account)}>
                        <View style={appStyle.row}>
                            <View style={appStyle.rowLeft}>
                                <View style={props.selecteduser && props.selecteduser.guest_email == Account.guest_email? appStyle.userListEntrySelected:appStyle.userListEntry}>
                                    <AppText style={props.selecteduser && props.selecteduser.guest_email == Account.guest_email?{ color: 'white'}: { color: 'black'}}>{Account.name}</AppText>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>)
                }):null}
                
            </View>
        </View>
    )
}