import axios from 'axios'

const OAUTH_TWITTER_ID = "aGhvYm0walZMblZWWmQyQkI2Z2Q6MTpjaQ"
const OAUTH_TWITTER_SECRET = "gAHarFfNjqDTY-y3rikdeIfpuipdWDtkdO63ELw8xKjpW9zCiT"
const URL_WEB = "http://localhost:3000/wooden_loot_box/"

export default async function twitter({ code }) {
    let userProvider
  
    const form = new URLSearchParams()
    form.append('client_id', OAUTH_TWITTER_ID)
    form.append('redirect_uri', `${URL_WEB}`)
    form.append('grant_type', `authorization_code`)
    form.append('code_verifier', `code_challenge`)
    form.append('code', code)
  
    const access = await axios({
      url: `https://api.twitter.com/2/oauth2/token`,
      method: 'post',
      data: form,
    })
  
    if (access.data && access.data.access_token) {
      const me = await axios({
        url: 'https://api.twitter.com/2/users/me',
        method: 'get',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${access.data.access_token}`,
        },
      })
  
      if (me.data && me.data.data) {
        userProvider = {
          // since twitter does not return email, we construct a dummy email for database
          email: `${me.data.data.username}.${me.data.data.id}@example.com`,
          name: me.data.data.name,
        }
      }
    }
  
    return userProvider
}
  