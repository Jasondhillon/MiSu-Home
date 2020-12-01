import Bulb from '../../assets/DeviceIcons/Bulb.png'
import Lock from '../../assets/DeviceIcons/Lock.png'
import Speaker from '../../assets/DeviceIcons/Speaker.png'
import device from '../../assets/device.png'
import Plug from '../../assets/DeviceIcons/outlet.png'
import Doorbell from '../../assets/icons/hub.png'

export default getDeviceIcon = (deviceType) =>{
    if (deviceType === ""){
        // differentiate between devices with empty description
        return Lock
    }   
    else if (deviceType === 'W21-N13')
        return Bulb
    else if (deviceType === 'Belkin Plugin Socket 1.0')
        return Plug
    else if (deviceType === 'Unknown Model') // This is the Ring doorbell default description
        return Doorbell
    else 
        return device
}