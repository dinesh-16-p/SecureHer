import os
import sys
import logging
from typing import Optional, Dict, Any
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("secureher.backend")

# Load environment variables
# In production (Vercel/Cloud Run), env vars are injected directly — dotenv is a dev-only fallback.
try:
    load_dotenv()  # Loads .env if present locally — silently ignored on Vercel
except Exception:
    pass

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "").strip()
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "SecureHer Emergency Dispatch").strip()
# FIREBASE_API_KEY is the Web API Key (NOT a service account). Used to verify Firebase ID tokens.
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

app = FastAPI(
    title="SecureHer Safety & AI Backend API",
    description="Emergency SOS alert dispatch, notification verification, and AI safety router",
    version="1.0.0"
)

# CORS Configuration — explicit allowed origins only (no wildcard in production)
origins = [
    # Production Firebase Hosting
    "https://her-a955f.web.app",
    "https://her-a955f.firebaseapp.com",
    # Local development
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SOSRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    accuracy: Optional[float] = None
    recipientEmail: Optional[str] = None
    recipientName: Optional[str] = None
    userName: Optional[str] = "SecureHer User"
    userPhone: Optional[str] = ""
    timestamp: Optional[str] = None

class AIRequest(BaseModel):
    prompt: str
    userContext: Optional[Dict[str, Any]] = None

def verify_firebase_token(auth_header: Optional[str]) -> Optional[dict]:
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    if not token or len(token) < 20:
        return None

    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_API_KEY}" if FIREBASE_API_KEY else "https://identitytoolkit.googleapis.com/v1/accounts:lookup"
    try:
        res = requests.post(verify_url, json={"idToken": token}, timeout=5)
        if res.status_code == 200:
            data = res.json()
            users = data.get("users", [])
            if users:
                user_info = users[0]
                return {
                    "uid": user_info.get("localId"),
                    "email": user_info.get("email"),
                    "displayName": user_info.get("displayName")
                }
    except Exception as e:
        logger.warning(f"Firebase token verification note: {e}")

    return None

