import * as React from 'react';
import { Picker, Text, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppTitleText from '../app/AppTitleText';
import AppText from '../app/AppText';

const PermView = (props) => {
    const [selectedValue, setSelectedValue] = React.useState(0);
    const pr = props.property
    return (
        <View style={[appStyle.row, {marginTop:10}]}>
            <View style={appStyle.rowLeft}>
                <AppText>{pr.title}</AppText>
            </View>
            <View style={appStyle.rowRight}>
                <Picker    
                    selectedValue={selectedValue}
                    style={{ height: 30, width: 150 }}
                    onValueChange={(itemValue, itemIndex) =>{
                        setSelectedValue(itemValue)
                        props.updatePerm({...pr ,readOnly:itemValue })
                }}>
                    <Picker.Item label="Allow" value={2} />
                    <Picker.Item label="Read Only" value={1} />
                    <Picker.Item label="No Access" value={0} />
                </Picker> 
            </View>
        </View>
    )
}

export const PermissionList = props => {
    const  properties  =[]
    Object.keys(props.properties).forEach((key,index) => {
        properties.push(props.properties[key])
    })

    React.useEffect(() => {
        props.setPerm(properties)
    }, [ ])
  

    const updatePerm = (newValue) =>{
        props.setPerm([...properties, newValue])
    }

    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0, marginTop:-15}}>What permissions would you like to Share for</AppHeaderText>
            <AppTitleText> {props.selecteddevice.title}</AppTitleText>

            {properties.map((props,index)=> 
            <PermView key={index}property={props} updatePerm={updatePerm} />)}
            
        </View>
    )
}


