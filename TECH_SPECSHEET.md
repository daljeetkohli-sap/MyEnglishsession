# Aussie English Daily Quest Tech Spec Sheet

## Product Summary

Aussie English Daily Quest is a lightweight, offline-first React web app for practising practical Australian English through daily vocabulary, quick game mechanics, and real-life task prompts.

The app is intended for personal daily use, with low data consumption, local progress tracking, and a polished mobile-friendly interface.

## Current Release

Version: MVP live app  
Primary branch: `main`  
Repository: `https://github.com/daljeetkohli-sap/MyEnglishsession`  
Live target: `https://daljeetkohli-sap.github.io/MyEnglishsession/`  
Local dev path: `http://127.0.0.1:5188/`

## Current Features

### Offline-First App Shell

- PWA manifest configured in `public/manifest.webmanifest`
- Service worker configured in `public/sw.js`
- App shell caches core files for offline access
- No remote images, remote fonts, external APIs, or streaming content required
- User progress is stored locally on the device with `localStorage`

### Daily Vocabulary Quest

- Shows a focused set of three vocabulary items
- Default daily mix rotates once per calendar day
- Tracks completed words for the day
- Awards points for completed vocabulary learning actions
- Supports alternate vocabulary sources through section-level input controls

### Meaning Match Mini Game

- Presents one active word with an example sentence
- User selects the correct meaning from available choices
- Correct answers increase daily progress
- Feedback updates immediately after each attempt
- Game input source can be controlled independently from other sections

### Real-Life Task Practice

- Gives practical scenarios such as coffee ordering, work check-ins, errands, and social conversations
- Provides sentence starters to reduce friction
- User writes a complete sentence and completes the task
- Completing a task advances to the next scenario
- Task source can be controlled independently from vocabulary and game content

### Section-Level Input Controls

Each major section can choose what drives its content:

- Daily Quest input
- Meaning Match input
- Real-Life Task input
- Progress input

Available sources:

- Daily mix
- Work
- Social
- Errands
- Confidence
- Custom focus

Custom focus accepts comma-separated user topics such as `meeting, shopping, phone call`.

### End-User Walkthrough

- Hero button: `Walk me through`
- Five-step guided flow:
  - Choose your focus
  - Pick a word
  - Play the match
  - Write one real sentence
  - Check progress
- Users can move through steps, start learning, or skip
- Walkthrough state is saved locally

### Progress and Motivation

- Points system
- Level system
- Daily completion count
- Level progress meter
- Active source summary
- Offline/online status indicator

### Deployment

- GitHub Pages deployment workflow in `.github/workflows/deploy-pages.yml`
- Vite base path is dynamic:
  - Local dev uses `/`
  - GitHub Actions production build uses `/MyEnglishsession/`
- Production build generated with `npm run build`
- Build output remains small for low data consumption

## Commit Feature Log

### Pending commit - Make walkthrough button restart guide

- Updated the `Walk me through` button so it restarts at step 1 every time
- Added automatic scrolling to the walkthrough panel when the guide opens or advances
- Added focus styling and scroll margin for the walkthrough panel
- Disabled service-worker registration in local development to avoid stale cached UI during testing
- Improves end-user clarity when the guide appears below the hero area

### Pending commit - Harden local load against white page failures

- Sanitized saved `localStorage` state before using it in React state
- Added safe fallbacks for walkthrough steps, scenarios, section inputs, and selected words
- Unregisters service workers automatically during local development to clear stale cached app shells
- Reduces the chance of blank-page failures from old cached state or prior local service-worker scopes

### Latest commit - Fix local dev base path

- Updated Vite base-path configuration so local dev runs at `http://127.0.0.1:5188/`
- Preserved GitHub Pages production path at `/MyEnglishsession/` during GitHub Actions builds
- Verified local HTML points to `/src/main.jsx`
- Verified production GitHub Pages build points to `/MyEnglishsession/assets/...`

### `a63dd20` - Add end user walkthrough

- Added the `Walk me through` guided user flow
- Added a persistent walkthrough state
- Added walkthrough styles and responsive layout support
- Verified production build

### `8611087` - Add section input controls

- Added per-section input source controls
- Added category-driven sources for Work, Social, Errands, and Confidence
- Added Custom focus source with comma-separated user topics
- Added source-specific scenario pools
- Removed empty GitHub workflow file
- Verified production build

### `f28ddf8` - Add GitHub Pages deployment

- Added GitHub Pages Actions workflow
- Configured Vite base path for the live repository route
- Updated service worker registration for the GitHub Pages subpath
- Updated manifest and service worker paths for subpath deployment
- Verified production build

### `23c4ec5` - Ignore local dev logs

- Updated `.gitignore` to ignore local log files

### `e9bc650` - Build offline vocabulary quest app

- Replaced placeholder app with the full vocabulary quest experience
- Added vocabulary data, daily quest flow, meaning match game, real-life tasks, and progress tracking
- Added app styling
- Added PWA manifest, icon, and service worker
- Added README documentation
- Verified production build

## Technical Architecture

### Frontend

- React 18
- Vite 5
- Plain CSS
- No backend dependency
- No runtime API dependency

### State

Stored in browser `localStorage` under:

```text
aussieEnglishGameProgressV1
```

Stored values include:

- Points
- Completed daily words
- Scenario index
- Section input selections
- Custom focus text
- Walkthrough visibility and current step

### Offline Strategy

- Cache core app shell files on service worker install
- Serve cached GET requests when available
- Fall back to cached `index.html` for navigation requests when offline
- Keep all learning data bundled in the app to avoid network dependency

### Data Consumption Strategy

- No external media requests
- No external font downloads
- No AI/API calls in the MVP
- Small production bundle
- Browser cache and service worker cache reduce repeat loading cost

## Known Limitations

- Learning content is bundled statically in the app
- Progress is local to the current browser and device
- No user account or cloud sync
- No speech recognition yet
- No spaced repetition algorithm yet
- No admin/editor interface for adding vocabulary without code changes

## Future Planned Releases

### Release 1.1 - Practice Quality

- Add spaced repetition scheduling
- Add difficulty levels for each word
- Add review mode for missed meanings
- Add daily streak tracking
- Add reset progress and export progress options

### Release 1.2 - Speaking Support

- Add optional speech input for practice sentences
- Add pronunciation confidence prompts
- Add listen-and-repeat mode
- Keep speech features optional so offline text practice still works

### Release 1.3 - Content Expansion

- Add more Australian English vocabulary packs
- Add workplace, school, shopping, transport, healthcare, and social packs
- Add user-editable custom vocabulary lists
- Add import/export for custom focus packs

### Release 1.4 - Personalisation

- Add learner goals and weekly targets
- Add adaptive task recommendations based on missed words
- Add per-section presets
- Add lightweight onboarding preferences

### Release 1.5 - Multi-Device and Sharing

- Add optional account-based sync
- Add family/shared learning mode
- Add progress backup
- Add printable or shareable weekly progress summaries

## Update Rule

When a new feature commit is added, update this spec sheet in the same pull of work with:

- New feature summary
- Commit hash and title
- Files changed at a high level
- Any new known limitations
- Any roadmap changes caused by the feature
