# AURELLE® — Editorial skincare storefront

An original, responsive, frontend-only ecommerce portfolio concept. Created as an independent skincare brand study, not a clone of another website.

## Preview locally

```bash
cd aurelle-store
python3 -m http.server 4173
```

Visit `http://localhost:4173/`.

## Deploy to Netlify or Vercel

- **Netlify:** Drag the `aurelle-store` folder into Netlify's deploy area or connect its Git repository. Publish directory: `.`. Build command: none.
- **Vercel:** Import the directory as a project. Framework preset: **Other**. Build command: none. Output directory: `.`.

This site is written in semantic HTML, custom CSS, and plain JavaScript with no runtime packages. The product imagery is bundled locally. Typography uses Google Fonts with system fallbacks.

## Implemented frontend behaviors

- Fully responsive editorial homepage and mobile navigation
- Filterable collection with four original SVG product illustrations
- Product quick-view panels with descriptions, ingredients, and usage
- Functional shopping bag with quantity controls, subtotal, and localStorage persistence
- Search across product names and descriptions
- Two-step routine finder with personalized product suggestions
- Two readable editorial article dialogs
- Accessible native dialogs, clear focus states, reduced-motion support
- Locally validated newsletter form (demo only; does **not** collect/store addresses)

## Demo limitations

- **No checkout or payments.** The checkout button displays a demo message.
- **No database, accounts, order persistence, inventory, or shipping service.** The cart is stored in the browser only.
- **No newsletter integration.** Email is not stored or transmitted.
- **No verified product claims.** Product names, descriptions, pricing and brand are fictional concept data. Replace before using for a real business.
- The model/beauty photographs are cropped from the earlier AURELLE concept mockup created in this design exercise; they are illustrative concept artwork, not authentic product campaign photography.

## Structure

- `index.html`: semantic page sections and accessible dialogs
- `styles.css`: art direction, responsive layouts, animations, typography
- `app.js`: products, collection filtering, search, cart, routine finder, editorial content
- `assets/`: hero/editorial artwork and bespoke packaging SVG illustrations
- `netlify.toml`, `vercel.json`: ready-to-deploy configuration

## Suggested upgrades for production

Connect a real catalog, inventory, ecommerce checkout provider (Stripe/Shopify), analytics, privacy/compliance, hosting domain, email consent and confirmation, original licensed campaign photography, and brand/product legal review.

© 2026 AURELLE, original portfolio concept.
