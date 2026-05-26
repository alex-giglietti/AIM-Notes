import supabase from '../lib/supabase'
import fs from 'fs'
import { parse } from 'cookie'

export default async function handler (req, res) {
    const cookies = parse(req.headers.cookie || '')
    if (!cookies.session) {
        res.redirect('index.html')
    }
    const session = JSON.parse(cookies.session)
    const userEmail = session.email
    if (!userEmail) {
        res.redirect('index.html')
    } else {
        const { id } = req.query
        const { data, error } = await supabase
        .from('AIM Notes')
        .select()
        .eq('id', `${id}`)
        console.log('data:', data)
        console.log('error:', error)
        console.log('userEmail:', userEmail)
        if (!error && data.length > 0 && data[0].userID === userEmail) {
            res.send(fs.readFileSync(process.cwd() + '/views/editor.html', 'utf8'))
        } else {
            res.send(fs.readFileSync(process.cwd() + '/views/projects.html', 'utf8'))
        }
    }
}