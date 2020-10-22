import * as React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
export const DeviceList = (props) => {
   
    return (
        <View>
            <Text style={{ fontSize:25 , fontWeight:'700'}}>What device would you like to Share ?</Text>
            {
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
                })
            }
        </View>
    )
}