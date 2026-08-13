<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/aa928df5-fcaa-4ba8-b916-c410c3d329c8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Live Radio

Musafir Mix now includes a real internet-radio mode. It discovers Hindi/Bollywood-oriented stations in India from the Radio Browser public directory and plays each station's live stream through the browser's native audio element. Media Session controls are wired for play/pause and station next/previous where the browser supports them.

Live stations can change or disappear because the directory and station streams are external services. Some streams may also be blocked by browser CORS/mixed-content policies.
