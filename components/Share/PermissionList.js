//import { Picker } from 'expo';
import * as React from 'react';
import { Picker, Text, View } from 'react-native';
import appStyle from '../../styles/AppStyle';


const PermView = (props) => {
    const [selectedValue, setSelectedValue] = React.useState(0);
    const pr = props.property
    return (<View  style={{ flexDirection: "row" ,justifyContent:"space-between", alignItems:"center"}}>
            <Text>{pr.title}</Text>
           
           <Picker    
                selectedValue={selectedValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) =>{
                    setSelectedValue(itemValue)
                    props.updatePerm({...pr ,readOnly:itemValue })
                }}>
                <Picker.Item label="Allow" value={2} />
                <Picker.Item label="Read Only" value={1} />
                <Picker.Item label="No Access" value={0} />
             </Picker> 
        </View>
    )
}

export const PermissionList = props => {
    const  properties  =[]
    Object.keys(props.properties).forEach((key,index) => {
        properties.push(props.properties[key])
    })

    React.useEffect(() => {
        props.setPerm(properties)
    }, [ ])
  

    const updatePerm = (newValue) =>{
        props.setPerm([...properties, newValue])
    }

    return (
        <View style={appStyle.container}>
            <AppHeaderText style={{textAlign:'center', marginBottom:0}}>What Permission in ${props.selecteddevice.title} Would you like to Share?</AppHeaderText>

            {properties.map((props,index)=> <PermView key={index}property={props} updatePerm={updatePerm} />)}
            
        </View>
    )
}


