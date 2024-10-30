import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://pjgojihznuoxpwjbckun.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqZ29qaWh6bnVveHB3amJja3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjI5NjYsImV4cCI6MjA0NTQzODk2Nn0.PLThYi8xvaMoW_DiorHM6J8lIQp0Ik-EMhQmVStbTWg"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
