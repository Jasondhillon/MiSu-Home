import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import LogEntry from './ListEntries/LogEntry';

const LogCard = props => {
    return (
        <View style={[appStyle.card, { paddingBottom:0 , flex: 1, marginHorizontal:5}]}>
            <View style={[appStyle.container, {paddingBottom: 0, flex: 1}]}>
                <View style={appStyle.rowLeft}>
                    <Image style={{width:30, height:30, marginRight:20}} source={require('../../assets/log.png')} />
                    <AppHeaderText style={{fontSize:20, marginTop:2, marginLeft:-5}}>{props.type} Logs</AppHeaderText>
                </View> 
                <View style={ [appStyle.lineSeperatorFull, {marginTop:10, marginBottom:10, flex:1} ]}/>
                               
                {props.logs ? props.logs.map( (entry,index)=> {
                        return(
                                <LogEntry log={entry} key={index}/>
                        )
                    }
                ):null}
            </View>
        </View>
    )
}

export default LogCard