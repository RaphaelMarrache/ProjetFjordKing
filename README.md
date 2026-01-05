# ProjetFjordKing

ProjetFjordKing is a small leave-request management app. It includes a FastAPI backend that stores employee data in an Excel file, plus React/Vite frontends for workers and managers.

## Features
- Worker login with name + code and request creation (vacation or sick leave)
- Admin review, status updates, and archive management
- Per-sector conflict checks for finished requests
- Excel-based storage for employee data and cumulative leave days
- File upload support for sick-leave attachments

## Tech stack
- Backend: FastAPI, OpenPyXL
- Frontend: React + Vite, Axios
- Data: Excel file stored in `Back/employes_exemple.xlsx`

## Project structure
- `Back/`: FastAPI API, Excel data, and uploads
- `Front/worker-requests/`: React/Vite UI with worker and manager flows
- `worker-requests/`: alternate React/Vite UI (simpler prototype)
- `Front/src/`: early prototype components (not wired to a build)

## Run locally
Backend (from `Back/`):
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn openpyxl python-multipart
uvicorn main:app --reload
```

Frontend (pick one):
```
cd Front\worker-requests
npm install
npm run dev
```

or
```
cd worker-requests
npm install
npm run dev
```

The frontend expects the API at `http://127.0.0.1:8000`.

## Notes
- Employee reference data lives in `Back/employes_exemple.xlsx`.
- Sick-leave uploads are stored in `Back/uploads/`.
