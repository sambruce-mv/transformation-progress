# Programs Page — Build Spec
## Source reference screenshots
- `_ref/programs-01.jpg` — top of page: header, Browse by Language, Hot in Malaysia, Continue programs, Author collections
- `_ref/programs-02.jpg` — Browse by Categories grid (Mind/Soul/Body/Entrepreneurship) + Mind horizontal section
- `_ref/programs-03.jpg` — Entrepreneurship + Career Growth horizontal sections
- `_ref/programs-04.jpg` — Relationships + New releases + Coming soon (start)
- `_ref/programs-05.jpg` — Body + Soul + Entrepreneurship sections
- `_ref/programs-06.jpg` — Coming soon (Bold Conversations full card with description)

## Task
Rewrite `src/screens/ProgramsScreen.tsx` and create supporting components to match the real Mindvalley app as shown in the screenshots.

## Full page structure (top → bottom, Discover tab)

### 1. Header (already in app — keep as-is)
- User avatar circle (top left)
- Search + Bell icons (top right)

### 2. Tab bar
- Tabs: Discover (active, white underline) | Coach | Recordings | Courses
- Active tab: white text + white 2px underline
- Inactive: grey text, no underline
- Only implement Discover tab content for now (others can be empty placeholder)

### 3. Browse by Language
- Label: "Browse by language"
- Pill: "English (EN)" with × to dismiss — just a static display pill, no functionality needed

### 4. Hot in Malaysia
- Section header: globe icon (Ionicons "earth-outline") + "Hot in Malaysia" text + NO "See all"
- Horizontal ScrollView of ranked program cards
- **HotRankCard**: 
  - Large rank number (e.g. "1", "2", "3") on left — bold, ~48px, white, slight opacity
  - Program cover image (square-ish ~140×140) with rounded corners
  - Below image: program title (white, ~13px bold), author name (grey, ~11px)
  - Cards are compact, side by side

### 5. Continue programs
- Section header: "Continue programs" + "See all" (white, right)
- Use existing `ContinueProgramCard` component
- Horizontal ScrollView

### 6. Author collections
- Section header: "Author collections" — brief horizontal scroll of author avatar + name cards
- Simple circular avatar + author name below, horizontal scroll
- Use real author photos from `assets/authors/` if available

### 7. Browse by Categories
- Section header: "Browse by Categories" (white, bold, ~16px)
- **2×2 grid** (NOT a horizontal scroll) of category tiles
- Each tile (~half screen width, ~180px tall), rounded corners ~12px
- Large artistic image fills the tile
- Category name in white bold (~20px) at bottom-left with padding
- Categories (with colour-coded icons used elsewhere):
  - Mind (blue/cyan), Soul (teal), Body (orange), Entrepreneurship (blue-purple)
  - Show 4 tiles in the 2×2 grid

### 8. Per-category horizontal sections (one per category)
Repeat this pattern for: **Mind, Body, Soul, Relationships, Entrepreneurship, Career Growth**

- Section header row:
  - Small coloured icon (use Ionicons or colored dot) + category name in white (~15px bold) on left
  - "See all" in white on right
