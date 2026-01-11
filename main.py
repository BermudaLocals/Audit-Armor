from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import datetime, random

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health(): return {"status": "ok", "time": str(datetime.datetime.now())}

@app.get("/state")
def state(): return {"drift_score": 98.4, "exposure_usd": 12500, "savings_delta_usd": 4200}

@app.post("/demo/run")
def run(): return {"status": "complete", "findings": {"risk": "low", "delta": 400}}
