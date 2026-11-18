# King of the Hill website

Static site for kingofthehill.co.uk, hosted on GitHub Pages. No build step: every file in this folder is the live site.

## First-time setup

1. Create a new **public** repository on GitHub (GitHub Pages on a free account only works with public repos).
2. Upload everything in this folder to the root of the `main` branch, including `CNAME` and `.nojekyll`.
   On a Mac, `.nojekyll` is hidden: press Cmd+Shift+. in Finder to show it. If it gets missed, the site still works.
3. Go to Settings → Pages → Build and deployment. Set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then click Save.
4. The custom domain box should fill in `kingofthehill.co.uk` from the `CNAME` file.
5. Update the DNS wherever the domain is managed:
   - Four **A** records on `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Four **AAAA** records on `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - **CNAME** `www` → `YOUR-GITHUB-USERNAME.github.io`
   - Delete the old A/CNAME records that point at Vercel or Netlify. Leave the MX and TXT records alone, because those run email.
6. When GitHub shows the DNS check has passed, tick **Enforce HTTPS**. The certificate can take up to a day.
7. Once the site loads from GitHub, remove the domain from Vercel.

### Previewing before you switch DNS

Delete `CNAME` from the repo, and the site will load at `https://YOUR-GITHUB-USERNAME.github.io/REPO-NAME/`. Every link is relative, so it works on that address too. Put `CNAME` back, or type the domain into Settings → Pages, when you're ready to go live.

## Updating the site

Edit a file on GitHub, or upload a replacement, and commit. Pages republishes automatically within a minute or two.

## How it fits together

| File | What it is |
|---|---|
| `index.html` | Homepage: all four trips, trip finder, comparison table |
| `learn-to-ski-tour-himalayas.html` | Learn to Ski Tour, £4,950 |
| `annapurna-ski-expedition.html` | Annapurna flagship, £13,500 (the original detailed page) |
| `mera-peak-ski-expedition.html` | Mera Peak, £8,950 |
| `himlung-himal-ski-expedition.html` | Himlung Himal, £11,950 |
| `404.html` | Page-not-found screen |
| `assets/` | Shared styles (`koth.css`) and scripts (`koth.js`, `finder.js`) |
| `images/` | All photos, as WebP |
| `sitemap.xml`, `robots.txt` | For Google. Submit the sitemap in Search Console once live |
| `CNAME` | Tells GitHub Pages the custom domain |
| `.nojekyll` | Tells GitHub to publish the files as they are |

- Clean URLs work on GitHub Pages: `/mera-peak-ski-expedition` serves `mera-peak-ski-expedition.html`.
- Old links such as `kingofthehill.co.uk/#booking` are forwarded to the Annapurna page by a small script in `index.html`.
- The contact form posts to formsubmit.co, which emails info@kingofthehill.co.uk. It works on any host.
- Photo credits sit at the bottom of each trip page and under the homepage trip cards. Several photos are CC BY-SA, so keep each credit for as long as its photo is used.
