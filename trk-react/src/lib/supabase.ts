import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export interface Certification {
  id: string; issuer: string; name: string; cert_number: string
  issued_date: string; expiry_date?: string; skill_domain: string
  sector: string; badge_url?: string; pdf_url?: string; verify_url?: string; created_at: string
}
export interface GalleryItem {
  id: string; title: string; description?: string; image_url: string
  sector: string; item_type: string; created_at: string
}
