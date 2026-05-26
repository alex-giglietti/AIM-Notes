import supabase from '../lib/supabase'
import { parse } from 'cookie'

export default async function handler (req, res) {
    const cookies = parse(req.headers.cookie || '')
    if (!cookies.session) {
        res.redirect('/index.html')
    }
    const session = JSON.parse(cookies.session)
    const userEmail = session.email
    if (!userEmail) {
        res.redirect('/index.html')
    } else {
        const { id } = req.query
        const { data, error } = await supabase
        .from('AIM Notes')
        .select()
        .eq('id', `${id}`)
        if (!error && data.length > 0 && data[0].userID === userEmail) {
            res.json(data)
        } else {
            res.redirect('/api/projects')
        }
    }
}