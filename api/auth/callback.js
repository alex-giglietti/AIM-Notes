import 'dotenv/config'
import { parse } from 'cookie'

export default async function handler (req, res) {
    const { code, state } = req.query
    const cookies = parse(req.headers.cookie || '')
    if (state != cookies.oauth_state) return res.status(403).send('State Mismatch')
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
            grant_type: 'authorization_code',
        })
    })
    const { id_token, access_token } = await tokenRes.json()
    const payload = JSON.parse(atob(id_token.split('.')[1]))
    const session = JSON.stringify({ name: payload.name, email: payload.email, accToken: access_token })
    res.setHeader('Set-Cookie', `session=${session}; HttpOnly; Path=/; Max-Age=86400`)
    res.redirect('/api/projects')
}