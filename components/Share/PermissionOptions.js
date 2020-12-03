import * as React from 'react';
import {useState} from 'react';
import { Picker, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import appStyle from '../../styles/AppStyle';
import AppHeaderText from '../app/AppHeaderText';
import AppText from '../app/AppText';
import AppTitleText from '../app/AppTitleText';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';

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
    var options = props.options;
    
    // Used by data picker
    const [mode, setMode] = useState('date');
    const [showTempDate, setShowTempDate] = useState(false);
    const [showScheduledEndDate, setShowScheduledEndDate] = useState(false);
    const [showScheduledStartDate, setShowScheduledStartDate] = useState(false);

    const onTempDataChange = (event, selectedDate) => {
        const currentDate = selectedDate || options.tempDate;
        setShowTempDate(Platform.OS === 'ios');
        options.tempDate = currentDate;
        if(mode == 'date')
            setMode('time');
        if(mode == 'time')
            setMode('date');
    };
    
    const onScheduledEndDateChanged = (event, selectedDate) => {
        const currentDate = selectedDate || options.scheduledEndDate;
        setShowScheduledEndDate(Platform.OS === 'ios');
        options.scheduledEndDate = currentDate;
        if(mode == 'date')
            setMode('time');
        if(mode == 'time')
            setMode('date');
    };
    
    const onScheduledStartDateChanged = (event, selectedDate) => {
        const currentDate = selectedDate || options.scheduledStartDate;
        setShowScheduledStartDate(Platform.OS === 'ios');
        options.scheduledStartDate = currentDate;
        if(mode == 'date')
            setMode('time');
        if(mode == 'time')
            setMode('date');
    };

    const showTempDateMode = (currentMode) => {
        setShowTempDate(true);
        setMode(currentMode);
    };

    const showScheduledStartDateMode = (currentMode) => {
        setShowScheduledStartDate(true);
        setMode(currentMode);
    };

    const showScheduledEndDateMode = (currentMode) => {
        setShowScheduledEndDate(true);
        setMode(currentMode);
    };

    const updateSelection = (newValue) =>{
        options.selection = newValue;
        props.selectOptions(options);
    }

    const updateScheduledDays = (day) =>{
        if(options.scheduledDays != null)
        {
            if(options.scheduledDays.includes(day))
                options.scheduledDays = options.scheduledDays.filter(x => x != day);
            else
                options.scheduledDays.push(day);
        }
        else
            options.scheduledDays = [];
        props.selectOptions(options);
    }

    // Use date
    Moment.locale('en');

    return (

        <View style={[appStyle.container]}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0, marginTop:-15}}>Set the access options for these properties</AppHeaderText>
            
            {/* Selection Header */}
            <View style={[appStyle.row, {flex:1, top: -10 ,marginTop:15, maxHeight:30, overflow: "visible", justifyContent: 'space-between'}]}>
                <TouchableOpacity style={options.selection == 0 ? appStyle.tabSelected : appStyle.tab} onPress={() => {updateSelection(0)}}>
                    <View><AppText>Temporary</AppText></View>
                </TouchableOpacity>

                <TouchableOpacity style={options.selection == 1 ? appStyle.tabSelected : appStyle.tab} onPress={() => {updateSelection(1)}}>
                    <View><AppText>Recurring</AppText></View>
                </TouchableOpacity>

                <TouchableOpacity style={options.selection == 2 ? appStyle.tabSelected : appStyle.tab} onPress={() => {updateSelection(2)}}>
                    <View><AppText>Unlimited</AppText></View>
                </TouchableOpacity>
            </View>

            {/* Display Temporary options */}
            {
                options.selection == 0 && 
                <View style={{flex:1, marginTop:10}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <AppText>Allow usage from now until...</AppText>
                    </View>
                    <View style={{flex:1, marginTop:-180}}>
                        <View style={appStyle.row}>
                            <TouchableOpacity style={[appStyle.regularButton, {marginRight:5}]} onPress={() => {showTempDateMode('date')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.tempDate).format('MMM Do YYYY')}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity style={[appStyle.regularButton, {marginLeft:5}]} onPress={() => {showTempDateMode('time')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.tempDate).format('h:mm a')}</AppText>
                            </TouchableOpacity>
                        </View>
                        {showTempDate && (
                            <DateTimePicker
                            testID="dateTimePicker"
                            value={options.tempDate}
                            mode={mode}
                            minimumDate={new Date()}
                            is24Hour={false}
                            display="default"
                            onChange={onTempDataChange}
                            />
                        )}
                    </View>
                </View>
            }
            
            {/* Display Schedule options */}
            {
                options.selection == 1 && 
                <View style={[appStyle.column, {marginTop:15, top: 10}]}>
                    
                    {/* Day Select */}
                    <View style={appStyle.row}>
                        <View style={appStyle.rowLeft}>
                            <AppTitleText>Days</AppTitleText>
                        </View>
                        <View style={appStyle.rowRight}>
                            <View style={[appStyle.row, {alignContent:'flex-end', justifyContent:'flex-end'}]}>
                                <TouchableOpacity onPress={() => {updateScheduledDays(0)}} style={[options.scheduledDays.includes(0) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>M</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(1)}} style={[options.scheduledDays.includes(1) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>T</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(2)}} style={[options.scheduledDays.includes(2) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>W</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(3)}} style={[options.scheduledDays.includes(3) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>R</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(4)}} style={[options.scheduledDays.includes(4) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>F</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(5)}} style={[options.scheduledDays.includes(5) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:5}]}>
                                    <AppText>S</AppText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {updateScheduledDays(6)}} style={[options.scheduledDays.includes(6) ? appStyle.checkBoxSelected : appStyle.checkBox, {marginRight:0}]}>
                                    <AppText>U</AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* Start Date */}
                    <View style={[appStyle.row, {marginTop:20}]}>
                        <AppText>Start Date</AppText>
                        <View style={appStyle.rowRight}>
                            <TouchableOpacity style={[appStyle.regularButton, {marginTop:-8, marginLeft:20, maxHeight:35}]} onPress={() => {showScheduledStartDateMode('date')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.scheduledStartDate).format('MMM Do YYYY')}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Start Time */}
                    <View style={[appStyle.row, {marginTop:20}]}>
                        <AppText>Start Time</AppText>
                        <View style={appStyle.rowRight}>
                            <TouchableOpacity style={[appStyle.regularButton, {marginTop:-8, marginLeft:20, maxHeight:35}]} onPress={() => {showScheduledStartDateMode('time')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.scheduledStartDate).format('h:mm a')}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* End Date */}
                    <View style={[appStyle.row, {marginTop:20}]}>
                        <AppText>End Date</AppText>
                        <View style={appStyle.rowRight}>
                            <TouchableOpacity style={[appStyle.regularButton, {marginTop:-8, marginLeft:20, maxHeight:35}]} onPress={() => {showScheduledEndDateMode('date')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.scheduledEndDate).format('MMM Do YYYY')}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* End Time */}
                    <View style={[appStyle.row, {marginTop:20}]}>
                        <AppText>End Time</AppText>
                        <View style={appStyle.rowRight}>
                            <TouchableOpacity style={[appStyle.regularButton, {marginTop:-8, marginLeft:20, maxHeight:35}]} onPress={() => {showScheduledEndDateMode('time')}}>
                                <AppText style={{paddingHorizontal:20}}>{Moment(options.scheduledEndDate).format('h:mm a')}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {showScheduledStartDate && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={options.scheduledStartDate}
                        mode={mode}
                        minimumDate={new Date()}
                        is24Hour={false}
                        display="default"
                        onChange={onScheduledStartDateChanged}
                        />
                    )}
                    {showScheduledEndDate && (
                        <DateTimePicker
                        testID="dateTimePicker"
                        value={options.scheduledEndDate}
                        mode={mode}
                        minimumDate={new Date()}
                        is24Hour={false}
                        display="default"
                        onChange={onScheduledEndDateChanged}
                        />
                    )}
                </View>
            }

            {/* Display Unlimited options */}
            {
                options.selection == 2 && 
                <View style={{flex:1, marginTop:10}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <AppText>Allow this user unlimited access to the device and properties selected...</AppText>
                    </View>
                </View>
            }
        </View>
    )
}
