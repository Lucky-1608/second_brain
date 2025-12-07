---
description: How to host and set up the Supabase database
---

# How to Host Your Database (Supabase)

Your application uses **Supabase** as the database provider. You don't need to "host" it yourself; Supabase manages it for you in the cloud.

Follow these steps to set it up:

## 1. Create a Supabase Project
1.  Go to [Supabase.com](https://supabase.com) and sign up/log in.
2.  Click **New Project**.
3.  Choose your organization, name the project (e.g., "Second Brain"), and set a database password.
4.  Choose a region close to you.
5.  Click **Create new project**.

## 2. Apply the Database Schema
Once your project is ready (it takes a minute):
1.  In your Supabase dashboard, go to the **SQL Editor** (icon looks like a terminal/code file on the left sidebar).
2.  Click **New query**.
3.  Open the `schema.sql` file in your local project (it's in the root folder).
4.  Copy **ALL** the text from `schema.sql`.
5.  Paste it into the Supabase SQL Editor.
6.  Click **Run** (bottom right).

**Success!** This creates all your tables (habits, tasks, goals, etc.) and security rules.

## 3. Connect Your App
You need to tell your app where the database is.
1.  In Supabase, go to **Project Settings** (gear icon) -> **API**.
2.  Find the **Project URL** and **anon public key**.
3.  Copy these values.
4.  **For Local Development**: Paste them into your `.env.local` file.
5.  **For Deployment (Render/Vercel)**: Add them as Environment Variables in your hosting dashboard.

That's it! Your database is now hosted and connected.
