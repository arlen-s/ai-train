# LawnBot AI Web Workbench

Phase 10 replaces the original static shell with a Vite + React + TypeScript frontend for the Chinese-first V2 robotics AI training workbench.

## Commands

```bash
npm install
npm test -- --run
npm run build
npm run dev
```

By default the app calls the FastAPI metadata service on the same origin. For local split-process development, set `VITE_API_BASE_URL`, for example:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

The workbench consumes the V2 metadata APIs for Dashboard, Dataset/QC, Perception, RL replay, Evaluation/Badcase, report export, and V3 backlog planning.
