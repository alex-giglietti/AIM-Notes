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
        if(req.method == 'GET') {
                const { data, error } = await supabase
                .from('AIM Notes')
                .select()
                .eq('userID', `${userEmail}`)

                if (!error) {
                    res.json(data)
                } else {
                    res.send(`Error ${error}`)
                }
        } else if(req.method == 'POST') {
            const { projectName } = req.body
            const { data, error } = await supabase
            .from('AIM Notes')
            .insert({ projectName: projectName, userID: userEmail})
            .select()
            const { id } = data[0]
            if (!error) res.redirect(`/api/editor?id=${id}`)
                else res.redirect('/api/projects')
        }
    }
}