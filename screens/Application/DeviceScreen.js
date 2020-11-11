import React from 'react';
import { TouchableOpacity, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import appStyle from '../../styles/AppStyle';
import DeviceCard from '../../components/cards/DeviceCard';

class DeviceScreen extends React.Component 
{
    
    static navigationOptions = ({ navigate, navigation }) => ({
        headerTitle: navigation.getParam('device','').name,
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
        const device = this.props.navigation.getParam('device','');
        return(
            
            <View style={appStyle.container}>
                {
                    <View style={appStyle.cardContainer}>
                    <ScrollView style={appStyle.scrollView}>
                        <DeviceCard device={device}/>
                    </ScrollView>
                    </View>
                }
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