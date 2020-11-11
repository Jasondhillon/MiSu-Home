import { getListofSharedAccounts } from '../../services/listDevice'

const setSharedAccounts = (type, data, success) => ({
    type, 
    payload: {...data, success}
})

export  const getSharedAccountsAction = (IdToken) => {
   
    return async (dispatch) =>{
        try {
            dispatch(setSharedAccounts('SET_SHARED_ACCOUNTS' ,{ sharedAccounts: [], error: null ,loading: false},true,))
            const data = await getListofSharedAccounts(null,IdToken)
            dispatch(setSharedAccounts('SET_SHARED_ACCOUNTS' ,{ sharedAccounts: data.message,  error: null ,loading: false},true,))
        } catch (error) {
            dispatch(setSharedAccounts('SET_SHARED_ACCOUNTS',{ sharedAccounts:[], error: error.message,loading: false },false))
        }
    }
}