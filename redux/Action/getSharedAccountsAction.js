import { getListofSharedAccounts } from '../../services/listDevice'

const setSharedAccounts = (type, data, success) => ({
    type, 
    payload: {...data, success}
})

export  const getSharedAccountsAction = (IdToken) => {
   
    return async (dispatch) =>{
        try {
            const data = await getListofSharedAccounts(null,IdToken)
            dispatch(setSharedAccounts('SET_SHARED_ACCOUNTS' ,{ sharedAccounts: data.message},true))
        } catch (error) {
            dispatch(setSharedAccounts('SET_SHARED_ACCOUNTS',null,false))
        }
    }
}