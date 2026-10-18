# Card Game Client

Next.js player-facing web client for the Joker card game.

## Commands (run from `card-game_client/`)

```bash
npm run dev     # Turbopack dev server (kills port 3000 first)
npm run build   # Production build (uses webpack, NOT Turbopack)
npm run lint    # ESLint
```

> Dev uses `--turbopack`; production build explicitly uses `--webpack`. Do not add `--turbopack` to the build command.

## Stack

- **Next.js App Router** + **next-intl** for i18n
- **Zustand** for client state
- **SCSS modules** (`.module.scss`) for component styles
- **Socket.IO client** via singleton hook

## Architecture

### Routing

All routes live under `app/[locale]/`. The locale prefix is **always present** (e.g. `/en/account`, `/ka/rules`).

```
app/[locale]/
  (root)/        # Public-facing pages (home, etc.)
  (gameViews)/   # Active game room views
  account/       # User account pages
  about/ rules/ privacy/ terms/ feedback/ data-deletion/
```

Use path utilities from [`i18n/navigation.ts`](i18n/navigation.ts) (`Link`, `useRouter`, `redirect`) — **not** `next/navigation` directly — so locale is handled correctly.

**Supported locales**: `en`, `ka`, `ru` (Georgian, Russian).

### State management

Zustand stores live in [`store/`](store/). Each feature has its own store file/folder. Stores are `"use client"` modules using `create<Store>()`.

Key stores:

- `auth/` — signin, signup, logout, password
- `user/` — session user, avatar, username
- `flashMsgStore.ts` — toast messages (call `setFlashMsg`)
- `soundStore.ts` — sound on/off
- `displayRoomStore.ts` — room lobby selection

### Styling

- **CSS custom properties** defined in [`styles/_variables.scss`](styles/_variables.scss) — use these for colors (e.g. `var(--clr-primary)`, `var(--clr-danger-300)`).
- **Mixins** in [`styles/_mixins.scss`](styles/_mixins.scss).
- Each component uses its own `.module.scss` file. No inline styles, no Tailwind.

### Socket

Single Socket.IO connection managed by [`hooks/useSocket.ts`](hooks/useSocket.ts). Connects to `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).  
Import and call `useSocket()` to get the socket instance — do not create new `io()` connections elsewhere.

### Key types

Core game types (Room, RoomUser, PlayingCard, Suit, Rank, HandBid, HandWin, HandPoint) are in [`utils/interfaces.ts`](utils/interfaces.ts). Prefer extending those rather than redefining.

### Path alias

`@/` maps to the project root (e.g. `@/components/auth/Auth`, `@/store/flashMsgStore`).

## Environment variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000   # Server base URL
```
