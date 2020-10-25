import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import appStyle from '../../styles/AppStyle';

export const DeviceList = (props) => {
    console.log({p:props.selecteduser})
    console.log({
       dec: props.devices
    })
   
    return (
        <View style={appStyle.container}>
            <Text style={{ fontSize:25 , fontWeight:'700'}}>What device would you like to Share with {props.selecteduser}?</Text>
            { props.devices && Array.isArray(props.devices)?
                props.devices.map( (device ,index) =>{
                    return(
                        <TouchableOpacity 
                            key={index}
                                onPress={()=> props.selectDevice(device)}>
                            <View style={props.selecteddevice?props.selecteddevice.title== device.title? { backgroundColor: 'blue' ,padding: 20}:{padding: 20 }:{padding: 20 }}>
                                <Text style={
                                    props.selecteddevice?props.selecteddevice.title== device.title? { color: 'white'}: { color: 'black'}:{ color:'red'}}>{device.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }):null
            }
        </View>
    )
}