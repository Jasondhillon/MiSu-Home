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
        </View>
    )
}

export const PermissionList = props => {

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

    const selectedAllAccess = props.properties.every(x => x != null && x.access === 2);

    const selectedAllReadOnly = props.properties.every(x => x != null && x.access === 1);

    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0, marginTop:-15}}>What permissions would you like to share...</AppHeaderText>
            
            <View style={[appStyle.row, {marginTop:10}]}>
                <View style={appStyle.rowLeft}>
                    <AppTitleText style={{marginLeft:-25, marginTop:25}}> {props.selecteddevice.title}</AppTitleText>
                </View>
                <View style={[appStyle.rowRight, {marginLeft:45}]}>
                    <View style={[appStyle.row, {justifyContent:'flex-end'}]}>
                        <View style={[appStyle.column, {marginLeft:-40, marginRight:5}]}>
                            {/* Select All Read-Only options */}
                            <TouchableOpacity style={[(selectedAllReadOnly) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginLeft:10, width:25, height:25}]} onPress={() => {
                                    if(selectedAllReadOnly)
                                    {
                                        const tempProps = props.properties;
                                        tempProps.forEach(function(x, index) {
                                            tempProps[index].access = 0
                                          }, tempProps); 
                                        props.setPerm(tempProps);
                                    }
                                    else
                                    {
                                        const tempProps = props.properties;
                                        tempProps.forEach(function(x, index) {
                                            tempProps[index].access = 1
                                          }, tempProps); 
                                        props.setPerm(tempProps);
                                    }
                                }}/>
                            <AppText style={{marginRight:15}}>View</AppText>
                        </View>
                        <View style={[appStyle.column, {marginRight:-2.5}]}>
                            {/* Select All Allow options */}
                            <TouchableOpacity style={[(selectedAllAccess) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginLeft:25, width:25, height:25}]} onPress={() => {
                                if(selectedAllAccess)
                                {
                                    const tempProps = props.properties;
                                    tempProps.forEach(function(x, index) {
                                        tempProps[index].access = 0
                                      }, tempProps); 
                                    props.setPerm(tempProps);
                                }
                                else
                                {
                                    const tempProps = props.properties;
                                    tempProps.forEach(function(x, index) {
                                        tempProps[index].access = 2
                                      }, tempProps); 
                                    props.setPerm(tempProps);
                                }
                                }}/>
                            <AppText style={{marginLeft:5}}>Control</AppText>
                        </View>
                    </View>
                </View>
            </View>

            
            
            <ScrollView style={{flex:1, width:350, marginTop:2}}>
                
                {props.properties.map((props,index)=>
                    <PermView key={index}property={props} updatePerm={updatePerm} access={props.access} initialValue={props.access}/>)}
            </ScrollView>
        </View>
    )
}