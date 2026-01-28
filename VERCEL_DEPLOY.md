# Deploy MenuAR_Demo to Vercel

## Prerequisites

- GitHub account (repo already at [inaratech-code/MenuAR_Demo](https://github.com/inaratech-code/MenuAR_Demo))
- [Vercel account](https://vercel.com/signup) (free; can sign up with GitHub)

---

## Steps

### 1. Sign in to Vercel

Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.  
Vercel will ask for permission to access your repositories (you can limit it to the MenuAR_Demo repo if you prefer).

### 2. Import the project

1. Click **Add New…** → **Project**.
2. Find **inaratech-code/MenuAR_Demo** in the list (or search for `MenuAR_Demo`).
3. Click **Import** next to it.

### 3. Configure the project (usually leave defaults)

| Setting           | Use this                      |
|-------------------|-------------------------------|
| **Framework**     | Next.js (auto-detected)      |
| **Root Directory**| `.` (leave default)          |
| **Build Command** | `npm run build` or leave default |
| **Output Directory** | leave default              |
| **Install Command**  | `npm install` or leave default |

Do **not** add any environment variables unless you add them in code later.

### 4. Deploy

Click **Deploy**.  
Vercel will:

- Clone the repo
- Run `npm install` and `npm run build`
- Deploy the app and give you a URL like `https://menu-ar-demo-xxxx.vercel.app`

### 5. Use the live app

- Open the **Production** URL on your phone (HTTPS).
- Go to a menu item and tap **View in AR** — it will work because the site is served over HTTPS.

---

## After the first deploy

- **Automatic deploys:** Every push to `main` on GitHub will trigger a new deployment.
- **Preview URLs:** Pull requests get their own preview URLs.
- **Custom domain (optional):** In the project → **Settings** → **Domains**, add your own domain.

---

## If the build fails

1. In Vercel, open the project → **Deployments** → click the failed run → check the **Build Logs**.
2. Typical causes:
   - **Node version:** Vercel uses a recent Node by default; if you need a specific version, set it in **Settings** → **General** → **Node.js Version** (e.g. `18.x`), or add an `engines` field in `package.json`.
   - **Missing dependency:** Ensure every import is in `dependencies` in `package.json` (not only `devDependencies`).

---

## Quick link

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Import from GitHub](https://vercel.com/new)