- Horizontal ScrollView of **ProgramCard**:
  - Cover image (~220×140px), rounded corners ~10px, Mindvalley chevron watermark (small, bottom-center — just the MV logo if available, else skip)
  - Program title (white, 13px bold, 2 lines max) below image
  - Author name (grey #999, 12px)
  - Enrolled count row: person-group icon + enrolled number + " · " + lesson count (grey, 11px)
  - Card width ~220px, gap between cards ~12px

### 9. New releases
- Section header: "New releases" (no "See all")
- Horizontal ScrollView of **NewReleaseCard**:
  - Wider card (~280px wide, ~160px tall), image fills entire card (author photo style — shows instructor with program name text overlay)
  - Program title bold white overlay text (bottom-left)
  - Author name · lesson count (small white text below title on overlay)
  - Rounded corners ~12px

### 10. Coming soon
- Section header: "Coming soon"
- Vertical list (NOT horizontal scroll) — shows 1 card at full width
- **ComingSoonCard**:
  - Cover image full width, ~220px tall, rounded corners
  - Program title (white, bold, ~15px)
  - Author name (grey)
  - Lesson count (grey)
  - Description text (grey, ~13px, 3 lines, then truncated)
  - NO enrolled count (not released yet)

---

## Mock data to add to `src/data/mockData.ts`

### hotInMalaysia (array of 5 programs)
```ts
{ id, rank, title, author, coverImage }
```
Use programs: 
1. The 6 Phase Meditation - Vishen Lakhiani
2. Superbrain - Jim Kwik
3. Duality - Jeffrey Allen
4. The M Word - Emily Fletcher
5. Be Extraordinary - Vishen Lakhiani

Use existing `coverImages` map values where available.

### programsByCategory
A map of category → array of programs:
```ts
{
  Mind: [...],
  Body: [...],
  Soul: [...],
  Relationships: [...],
  Entrepreneurship: [...],
  CareerGrowth: [...],
}
```
Each entry: `{ id, title, author, coverImage, enrolledCount, lessonCount }`

Use real program names and authors from the screenshots:
- Mind: The Champion Mindset (Florencia Andres), Be Extraordinary (Vishen Lakhiani)
- Body: Modern Qi Gong (Lee Holden), Total Transformation Training (Christine Bullock)
- Soul: Higher Self Activation (Ariya Lorenz), Unlimited Abundance (Christie Marie Sheldon)
- Relationships: The Energies of Love (Donna Eden & David Feinstein), Calling in The One (Katherine Woodward Thomas)
- Entrepreneurship: Negotiate with Confidence (Kwame Christian, 2370 enrolled, 14 lessons), Building a... (Jeffrey Perlman)
- CareerGrowth: The Stage Effect (Eric Edmeades, 15469 enrolled, 21 lessons), The Maestro (Itay Talgam)

Use Unsplash placeholders for cover images not in coverImages map.

### newReleases (array of 3)
`{ id, title, author, lessonCount, image }` — use author photos from `assets/authors/` as the card image
- Negotiate with Confidence — Kwame Christian, 14 lessons, image: Unsplash photo of Kwame or professional speaker
- The Maestro to Leadership — Itay Talgam, image: conductor/orchestra Unsplash

### comingSoon (array of 2)
`{ id, title, author, lessonCount, description, coverImage }`
- Bold Conversations — Vernā Myers, 11 lessons, description: "You've felt it before: the moment someone says something offensive, the room goes quiet, and nobody does anything. Not because they don't care, but because nobody taught them how. This..."

### authorCollections (array of 6)
`{ id, name, avatar }` — use `assets/authors/` images
- Vishen Lakhiani, Jim Kwik, Emily Fletcher, Jeffrey Allen, Marisa Peer, Marie Diamond

---

## Category icons & colours
```
Mind: 'diamond-outline', #4FC3F7 (cyan-blue)
Soul: 'radio-button-on-outline', #4DB6AC (teal)
Body: 'hexagon-outline', #FF7043 (orange)
Entrepreneurship: 'close-outline' or star, #7986CB (indigo)
Relationships: 'heart-outline', #F06292 (pink)
CareerGrowth: 'trending-up-outline', #FFB300 (amber)
```

---

## Styling rules
- Background: #0a0a0a (near black)
- Section header font: 15px, fontWeight '700', color #fff
- "See all" font: 13px, color #fff
- Card title: 13px bold white
- Card meta (author/enrolled): 12px #999
- Horizontal section padding: paddingHorizontal 16, gap 12 between cards
- Section spacing: marginBottom 28 between sections
- All images: borderRadius 10
- Category grid gap: 8px between tiles

---

## Files to create/modify
1. **MODIFY** `src/data/mockData.ts` — add hotInMalaysia, programsByCategory, newReleases, comingSoon, authorCollections
2. **MODIFY** `src/screens/ProgramsScreen.tsx` — full rewrite
3. **CREATE** `src/components/ProgramCard.tsx` — standard program card
4. **CREATE** `src/components/HotRankCard.tsx` — ranked card for Hot in Malaysia
5. **CREATE** `src/components/NewReleaseCard.tsx` — wide author-photo card
6. **CREATE** `src/components/ComingSoonCard.tsx` — full-width card with description
7. **CREATE** `src/components/CategoryTile.tsx` — square category grid tile

## Important
- Keep existing `ContinueProgramCard`, `Header`, `Section`, `FavoriteCard` components unchanged
- No TypeScript strict errors
- All new components should be self-contained with StyleSheet.create
- Use `require()` for local assets, `{ uri: string }` for URLs — handle both with `typeof x === 'string' ? { uri: x } : x as any`
- Run NO build/test commands — just write the files
