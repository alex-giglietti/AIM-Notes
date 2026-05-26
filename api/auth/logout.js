
export default function handler (req, res) {
    res.setHeader('Set-Cookie', `session=; HttpOnly; Path=/; Max-Age=0`)
    res.redirect('/index.html')
}