
export  const  getHubInfoService = async (idToken) => {
    const response =   await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/getUserInfo', {
       method: 'GET',
       headers: 
       {
           Authorization: 'Bearer ' + idToken
       }
     })
    
     return response.json()
 }