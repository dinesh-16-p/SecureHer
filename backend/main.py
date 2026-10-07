import os
from typing import Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "noreply@secureher.app")
BREVO_SENDER_NAME = os.getenv("BREVO_SENDER_NAME", "SecureHer Emergency Dispatch")

app = FastAPI(
    title="SecureHer Safety Backend API",
    description="Emergency SOS alert dispatch and notification verification service",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://her-a955f.web.app",
    "https://her-a955f.firebaseapp.com",
    "*"
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

@app.get("/api/health")
def health_check():
    """Health check endpoint to verify backend connectivity"""
    brevo_configured = bool(BREVO_API_KEY and len(BREVO_API_KEY) > 10)
    return {
        "status": "healthy",
        "service": "SecureHer Safety Backend",
        "version": "1.0.0",
        "emailServiceConfigured": brevo_configured,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/sos")
def send_sos_alert(req: SOSRequest, authorization: Optional[str] = Header(None)):
    """
    Dispatches real emergency SOS email to the user's configured emergency contact via Brevo API.
    """
    if not req.recipientEmail:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No emergency contact email provided. Please configure an emergency contact in SecureHer."
        )

    # Prepare Google Maps Link if coordinates are available
    map_link = ""
    location_text = "Location coordinates not available"
    if req.latitude is not None and req.longitude is not None:
        location_text = f"{req.latitude:.5f}° N, {req.longitude:.5f}° E"
        map_link = f"https://www.google.com/maps?q={req.latitude},{req.longitude}"

    formatted_time = req.timestamp or datetime.now().strftime("%B %d, %Y at %I:%M %p")

    # Email Subject & HTML Template
    subject = f"🚨 SECUREHER EMERGENCY ALERT — {req.userName} needs immediate assistance!"
    
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
        .info-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F6DDE5; }}
        .btn {{ display: inline-block; background-color: #D92D3A; color: #FFFFFF !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 20px; text-align: center; }}
        .footer {{ background-color: #F8F5F7; padding: 15px; text-align: center; font-size: 12px; color: #8F7084; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin:0; font-size: 24px;">🚨 EMERGENCY SOS ALERT</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">SecureHer Emergency Safety Broadcast</p>
        </div>
        <div class="body">
          <div class="alert-box">
            <strong style="color: #D92D3A; font-size: 16px;">{req.userName} has activated an emergency SOS!</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #5B214F;">
              They designated you as their primary emergency contact. Please contact them or dispatch local emergency support immediately.
            </p>
          </div>

          <div style="margin-bottom: 20px;">
            <div class="info-row">
              <strong>User Name:</strong>
              <span>{req.userName}</span>
            </div>
            {f'<div class="info-row"><strong>Phone:</strong><span><a href="tel:{req.userPhone}">{req.userPhone}</a></span></div>' if req.userPhone else ''}
            <div class="info-row">
              <strong>Time of Activation:</strong>
              <span>{formatted_time}</span>
            </div>
            <div class="info-row">
              <strong>GPS Location:</strong>
              <span>{location_text}</span>
            </div>
          </div>

          {f'<div style="text-align: center;"><a href="{map_link}" class="btn" target="_blank">📍 View Live GPS Location on Google Maps</a></div>' if map_link else ''}

          <div style="margin-top: 30px; font-size: 13px; color: #5B214F; background: #FAF5F7; padding: 12px; border-radius: 6px;">
            <strong>Immediate Actions Recommended:</strong>
            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
              <li>Call {req.userName} directly to verify their safety.</li>
              <li>Check their location on the map above.</li>
              <li>If unreachable and in distress, dial emergency services (e.g. 112 / 911 / Police).</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          Sent automatically via SecureHer Women Safety Network.
        </div>
      </div>
    </body>
    </html>
    """

    # Check if Brevo API Key is configured
    if not BREVO_API_KEY:
        return {
            "success": False,
            "message": "Brevo email service API key is not configured on the backend server. Please set BREVO_API_KEY in backend/.env.",
            "emailSent": False,
            "recipient": req.recipientEmail
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
            "name": BREVO_SENDER_NAME,
            "email": BREVO_SENDER_EMAIL
        },
        "to": [
            {
                "email": req.recipientEmail,
                "name": req.recipientName or req.recipientEmail
            }
        ],
        "subject": subject,
        "htmlContent": html_content
    }

    try:
        response = requests.post(brevo_url, json=payload, headers=headers, timeout=10)
        if response.status_code in [200, 201, 202]:
            return {
                "success": True,
                "message": f"SOS Emergency alert email successfully delivered to {req.recipientEmail}.",
                "emailSent": True,
                "data": response.json() if response.text else {}
            }
        else:
            return {
                "success": False,
                "message": f"Brevo API returned error ({response.status_code}): {response.text}",
                "emailSent": False
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to send email through Brevo: {str(e)}",
            "emailSent": False
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
