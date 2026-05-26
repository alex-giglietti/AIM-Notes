import supabase from '../lib/supabase.js'
import { parse } from 'cookie'
import fs from 'fs'

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
        const { data, error } = await supabase
        .from('AIM Notes')
        .select()
        .eq('userID', `${userEmail}`)
        if (!error) {
            res.send(fs.readFileSync(process.cwd() + '/views/projects.html', 'utf8'))
        } else {
            res.redirect('/index.html')
        }
    }
}
