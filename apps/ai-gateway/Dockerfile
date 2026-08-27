# DECIVEXA Zone-3 AI Gateway — container build (Increment 017).
#
# This image is buildable and runnable (its entrypoint, `node dist/server.js`,
# starts and then deliberately fails fast — see server.ts's guarded bootstrap
# comment) but is NOT yet wired to any real production dependency (no real
# WorkloadAuthenticator/CredentialSource/GatewayProvider implementation
# exists in this repository yet). Building or running this image performs
# no GCP contact, no provider contact, and requires no credential.
#
# This matches infra/gcp/main.tf's existing expectation of an image named
# "ai-gateway" in the "decivexa-ai-gateway" Artifact Registry repository,
# referenced only by digest — this Dockerfile does not push or tag
# anything; that remains a separate, future, explicitly authorized step.

# --- Build stage ---
# apps/ai-gateway has ZERO runtime dependencies (package.json
# "dependencies": {}) — only "typescript"/"@types/node" as devDependencies,
# needed solely to compile. This stage exists only to run `tsc`; nothing
# from it except the compiled dist/ output crosses into the production
# stage below.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build \
  # tsconfig.json's "include" deliberately covers every *.spec.ts and
  # *.testkit.ts file too (so `npm test` outside this image can compile
  # and run them) — production has no use for compiled test code or
  # test-only fake implementations, so both are pruned here rather than
  # forking a second tsconfig purely to exclude them (Minimum Necessary
  # Architecture: one build config, one narrow cleanup step).
  && find dist -name '*.spec.*' -delete \
  && find dist -name '*.testkit.*' -delete

# --- Production stage ---
# No `npm install`/`npm ci` at all in this stage — there is nothing to
# install. The image contains exactly the compiled output and the
# minimal package.json needed for `npm start` to resolve its script.
FROM node:22-slim AS production
WORKDIR /app
ENV NODE_ENV=production

# The official Node images already define a non-root "node" user/group
# (uid/gid 1000) — reused rather than inventing a new one.
COPY --from=build /app/dist ./dist
COPY package.json ./

USER node

# Cloud Run injects PORT at runtime (see server.ts — the server fails
# fast if it is absent, and never assumes a default). No EXPOSE value is
# load-bearing for Cloud Run, which reads PORT directly, but it documents
# the contract for any other local/manual use of this image.
EXPOSE 8080

CMD ["node", "dist/server.js"]
