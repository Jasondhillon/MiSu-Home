import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import appStyle from '../../../styles/AppStyle';

const formatEntryText = (log) => {

    if (log.operation !== undefined)
    {
        if (log.operation === "Create")
            return `${log.primary_user} shared access with you`
        else if (log.operation === 'Delete')
            return `${log.primary_user} revoked your access`
        else if (log.operation === 'Ended sharing early')
            return `You ended sharing early`
        else if (log.operation === 'Accept')
            return `You accepted access`
        else
            return log.operation
    }
    return `${log.secondary_user} set the ${log.property_name} property of ${log.device_name} to ${log.value == true ? 'On' : (log.value == false ? 'Off' : log.value)}`
}

const  LogEntry = (props) =>  {
  
    var log = props.log;

    return (
        <View style={[appStyle.container, {paddingTop: 0, flex: 1, alignItems: 'stretch'} ]}>
            <View style={{alignItems: 'stretch', flex: 1}}>
                <Text style={{marginLeft: 5, fontSize: 12, textAlign: 'left', alignSelf:'stretch', flex: 1}}>{log.date} - {log.time}</Text>
                {/*
                <Text >&rarr;User: {log.secondary_user}</Text>
                <Text >&rarr;Device: {log.device_name} ({log.device_description})</Text>
                <Text >&rarr;Property: {log.property_name}</Text>
                <Text >&rarr;Value: {log.value ? "On" : "Off"}</Text>
                <View style={appStyle.lineSeperator}></View>
                */}
                <Text style={{marginLeft: 5, fontSize: 16, textAlign: 'left', alignSelf: 'stretch', flex: 1}}>{formatEntryText(log)}</Text>
            </View>
            <View style={ [appStyle.lineSeperatorFull, {marginTop:10, alignSelf: 'stretch'} ]}/>
        </View> 

    );
}

export default LogEntry