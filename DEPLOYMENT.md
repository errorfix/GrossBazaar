# Deploying Gross-Bazaar to Vercel on grossbazaar.com

This guide takes the site from this folder to a live, HTTPS-secured site at
**https://www.grossbazaar.com**, with `grossbazaar.com` redirecting to it.

> **Why `www` as the main address?** The site's SEO settings (canonical URL, Open
> Graph, structured data) already point to `https://www.grossbazaar.com` in
> `src/config/site.ts`. Keep the Vercel primary domain and that setting the same.
> If you would rather use the bare `grossbazaar.com`, change both.

---

## 0. Before you start

You need:

- A **GitHub** account (Vercel deploys automatically from it).
- Your **Vercel** account, logged in.
- Access to the **DNS settings** wherever you bought `grossbazaar.com`
  (GoDaddy, Hostinger, Namecheap, BigRock, Cloudflare, etc.).
- Node.js 20.9 or newer locally (Next.js 16 requirement). Vercel uses a compatible version by default.

---

## 1. Fill in the launch details (do this first)

Contact and business details live in `src/config/site.ts`. Already filled in:

| Field | Value | Shown in |
| --- | --- | --- |
| `contact.email` | `info@grossbazaar.com` | Contact section, footer, Privacy Policy |
| `contact.phone` | `+91 78276 24501` | Contact section, footer |
| `contact.whatsapp` | `917827624501` | Contact section (opens WhatsApp chat) |
| `legal.entityName` | `Gross Bazaar` | Footer |
| `legal.incubatedAt` | `Lingaya's Vidyapeeth` | Footer |

Still to add when available (each row stays **hidden** until filled):

| Field | Example |
| --- | --- |
| `legal.udyamnumber` | `"UDYAM-HR-00-0000000"` |
| `legal.registeredOffice` | Registered office address, if you have one |
| `legal.cin` | CIN / LLPIN, if you incorporate later |

Also:

- [ ] Have a lawyer review and complete **`src/app/privacy/page.tsx`** and **`src/app/terms/page.tsx`**.
      They are marked as drafts on the site. For India, the Privacy Policy should cover the
      Digital Personal Data Protection Act, 2023.
- [ ] Remove the draft banner in `src/components/LegalPage.tsx` once the legal text is final.

Check that it still builds:

```bash
npm run build
```

---

## 2. Put the project on GitHub

This folder is not a git repository yet.

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Gross-Bazaar website"
```

Create a **private** repository on GitHub named `gross-bazaar-site` (github.com → New repository,
leave "Add README" unticked), then connect and push. Replace `YOUR-USERNAME`:

```bash
git remote add origin https://github.com/YOUR-USERNAME/gross-bazaar-site.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

> Or, with the GitHub CLI already installed on this machine, one command creates the repo and pushes:
>
> ```bash
> gh repo create gross-bazaar-site --private --source . --push
> ```

---

## 3. Import the project into Vercel

1. Go to **vercel.com → Add New… → Project**.
2. Choose **Import Git Repository** and pick `gross-bazaar-site`. Grant Vercel access to the repo if asked.
3. Vercel detects **Next.js** automatically. Leave the defaults:
   - Framework Preset: **Next.js**
   - Build Command: `next build` (default)
   - Output Directory: default
   - Install Command: `npm install` (default)
4. Open **Environment Variables** and add (step 5 explains the second one):

   | Name | Value | Environments |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.grossbazaar.com` | Production |
   | `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | your form endpoint URL | Production, Preview |

5. Click **Deploy**. After a minute or two you get a working URL like
   `gross-bazaar-site.vercel.app`. Open it and check the site.

From now on, every `git push` to `main` redeploys production automatically, and every
other branch or pull request gets its own preview URL.

---

## 4. Connect grossbazaar.com

### 4a. Add the domains in Vercel

1. Vercel → your project → **Settings → Domains**.
2. Add **`www.grossbazaar.com`**.
3. Add **`grossbazaar.com`**. When Vercel asks, choose **"Redirect to www.grossbazaar.com"**
   (permanent redirect, 308).
4. Vercel now shows each domain as **Invalid Configuration**, together with the exact DNS
   records it needs. Keep this page open.

### 4b. Add the DNS records at your domain registrar

Log in where you bought the domain → **DNS / Manage DNS** for `grossbazaar.com`, and add the
records **exactly as Vercel displays them**. They normally look like this:

| Type | Name / Host | Value / Points to | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `76.76.21.21` | Auto / 1 hour |
| `CNAME` | `www` | `cname.vercel-dns.com` | Auto / 1 hour |

