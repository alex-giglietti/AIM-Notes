import 'dotenv/config'
import { parse } from 'cookie'

export default function handler(req, res){
    const userName = parse(req.headers.cookie || '')
    const session = JSON.parse(userName.session)
    res.json(session)
}