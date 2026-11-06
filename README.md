# Sri Lanka – Travel With Sam

A static website (HTML/CSS/JS, no build step) for Sam's private day trips in Sri Lanka.

## Files
- `index.html`: all page content
- `assets/css/style.css`: theme (colours at the top in `:root`)
- `assets/js/main.js`: menu, scroll animations, booking form (WhatsApp / email)
- `assets/img/`: Sam's photo and car (cropped from the poster), favicon

## Contact details used
- WhatsApp / phone: +94 75 071 2100
- Email: sameera.astron@gmail.com
- Instagram: @Sri_lanka_Travel_with_Sam

To change them, search and replace `94750712100`, `sameera.astron@gmail.com` and `Sri_lanka_Travel_with_Sam`.

## Photos
- `sam.jpg` / `sam-about.jpg`: from Sam's portrait ("Mountain Forest Portrait at Dusk.png").
- `car.jpg` / `og-image.jpg`: from Sam's branded car image ("Sri Lanka Road Trip Adventure.png").
  `og-image.jpg` is the preview picture shown when the link is shared on WhatsApp/Facebook.
- To use a new photo, keep the same file name in `assets/img/` and roughly the same shape.

## Before going live
- Add genuine guest reviews in the "Reviews" section (template is in an HTML comment there).
- Scenic photos are loaded from Unsplash (free licence). They can be swapped for Sam's own trip photos.

## Run locally
```
python -m http.server 5612
```
Then open http://localhost:5612

## Hosting
Upload the folder to any static host: Netlify (drag and drop), GitHub Pages, Cloudflare Pages, or cPanel `public_html`.
