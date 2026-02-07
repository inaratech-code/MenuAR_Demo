# MenuAR_Demo — WebAR Restaurant Menu Starter

Production-ready WebAR menu using **Next.js 14 (App Router)**, **React**, and **@google/model-viewer**. No mobile app, Unity, or designer required. Works in the browser on Android and iOS.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick a menu item, then open the AR page on a phone to use “View in AR”.

---

## How AR works

- **Android (Chrome):** Uses [Scene Viewer](https://developers.google.com/ar/develop/webxr/model-viewer) or WebXR. Tapping “View in AR” lets users place the 3D model in the real world.
- **iOS (Safari):** Uses [Quick Look](https://developer.apple.com/augmented-reality/quick-look/) (`.usdz` is optional; the viewer can use a `.glb` via the model-viewer flow).
- **Desktop:** The 3D model is shown in the page with camera controls and auto-rotate; “View in AR” is hidden or inactive when AR is not available.

The app uses the `<model-viewer>` web component from `@google/model-viewer`, which handles:

- 3D rendering (GLB/glTF)
- AR entry (Scene Viewer / Quick Look / WebXR)
- Camera controls and auto-rotate

Everything is client-side; no Unity, ARCore, or ARKit SDKs are used.

### View in AR doesn’t work?

**AR requires HTTPS.** If you open the app over `http://` (e.g. `http://192.168.1.79:3000` on your phone), “View in AR” will not work. Use one of these:

1. **Deploy to Vercel** (or any HTTPS host), then open the app on your phone using the `https://` URL.
2. **Local testing with HTTPS:** run `npx ngrok http 3000`, then on your phone open the **https** URL that ngrok prints. No signup needed for short sessions.

On the AR page, when you’re on HTTP, a yellow notice explains this and repeats the steps.

---

## Project structure

```
/app
  layout.js          # Root layout, meta tags
  page.js            # Home: list of menu items
  not-found.js       # 404 when slug is invalid
  /ar/[slug]
    page.js          # AR page for one menu item
/components
  ARViewer.js        # Client-only model-viewer wrapper
/lib
  arSupport.js       # AR support detection (HTTPS + device)
  modelViewerConfig.js # 3D/AR constants (scale, camera, lighting)
/data
  menu.json          # Menu items (slug, name, price, description, modelPath)
/public
  /models            # Put your .glb (and optionally .usdz) here
```

---

## Adding menu items

Edit `data/menu.json`. Each item needs:

| Field       | Description                                      |
|------------|---------------------------------------------------|
| `slug`     | URL segment, e.g. `"signature-burger"` → `/ar/signature-burger` |
| `name`     | Display name                                     |
| `price`    | e.g. `"$14.99"`                                  |
| `description` | Short text for the AR page                    |
| `modelPath`   | URL or path to the 3D model (see below)       |
| `imagePath` (optional) | Path to image for 2D fallback when AR is not supported |

Example:

```json
{
  "slug": "my-dish",
  "name": "My Dish",
  "price": "$9.99",
  "description": "Optional short description.",
  "modelPath": "/models/my-dish.glb"
}
```

Slugs should be URL-safe (lowercase, hyphens, no spaces).

---

## Adding 3D models

1. **Put files in `public/models/`**  
   Example: `public/models/sample.glb`.

2. **Reference them in `menu.json`** with a path starting with `/models/`:
   ```json
   "modelPath": "/models/sample.glb"
   ```

3. **Formats**
   - **GLB/glTF** – Supported everywhere. Prefer **GLB** (single file).
   - **USDZ (optional)** – For better Quick Look on iOS, you can add an `ios-src` in the AR viewer later; the starter uses `.glb` only.

4. **Keeping the starter runnable**  
   The included `menu.json` uses a demo model URL so the app works without any local files. To use your own model, add a `.glb` under `public/models/` and set `modelPath` to `"/models/yourfile.glb"` for that item.

5. **Optimizing for mobile and slow networks**  
   For low-end Android and fast loading: keep GLB file size small, use compressed textures (e.g. KTX2 or smaller PNG/JPG), and limit polygon count. The app lazy-loads the 3D model when the viewer scrolls into view, so the initial page stays light.

### 3D model authoring (consistency & AR)

For consistent scale, placement, and performance across items:

- **Coordinate system:** Use **Y-up** (glTF default). Models are placed on horizontal surfaces (tables, floor) with the app’s `ar-placement="floor"`.
- **Pivot:** Author models with the **pivot at the bottom center** of the object (e.g. base of a plate or cup). This avoids floating or sinking into the surface when placed in AR.
- **Scale:** Use **real-world units** (e.g. 1 unit = 1 meter). The app uses a fixed AR scale (`ar-scale-value`) so all items appear at a consistent size; author plates, drinks, and combos at sensible relative sizes.
- **Clean assets:** Remove unnecessary geometry, duplicate materials, or hidden meshes to improve load time and stability on low-end devices.

Configuration (camera, lighting, AR scale) is centralized in `lib/modelViewerConfig.js` so you can adjust framing and limits in one place.

---

## QR codes

Use QR codes so guests open the AR page for a specific dish.

1. **Base URL**  
   Production: `https://your-domain.com`  
   Local: `http://YOUR_LOCAL_IP:3000` (e.g. `http://192.168.1.10:3000`).

2. **AR page URL**
   - One item: `https://your-domain.com/ar/signature-burger`
   - Home: `https://your-domain.com`

3. **Generating QR codes**
   - [qrcode.re](https://goqr.me/api/doc/create-qr-code/), [qr.io](https://qr.io), or any “URL → QR code” tool.
   - Use the exact AR URL above as the “URL” or “Website” content.

4. **Testing on a phone**  
   Ensure the phone is on the same Wi‑Fi as your dev machine, use your machine’s local IP (e.g. `http://192.168.1.10:3000/ar/signature-burger`) as the QR target, then scan and open in the browser.

---

## Deploying on Vercel

1. Push the project to GitHub (or use the Vercel Git integration).
2. In [Vercel](https://vercel.com): **Add New** → **Project** → import this repo.
3. Leave **Framework Preset** as Next.js and **Root Directory** as `.` (or wherever the app lives).
4. No environment variables are required.
5. Deploy. Vercel will run `next build` and serve the app.

**Static assets:** Files in `public/` are served from the root. So `public/models/sample.glb` is available at `https://your-domain.com/models/sample.glb`, and `modelPath: "/models/sample.glb"` works in production.

---

## Tech stack

- **Next.js 14** (App Router)
- **React** (JavaScript)
- **@google/model-viewer** for 3D and AR
- Static menu data and static assets; no env vars required

---

## License

Use and modify as you like for your projects.
