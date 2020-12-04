import React from 'react';
import { Dimensions, View, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import { shareAction } from '../../redux/Action/shareAction';
import appStyle from '../../styles/AppStyle';
import { showToast } from '../../utils/toast';
import { DeviceList } from '../Share/deviceList';
import { PermissionList } from '../Share/PermissionList';
import { PermissionOptions } from '../Share/PermissionOptions';
import { UserList } from '../Share/userList';
import SmallIcon from '../SmallIcon';
const liftImg = require('../../assets/left.png')
const rightImg = require('../../assets/right.png')
const removeImg = require('../../assets/x.png')
const shareImg = require('../../assets/share.png')

class Footer extends React.Component {
    
    constructor (props) {
        super(props)
    }
    
    createRemoveAlert = (user) =>
    Alert.alert(
      "Remove " + this.props.selecteddevice.title,
      "Are you sure? You will need to give this user access again.",
      [
        {
          text: "Cancel",
        },
        { text: "Remove", onPress: () => this.props.Share(this.props.IdToken, this.props.selecteduser, this.props.selecteddevice,this.props.sharedAccounts,this.props.selectedprops,this.props.selectedoptions)}
      ],
      { cancelable: false }
    );

    render ()   { 
        return (
            <View>
                <View style={{backgroundColor:'black', height:1, marginBottom:10}}/>
                <View style={{ flexDirection:'row' , justifyContent:'space-between' , marginTop: 0}}>
                {
                    (
                        <TouchableOpacity onPress={() => this.props.prev()}>
                            <View>
                                <SmallIcon img={liftImg} />
                            </View>
                        </TouchableOpacity> 
                    )
                }
                {
                    // Last screen
                    this.props.pos == 3 ?
                    ( 
                        <TouchableOpacity onPress={()=> this.props.Share(this.props.IdToken, this.props.selecteduser, this.props.selecteddevice,this.props.sharedAccounts,this.props.selectedprops,this.props.selectedoptions)}>
                            <View>
                                <SmallIcon img={shareImg} />
                            </View>
                        </TouchableOpacity>
                    ):
                    // Permissions Screen, show early share button if no perms are set and the user has this device
                    this.props.pos == 2 && this.props.selectedprops.every(x => x.access == 0 || x.access == null) ?
                    (  
                        <TouchableOpacity onPress={()=> {
                            if('devices' in this.props.selecteduser && this.props.selecteduser.devices.some(x => x.name == this.props.selecteddevice.title))
                                this.createRemoveAlert()
                            else
                                this.props.modalRef.current.snapTo(1);
                        }}>
                            <View>
                                <SmallIcon img={removeImg} />
                            </View>
                        </TouchableOpacity>
                    ):
                    (  
                        <TouchableOpacity onPress={()=> this.props.next()}>
                            <View>
                                <SmallIcon img={rightImg} />
                            </View>
                        </TouchableOpacity>
                    )
                }
                </View>
            </View>
        )
    }
}

class ShareModal extends React.Component {
    
    constructor (props) {
        super(props)

        this.state={
            pos:0,
            selecteddevice: null,
            selectedprops: [],
            selecteduser: null,
            selectedoptions: null,
            permissions: null,
            refresh: true,
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
            case 3:
                this.selectedPerms();
                this.setState({ pos });  
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

    UNSAFE_componentWillMount() {

        this.props.user? this.setState({pos: 0 , selecteduser:this.props.user  }): null
       
    }

    UNSAFE_componentWillReceiveProps(props){
        this.setState({
            refresh : !this.state.refresh
        })
    }

    selectPermission( permissions) {
        this.setState({
            selectedprops: permissions,
        })
    }

    selectOptions(options) {
        this.setState({
            selectedoptions: options,
        })
    }

    selectUser (user) {
        this.setState({
            selecteduser: user
        })
    }

    async selectDevice (device) {
       const FoundAcc =  await this.props.sharedAccountsData.sharedAccounts.find( account => account.guest_email == this.state.selecteduser.guest_email)
       if(FoundAcc){
           const FoundDevice = await  FoundAcc.devices.find(dev => dev.name == device.title)
            if(FoundDevice) {
                const  tempProps  = []
                Object.keys(device.properties).forEach((pkey,index)=> {
                    //Check if Property Exist in Found Device
                    let FoundProp = null //FoundDevice.properties.find(FProp => FProp.title == property.title)
                   
                    Object.keys(FoundDevice.properties).forEach((key,index) => {
                     
                      

                        if(FoundDevice.properties[key].name == device.properties[pkey].title){
                           

                            FoundProp = FoundDevice.properties[key]
                        }
                    })
                   
                    if(FoundProp){
                       //Found ChecK For Readonly if 1 give Allow if 0 give readonly
                        tempProps.push( FoundProp.read_only == 1 ?  {...device.properties[pkey],access:1}:  {...device.properties[pkey],access:2})
                    }else {
                        //Not Found  Set no Access
                        tempProps.push( {...device.properties[pkey],access:0})
                    }
                })

                await this.setState({
                    selecteddevice: device,
                    selectedprops: tempProps ,
                })
            }
            else {
                //Account Found but no device meaning no nneed to loops through Properties
                const tempProps = []
                 Object.keys( device.properties).forEach((key, index) => {
                    tempProps.push({...device.properties[key],access: 0})
                })
        
                await this.setState({
                    selecteddevice: device,
                    selectedprops: tempProps,
                })
            }
       }
       else {
      
        const tempProps = []
        Object.keys(device.properties).forEach((key, index) => {
           tempProps.push({...device.properties[key],access: 0})
       })
        await this.setState({
            selecteddevice: device,
            selectedprops: tempProps,
        })
       }
    }

    async selectedPerms() {
        
        var type = 2;
        var tempDate = new Date();
        var scheduledDays = [];
        var scheduledStartDate = new Date();
        var scheduledEndDate = new Date();
        
        // Initialize the selectedoptions to current selection if it exists
        const FoundAcc = this.props.sharedAccountsData.sharedAccounts.find( account => account.guest_email == this.state.selecteduser.guest_email)
        if(FoundAcc){
           const FoundDevice = FoundAcc.devices.find(dev => dev.name == this.state.selecteddevice.title)
            if(FoundDevice) {
                var firstPerm = FoundDevice.properties[0];
                var type = 0;
                if(firstPerm != null)
                {
                    if(firstPerm.temporary == 1)
                    {
                        tempDate = new Date(firstPerm.temp_date + ", " + firstPerm.temp_time_range_end);
                        type = 0;
                    }

                    if(firstPerm.time_range == 1)
                    {
                        scheduledStartDate = new Date(firstPerm.time_range_start_date + ", " + firstPerm.time_range_start);
                        scheduledEndDate = new Date(firstPerm.time_range_end_date + ", " + firstPerm.time_range_end);
                        // get scheduled days by iterating through time_range_reoccuring
                        if(firstPerm.time_range_reoccuring != "" && firstPerm.time_range_reoccuring != null)
                        {
                            var tempCount = 0;
                            for (var i = 0; i < firstPerm.time_range_reoccuring.length + 1; i++) {
                                // Skip to every three letters to support the MonThuSat example
                                if(tempCount >= 3 && i <= firstPerm.time_range_reoccuring.length)
                                {
                                    // Push to the scheduledDays arrays depending on the day
                                    tempCount = 0;
                                    var dayCut = firstPerm.time_range_reoccuring.substring(i - 3, i);
                                    // Check if the time range is thursday for special case of using R to signify it
                                    if(dayCut == "Mon")
                                    {
                                        scheduledDays.push(0);
                                    }
                                    else if(dayCut == "Tue")
                                    {
                                        scheduledDays.push(1);
                                    }
                                    else if(dayCut == "Wed")
                                    {
                                        scheduledDays.push(2);
                                    }
                                    else if(dayCut == "Thu")
                                    {
                                        scheduledDays.push(3);
                                    }
                                    else if(dayCut == "Fri")
                                    {
                                        scheduledDays.push(4);
                                    }
                                    else if(dayCut == "Sat")
                                    {
                                        scheduledDays.push(5);
                                    }
                                    else if(dayCut == "Sun")
                                    {
                                        scheduledDays.push(6);
                                    }
                                }
                                tempCount++;
                            }
                        }
                        type = 1;
                    }    
                
                    if(firstPerm.unrestricted == 1)
                    {
                        type = 2;
                    }
                }
            }
        }
        
        await this.setState({
            selectedoptions:{
                selection:type,
                tempDate:tempDate,
                scheduledDays:scheduledDays,
                scheduledStartDate:scheduledStartDate,
                scheduledEndDate:scheduledEndDate,
            }
        })  
    }

    renderScreen(pos) {
        switch(pos) {
            case 0:
                return <UserList  selecteduser={this.state.selecteduser} sharedAccounts={this.props.sharedAccountsData.sharedAccounts}  setUser={this.selectUser.bind(this)} />
            case 1:
                return <DeviceList selecteduser={this.state.selecteduser} selecteddevice={this.state.selecteddevice} devices={this.props.devicesData.devices} setDevice={this.selectDevice.bind(this)}/>
            case 2 :
                return <PermissionList AccessData={this.props.AccessState.temp_access}  ModifyState={this.props.ModifyAccess} selecteduser={this.state.selecteduser}  selecteddevice={this.state.selecteddevice} setPerm={this.selectPermission.bind(this)} properties={this.state.selectedprops} />
            case 3 :
                return <PermissionOptions AccessData={this.props.AccessState.temp_access}  ModifyState={this.props.ModifyAccess} selecteduser={this.state.selecteduser}  selecteddevice={this.state.selecteddevice} setPerm={this.selectPermission.bind(this)} properties={this.state.selectedprops} options={this.state.selectedoptions} selectOptions={this.selectOptions.bind(this)} />
            default: 
                return null
        } 
    }
  
    share(idToken, selectedAccount, selecteddevice, sharedAccounts, selectedProps, selectedOptions){
        this.props.Share(idToken, selectedAccount.guest_email, selecteddevice, sharedAccounts, selectedProps,selectedOptions);
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
                    await this.setState({
                        selecteduser: this.props.selecteduser, 
                        selecteddevice: this.props.selecteddevice, 
                        pos:2, 
                    });
                    this.selectDevice(this.props.selecteddevice);
                }
                else if(this.props.canEditUser == false)
                    await this.setState({
                            selecteddevice:null,
                            selecteduser:this.props.selecteduser,
                            pos:1
                    })
                else 
                    this.setState({
                        pos:0,
                        selecteduser:null,
                        selecteddevice:null,
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
                            modalRef={this.props.ModalRef}
                            selecteduser={this.state.selecteduser}
                            selecteddevice={this.state.selecteddevice}
                            selectedprops={this.state.selectedprops}
                            selectedoptions={this.state.selectedoptions}
                            next={this.next.bind(this)} 
                            prev={this.previous.bind(this)} 
                            IdToken={this.props.sessionData.idToken}
                            Share={this.share.bind(this)}
                         />
                     </View>)
           }}
         />
        )}
}


const mapStateToProps = (state) => {

    const {devicesData ,sharedAccountsData  ,sessionData , shareState ,AccessState} = state
    return { devicesData ,sharedAccountsData,sessionData ,shareState ,AccessState}
  };

  const mapDispatchToProps = dispatch =>  {
    return {
        ModifyAccess : (title, value) => { dispatch(ModifyAccessStateAction(title,value))},
        Share : (idToken,email,device, accounts,properties, options) => {dispatch(shareAction(idToken,email,device, accounts,properties, options))},
   }
}
  

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal)