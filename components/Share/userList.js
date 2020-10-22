import * as React from 'react';
import { Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export const UserList = (props) => {
    return (
        <View>
            <Text style={{ fontSize:25 , fontWeight:'700'}}>Who would you Like to Share With ?</Text>
            <TextInput  placeholder={'Search'} style={{
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 15,
                padding:5,
                marginBottom:10
            }}
            placeholderTextColor={'black'}/>
            
            {props.sharedAccounts?props.sharedAccounts.map((Account,index) =>{
               
                return(
                <TouchableOpacity key={index} onPress={()=> props.setUser(Account)}>
                    <View style={props.selecteduser?props.selecteduser.name== Account.name? { backgroundColor: 'blue' ,padding: 20}:{padding: 20 }:{padding: 20 }}>
                        <Text style={props.selecteduser?props.selecteduser.name== Account.name?{ color: 'white'}: { color: 'black'}:{ color:'red'}}>{Account.name}</Text>
                    </View>
                </TouchableOpacity>)
            }):null}
            
        
        </View>
    )
}