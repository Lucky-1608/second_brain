---
description: How to push the project to GitHub
---

# How to Push to GitHub

Since the project is already created, follow these steps to push it to GitHub.

1.  **Initialize Git (if not already done)**
    The project might already have git initialized. You can check by running:
    ```bash
    git status
    ```
    If it says "fatal: not a git repository", run:
    ```bash
    git init
    ```

2.  **Stage and Commit Files**
    ```bash
    git add .
    git commit -m "Initial commit: Second Brain app with Next.js and Supabase"
    ```

3.  **Create a Repository on GitHub**
    - Go to [GitHub.com](https://github.com) and log in.
    - Click the **+** icon in the top right and select **New repository**.
    - Name it `second-brain`.
    - Choose **Public** or **Private**.
    - **Do not** initialize with README, .gitignore, or License (we already have them).
    - Click **Create repository**.

4.  **Connect to Remote and Push**
    Copy the commands under "…or push an existing repository from the command line" from the GitHub page. They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/second-brain.git
    git branch -M main
    git push -u origin main
    ```

5.  **Done!**
    Refresh your GitHub repository page to see your code.
