---
description: How to deploy the Second Brain app
---

# Deployment Guide

Since this is a **Next.js application with Server-Side Rendering (SSR)** (it uses Supabase Auth and dynamic data), you have two main options.

## Option 1: Vercel (Recommended)
Vercel is the creators of Next.js, and it offers the easiest deployment.

1.  Push your code to GitHub (you already did this).
2.  Go to [Vercel.com](https://vercel.com) and sign up/log in.
3.  Click **Add New...** -> **Project**.
4.  Import your `second_brain` repository.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Add `NEXT_PUBLIC_SUPABASE_URL` and your value.
    *   Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` and your value.
6.  Click **Deploy**.
    *   Vercel detects Next.js automatically. You don't need to configure build commands.

---

## Option 2: Render (Web Service)
**IMPORTANT**: You must deploy this as a **Web Service**, NOT a "Static Site".
If Render is asking for a "Publish Directory", you likely selected "Static Site". Go back and select **"Web Service"**.

1.  Go to [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Runtime**: Node
    *   **Build Command**: `npm run build`
    *   **Start Command**: `npm run start`
5.  **Environment Variables**:
    *   Click "Advanced" or "Environment".
    *   Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6.  Click **Create Web Service**.

### Why not "Static Site"?
Your app uses `cookies()` and dynamic data fetching (`createServerClient`), which requires a running Node.js server. A "Static Site" only hosts HTML/CSS/JS files and cannot run the server-side logic needed for your authentication and dashboard.
