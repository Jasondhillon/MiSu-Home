import React from 'react';
import { Dimensions, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { shareAction, shareFailed, ShareSuccess } from '../../redux/Action/shareAction';
import appStyle from '../../styles/AppStyle';
import { showToast } from '../../utils/toast';
import AppTitleText from '../app/AppTitleText';
import { DeviceList } from '../Share/deviceList';
import { PermissionList } from '../Share/PermissionList';
import { UserList } from '../Share/userList';
import SmallIcon from '../SmallIcon';

const liftImg = require('../../assets/left.png')
const rightImg = require('../../assets/chevron.png')
const shareImg = require('../../assets/share.png')

const Footer = (props) => {

    return (
        <View style={{ flexDirection:'row' , justifyContent:'space-between' , marginTop: 20}}>
            {
                (
                    <TouchableOpacity onPress={() => props.prev()}>
                        <View>
                            <SmallIcon img={liftImg} />
                        </View>
                    </TouchableOpacity> 
                )
            }
            {
                props.pos == 2 ?
                ( 
                    <TouchableOpacity onPress={()=> props.Share(props.IdToken, props.selecteduser, props.selecteddevice,props.sharedAccounts,props.selectedprops)}>
                        <View>
                            <SmallIcon img={shareImg} />
                        </View>
                    </TouchableOpacity>
                ):(  
                    <TouchableOpacity onPress={()=> props.next()}>
                        <View>
                            <SmallIcon img={rightImg} />
                        </View>
                    </TouchableOpacity>
                 )
            }
        </View>
    )
}

class ShareModal extends React.Component {
    
    constructor (props) {
        super(props)

        this.state={
            pos:0,
            selecteddevice: null,
            selecteduser: null,
            permissions: null,
            refresh: true,
            updatedproperties: null
        };
    }

    next () {
        let pos =  this.state.pos +1
        switch (pos) {
            case  1:
                this.state.selecteduser ? this.setState({ pos }) : showToast('Select a user!')
                break;
            case 2:
                if(this.state.selecteddevice != null)
                {
                    this.selectDevice(this.state.selecteddevice);
                    this.setState({ pos });  
                }
                else
                    showToast('Select a Device!') 
                break;
            default:
                break;
        }
      
      
    }

    previous () {
        let pos =  this.state.pos -1;
        this.setState({ pos});
        if((this.props.canEditUser == false && this.state.pos <= 1) || (this.props.canEditUser == true && this.state.pos <= 0))
        this.props.ModalRef.current.snapTo(1);
    }

    submit () {
        console.log('submitting')
    }

    UNSAFE_componentWillMount() {

        this.props.user? this.setState({pos: 0 , selecteduser:this.props.user  }): null
       
    }
    

    UNSAFE_componentWillReceiveProps(){
        this.setState({
            refresh : !this.state.refresh
        })

    }


    selectPermission( permissions) {
        this.setState({
            updatedproperties: permissions,
        })
    }

    selectUser (user) {
        this.setState({
            selecteduser: user
        })
    }

    async selectDevice (device) {

        // check if the property exists on the device we've selected
        Object.keys(device.properties).map((item,index) => {
            device.properties[item].access = 0
        });

        await this.setState({
            selecteddevice: device,
            selectedprops: device.properties,
            updatedproperties: device.properties
        })
        
        // Initialize the properties with the already set property settings
        if(this.props.sharedAccountsData.sharedAccounts != null && this.state.selecteduser != null && this.state.selecteddevice != null && this.state.selecteddevice.properties != null)
        {
            for(var i = 0; i < this.props.sharedAccountsData.sharedAccounts.length; i++)
            {
                if(this.props.sharedAccountsData.sharedAccounts[i].devices != null)
                {
                    for(var x = 0; x < this.props.sharedAccountsData.sharedAccounts[i].devices.length; x++)
                    {
                        if(this.props.sharedAccountsData.sharedAccounts[i].devices[x].properties != null)
                        {
                            // Iterate through every property already granted to the user
                            for(var p = 0; p < this.props.sharedAccountsData.sharedAccounts[i].devices[x].properties.length; p++)
                            {
                                // check if the property exists on the device we've selected
                                Object.keys(device.properties).map((item,index) => {
                                    var found = 0;
                                    if(device.properties[item].title == this.props.sharedAccountsData.sharedAccounts[i].devices[x].properties[p].name)
                                    {    
                                        found = 1;
                                        device.properties[item].access = 2;
                                        if(this.props.sharedAccountsData.sharedAccounts[i].devices[x].properties[p].read_only == 1)
                                        {
                                            device.properties[item].access = 1;
                                        }
                                    }
                                    if(found == 0)
                                        device.properties[item].access = 0;
                                });
                            }
                        }
                    }
                }
            }
        }

        await this.setState({
            selecteddevice: device,
            selectedprops: device.properties,
            updatedproperties: device.properties
        })
    }


    renderScreen(pos) {
        switch(pos) {
            case 0:
                return <UserList  selecteduser={this.state.selecteduser} sharedAccounts={this.props.sharedAccountsData.sharedAccounts}  setUser={this.selectUser.bind(this)} />
            case 1:
                return <DeviceList selecteduser={this.state.selecteduser} selecteddevice={this.state.selecteddevice} devices={this.props.devicesData.devices} setDevice={this.selectDevice.bind(this)}/>
            case 2 :
                return <PermissionList selecteduser={this.state.selecteduser}  selecteddevice={this.state.selecteddevice} setPerm={this.selectPermission.bind(this)} properties={this.state.selecteddevice.properties} />
            default: 
                return null
        } 
    }
  
    share(idToken, selectedAccount, selecteddevice, sharedAccounts, selectedProps){

        this.props.Share(idToken, selectedAccount.guest_email, selecteddevice, sharedAccounts, selectedProps);
        this.props.ModalRef.current.snapTo(1);
    }

    render ()   {
        return (
           <BottomSheet
           initialSnap={1}
           ref={this.props.ModalRef}
           snapPoints={['60%','0%']}
           borderRadius={15}
           // Initialize the modal
           onOpenStart={async () => {
                if(this.props.selecteddevice != null && this.props.selecteduser != null)
                {
                    await this.setState({selecteduser: this.props.selecteduser, selecteddevice: this.props.selecteddevice, pos:2, updatedproperties:null,});
                    this.selectDevice(this.props.selecteddevice);
                }
                else if(this.props.canEditUser == false)
                        this.setState({
                            selecteddevice:null,
                            updatedproperties:null,
                            selecteduser:this.props.selecteduser,
                            pos:1
                    })
                else 
                    this.setState({
                        pos:0,
                        selecteduser:null,
                        selecteddevice:null,
                        updatedproperties:null
                    })
           }}
           renderContent={()=>{
               return(
                     <View style={[{
                        padding: 20,
                        height: Dimensions.get("screen").height * 0.564,
                     }, appStyle.modal]}>
                        {this.renderScreen(this.state.pos)}
                         <Footer 
                            canEditUser = {this.props.canEditUser}
                            pos={this.state.pos} 
                            sharedAccounts={this.props.sharedAccountsData.sharedAccounts}
                            selecteduser={this.state.selecteduser}
                            selecteddevice={this.state.selecteddevice}
                            selectedprops={this.state.updatedproperties}
                            next={this.next.bind(this)} 
                            prev={this.previous.bind(this)} 
                            IdToken={this.props.sessionData.idToken}
                            submit={this.submit} 
                            Share={this.share.bind(this)}
                         />
                     </View>)
           }}
         />
        )}
}

const mapStateToProps = (state) => {
    const {devicesData ,sharedAccountsData  ,sessionData} = state
    return { devicesData ,sharedAccountsData,sessionData}
  };

  const mapDispatchToProps = dispatch =>  {
    return {
        Share : (idToken,email,device, accounts,properties) => {dispatch(shareAction(idToken,email,device, accounts,properties))},
   }
}
  

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal)