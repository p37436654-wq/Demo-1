# Mahindra — Built Beyond | Website plan

## Product and implementation

Create a responsive, premium Mahindra passenger-vehicle showroom focused on the current India-market SUV/eSUV line-up. The home page begins with an immersive particle assembly, moves into a brand story and a searchable, filterable catalogue, then a distinct electric interlude and dealer/test-drive actions. Each model has a dedicated information page with seating, price, powertrain, reported efficiency/range and its basis, power, torque, transmission, drive type, dimensions, safety, variants, colour names, features and linked sources. A comparison route presents user-selected models side by side. Model facts are a typed, transparent dataset, not generated dynamically. The scope excludes Mahindra commercial pick-ups; an official model link and update caveat establish the live source of truth for variant availability and prices.

The website runs as a static React/Vite client application with React Router for `/`, `/model/:slug`, and `/compare`; Framer Motion for authored transitions; Lucide icons; and CSS for the editorial responsive layout. There is no account, server, or database. Compare selection lives in browser local storage. Real model photography is mapped to catalogue cards, detail heroes and a small exterior gallery. Uploaded media is served from Webdev project storage. A canvas reads pixels from real Thar ROXX photography and choreographs floating colored particles into the vehicle silhouette, then gently loosens the formation. A reduced-motion setting replaces that loop with still imagery and disables transition-heavy motion. Product figures are labelled as reported, claimed or indicative and linked to their sources.

### Project structure

- `src/App.tsx` — route layout, catalogue filters, home page, detail pages, compare flow and short-lived notices.
- `src/components/` — brand mark, header/footer, the particle hero, reveal wrapper, product cards, comparison tray, model gallery and specification tiles.
- `src/data/types.ts`, `src/data/models.ts` — typed catalogue facts, model media, variants and source links.
- `src/styles.css` — global visual tokens, responsive layout, reduced-motion behavior and authored UI motion.
- `public/manus-routes.json`, `public/mahindra-mark.svg` — page-route manifest and site favicon.
- `docs/MODEL_RESEARCH.md` — model research and photo provenance.

## Design system

**Design movement.** Contemporary automotive neofuturism meets independent motoring-journal editorial design: sculptural darkness, precise technical labels and one expressive serif voice.

**Core principles.** (1) Let the machine be the focal point, not the interface. (2) Show the memorable story first and make hard facts easy to scan. (3) Make discovery tactile, visual and reversible. (4) Keep every important motion optional for reduced-motion visitors.

**Color philosophy.** Charcoal grounds the experience in engineering and night-driving focus; chalk/stone editorial surfaces contrast the vehicle pages without feeling sterile; copper vermilion is the ownable signal for power, motion, current focus and key interaction. Use color sparingly so photographed paint stays the richer color story.

**Layout paradigm.** A long-form, asymmetric scroll narrative rather than a centered dashboard: the vehicle is visually weighted to one side while the editorial headline opens on the other; a narrow technical rail returns throughout. The lineup uses a disciplined catalogue grid as an ordering device, then detail routes return to an offset, magazine-like two-column layout.

**Signature elements.** Tiny copper hairlines and precision numbering frame the model specs. A rising peak emblem and a rotating star/celestial “further” motif tie routes together. The hero's own particles are sampled from a real Thar ROXX photo, scattered into open space and magnetically drawn into the car.

**Interaction philosophy.** Browsing should feel like curating a route: filter, inspect a model, and add or remove up to three vehicles with immediate feedback. Search and filters remain clearly labelled, sort and compare state stays persistent locally, and official purchase/test-drive actions lead directly to Mahindra's own page. No irreversible in-site action is introduced.

**Animation.** The hero reassembles about every eighteen seconds with a seven-second formation and a brief drifting release. Keep particles subtle and low-density. Use short viewport reveals for editorial blocks, restrained card-image scale, and a low-amplitude ambient electric glow. Avoid aggressive parallax, high-flashing contrast and perpetual movement except for the intentionally paced hero motif. Respect `prefers-reduced-motion`.

**Typography system.** Manrope carries the large, close-tracked sans headlines and technical numbers; DM Sans supports navigation, metadata and paragraphs; Georgia italic adds the hand-set contrast on emphasized copy. Headers use tight line height and tracking; small labels use uppercase spacing rather than bold body text.

**Brand essence.** A considered home for the Mahindra SUV traveller — the place that turns product research into the anticipation of going somewhere further. Three adjectives: bold, grounded, curious.

**Brand voice.** Compact, knowing, invitational; give the road a human point of view and keep technical facts direct. Example lines: “A world of purpose-built SUVs. One instinct: go further.” and “It’s not the road. It’s the reason to go.”

**Wordmark and logo.** Use a custom, rising line monogram inspired by three mountain/road crests, then a tightly tracked wordmark with a small spaced “BUILT BEYOND” lock-up. The monogram is also reduced to a square favicon, drawn in a deliberate stroke rather than a default font glyph.

**Signature brand color.** Copper vermilion `#C8543D` — the unmistakable “signal” for energy, forward motion and meaningful decisions.
