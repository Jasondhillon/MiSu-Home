import * as React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import AppText from '../../app/AppText';
import appStyle from '../../../styles/AppStyle';

const  HubCardSharedUsersListEntry =props =>  {
  
    return (
      <TouchableOpacity  onPress={() => props.move()} style = { style.container } >
        <View style={[appStyle.container, {marginTop:-10}]}>
          <View style={appStyle.row}>
            <View style={appStyle.rowLeft}>
              <Image
                  style={style.userIcon}
                  source={require('../../../assets/icons/user.png')}
              />
              
              <AppText>{props.name} </AppText>
            </View>

            <View style={appStyle.rowRight}>
              <Image style={style.rightIcon} source={require('../../../assets/right.png')} />
              
            </View>
          </View>
        </View>
        <View style = {style.lineContainer} >
        </View>
      </TouchableOpacity>
    );
  
      
    <View  style = { style.container } >
    <TouchableOpacity  onPress={() => props.move()}>
      <View style={{ flexDirection:'row' ,justifyContent:'space-around' ,marginTop: 10 ,marginBottom: 10}}>
     <Icon img={require('../../../assets/wifi.png' )} />
     <AppText>{props.name} </AppText>
     <Icon img={require('../../../assets/right.png')} />
     </View>
     
     </TouchableOpacity>
   </View>
}


const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf:'stretch',
    height:50,
  },
  lineContainer: {
    flex:1,
    backgroundColor:'#333333',
    height:2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'stretch',
    position:'absolute',
    left:0,
    right:0,
    top:40,
  },
  userIcon: {
    height:30,
    width: 30,
    marginTop:-2.5,
    marginRight:5
  },
  rightIcon: {
    height:25,
    width: 25,
    marginTop:0,
    marginRight:0
  }
});




//export default connect(mapStateToProps)(withNavigation(HubCardSharedUsersListEntry));
export default HubCardSharedUsersListEntry