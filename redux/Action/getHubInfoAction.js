
import { getHubInfoService } from '../../services/getHubInfo'


const setHub = (type,data,success) => ({
    type,
    payload:{...data, success}
})


export const getHubInfoAction =  (idToken) => {
    return async (dispatch) =>{
        try {
            const data = await getHubInfoService(idToken)
            dispatch(setHub('SET_HUB_INFO',data,true))
            
        } catch (error) {
            dispatch(setHub('UNSET_HUB_INFO',null,false))
        }

    }
  

}