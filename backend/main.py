import os
import sys
import logging
from typing import Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
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
load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "").strip()
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "SecureHer Emergency Dispatch").strip()
FIREBASE_API_KEY = os.getenv("FIREBASE_API_KEY", "").strip()

app = FastAPI(
    title="SecureHer Safety Backend API",
    description="Emergency SOS alert dispatch and notification verification service",
    version="1.0.0"
)

# CORS Configuration for local development and Firebase Hosting domains
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://her-a955f.web.app",
    "https://her-a955f.firebaseapp.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
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

def verify_firebase_token(auth_header: Optional[str]) -> Optional[dict]:
    """
    Verifies Firebase ID token if provided.
    Extracts authenticated user UID and email.
    """
    if not auth_header or not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ")[1]
    if not token or len(token) < 20:
        return None

    # Verify token using Google Identity Toolkit REST API
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={FIREBASE_API_KEY}" if FIREBASE_API_KEY else "https://identitytoolkit.googleapis.com/v1/accounts:lookup"
    try:
        res = requests.post(verify_url, json={"idToken": token}, timeout=5)
        if res.status_code == 200:
            data = res.json()
            users = data.get("users", [])
            if users:
                user_info = users[0]
                logger.info(f"Verified Firebase user UID: {user_info.get('localId')}")
                return {
                    "uid": user_info.get("localId"),
                    "email": user_info.get("email"),
                    "displayName": user_info.get("displayName")
                }
    except Exception as e:
        logger.warning(f"Firebase token verification error (continuing with payload): {e}")

    return None

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend connectivity and Brevo readiness"""
    brevo_configured = bool(BREVO_API_KEY and len(BREVO_API_KEY) > 10 and BREVO_SENDER_EMAIL)
    return {
        "status": "healthy",
        "service": "SecureHer Safety Backend",
        "version": "1.0.0",
        "brevoConfigured": brevo_configured,
        "senderConfigured": bool(BREVO_SENDER_EMAIL),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/sos")
def send_sos_alert(req: SOSRequest, authorization: Optional[str] = Header(None)):
    """
    Dispatches real emergency SOS email to the authenticated user's configured emergency contact via Brevo API.
    """
    logger.info("Received SOS alert request")

    # Verify Firebase Authentication
    auth_user = verify_firebase_token(authorization)
    if auth_user:
        user_name = auth_user.get("displayName") or req.userName or "SecureHer User"
    else:
        user_name = req.userName or "SecureHer User"

    # Determine Recipient Email
    recipient_email = (req.recipientEmail or "").strip()
    if not recipient_email or "@" not in recipient_email:
        logger.warning("SOS rejected: No emergency contact email provided")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No emergency contact email is configured. Please configure an emergency contact in SecureHer."
        )

    # Location Formatting
    map_link = ""
    location_text = "GPS coordinates not available"
    location_status = "unavailable"
    if req.latitude is not None and req.longitude is not None:
        location_text = f"{req.latitude:.5f}° N, {req.longitude:.5f}° E"
        map_link = f"https://www.google.com/maps?q={req.latitude},{req.longitude}"
        location_status = "available"

    formatted_time = req.timestamp or datetime.now().strftime("%B %d, %Y at %I:%M %p")

    # Email Subject & HTML Template
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

    # Validate Brevo API Configuration
    if not BREVO_API_KEY or not BREVO_SENDER_EMAIL:
        logger.error("Brevo credentials missing in backend environment variables")
        return {
            "success": False,
            "emailStatus": "failed",
            "locationStatus": location_status,
            "message": "Brevo email API is not configured on the backend server (BREVO_API_KEY / BREVO_SENDER_EMAIL missing). Please check backend/.env.",
            "recipient": recipient_email
        }

    # Dispatch email via Brevo REST API
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
        logger.info(f"Sending SOS alert via Brevo to {recipient_email}...")
        response = requests.post(brevo_url, json=payload, headers=headers, timeout=10)

        if response.status_code in [200, 201, 202]:
            resp_data = response.json() if response.text else {}
            message_id = resp_data.get("messageId", "ok")
            logger.info(f"Brevo email delivered successfully (messageId: {message_id})")
            return {
                "success": True,
                "emailStatus": "sent",
                "messageId": message_id,
                "locationStatus": location_status,
                "message": f"Emergency alert email successfully sent to {recipient_email}.",
                "recipient": recipient_email
            }
        else:
            logger.error(f"Brevo API error ({response.status_code}): {response.text}")
            return {
                "success": False,
                "emailStatus": "failed",
                "locationStatus": location_status,
                "error": f"Brevo returned status {response.status_code}: {response.text}",
                "message": "Brevo email delivery failed. Please verify that BREVO_SENDER_EMAIL is a verified sender in your Brevo account.",
                "recipient": recipient_email
            }
    except Exception as e:
        logger.error(f"Brevo connection exception: {str(e)}")
        return {
            "success": False,
            "emailStatus": "failed",
            "locationStatus": location_status,
            "error": str(e),
            "message": f"Connection error while sending email: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
