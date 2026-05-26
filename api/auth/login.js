import 'dotenv/config'

export default function handler(req, res) {
    const state = crypto.randomUUID()
    res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Path=/; Max-Age=600`)

const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state
})

res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)

}