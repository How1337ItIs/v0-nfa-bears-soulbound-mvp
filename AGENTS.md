# Repository Guidelines

## Project Structure & Module Organization
- `app/`: App Router pages and `app/api/*` routes (`invite`, `invite/verify`, `mint`).
- `components/` (`ui/`, `dashboard/`, `mobile/`): Reusable React components (PascalCase).
- `lib/`: Core utilities (`error-handling.ts`, `viemProvider.ts`, `redis.ts`).
- `hooks/`, `providers/`: Custom hooks and React context/providers.
- `contracts/`, `artifacts/`, `deployments/`: Solidity sources and generated ABIs/metadata.
- `scripts/`: Operational scripts (e.g., `scripts/deploy_membership.js`).
- `public/`, `styles/`: Static assets and Tailwind CSS.
- `data/venues.json`, `types/`: Venue data and TypeScript types.

## Build, Test, and Development Commands
- Install: `pnpm install` (preferred). Alt: `npm i`.
- Develop: `pnpm dev` → Next.js at `http://localhost:3000`.
- Build/Start: `pnpm build` then `pnpm start` (prod).
- Lint: `pnpm lint`.
- Example scripts: `node scripts/deploy_membership.js`, `node scripts/verify_wallet.js`.
- Env (create `.env`): `DEPLOYER_PRIVATE_KEY`, `INVITE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_BEPOLIA_RPC`, optional `DEV_SKIP_GPS=true`, optional `NEXT_PUBLIC_APP_URL`.

## Coding Style & Naming Conventions
- TypeScript strict; function components only.
- Components: PascalCase files; hooks start with `use*`.
- Routes: App Router conventions (`app/**/page.tsx`, `app/api/**/route.ts`).
- Error handling: use `lib/error-handling.ts` (Logger, APIError, `withErrorHandling`).
- Styling: Tailwind utilities; keep global styles in `styles/globals.css`.

## Testing Guidelines
- No formal unit tests yet. Validate flows via cURL:
  - Generate invite: `curl -X POST :3000/api/invite -H 'Content-Type: application/json' -d '{"venueId":"local-dev"}'`.
  - Verify invite: `curl -X POST :3000/api/invite/verify -H 'Content-Type: application/json' -d '{"code":"...","address":"0x..."}'`.
  - Mint SBT: `curl -X POST :3000/api/mint -H 'Content-Type: application/json' -d '{"address":"0x...","code":"..."}'`.
- Redis check: `node test-redis.js` (or Upstash via `UPSTASH_*`). Add Vitest/Playwright if introducing tests.

## Commit & Pull Request Guidelines
- Commits: Imperative; Conventional Commits preferred (e.g., `feat(api): add invite verify`).
- PRs: Small, descriptive; link issues; include screenshots for UI and list env changes.
- Pre-push: `pnpm lint` + `pnpm build`. Update docs when touching security, env, or APIs.

## Security & Configuration Tips
- Keys: Never commit secrets. Use strong `INVITE_SECRET_KEY` (≥32 chars). Relayer `DEPLOYER_PRIVATE_KEY` must be `0x` + 64 hex.
- Rate limits: Upstash-based in API routes; do not reduce in production.
- Chain: Berachain Bepolia (id 80069). RPC via `NEXT_PUBLIC_BEPOLIA_RPC`.
- Base URL: Some docs reference `NEXT_PUBLIC_BASE_URL`; code uses `NEXT_PUBLIC_APP_URL`. Prefer setting `NEXT_PUBLIC_APP_URL` (e.g., `http://localhost:3001`) for QR links.
- Venues: Keep `data/venues.json` and any in-route venue constants in sync.
