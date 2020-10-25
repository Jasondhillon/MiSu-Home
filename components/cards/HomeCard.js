import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
//import HubCardSharedUsersListEntry from './ListEntries/HubCardSharedUsersListEntry';
import HomeCardDeviceEntry from './ListEntries/HomeCardDeviceEntry';

class HomeCard extends React.Component {
    constructor(props){
        super(props)
    }
    
    render()
    {
        // split devices into two columns to be used for rendering
       // const col1 = [],col2 = [];

        if(this.props.sharedDevice != null && this.props.sharedDevice.devices != null)
        {
            this.props.sharedDevice.devices.forEach((element, index) => {
                if(index % 2 == 0)
                    col1.push(element);
                else
                    col2.push(element);
            });
        };

        return (
            <View style={[appStyle.card, { paddingBottom:0 }]}>
                <View style={[appStyle.container]}>
                    <View style={[appStyle.row, {marginLeft:10, marginTop:-10, marginBottom:5}]}>
                        <View style={appStyle.rowLeft}>
                            <AppHeaderText>{`${this.props.sharedDevice.sharer_name}'s House`}</AppHeaderText>    
                        </View>
                    </View>
                    
                    <View style={[appStyle.lineSeperatorAlt, {marginHorizontal:-9}]}/>

                        {!this.props.sharedDevice.isShared?(
                             <View style={[appStyle.row, {marginLeft:-5}]}>
                             {/* Left Column */ }
                             <View style={appStyle.columnLeft}>
                                 {col1.map((device,index) => {
                                     return  (
                                         <HomeCardDeviceEntry  key={index} device={device}/>
                                 )})}
                             </View>
     
                             {/* Right Column */ }
                             <View style={appStyle.columnRight}>
                                 {col2.map((device,index) => {
                                     return  (
                                         <HomeCardDeviceEntry  key={index} device={device}/>
                                 )})}
                             </View>
                         </View>
                        ): null}
                   
                    
                    <View style={{paddingTop:10, paddingHorizontal:5, paddingBottom:5}}>
                        <AppText>You've been given access to devices in this home.</AppText>
                    </View>

                    <View style={appStyle.row}>
                        <View style={{flex:1, marginRight:5}}>
                            <TouchableOpacity style={appStyle.greenButton} onPress={()=> this.props.updateInvite(this.props.sharedDevice.login_credentials_id,1,props.IdToken)}>
                                    <Text style={{ color: 'white' ,textAlign:"center"}}> Accept</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginLeft:5, flex:1 }}>
                            <TouchableOpacity style={appStyle.redButton} onPress={()=> this.props.updateInvite(this.props.sharedDevice.login_credentials_id,0,props.IdToken)}>
                                    <Text style={{ color: 'white',textAlign:"center"}}> Decline</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


export default HomeCard