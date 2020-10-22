import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import appStyle from '../../styles/AppStyle';

class DeviceScreen extends React.Component 
{
    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: 'Device',
        headerLeft: () => (
            <View>
                <TouchableOpacity style={{alignSelf: 'center', marginTop: 16}} onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrow-back" size={35} style={{ marginLeft:16, marginBottom:10 }}/>
                </TouchableOpacity>
            </View>
        ),
        headerRight: () => ( <View></View>)
    });

    
  
  
  
    render()
    {
        return(
            
            <View style={appStyle.container}>
                {/*<View style={appStyle.cardContainer}>
                    <ScrollView style={appStyle.scrollView}>
                        {this.props.devicesData.devices.map(device => {
                            return   <DeviceCard/>
                        })}
                      
                    </ScrollView>
                    </View>*/}
            </View> 
        );
    }
}

const mapStateToProps = (state) => {
    const { devicesData} = state
    return { devicesData}
  };





  const mapDispatchToProps = dispatch =>  {
    return {
        dosomething : () => {}
   }
}


export default  connect(mapStateToProps, mapDispatchToProps)(DeviceScreen)