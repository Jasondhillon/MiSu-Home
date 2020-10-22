
// Accepts/declines an invitation sent by a primary user
export const updateInvitation = async (account, value ,idToken) => {
   
    const response =  await fetch('https://c8zta83ta5.execute-api.us-east-1.amazonaws.com/test/invitation', {
          method: 'POST',
          headers: 
          {
              Authorization: 'Bearer ' + idToken,
          },
          body: JSON.stringify({
            account: account,
            accepted: value
          })
      })
      return response.json()
  
  }