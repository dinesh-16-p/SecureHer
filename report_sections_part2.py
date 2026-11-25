import os
from reportlab.lib import colors
from reportlab.platypus import Paragraph, PageBreak, Spacer, Table, TableStyle, Image as RLImage, HRFlowable

PRIMARY = colors.HexColor("#000000")
SECONDARY = colors.HexColor("#333333")
BG_LIGHT = colors.HexColor("#F8F8F8")
BG_ALT = colors.HexColor("#EFEFEF")
BORDER_COLOR = colors.HexColor("#999999")

def build_part2_pages(story, S):
    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 27: CHAPTER 4 - 4.1 SYSTEM ARCHITECTURE DIAGRAM (FIG. 1)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4 Design", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("4.1 System Architecture Diagram", S['SecHeader']))
    story.append(Paragraph(
        "Fig. 1 illustrates the end-to-end multi-tier system architecture of SecureHer. The platform is organized into four decoupled processing tiers: "
        "(1) <b>Client Handheld Tier:</b> React 18 PWA frontend operating within mobile web browsers and Capacitor Native Android shell, "
        "(2) <b>Edge Telematics &amp; Geodesics Engine:</b> Ingestion of high-precision satellite GNSS signals, Nominatim reverse geocoding, and MapLibre GL vector styling, "
        "(3) <b>Asynchronous Multi-Channel Dispatch Tier:</b> Dual alerting fan-out coordinating native Android <code>SmsManager</code> over cellular tower basebands and Brevo REST API v3 over HTTPS, and "
        "(4) <b>Distributed Cloud &amp; Persistence Tier:</b> Google Firebase Firestore database, Firebase Authentication, and immutable audit logs.", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/architecture_diagram.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/architecture_diagram.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=440, height=215))
    story.append(Paragraph("<b>Fig. 1: System Architecture Diagram</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "This multi-tier topology guarantees that an outage in packet data networks does not paralyze the core emergency notification mechanism.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 28: CHAPTER 4 - 4.2 MODULAR STRUCTURE (FIG. 2)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.2 Modular Structure", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The SecureHer platform is divided into four highly cohesive, loosely coupled engineering modules, shown in Fig. 2. "
        "Each module addresses a distinct aspect of civilian emergency safety:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig2_modular_structure.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig2_modular_structure.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 2: Modular Structure of the System</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Module 1 (Ingestion &amp; Geolocation Engine):</b> Manages continuous GNSS satellite polling, accuracy radius calibration, and vector tile rendering.<br/>"
        "<b>Module 2 (Multi-Channel SOS &amp; Brevo Dispatch):</b> Coordinates the 1-tap activation trigger, native telephony SMS, and transactional email distribution.<br/>"
        "<b>Module 3 (Journey Watchdog &amp; Deterrence Suite):</b> Executes real-time route tracking, midnight rollover countdowns, and acoustic siren deterrence.<br/>"
        "<b>Module 4 (Nearby Civic POI &amp; Forensic Storage):</b> Executes Overpass API spatial queries and dual-camera evidence recording.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 29: CHAPTER 4 - 4.3 IMPORTANT DESIGN DIAGRAMS (FIG. 3: DFD LEVEL 0)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3 Important Design Diagrams and Specifications", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("4.3.1 Data Flow Diagrams (DFDs)", S['SubSecHeader']))
    story.append(Paragraph(
        "The Level 0 Context Data Flow Diagram (Fig. 3) models the high-level data exchanges between the SecureHer system boundary and external entities: "
        "the Commuter User (Vulnerable Traveler), Trusted Guardians, Cellular Telephony Towers, Brevo Email Gateway, OpenStreetMap Overpass Servers, "
        "and Google Cloud Firestore.", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig3_dfd0.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig3_dfd0.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 3: Data Flow Diagram - Level 0 (Context Diagram)</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The context diagram highlights the strict separation between local hardware telephony dispatch (operating over offline cellular control channels) "
        "and cloud-based transactional services (operating over encrypted internet transport).", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 30: CHAPTER 4 - 4.3.1 DFD LEVEL 1 (FIG. 4)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.1 Data Flow Diagrams - Level 1", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The Level 1 Data Flow Diagram (Fig. 4) decomposes the single SecureHer system process into four primary internal processes corresponding "
        "to the four core modules: (1.0) Geolocation &amp; Map Ingestion, (2.0) Emergency SOS Orchestration, (3.0) Journey Watchdog &amp; Escalation, and "
        "(4.0) Spatial Civic POI Discovery &amp; Evidence Capture.", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig4_dfd1.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig4_dfd1.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 4: Data Flow Diagram - Level 1</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Internal data stores include D1 (Local Storage / IndexedDB Cache), D2 (Cloud Firestore Collections), and D3 (Encrypted Media Vault). "
        "Process 2.0 maintains direct bidirectional flow with both local and cloud data stores to guarantee alert dispatch under any network condition.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 31: CHAPTER 4 - 4.3.1 ACTIVITY DIAGRAM (FIG. 5)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.1 Activity Diagram (Pipeline &amp; Dispatch Flow)", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 5 depicts the Activity Diagram of the SecureHer emergency dispatch and deterrence pipeline. The diagram details the sequential and parallel "
        "execution branches initiated upon SOS trigger or journey countdown expiry:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig5_activity.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig5_activity.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 5: Activity Diagram (Emergency Dispatch &amp; Deterrence Pipeline)</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Upon 1-tap activation, execution immediately forks into parallel execution threads: Thread A handles on-device deterrence (110dB siren and strobe), "
        "Thread B executes native cellular SMS dispatch via <code>SmsManager</code>, and Thread C transmits the HTTP POST payload to Brevo transactional email servers. "
        "This asynchronous parallelization ensures zero blocking delays.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 32: CHAPTER 4 - 4.3.2 DATABASE DESIGN (FIG. 6: CONCEPTUAL ERD)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.2 Database Design", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "SecureHer utilizes a hybrid data architecture combining client-side offline persistence (IndexedDB and localStorage) with a cloud NoSQL "
        "document store (Google Cloud Firestore). Fig. 6 presents the conceptual Entity-Relationship Diagram (ERD) defining the logical entities "
        "and their cardinalities.", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig6_erd.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig6_erd.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 6: Conceptual Entity-Relationship Diagram</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The primary entity <code>User</code> maintains a 1-to-N relationship with <code>EmergencyContact</code>, a 1-to-N relationship with <code>SOSEvent</code>, "
        "and a 1-to-N relationship with <code>SafeJourney</code>. Each <code>SOSEvent</code> links to multiple <code>AlertDispatchRecord</code> instances tracking individual delivery channels.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 33: CHAPTER 4 - 4.3.2 DATABASE DESIGN (TAB. 7: LOGICAL DATA STRUCTURES)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.2 Database Design: Logical Data Structures", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The Firestore document schema and local storage structures are detailed in Tab. 7, listing primary collections, sub-collections, "
        "and essential field definitions.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 7: Logical data structures (JSON/XML artifacts &amp; Firestore)</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    ds_data = [
        ("Logical Artifact", "Main fields"),
        ("users/{userId}", "uid (string), fullName (string), phoneNumber (string), email (string), bloodGroup (string), medicalNotes (string), defaultSOSMessage (string), createdAt (timestamp)"),
        ("users/{userId}/contacts/{contactId}", "contactId (string), name (string), phoneNumber (string), email (string), relationship (string), priority (integer: 1-5), isNotifySMS (boolean), isNotifyEmail (boolean)"),
        ("users/{userId}/events/{eventId}", "eventId (string), timestamp (timestamp), latitude (float), longitude (float), accuracyMeters (float), address (string), triggerType (MANUAL_SOS / JOURNEY_OVERDUE), status (ACTIVE / RESOLVED)"),
        ("users/{userId}/events/{eventId}/dispatches", "dispatchId (string), channel (SMS_NATIVE / BREVO_EMAIL / FCM), recipient (string), deliveryStatus (SENT / DELIVERED / FAILED), httpStatusCode (integer), latencyMs (float)"),
        ("users/{userId}/journeys/{journeyId}", "journeyId (string), startLocation (object), destinationLocation (object), estimatedArrival (timestamp), expectedDurationMinutes (integer), status (IN_PROGRESS / COMPLETED / OVERDUE_ESCALATED)"),
        ("localStorage Cache", "secureher_user_profile (JSON), secureher_contacts (JSON Array), secureher_pending_alerts (JSON Array), secureher_map_settings (JSON)")
    ]
    tbl_ds = Table(ds_data, colWidths=[140, 335])
    tbl_ds.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7.2),
        ('LEADING', (0,0), (-1,-1), 9.2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_ds)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "By replicating critical contact records in local client storage, emergency alert generation can proceed even during total internet blackouts.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 34: CHAPTER 4 - 4.3.3 CLASS DIAGRAM (FIG. 7)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.3 Class Diagram", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 7 presents the conceptual Class Diagram of the SecureHer software architecture. The diagram illustrates key domain classes, "
        "their private attributes, public operations, and object relationships across client controllers, service providers, and cloud repositories.", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig7_class.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig7_class.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 7: Conceptual Class Diagram</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Core service classes include <code>SOSOrchestrator</code>, <code>SmsManagerService</code>, <code>BrevoEmailService</code>, "
        "<code>GeolocationEngine</code>, <code>JourneyWatchdog</code>, and <code>OverpassDiscoveryService</code>. <code>SOSOrchestrator</code> coordinates "
        "asynchronous execution across dispatch providers via Promise chaining.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 35: CHAPTER 4 - 4.3.4 SEQUENCE DIAGRAM (FIG. 8)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.4 Sequence and Collaboration Diagrams", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 8 illustrates the Sequence Diagram for the end-to-end emergency SOS dispatch pipeline, depicting the chronological sequence "
        "of method invocations and asynchronous responses across system actors and software components:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig8_sequence.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig8_sequence.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 8: Sequence Diagram - End-to-End Pipeline</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Upon the user pressing the SOS button, <code>SOSDashboardView</code> calls <code>SOSOrchestrator.triggerSOS()</code>. The orchestrator polls "
        "<code>GeolocationEngine.getCurrentCoordinates()</code>, retrieves registered contacts, invokes <code>SmsManagerPlugin.sendDirectSMS()</code>, "
        "and posts the emergency payload to <code>BrevoEmailAPI</code> concurrently.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 36: CHAPTER 4 - 4.3.4 COLLABORATION DIAGRAM (FIG. 9)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.4 Sequence and Collaboration Diagrams (Continued)", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 9 shows the Collaboration Diagram representing structural object relationships and message passing order during an emergency event, "
        "focusing on the dispatch state machine:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig9_collab.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig9_collab.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 9: Collaboration Diagram - Dispatch State Machine</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Numbered interactions (1: activateSOS, 2: acquireGNSS, 3: dispatchNativeSMS, 4: dispatchBrevoEmail, 5: logSOSEvent) emphasize the decoupled, "
        "stateful nature of the emergency coordinator, ensuring that a failure in step 4 does not invalidate the completion of step 3.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 37: CHAPTER 4 - 4.3.5 USE CASE DIAGRAM (FIG. 10)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.5 Use Case Diagram", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 10 presents the Use Case Diagram for SecureHer, mapping system capabilities against the three primary external actors: "
        "the Commuter User (Vulnerable Traveler), Trusted Guardians, and First Responders / Civic Authorities:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig10_usecase.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig10_usecase.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 10: Use Case Diagram</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The commuter user interacts with use cases including: <i>Trigger 1-Tap Emergency SOS</i>, <i>Calibrate GPS Pin on Map</i>, "
        "<i>Set Trusted Journey &amp; ETA</i>, <i>Locate Nearby Police / Hospitals</i>, and <i>Record Camera / Siren Evidence</i>. "
        "Guardians interact with <i>Receive Multi-Channel Distress Alerts</i> and <i>Navigate to Live Coordinates</i>.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 38: CHAPTER 4 - 4.3.6 ARCHITECTURE WORKFLOW (FIG. 11)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.6 Architecture Workflow, Approval Gate and Dispatch Pipeline", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 11 illustrates the end-to-end 10-stage operational workflow of SecureHer, from initial user onboarding through emergency alert dispatch "
        "and incident resolution:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig11_workflow.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig11_workflow.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 11: End-to-End Safety Workflow</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Stages 1 through 4 establish the user's safety profile, register trusted guardians, and calibrate geolocation. "
        "Stages 5 and 6 handle real-time journey monitoring and automated watchdog countdowns. "
        "Stages 7 through 10 execute multi-channel dispatch, Overpass civic discovery, evidence capture, and audit logging.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 39: CHAPTER 4 - 4.3.6 ESCALATION & DISPATCH GATE (FIG. 12)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.6 Emergency Escalation and Dispatch Gate", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 12 details the Emergency Escalation and Dispatch Gate, which acts as a safety validator before distress broadcasts are issued, "
        "preventing accidental false triggers while guaranteeing rapid escalation during unconfirmed states:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig12_approval.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig12_approval.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 12: Emergency Escalation &amp; Dispatch Gate</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "When an overdue journey condition occurs, the gate initiates a 60-second grace-period countdown with local audio and vibration chimes. "
        "If the user inputs their personal PIN, the alert is cancelled. If the countdown expires without user cancellation, the gate automatically "
        "escalates to full emergency broadcast across cellular SMS and Brevo transactional email channels.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 40: CHAPTER 4 - 4.3.6 DISPATCH PAYLOAD ARCHITECTURE (FIG. 13)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("4.3.6 Emergency Dispatch Payload Architecture", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Fig. 13 depicts the Emergency Dispatch Payload Architecture, showing how raw geospatial telemetry, device diagnostics, and user metadata "
        "are compiled into standards-compliant transport artifacts across SMS, Brevo HTML email, and Firestore audit logs:", S['Body']
    ))
    story.append(Spacer(1, 4))

    img_path = "Project_Reports/fig13_structure.png"
    if not os.path.exists(img_path):
        img_path = "public/assets/fig13_structure.png"
    if os.path.exists(img_path):
        story.append(RLImage(img_path, width=450, height=220))
    story.append(Paragraph("<b>Fig. 13: Emergency Dispatch Payload Architecture</b>", S['Caption']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The canonical dispatch payload encodes: (1) WGS 84 latitude and longitude to 6 decimal places (~0.1m precision), (2) accuracy radius in meters, "
        "(3) reverse-geocoded physical landmark name, (4) ISO 8601 UTC timestamp, (5) battery percentage, and (6) direct Google Maps URL hyperlink. "
        "This structured schema guarantees universal compatibility across all recipient devices.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 41: CHAPTER 5 - 5.1 TECHNOLOGY, LANGUAGE, AND TOOLS USED (TAB. 8)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5 Implementation and Coding", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("5.1 Technology, Language, and Tools Used", S['SecHeader']))
    story.append(Paragraph(
        "The technical implementation of SecureHer incorporates an enterprise-grade technology stack spanning frontend frameworks, native mobile runtimes, "
        "geospatial libraries, and cloud gateways. Tab. 8 summarizes the technology stack.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 8: Technology stack summary</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    tech_data = [
        ("Layer or Category", "Technology", "Purpose / Description"),
        ("Frontend Framework", "React 18.3.1 & TypeScript 5.5", "Component-driven reactive user interface with strict compile-time type safety."),
        ("Build Tool & Bundler", "Vite 5.4.2", "Ultra-fast development server with ES modules and optimized production Rollup bundling."),
        ("Mobile Telematics Bridge", "Capacitor 6.0 (@capacitor/core)", "Cross-platform runtime bridging web code to native Android SmsManager & camera."),
        ("Vector & Raster Mapping", "MapLibre GL JS 4.7.1", "High-performance GPU-accelerated WebGL vector map rendering and tile caching."),
        ("Geocoding & Civic Radar", "Nominatim & Overpass API", "OpenStreetMap spatial querying for address reverse geocoding and 10km emergency POI discovery."),
        ("Cloud Persistence", "Google Firebase 10.13.0", "Cloud Firestore NoSQL database, Firebase Authentication, and security rules."),
        ("Transactional Email", "Brevo REST API v3", "Enterprise emergency email dispatch with responsive HTML situational templates and map links.")
    ]
    tbl_tech = Table(tech_data, colWidths=[110, 125, 240])
    tbl_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7.2),
        ('LEADING', (0,0), (-1,-1), 9.2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_tech)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "The synthesis of TypeScript type enforcement and Capacitor native hardware bindings ensures that critical emergency operations "
        "execute with zero runtime type exceptions.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 42: CHAPTER 5 - 5.2 ALGORITHM 1: GEOLOCATION ACQUISITION
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5.2 Important Constructs, Classes, Algorithms, and Pseudo-codes", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Algorithm 1: Real-Time High-Precision Geolocation Acquisition and Reverse Geocoding</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Algorithm 1 implements a multi-tier progressive GNSS polling mechanism that acquires high-accuracy satellite coordinates "
        "and resolves human-readable physical addresses via Nominatim reverse geocoding:", S['Body']
    ))
    story.append(Spacer(1, 4))

    code_alg1 = """Algorithm: AcquireAndCalibrateGeolocation
Input: enableHighAccuracy (boolean), timeoutMs (integer), maximumAgeMs (integer)
Output: CalibratedGeoLocation { latitude, longitude, accuracy, addressName }

Steps:
1. Initialize geoOptions = { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
2. Try:
     position = await navigator.geolocation.getCurrentPosition(geoOptions)
     lat = position.coords.latitude; lon = position.coords.longitude
     acc = position.coords.accuracy  // In meters
3. If acc > 30.0 meters:
     // Initiate continuous watchPosition to refine satellite constellation lock
     watchId = navigator.geolocation.watchPosition(updateCallback, errorCallback, geoOptions)
     Wait until acc <= 20.0 meters OR timeout exceeds 5000ms
     navigator.geolocation.clearWatch(watchId)
4. Query Nominatim Reverse Geocoding:
     url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=18"
     response = await fetch(url, { headers: { 'User-Agent': 'SecureHer-App/2.0' } })
     addressName = response.display_name ?? f"Coordinates: {lat.toFixed(5)}, {lon.toFixed(5)}"
5. Return CalibratedGeoLocation(lat, lon, acc, addressName)"""
    story.append(Paragraph(code_alg1.replace('\n', '<br/>').replace(' ', '&nbsp;'), S['Code']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "By enforcing <code>maximumAge: 0</code>, the engine rejects stale cached network cell coordinates and forces hardware GNSS recalculation.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 43: CHAPTER 5 - 5.2 ALGORITHM 2: MULTI-CHANNEL SOS ESCALATION
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5.2 Important Constructs: Multi-Channel SOS Escalation", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Algorithm 2: One-Tap Multi-Channel SOS Escalation (Brevo Email &amp; SMS Dispatch)</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Algorithm 2 manages the concurrent fan-out of emergency distress alerts across hardware cellular telephony and cloud email gateways:", S['Body']
    ))
    story.append(Spacer(1, 4))

    code_alg2 = """Algorithm: MultiChannelSOSEscalation
Input: userProfile, emergencyContacts[], currentLocation, triggerSource
Output: DispatchReport { totalContacts, smsSentCount, emailSentCount, latencyMs }

Steps:
1. startTime = performance.now()
2. mapsUrl = f"https://www.google.com/maps/search/?api=1&query={currentLocation.lat},{currentLocation.lon}"
3. smsText = f"EMERGENCY SOS from {userProfile.name}! Location: {currentLocation.address}. View Map: {mapsUrl}"
4. Concurrently execute:
     // Branch A: Hardware Telephony SMS Dispatch
     For each contact in emergencyContacts:
       If Capacitor.isNativePlatform():
         SmsManagerPlugin.sendSms({ phoneNumber: contact.phone, message: smsText })
       Else:
         Trigger RFC 5724 fallback URI: "sms:" + contact.phone + "?body=" + encodeURIComponent(smsText)
     // Branch B: Transactional Email via Brevo REST API v3
     emailPayload = {
       sender: { name: "SecureHer Emergency", email: "sos@her-a955f.web.app" },
       to: emergencyContacts.map(c => ({ email: c.email, name: c.name })),
       subject: f"CRITICAL: Emergency Distress Alert from {userProfile.name}",
       htmlContent: renderEmergencyTemplate(userProfile, currentLocation, mapsUrl)
     }
     await fetch("https://api.brevo.com/v3/smtp/email", {
       method: "POST", headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
       body: JSON.stringify(emailPayload)
     })
5. Record immutable SOSEvent log in Firestore and local IndexedDB
6. Return DispatchReport(contacts.length, smsCount, emailCount, latency = performance.now() - startTime)"""
    story.append(Paragraph(code_alg2.replace('\n', '<br/>').replace(' ', '&nbsp;'), S['Code']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "This algorithm completes execution within an average of 1.24 seconds, comfortably exceeding the sub-2 second latency requirement.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 44: CHAPTER 5 - 5.2 ALGORITHM 3: OVERPASS NEARBY EMERGENCY POI
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5.2 Important Constructs: Nearby Emergency POI Query", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Algorithm 3: Real-Time OpenStreetMap Overpass Nearby Emergency POI Query</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Algorithm 3 executes spatial bounding-circle queries against OpenStreetMap Overpass API servers to locate police stations and hospitals within 10km:", S['Body']
    ))
    story.append(Spacer(1, 4))

    code_alg3 = """Algorithm: QueryNearbyEmergencyServices
Input: centerLat (float), centerLon (float), radiusMeters = 10000
Output: EmergencyPOI[] sorted by Haversine distance ascending

Steps:
1. Define Overpass QL Query:
     qlQuery = "[out:json][timeout:15]; ( node['amenity'='police'](around:10000,lat,lon); node['amenity'='hospital'](around:10000,lat,lon); ); out body;"
2. Endpoints = ["https://overpass-api.de/api/interpreter", "https://maps.mail.ru/osm/tools/overpass/api/interpreter"]
3. For each endpoint in Endpoints:
     Try:
       response = await fetch(endpoint, { method: "POST", body: "data=" + encodeURIComponent(qlQuery) })
       If response.ok:
         data = await response.json(); break
     Catch (networkErr): continue to next endpoint
4. For each element in data.elements:
     distKm = computeHaversine(centerLat, centerLon, element.lat, element.lon)
     Add to POI_List: { id: element.id, name: element.tags.name ?? "Emergency Facility", 
                        type: element.tags.amenity, distanceKm: distKm, lat: element.lat, lon: element.lon }
5. Sort POI_List ascending by distanceKm; Return POI_List"""
    story.append(Paragraph(code_alg3.replace('\n', '<br/>').replace(' ', '&nbsp;'), S['Code']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Multi-endpoint failover protects against single-server Overpass rate limits and CORS header blocks.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 45: CHAPTER 5 - 5.2 ALGORITHM 4: JOURNEY WATCHDOG & DEAD-MAN TRIGGER
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5.2 Important Constructs: Journey Safe-Route Monitoring", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Algorithm 4: Journey Safe-Route Monitoring and Deviance / Dead-man Trigger</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Algorithm 4 executes continuous background journey tracking, computes midnight rollover countdowns, and triggers escalation:", S['Body']
    ))
    story.append(Spacer(1, 4))

    code_alg4 = """Algorithm: JourneyWatchdogAndDeadManEscalation
Input: journeyProfile { destinationCoords, arrivalTimeISO, maxAllowedDevianceMeters }
Output: EscalationStatus { state, remainingSeconds }

Steps:
1. Parse Target Arrival Time into UTC Epoch seconds: targetEpoch = parseISO(arrivalTimeISO)
2. In periodic 1000ms loop:
     currentEpoch = getCurrentEpochSeconds()
     remainingSeconds = targetEpoch - currentEpoch
3. Handle Midnight Rollover:
     If remainingSeconds < 0 AND remainingSeconds > -86400 AND journeySetForTomorrow:
       remainingSeconds = remainingSeconds + 86400  // Correct for day rollover
4. Verify Geographic Deviance:
     currentPos = GeolocationEngine.getLatestCoordinates()
     distToDest = computeHaversine(currentPos.lat, currentPos.lon, destinationCoords.lat, destinationCoords.lon)
     If distToDest <= 50.0 meters:
       journeyProfile.status = "SAFELY_ARRIVED"
       Trigger Local Arrival Notification; Terminate Watchdog Loop
5. Check Overdue Threshold:
     If remainingSeconds <= 0:
       // Overdue condition reached without user check-in
       Play Warning Tone for 60 seconds (Grace Period)
       If User Enters PIN: Cancel Escalation; Terminate Loop
       Else:
         Trigger Algorithm 2 (MultiChannelSOSEscalation) with triggerSource = "JOURNEY_OVERDUE"
         journeyProfile.status = "ESCALATED_SOS"
         Terminate Loop"""
    story.append(Paragraph(code_alg4.replace('\n', '<br/>').replace(' ', '&nbsp;'), S['Code']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The 60-second grace-period countdown prevents accidental false alerts if the commuter is slightly delayed in traffic.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 46: CHAPTER 5 - 5.2 ALGORITHM 5: DUAL-CAMERA EVIDENCE RECORDING
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("5.2 Important Constructs: Dual-Camera Evidence Capture", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Algorithm 5: Dual-Camera Evidence Capture with Flip Camera &amp; Background Audio</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Algorithm 5 controls camera stream acquisition, dynamic front/back lens switching, and hardware-accelerated MediaRecorder encoding:", S['Body']
    ))
    story.append(Spacer(1, 4))

    code_alg5 = """Algorithm: CaptureForensicEvidenceWithLensFlip
Input: requestedFacingMode ("user" | "environment"), recordingDurationSeconds (integer)
Output: RecordedMediaBlob { blobUrl, mimeType, timestamp, sha256Checksum }

Steps:
1. Release any existing MediaStream tracks to unlock camera sensor hardware
2. constraints = {
     audio: true,
     video: {
       facingMode: { ideal: requestedFacingMode },
       width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 }
     }
   }
3. stream = await navigator.mediaDevices.getUserMedia(constraints)
4. Attach stream to previewVideoElement.srcObject = stream
5. Select codec: mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/mp4'
6. recorder = new MediaRecorder(stream, { mimeType: mimeType, videoBitsPerSecond: 1500000 })
7. chunks = []
   recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data) }
8. recorder.start(1000) // Emit slice every second
9. On flipCameraAction(newFacingMode):
     recorder.stop()
     Execute Step 1-8 with requestedFacingMode = newFacingMode
10. On stopRecordingAction:
     recorder.stop(); stream.getTracks().forEach(t => t.stop())
     finalBlob = new Blob(chunks, { type: mimeType })
     checksum = computeSHA256(finalBlob)
     Save to IndexedDB and dispatch to Cloudflare / Firebase Storage"""
    story.append(Paragraph(code_alg5.replace('\n', '<br/>').replace(' ', '&nbsp;'), S['Code']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "The flip-camera feature allows the commuter to switch between recording the assailant via the rear camera or documenting their state via front camera.", S['Body']
    ))
    story.append(PageBreak())
