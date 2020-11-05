import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import appStyle from '../../styles/AppStyle';

class UserCard extends Component 
{
    state = 
    {
      owned: true
    }
    
    constructor(props){
        super(props)

        this.state  = {

        }
    }  

    render () 
    {
        return (
            <View style={[appStyle.card, {paddingHorizontal:20}]}>
                <AppHeaderText style={style.name}>Hi!</AppHeaderText>
            </View>
        );
    };

}

const DeviceItem = (props) => {
      
    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('Device')}>
        <View style={styles.item}>
            <SmallIcon img={require('../../assets/wifi.png')} />
            <Text> {props.device.name}</Text>
            <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={"#f5dd4b"}
                    ios_backgroundColor="#3e3e3e"
                    value={true}
      />
            <SmallIcon img={require('../../assets/right.png')} />
        </View>
        </TouchableOpacity>
    )
}

const List  = (props) => {
    return (
        <View >
            {props.devices[0].map((device,index)=> <DeviceItem key={index} device={device} navigation={props.navigation} />)}
        </View>
    )
}

const Footer = (props) => {
    return(
        <TouchableOpacity onPress={() => props.endSharing()}>
            <View style={styles.enbtn}>
                <Text style={{ color:'white'}}>End All Sharing</Text>
            </View>
        </TouchableOpacity>
   )
}


class UserCard extends Component 
{
    state = 
    {
      owned: true
    }
    
    constructor(props){
        super(props)

        this.state  = {

        }
        this.ModalRef = React.createRef();
    }  

    render () 
    {
        return (
            <View style={[appStyle.card, {paddingHorizontal:20}]}>
                <AppHeaderText style={style.name}>Hi!</AppHeaderText>

                <List devices={this.props.devices}  navigation={this.props.navigation}/>
            </View>
        );
    };

}

;


const styles  = StyleSheet.create({
    name: {
        fontSize:24,
        height:30,
    },
    icon: {
        marginTop:10,
        height:100,
        width: 100,
    },
    container: {
        flex:1,
   },
   cardcont:{ 
    margin: 10,
    padding: 40 , 
    elevation: 4,  
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
             width: 0,
            height: 1,
        },
    shadowOpacity: 10,
    shadowRadius: 20.41},
   header : {
       flexDirection:'row',
       justifyContent: 'space-between'
   },
   item :{
       flexDirection: 'row',
       justifyContent: 'space-between',
        marginBottom: 10 , 
        marginTop:10
   },
   enbtn: {
        padding:5,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:"center"
   },
  
})


export default UserCard;