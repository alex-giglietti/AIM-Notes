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
        if(req.method == 'GET'){
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
        } else if (req.method == 'PUT') {
            const { id, projectData } = req.body
            const { error } = await supabase
            .from('AIM Notes')
            .update({ projectData: `${projectData}` })
            .eq('id', id)
            if(!error) res.status(200).end()
                else res.send(error)
        } else if (req.method == 'DELETE') {
            const { id } = req.query
            const response = await supabase
            .from('AIM Notes')
            .delete()
            .eq('id', id)
            if (!response.error) {
                res.status(200).end()
            } else res.send(response.error)
        }
        
    }
}
