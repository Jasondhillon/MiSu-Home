import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import appStyle from '../../styles/AppStyle';
import LogEntry from './ListEntries/LogEntry';

const LogCard = props => {
    return (
        <View style={[appStyle.card, { paddingBottom:0 }]}>
            <View style={[appStyle.container, {paddingBottom:-20}]}>                    
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