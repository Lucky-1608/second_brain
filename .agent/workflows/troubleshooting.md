---
description: Troubleshooting deployment issues
---

# Troubleshooting Deployment

If your deployment is failing, please check the following:

## 1. Check Build Logs
In your Render or Vercel dashboard, click on the failed deployment and look at the **Logs**.
*   **Common Error**: `Type error: Property '...' does not exist on type 'never'`
    *   **Fix**: We already fixed this in the code, but make sure you pushed the latest changes (`git push origin main`).
*   **Common Error**: `Error: @supabase/ssr: Your project's URL and API key are required`
    *   **Fix**: You MUST add the Environment Variables in the Render/Vercel dashboard.

## 2. Verify Environment Variables
You need to add these two variables in your hosting provider's settings:
*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**On Render:**
1.  Go to your Web Service.
2.  Click **Environment**.
3.  Add the variables there.

**On Vercel:**
1.  Go to Settings -> Environment Variables.
2.  Add them there.

## 3. Verify "Web Service" (Render only)
If you are using Render, double-check that you created a **Web Service**.
*   If you see "Publish Directory" in the settings, you created a **Static Site** by mistake.
*   **Fix**: Delete the Static Site and create a **New Web Service**.

## 4. Build Command
Ensure your build settings are correct:
*   **Build Command**: `npm run build`
*   **Start Command**: `npm run start`
