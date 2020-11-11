import * as React from 'react';
import { Picker, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import AppTitleText from '../app/AppTitleText';

const PermView = (props) => {
   
    const pr = props.property
    return (
        <View style={[appStyle.row, {marginTop:5}]}>
            <View style={appStyle.rowLeft}>
                <AppText>{pr.title}</AppText>
            </View>
            <View style={[appStyle.rowRight, {marginRight:15}]}>
                <View style={[appStyle.row, {justifyContent:'flex-end'}]}>
                    <TouchableOpacity style={[(props.access == 1) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:50}]} onPress={() => {
                        if(props.access == 1)
                        {
                            props.updatePerm({...pr ,access:0 })
                        }
                        else
                        {
                            props.updatePerm({...pr ,access:1 })
                        }
                    }}/>
                    <TouchableOpacity style={[(props.access == 2) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:12}]} onPress={() => {
                        if(props.access == 2)
                        {
                            props.updatePerm({...pr ,access:0 })
                        }
                        else
                        {
                            props.updatePerm({...pr ,access:2 })
                        }
                    }}/>
                </View>
            </View>
            {/* <View style={appStyle.rowRight}>
                <Picker    
                    selectedValue={selectedValue}
                    style={{ height: 30, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedValue(itemValue)
                        props.updatePerm({...pr ,access:itemValue })
                    }}>
                    <Picker.Item label="Allow" value={2} />
                    <Picker.Item label="Read Only" value={1} />
                    <Picker.Item label="No Access" value={0} />
                </Picker> 
            </View> */}
        </View>
    )
}

export const PermissionOptions = props => {
    const updatePerm = (newValue) =>{
        //check and remove for previous values
        const found =  props.properties.findIndex( te => te.title == newValue.title )
         
          if(found == -1) {
            
            props.setPerm([...props.properties, newValue])
          }else {
            const current = props.properties
            current.splice(found,1,newValue)
            props.setPerm(current)

        }

       
    }
    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0, marginTop:-15}}>Set the access options for these permissions</AppHeaderText>
            
            <View style={[appStyle.row, {flex:1, marginTop:10, height:30, justifyContent: 'space-between'}]}>
                <TouchableOpacity style={appStyle.tab}>
                    <View><AppText>Temporary</AppText></View>
                </TouchableOpacity>

                <TouchableOpacity style={appStyle.tab}>
                    <View><AppText>Scheduled</AppText></View>
                </TouchableOpacity>

                <TouchableOpacity style={appStyle.tab}>
                    <View><AppText>Unlimited</AppText></View>
                </TouchableOpacity>
            </View>

        </View>
    )
}