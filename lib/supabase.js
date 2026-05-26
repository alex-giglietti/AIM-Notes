import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`, `${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`)

export default supabase