> ⚠️ Vercel sometimes shows **project-specific values** (a different IP or a CNAME like
> `xxxxxxxx.vercel-dns-0xx.com`). If what you see in Vercel differs from the table above,
> **use Vercel's values.**

Also:

- **Delete any old conflicting records** for `@` and `www`: other `A` records,
  `AAAA` records, or a `CNAME` for `www` pointing at a parking page or old host.
- **Do not touch `MX` or `TXT` records.** Those run your email (for example Google Workspace
  or Zoho Mail). Changing them can break email.
- **Using Cloudflare?** Set both records to **DNS only** (grey cloud) so Vercel can issue the
  SSL certificate.

*Alternative:* instead of adding records, you can change the domain's **nameservers** to
Vercel's (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`). Only do this if your email records
are moved into Vercel DNS too. The record method above is safer if you already use email on
this domain.

### 4c. Wait for it to go live

- DNS usually updates in **5–30 minutes**, occasionally up to 48 hours.
- When both domains show **Valid Configuration** in Vercel, the **SSL certificate is issued
  automatically**. There is nothing to buy or install.
- You can check propagation at <https://dnschecker.org> (search `grossbazaar.com`, type `A`).

---

## 5. Enquiry forms configuration

The enquiry forms are configured to deliver submissions to **`info@grossbazaar.com`** using FormSubmit:

- **Default Endpoint:** `https://formsubmit.co/ajax/info@grossbazaar.com` (configured in `src/config/site.ts`).
- **First-time Activation:** Submit a test enquiry on the site. FormSubmit will immediately send an activation email to `info@grossbazaar.com`. Click the **"Activate Form"** button in that email to confirm. All subsequent submissions will be delivered instantly to your inbox.
- **Formspree or Custom Endpoint (Optional):** If you prefer Formspree or another form service, set `NEXT_PUBLIC_ENQUIRY_ENDPOINT` to your custom endpoint URL in Vercel (**Settings → Environment Variables**) and redeploy.

---

## 6. Launch checklist

Run through this on the live domain:

- [ ] `https://www.grossbazaar.com` loads with a padlock (HTTPS).
- [ ] `http://grossbazaar.com` and `https://grossbazaar.com` both redirect to `https://www.grossbazaar.com`.
- [ ] The intro loader plays once, then the site scrolls smoothly.
- [ ] The before/after scene animates when scrolling, on both desktop and phone.
- [ ] Every nav link and every "Discuss Your Inventory" / "Source Bulk Inventory" button opens the correct form.
- [ ] A test enquiry arrives by email (not demonstration mode).
- [ ] The footer shows real legal details, not "To be confirmed".
- [ ] Privacy Policy and Terms pages open and are final.
- [ ] Link preview: paste `https://www.grossbazaar.com` into WhatsApp or LinkedIn and check the title, description and image.
- [ ] Phone check: the sticky "Discuss inventory | Source stock" bar appears after the hero.

## 7. After launch (recommended)

- **Google Search Console:** search.google.com/search-console → Add property → Domain
  `grossbazaar.com`. Verify with the `TXT` record it gives you (add it at your registrar
  alongside the other records). This lets Google index the site and reports any issues.
- **Vercel Analytics** (optional): Project → Analytics → Enable. Privacy-friendly visitor counts, with no cookie banner needed.
- **Updating the site:** edit, then `git add .` → `git commit -m "..."` → `git push`.
  Vercel redeploys within a minute or two. Use **Deployments → Promote/Rollback** to instantly
  restore a previous version if something goes wrong.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Domain stuck on "Invalid Configuration" | Recheck the record values against Vercel's Domains page, remove old `A`/`AAAA`/`CNAME` records for `@`/`www`, then wait 30 minutes. |
| "Too many redirects" | Usually Cloudflare proxy: switch the records to **DNS only** (grey cloud), or set Cloudflare SSL mode to **Full**. |
| Forms still say "Demonstration mode" | `NEXT_PUBLIC_ENQUIRY_ENDPOINT` is missing in the **Production** environment, or the site wasn't redeployed after adding it. |
| Forms show "We couldn't send your enquiry" | The endpoint returned an error: check the form service's dashboard and that it accepts JSON posts. |
| Link previews show the old `vercel.app` address | Make sure `NEXT_PUBLIC_SITE_URL` is `https://www.grossbazaar.com` in Production and redeploy. |
| Build fails on Vercel but works locally | Open the failed deployment's **Build Logs**. Run `npm run build` locally to reproduce it. |