@app.get("/api/health")
def health_check():
    """Health check endpoint verifying backend connectivity, Brevo, and Gemini readiness"""
    brevo_configured = bool(BREVO_API_KEY and len(BREVO_API_KEY) > 10 and BREVO_SENDER_EMAIL)
    gemini_configured = bool(GEMINI_API_KEY and len(GEMINI_API_KEY) > 10)
    return {
        "status": "healthy",
        "service": "SecureHer Safety Backend",
        "version": "1.0.0",
        "brevoConfigured": brevo_configured,
        "senderConfigured": bool(BREVO_SENDER_EMAIL),
        "geminiConfigured": gemini_configured,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/sos")
def send_sos_alert(req: SOSRequest, authorization: Optional[str] = Header(None)):
    """
    Dispatches real emergency SOS email to the user's configured emergency contact via Brevo API.
    """
    logger.info("Received SOS alert request")

    auth_user = verify_firebase_token(authorization)
    user_name = auth_user.get("displayName") if auth_user and auth_user.get("displayName") else (req.userName or "SecureHer User")

    recipient_email = (req.recipientEmail or "").strip()
    if not recipient_email or "@" not in recipient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No emergency contact email provided. Please configure an emergency contact in SecureHer."
        )

    map_link = ""
    location_text = "GPS coordinates not available"
    location_status = "unavailable"
    if req.latitude is not None and req.longitude is not None:
        location_text = f"{req.latitude:.5f}° N, {req.longitude:.5f}° E"
        map_link = f"https://www.google.com/maps?q={req.latitude},{req.longitude}"
        location_status = "available"

    formatted_time = req.timestamp or datetime.now().strftime("%B %d, %Y at %I:%M %p")

    subject = f"🚨 SECUREHER EMERGENCY ALERT — {user_name} activated SOS!"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FBF8F9; margin: 0; padding: 20px; }}
        .card {{ max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 2px solid #D92D3A; box-shadow: 0 8px 30px rgba(217, 45, 58, 0.15); overflow: hidden; }}
        .header {{ background: linear-gradient(135deg, #D92D3A, #C75B7A); color: #FFFFFF; padding: 25px; text-align: center; }}
        .body {{ padding: 30px; color: #1E1A1D; line-height: 1.6; }}
        .alert-box {{ background: #FDF2F2; border-left: 4px solid #D92D3A; padding: 15px; border-radius: 6px; margin-bottom: 20px; }}
        .info-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F6DDE5; font-size: 14px; }}
        .btn {{ display: inline-block; background-color: #D92D3A; color: #FFFFFF !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 15px; }}
        .footer {{ background-color: #F8F5F7; padding: 15px; text-align: center; font-size: 12px; color: #8F7084; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">🚨 EMERGENCY SOS ALERT</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">SecureHer Women Safety Network</p>
        </div>
        <div class="body">
          <div class="alert-box">
            <strong style="color: #D92D3A; font-size: 16px;">{user_name} has activated an emergency SOS!</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #5B214F;">
              You are designated as their trusted emergency contact. Please contact them or seek appropriate local emergency assistance immediately.
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="info-row">
              <strong>User Name:</strong>
              <span>{user_name}</span>
            </div>
            {f'<div class="info-row"><strong>User Phone:</strong><span><a href="tel:{req.userPhone}">{req.userPhone}</a></span></div>' if req.userPhone else ''}
            <div class="info-row">
              <strong>Time of Activation:</strong>
              <span>{formatted_time}</span>
            </div>
            <div class="info-row">
              <strong>GPS Location:</strong>
              <span>{location_text}</span>
            </div>
          </div>

          {f'<div style="text-align: center;"><a href="{map_link}" class="btn" target="_blank">📍 Open Live Location on Google Maps</a></div>' if map_link else ''}

          <div style="margin-top: 25px; font-size: 13px; color: #5B214F; background: #FAF5F7; padding: 15px; border-radius: 6px;">
            <strong>Immediate Steps:</strong>
            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
              <li>Call {user_name} immediately to confirm their status.</li>
              <li>Track their GPS coordinates using the link above.</li>
              <li>If they are in immediate danger or unreachable, dial National Emergency Helpline (112 / Police).</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          Dispatched automatically by SecureHer Women Safety Application.
        </div>
      </div>
    </body>
    </html>
    """

    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        return {
            "success": False,
            "emailStatus": "failed",
            "locationStatus": location_status,
            "message": "Brevo email API is not configured on the backend server. Set BREVO_API_KEY & BREVO_SENDER_EMAIL in backend/.env.",
            "recipient": recipient_email
        }

    brevo_url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {
            "name": BREVO_SENDER_NAME or "SecureHer Emergency Dispatch",
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": recipient_email,
                "name": req.recipientName or recipient_email
            }
        ],
        "subject": subject,
        "htmlContent": html_content
    }

    try:
        response = requests.post(brevo_url, json=payload, headers=headers, timeout=10)
        if response.status_code in [200, 201, 202]:
            resp_data = response.json() if response.text else {}
            message_id = resp_data.get("messageId", "ok")
            return {
                "success": True,
                "emailStatus": "sent",
                "messageId": message_id,
                "locationStatus": location_status,
                "message": f"Emergency alert email successfully sent to {recipient_email}.",
                "recipient": recipient_email
            }
        else:
            return {
                "success": False,
                "emailStatus": "failed",
                "locationStatus": location_status,
                "error": f"Brevo returned status {response.status_code}: {response.text}",
                "message": "Brevo email delivery failed. Please verify BREVO_SENDER_EMAIL in your Brevo account.",
                "recipient": recipient_email
            }
    except Exception as e:
        return {
            "success": False,
            "emailStatus": "failed",
            "locationStatus": location_status,
            "error": str(e),
            "message": f"Connection error while sending email: {str(e)}"
        }

@app.post("/api/ai")
def secureher_ai_router(req: AIRequest, authorization: Optional[str] = Header(None)):
    """
    SecureHer Hybrid AI Router:
    1. Controlled Safety Layer: Checks prompt against deterministic safety/health/feature procedures.
    2. Gemini Fallback: Routes open-ended wellness queries to Gemini API securely on backend.
    """
    prompt_lower = (req.prompt or "").lower().strip()
    if not prompt_lower:
        raise HTTPException(status_code=400, detail="Prompt query is required.")

    # 1. Controlled Safety Router Layer
    if any(k in prompt_lower for k in ["sos", "danger", "help me", "emergency", "followed", "threat", "scared", "stalking"]):
        return {
            "source": "controlled_safety_layer",
            "reply": "🚨 **IMMEDIATE EMERGENCY GUIDANCE:** If you are in immediate danger, please press the **Emergency SOS button** in SecureHer or call national emergency services at **112** (or 1091 Women Helpline). Move toward a well-lit, public area with people or security personnel immediately."
        }

    if any(k in prompt_lower for k in ["contact", "add mother", "emergency contact"]):
        return {
            "source": "controlled_safety_layer",
            "reply": "👥 **Emergency Contacts Guide:** Go to **Safety → Emergency Contacts** to add or update trusted family/friends. Their emails will receive your live GPS coordinates during an SOS dispatch."
        }

    if any(k in prompt_lower for k in ["period", "cycle", "ovulation", "menstruation", "follicular", "luteal"]):
        ctx_day = req.userContext.get("currentDay") if req.userContext else None
        phase_text = f" (Your current recorded phase is {req.userContext.get('phase')})" if req.userContext and req.userContext.get('phase') else ""
        return {
            "source": "controlled_safety_layer",
            "reply": f"🌸 **Cycle Tracking Assistance:**{phase_text} Log your period start date under **Health → Period Tracker** to calculate your cycle phase, ovulation window, and upcoming period predictions."
        }

    if any(k in prompt_lower for k in ["camera", "evidence", "record photo", "video"]):
        return {
            "source": "controlled_safety_layer",
            "reply": "📸 **Incident Evidence Vault:** Open **Safety → Evidence Camera** to take discreet photo snapshots or video recordings. All media is encrypted and stored locally on your device for absolute privacy."
        }

    # 2. Open-ended Gemini API Layer
    if GEMINI_API_KEY:
        try:
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            system_instruction = "You are SecureHer AI, a compassionate, supportive wellness assistant for women's safety, mental health, and physical health. Provide concise, clear, and empowering answers. Never give medical diagnoses or claim to replace emergency services."

            gemini_payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_instruction}\nUser question: {req.prompt}"}
                        ]
                    }
                ]
            }

            res = requests.post(gemini_url, json=gemini_payload, timeout=8)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return {
                            "source": "gemini_api",
                            "reply": parts[0].get("text", "").strip()
                        }
        except Exception as e:
            logger.warning(f"Gemini API query error: {e}")

    # Fallback response when Gemini key is not set or unavailable
    return {
        "source": "secureher_assistant",
        "reply": f"I am your SecureHer Safety & Health Assistant. For urgent situations, use **Emergency SOS** or call **112**. For feature guidance, navigate using the sidebar to explore Safety, Health, Community, and Settings."
    }

if __name__ == "__main__":
    import uvicorn
    # Use PORT env var for Cloud Run / Vercel local dev compatibility
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
