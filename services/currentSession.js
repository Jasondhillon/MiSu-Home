import { Auth } from 'aws-amplify';
export const currentSessionService = async () => {
    const data1  = await  Auth.currentSession()
     
    const accDat = {
      id: data1.getIdToken().payload.sub,
      idToken: data1.getIdToken().getJwtToken(),
      accessToken: data1.getAccessToken().getJwtToken(),
      email: data1.getIdToken().payload.email,
      name: data1.getIdToken().payload.name
  };
  
   return accDat
}
  