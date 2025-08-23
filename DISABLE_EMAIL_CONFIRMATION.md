# How to Disable Email Confirmation in Supabase

## The Problem
Users are being created in Supabase but profiles aren't being created automatically because email confirmation is still enabled in your Supabase project settings.

## Solution: Disable Email Confirmation in Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `mieffvhlbnkmihonbdaf`

### Step 2: Navigate to Authentication Settings
1. Go to **Authentication** in the left sidebar
2. Click on **Settings**

### Step 3: Disable Email Confirmation
1. Scroll down to find **"Enable email confirmations"**
2. **UNCHECK** this option ✗
3. Click **Save** at the bottom

### Step 4: Verify Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. You can disable the confirmation email template or leave it as is

## What This Does

- **Before**: Users sign up → Account created but unconfirmed → Profile trigger doesn't run → No profile in database
- **After**: Users sign up → Account created and immediately confirmed → Profile trigger runs → Profile created in database

## Testing the Fix

1. Try signing up with a new email address
2. Check the browser console for debug information
3. You should see logs about profile creation
4. Check your Supabase profiles table - the new user should appear

## Additional Notes

- The signup code now includes manual profile creation as a fallback
- Console logging will help you debug any remaining issues
- Once this is working, you can remove the debug logs if you want

## Database Setup Required

**IMPORTANT**: You need to run these SQL scripts in your Supabase dashboard to fix the profile creation:

### Step 1: Fix the Database Trigger
1. Go to **Database** → **SQL Editor** in Supabase dashboard
2. Run the contents of `scripts/fix_profile_trigger.sql`

### Step 2: Fix RLS Policies  
1. In the same SQL Editor
2. Run the contents of `scripts/fix_rls_policies.sql`

### Step 3: Disable Email Confirmation (as described above)
1. Go to **Authentication** → **Settings**
2. **UNCHECK** "Enable email confirmations"
3. Click **Save**

## What These Scripts Do

- **fix_profile_trigger.sql**: Creates a robust trigger that automatically creates profiles when users sign up
- **fix_rls_policies.sql**: Updates Row Level Security policies to allow the trigger to work properly

## The Root Cause

The 401/406 errors were happening because:
1. Email confirmation was enabled (users created as "unconfirmed")
2. RLS policies were too strict and blocked profile creation
3. The database trigger wasn't handling edge cases properly

These scripts fix all three issues.
