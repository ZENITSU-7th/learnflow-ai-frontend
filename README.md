# LearnFlow AI Frontend

React + Vite frontend for LearnFlow AI.

## Local run

```powershell
npm install
npm run dev
```

The frontend defaults to the deployed Render API. For a different backend, create `.env`:

```text
VITE_API_URL=http://localhost:5000/api
```

## Main user flow

Sign in → Dashboard → Library → Save/analyze resource → Build course → Generate tasks → Schedule tasks → Complete tasks → AI quiz → knowledge score/weak topics → Ask AI.

Do not commit secrets.
