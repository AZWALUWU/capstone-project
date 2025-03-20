# Sehatica - Healthcare Web Application

## Updating Supabase API Keys

To update your Supabase API keys, follow these steps:

1. **Get your new API keys from Supabase**:
   - Log in to your Supabase dashboard: https://app.supabase.com
   - Select your project
   - Go to Project Settings > API
   - Copy the following values:
     - Project URL
     - anon public key
     - service_role key (for admin operations)
     - JWT Secret (from Project Settings > API > JWT Settings)

2. **Update your environment variables**:
   - Open or create `.env.local` in your project root
   - Update the following variables:

