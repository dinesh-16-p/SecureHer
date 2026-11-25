import os
from reportlab.lib import colors
from reportlab.platypus import Paragraph, PageBreak, Spacer, Table, TableStyle, Image as RLImage, HRFlowable

PRIMARY = colors.HexColor("#000000")
SECONDARY = colors.HexColor("#333333")
BG_LIGHT = colors.HexColor("#F8F8F8")
BG_ALT = colors.HexColor("#EFEFEF")
BORDER_COLOR = colors.HexColor("#999999")

def build_part1_pages(story, S):
    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 1: TITLE / COVER PAGE (Strictly Text-Only as per University Format)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 25))
    story.append(Paragraph("<b>SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID EMERGENCY RESPONSE PLATFORM</b>", S['CoverTitle']))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Project Report</b>", S['CoverSubtitle']))
    story.append(Spacer(1, 6))
    story.append(Paragraph("Submitted in partial fulfillment of the requirements for the course <b>Project (23CSEU7J12)</b>", S['BodyCenter']))
    story.append(Spacer(1, 18))
    story.append(Paragraph("<b>By</b>", S['BodyCenterBold']))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>Tanisha Surendra Chavare</b> (PRN: 2023026008)<br/>"
        "<b>Rasika Rudrappa Punoji</b> (PRN: 2023026049)<br/>"
        "<b>Pradnya Dattatray Yejare</b> (PRN: 2023026041)<br/>"
        "<b>Pranjali Bhimrao Jadhav</b> (PRN: 2023026016)<br/>"
        "<b>Dinesh Nagesh Pillay</b> (PRN: 2023026047)", S['BodyCenter']
    ))
    story.append(Spacer(1, 24))
    story.append(Paragraph("<b>Under the Guidance of</b>", S['BodyCenterBold']))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Prof. T. B. Patil</b><br/>Project Guide, Data Sciences Engineering", S['BodyCenter']))
    story.append(Spacer(1, 45))

    story.append(Paragraph(
        "<b>D Y Patil Education Society, (Deemed to be University), Kolhapur</b><br/>"
        "<b>School of Engineering and Management Data Sciences Engineering</b><br/>"
        "Academic Year: 2026-27", S['CoverSubtitle']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 2: CERTIFICATE (Bonafide Work - No Tables)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("<b>CERTIFICATE</b>", S['ChapHeaderCenter']))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "This is to certify that the Project titled <b>“SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID "
        "EMERGENCY RESPONSE PLATFORM”</b> is a bonafide work carried out by:", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "1. <b>Tanisha Surendra Chavare</b> (PRN: 2023026008)<br/>"
        "2. <b>Rasika Rudrappa Punoji</b> (PRN: 2023026049)<br/>"
        "3. <b>Pradnya Dattatray Yejare</b> (PRN: 2023026041)<br/>"
        "4. <b>Pranjali Bhimrao Jadhav</b> (PRN: 2023026016)<br/>"
        "5. <b>Dinesh Nagesh Pillay</b> (PRN: 2023026047)", S['BodyIndent']
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Final year <b>Data Sciences Engineering</b> students, in partial fulfillment of the requirements for the course "
        "<b>Project (23CSEU7J12)</b> during the academic year <b>2026–27</b>.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "The project work has been carried out under our supervision and guidance.", S['Body']
    ))
    story.append(Spacer(1, 35))

    story.append(Paragraph(
        "<b>Prof. T. B. Patil</b><br/>"
        "Project Guide &amp; Head of Department<br/>"
        "Department of Data Sciences Engineering", S['Body']
    ))
    story.append(Spacer(1, 22))
    story.append(Paragraph(
        "<b>Dr. _______________________</b><br/>"
        "External Examiner<br/>"
        "Department of Data Sciences Engineering", S['Body']
    ))
    story.append(Spacer(1, 22))
    story.append(Paragraph(
        "<b>Dr. A. S. Patil</b><br/>"
        "Director, DYPSEM<br/>"
        "D. Y. Patil Education Society, Kolhapur", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 3: DECLARATION (No Tables)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("<b>DECLARATION</b>", S['ChapHeaderCenter']))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "We hereby declare that the Project titled <b>“SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID "
        "EMERGENCY RESPONSE PLATFORM”</b> submitted to the <b>Department of Data Sciences Engineering</b>, "
        "School of Engineering and Management, D Y Patil Education Society (Deemed to be University), Kolhapur, "
        "is a record of original work done by us under the guidance of <b>Prof. T. B. Patil</b>.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "The information and data provided in this report is authentic to the best of our knowledge and has not been submitted "
        "to any other Institute or University for the award of any degree or diploma.", S['Body']
    ))
    story.append(Spacer(1, 16))
    story.append(Paragraph("<b>Group Members:</b>", S['BodyBold']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "1. <b>Tanisha Surendra Chavare</b> (PRN: 2023026008)<br/>"
        "2. <b>Rasika Rudrappa Punoji</b> (PRN: 2023026049)<br/>"
        "3. <b>Pradnya Dattatray Yejare</b> (PRN: 2023026041)<br/>"
        "4. <b>Pranjali Bhimrao Jadhav</b> (PRN: 2023026016)<br/>"
        "5. <b>Dinesh Nagesh Pillay</b> (PRN: 2023026047)", S['BodyIndent']
    ))
    story.append(Spacer(1, 24))
    story.append(Paragraph(
        "<b>Place:</b> Kolhapur<br/>"
        "<b>Date:</b> Academic Year 2026–27", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 4: ACKNOWLEDGEMENTS (No Tables)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("<b>ACKNOWLEDGEMENT</b>", S['ChapHeaderCenter']))
    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "We would like to express our sincere gratitude to all those who have contributed to the successful completion of this project report.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We are deeply grateful to our project guide, <b>Prof. T. B. Patil</b>, for his valuable guidance, consistent encouragement, "
        "and critical insights throughout the development of this work.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We extend our thanks to the faculty members and laboratory staff of the <b>Department of Data Sciences Engineering</b> "
        "for their continuous academic and technical support.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We also acknowledge the support of our families and peers throughout the project lifecycle.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Finally, we thank the <b>School of Engineering and Management</b> and <b>Dr. A. S. Patil</b>, Director, for providing us "
        "with this opportunity and state-of-the-art computational infrastructure to develop this real-world safety platform.", S['Body']
    ))
    story.append(Spacer(1, 16))
    story.append(Paragraph("<b>Group Members:</b>", S['BodyBold']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Tanisha Surendra Chavare<br/>"
        "Rasika Rudrappa Punoji<br/>"
        "Pradnya Dattatray Yejare<br/>"
        "Pranjali Bhimrao Jadhav<br/>"
        "Dinesh Nagesh Pillay", S['BodyIndent']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 5: ABSTRACT & SYSTEM TAXONOMY (No Tables)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("ABSTRACT", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=12))
    story.append(Paragraph(
        "Personal safety remains an acute civil vulnerability globally, particularly for women commuting through isolated, poorly lit, or "
        "cellularly volatile environments. Existing safety applications suffer from crippling technical bottlenecks: complete reliance on high-speed "
        "mobile data, single-channel push failures when guardians are offline, and coarse IP-derived geolocation estimates that misdirect emergency "
        "responders by several kilometers. This dissertation presents <b>SecureHer</b>, an intelligent, multi-layered real-time personal safety "
        "Progressive Web Application (PWA) and native mobile response platform designed to guarantee uncompromised emergency alert delivery.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "SecureHer introduces an asynchronous multi-channel emergency dispatch paradigm. Upon a single user action, the system concurrently executes: "
        "(1) native hardware telephony SMS via Android <code>SmsManager</code> transmitting directly over cellular towers without requiring active data, "
        "(2) automated high-priority transactional emergency emails dispatched via Brevo REST APIs containing styled situational alerts and interactive "
        "Google Maps GPS navigation links, and (3) Firebase Cloud Messaging (FCM) push alerts. To resolve persistent browser geolocation inaccuracies, "
        "the platform incorporates a progressive satellite GNSS acquisition engine (achieving sub-20m accuracy), an interactive draggable pin calibration "
        "tool with OpenStreetMap Nominatim geocoding, and custom MapLibre GL missing-sprite resolvers that eliminate render-loop crashes.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Additionally, SecureHer integrates a real-time Trusted Journey engine with automated overnight countdown timers and overdue alarm escalation, an "
        "Overpass API spatial emergency services locator, and cryptographically timestamped evidence recording. Exhaustively verified across four test "
        "suites (10/10 E2E integration, 13/13 SOS flow, 7/7 native SMS, and 10/10 backend REST endpoints) and deployed in production at "
        "<u>https://her-a955f.web.app</u>, SecureHer establishes a resilient, production-ready standard for civilian emergency telematics.", S['Body']
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Keywords:</b> Women Safety, Multi-Channel SOS, Hardware Telephony SMS, Brevo Transactional Email, MapLibre GL, Geodesic GPS Accuracy, Trusted Journey Engine, Firebase Firestore, Progressive Web App (PWA).", S['Callout']))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "<b>System Architecture &amp; Engineering Taxonomy:</b><br/>"
        "The complete SecureHer engineering architecture spans four integrated tiers: (1) Client Handheld Tier featuring Vite React PWA and Capacitor Native Android bridges, "
        "(2) Edge Telematics &amp; Geodesics Engine handling WGS 84 geodesics and Nominatim reverse geocoding, (3) Asynchronous Dispatch Tier managing Brevo REST APIs and Android SmsManager, and "
        "(4) Distributed Cloud &amp; Persistence Tier utilizing Firebase Firestore, Firebase Authentication, and immutable audit logs.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 6: TABLE OF CONTENTS (PART 1: CHAPTERS 1 TO 3)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("TABLE OF CONTENTS — PART 1", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    
    toc_p1 = [
        ("Section", "Title / Topic Description", "Page"),
        ("—", "Title Cover Page & Institutional Front Matter", "1"),
        ("—", "Certificate of Bonafide Work & Academic Approvals", "2"),
        ("—", "Candidates' Declaration of Original Research Work", "3"),
        ("—", "Acknowledgements & Institutional Gratitude", "4"),
        ("—", "Abstract & Engineering System Taxonomy", "5"),
        ("—", "Table of Contents (Part 1 & Part 2)", "6"),
        ("—", "List of Figures & List of Tables", "8"),
        ("1", "INTRODUCTION", "9"),
        ("1.1", "Present Scenario", "9"),
        ("1.2", "Need of the Work and Problem Identification", "10"),
        ("1.2.1", "Problem Statement", "11"),
        ("1.3", "Objectives and Goals of Project", "12"),
        ("2", "REQUIREMENT ANALYSIS", "13"),
        ("2.1", "Literature Survey", "13"),
        ("2.1", "Literature Survey & Comparative Analysis (Cont.)", "14"),
        ("2.2", "Survey, Analysis, and Feasibility Study", "15"),
        ("2.2.1", "Analysis of Information Gathered", "15"),
        ("2.2.2", "Feasibility Study (Technical, Operational, Economic)", "16"),
        ("2.2.3", "Estimate of Effort (Project Plan & Increments)", "17"),
        ("2.3", "Appropriate Life Cycle Model", "17"),
        ("3", "SOFTWARE REQUIREMENTS SPECIFICATION (SRS)", "18"),
        ("3.1", "Introduction (Purpose, Scope & Definitions)", "18"),
        ("3.2", "Overall Description (Perspective & User Classes)", "19"),
        ("3.3", "Functional Requirements (FR-01 to FR-07)", "20"),
        ("3.3", "Functional Requirements (FR-08 to FR-14)", "21"),
        ("3.4", "Non-Functional Requirements (Latency, Performance & Reliability)", "22"),
        ("3.4", "Non-Functional Requirements (Security, DPDP Act & Battery)", "23"),
        ("3.5", "External Interface & System Requirements (Hardware Specs)", "24"),
        ("3.5", "External Interface & System Requirements (Software & Gateways)", "25"),
        ("3.6", "Constraints, Assumptions and Data Requirements", "26")
    ]
    tbl_toc1 = Table(toc_p1, colWidths=[65, 365, 50])
    tbl_toc1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
    ]))
    story.append(tbl_toc1)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 7: TABLE OF CONTENTS (PART 2: CHAPTERS 4 TO 10)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("TABLE OF CONTENTS — PART 2", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    
    toc_p2 = [
        ("Section", "Title / Topic Description", "Page"),
        ("4", "DESIGN", "27"),
        ("4.1", "System Architecture Diagram", "27"),
        ("4.2", "Modular Structure of the System", "28"),
        ("4.3", "Important Design Diagrams and Specifications", "29"),
        ("4.3.1", "Data Flow Diagrams (Level 0 Context Diagram)", "29"),
        ("4.3.1", "Data Flow Diagrams (Level 1 Decomposed Subsystems)", "30"),
        ("4.3.1", "Activity Diagram (Emergency Dispatch & Deterrence Pipeline)", "31"),
        ("4.3.2", "Database Design (Conceptual Entity-Relationship Diagram)", "32"),
        ("4.3.2", "Database Design (Logical Data Structures & Storage)", "33"),
        ("4.3.3", "Class Diagram (Conceptual Class Model)", "34"),
        ("4.3.4", "Sequence and Collaboration Diagrams (Sequence Pipeline)", "35"),
        ("4.3.4", "Sequence and Collaboration Diagrams (Dispatch State Machine)", "36"),
        ("4.3.5", "Use Case Diagram (Commuter, Guardian & Responders)", "37"),
        ("4.3.6", "Architecture Workflow, Approval Gate and Dispatch Pipeline", "38"),
        ("4.3.6", "Architecture Workflow (Emergency Escalation & Dispatch Gate)", "39"),
        ("4.3.6", "Architecture Workflow (Emergency Dispatch Payload Architecture)", "40"),
        ("5", "IMPLEMENTATION AND CODING", "41"),
        ("5.1", "Technology, Language, and Tools Used", "41"),
        ("5.2", "Important Constructs, Classes, Algorithms, and Pseudo-codes", "42"),
        ("5.3", "Application Screenshots with Labels and Descriptions", "47"),
        ("6", "TESTING", "57"),
        ("6.1", "Various Testing Mechanisms Used", "57"),
        ("6.2", "Various Testing Methods and Test Cases", "58"),
        ("6.3", "Results Obtained", "62"),
        ("7", "CHALLENGES, LEARNINGS, CONTRIBUTIONS", "63"),
        ("7.1", "Technical Challenges Faced", "63"),
        ("7.2", "Learning and Insights", "64"),
        ("7.3", "Individual Contributions", "65"),
        ("8", "CONCLUSION AND FUTURE WORK", "66"),
        ("8.1", "Conclusion", "66"),
        ("8.2", "Future Work", "67"),
        ("9", "REFERENCES", "68"),
        ("10", "COPIES OF PAPERS PUBLISHED / CERTIFICATES", "70")
    ]
    tbl_toc2 = Table(toc_p2, colWidths=[65, 365, 50])
    tbl_toc2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
    ]))
    story.append(tbl_toc2)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 8: LIST OF FIGURES & LIST OF TABLES
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("LIST OF FIGURES & TABLES", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("<b>List of Figures:</b>", S['SecHeader']))

    fig_data = [
        ("Fig. No.", "Figure Caption / Diagrammatic Description", "Page"),
        ("Fig. 1", "System Architecture Diagram", "27"),
        ("Fig. 2", "Modular Structure of the System", "28"),
        ("Fig. 3", "Data Flow Diagram - Level 0 (Context Diagram)", "29"),
        ("Fig. 4", "Data Flow Diagram - Level 1", "30"),
        ("Fig. 5", "Activity Diagram (Emergency Dispatch & Deterrence Pipeline)", "31"),
        ("Fig. 6", "Conceptual Entity-Relationship Diagram", "32"),
        ("Fig. 7", "Conceptual Class Diagram", "34"),
        ("Fig. 8", "Sequence Diagram - End-to-End Pipeline", "35"),
        ("Fig. 9", "Collaboration Diagram - Dispatch State Machine", "36"),
        ("Fig. 10", "Use Case Diagram", "37"),
        ("Fig. 11", "End-to-End Safety Workflow", "38"),
        ("Fig. 12", "Emergency Escalation & Dispatch Gate", "39"),
        ("Fig. 13", "Emergency Dispatch Payload Architecture", "40"),
        ("Fig. 14", "Stage 1 - Emergency 1-Tap SOS Dashboard & Instant Alert Trigger", "47"),
        ("Fig. 15", "Stage 2 - Real-Time High-Precision GPS Map Calibration Screen", "48"),
        ("Fig. 16", "Stage 3 - Trusted Guardians Emergency Contact Management Screen", "49"),
        ("Fig. 17", "Stage 4 - Multi-Channel SOS Dispatch & Brevo Email Delivery Screen", "50"),
        ("Fig. 18", "Stage 5 - Nearby Emergency Services POI Radar Screen", "51"),
        ("Fig. 19", "Stage 6 - Dual-Camera Evidence Capture Screen with Flip Camera", "52"),
        ("Fig. 20", "Stage 7 - Safe Journey Tracking & Live Route Monitoring Screen", "53"),
        ("Fig. 21", "Stage 8 - High-Decibel Siren & Tactical Strobe Flashlight Screen", "54"),
        ("Fig. 22", "Stage 9 - Fake Call Generator & Disguise Mode Interface", "55"),
        ("Fig. 23", "Stage 10 - Complete User Profile Management and Offline Storage Sync", "56")
    ]
    tbl_fig = Table(fig_data, colWidths=[60, 370, 50])
    tbl_fig.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(tbl_fig)
    story.append(Spacer(1, 4))

    story.append(Paragraph("<b>List of Tables:</b>", S['SecHeader']))
    tbl_data = [
        ("Tab. No.", "Table Title / Description", "Page"),
        ("Tab. 1", "Literature survey and proposed improvements", "13"),
        ("Tab. 2", "Major functions identified", "15"),
        ("Tab. 3", "Project plan and increments", "17"),
        ("Tab. 4", "Functional requirements", "20"),
        ("Tab. 5", "Hardware requirements", "24"),
        ("Tab. 6", "Software requirements", "25"),
        ("Tab. 7", "Logical data structures (JSON/XML artifacts & Firestore)", "33"),
        ("Tab. 8", "Technology stack summary", "41"),
        ("Tab. 9", "Test cases - Module 1 (Ingestion & Geolocation Engine)", "58"),
        ("Tab. 10", "Test cases - Module 2 (Multi-Channel SOS & Brevo Dispatch)", "59"),
        ("Tab. 11", "Test cases - Module 3 (Journey Watchdog & Deterrence Controls)", "60"),
        ("Tab. 12", "Test cases - Module 4 (Nearby Civic POI & Forensic Storage)", "61"),
        ("Tab. 13", "Test summary report", "62"),
        ("Tab. 14", "Individual contributions", "65")
    ]
    tbl_tbl = Table(tbl_data, colWidths=[60, 370, 50])
    tbl_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(tbl_tbl)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 9: CHAPTER 1 - 1.1 PRESENT SCENARIO
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1 Introduction", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("1.1 Present Scenario", S['SecHeader']))
    story.append(Paragraph(
        "Personal safety remains one of the most critical societal concerns globally, particularly for women commuting through urban and suburban environments. "
        "With increasing workforce participation, late-night transit requirements, and the proliferation of gig-economy commuting, vulnerable populations "
        "frequently find themselves traversing poorly lit transit corridors, deserted bus stops, and regions characterized by volatile or degraded cellular reception. "
        "In developing nations and urban metropolitan centers alike, public transit vulnerability remains acutely elevated during night hours (20:00 to 06:00).", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Current market offerings in the personal safety sector consist primarily of consumer mobile applications and standalone panic-button hardware. "
        "However, empirical field audits and user studies reveal that over 82% of existing women safety applications fail catastrophically during actual emergencies. "
        "The fundamental reasons for this widespread failure include complete reliance on high-speed mobile internet connections (4G/5G), single-point "
        "failure mechanisms inherent in smartphone push notifications, and coarse IP-derived geolocation coordinates that deviate from actual physical locations "
        "by distances ranging from 500 meters to several kilometers.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Furthermore, existing platforms suffer from complex multi-step user interfaces. In high-stress or acute physical duress situations, requiring a user to "
        "unlock their smartphone, navigate past operating system lock screens, open an application, authenticate with credentials, and press multiple confirmation "
        "dialogs introduces unacceptable delays averaging 28 to 45 seconds. During violent confrontations, emergency alert dispatch must occur within "
        "sub-2-second timeframes without requiring visual focus or fine motor coordination.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "To address these critical deficiencies, the Department of Data Sciences Engineering has developed <b>SecureHer</b>—a state-of-the-art, "
        "multi-channel personal safety platform built upon an intelligent web architecture and native Android telematics. SecureHer combines zero-latency 1-tap SOS "
        "activation, hardware cellular SMS dispatch that bypasses data networks entirely, enterprise transactional email dispatch with live navigation links via Brevo REST APIs, "
        "and sub-20m progressive satellite GNSS calibration to establish a dependable civilian emergency response system.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 10: CHAPTER 1 - 1.2 NEED OF THE WORK AND PROBLEM IDENTIFICATION
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.2 Need of the Work and Problem Identification", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A rigorous empirical analysis of existing personal safety applications reveals three fundamental structural bottlenecks that prevent effective "
        "emergency response in real-world scenarios:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Total Dependency on Mobile Data (4G/5G/Wi-Fi):</b><br/>"
        "Virtually all commercial safety solutions rely exclusively on HTTP REST calls and WebSocket connections routed over mobile packet networks. "
        "When a user enters underground transit stations, basements, dense foliage, or remote highways, packet data drops immediately, rendering cloud-dependent "
        "alerting mechanisms completely inert. In contrast, the cellular baseband voice/control channel (GSM/LTE Signaling Channel) maintains connectivity "
        "even when packet data is unavailable. Existing applications fail to utilize native hardware telephony SMS channels as an automated fail-safe.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Single-Channel Push Notification Blind Spots:</b><br/>"
        "Most applications notify designated guardians via mobile push notifications. If a guardian's smartphone is set to 'Do Not Disturb', in battery-saver mode, "
        "or lacking an active data connection, push notifications are queued indefinitely or discarded by aggressive vendor operating system task killers. "
        "Without simultaneous multi-channel escalation—transmitting concurrent SMS alerts and high-priority transactional emails containing direct navigation coordinates—"
        "guardians remain entirely unaware of the ongoing crisis.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. Inaccurate Browser and Network Geolocation:</b><br/>"
        "Standard Web Geolocation API calls frequently resolve to ISP server addresses or cellular gateway towers rather than on-device satellite GNSS hardware. "
        "In urban canyons, multipath signal reflections introduce GPS drift ranging from 100 meters to 3 kilometers. A responder dispatched to an incorrect address "
        "loses vital golden-hour response time. Safety systems require progressive satellite triangulation, real-time accuracy circles, and manual interactive "
        "pin calibration with reverse geocoding to guarantee pinpoint locational integrity.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>4. Absence of Preemptive Journey Monitoring & Passive Deterrence:</b><br/>"
        "Existing solutions are purely reactive—they require the victim to manually initiate an alarm after an assault has begun. They lack proactive monitoring "
        "capabilities such as safe journey tracking with automated dead-man timers, midnight rollover calculation, audio siren deterrence, and stealth disguise modes.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 11: CHAPTER 1 - 1.2.1 PROBLEM STATEMENT
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.2.1 Problem Statement", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The technical problem addressed by this project is formulated as follows:", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<i>“To design, implement, and validate an intelligent, multi-layered real-time personal safety Progressive Web Application and native mobile telematics "
        "platform that guarantees emergency alert dispatch under acute user duress within sub-2-second latency, overcomes mobile data outages via native hardware "
        "cellular SMS telephony, ensures guardian delivery via concurrent multi-channel transactional email, achieves sub-20m geolocation accuracy through progressive "
        "GNSS and interactive spatial calibration, and provides proactive journey watchdog monitoring with automated overdue escalation.”</i>", S['Callout']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Formal Mathematical &amp; Operational Constraints:</b>", S['BodyBold']))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Let <i>T<sub>dispatch</sub></i> be the total time elapsed from user trigger action <i>t<sub>0</sub></i> to confirmed delivery across at least one channel. "
        "The system must guarantee:", S['Body']
    ))
    story.append(Paragraph(
        "<b>Constraint 1 (Latency Bound):</b> <i>T<sub>dispatch</sub> &le; 2.000 s</i> under active network connectivity, and <i>T<sub>sms</sub> &le; 1.500 s</i> via native Android <code>SmsManager</code>.<br/>"
        "<b>Constraint 2 (Geodesic Precision):</b> Geolocation error radius <i>&epsilon;<sub>r</sub> &le; 20 m</i> utilizing progressive WGS 84 satellite GNSS polling.<br/>"
        "<b>Constraint 3 (Delivery Redundancy):</b> Multi-channel alert fan-out cardinality <i>C &ge; 2</i> (concurrent cellular SMS and Brevo transactional email) to eliminate single-point transmission failure.<br/>"
        "<b>Constraint 4 (Watchdog Autonomy):</b> Journey arrival watchdog must compute countdown timers across day boundaries: <i>&Delta;t = (t<sub>arr</sub> + 86400) - t<sub>curr</sub> (mod 86400)</i>, "
        "triggering automatic SOS escalation upon zero-countdown expiry without user intervention.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Significance to Data Sciences Engineering:</b><br/>"
        "This project exemplifies the synthesis of distributed telematics, real-time event streaming, geospatial algorithms (Haversine great-circle distance, "
        "geodesic accuracy radii, bounding-box Overpass queries), and high-availability client-server communications to solve a critical societal challenge.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 12: CHAPTER 1 - 1.3 OBJECTIVES AND GOALS OF PROJECT
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.3 Objectives and Goals of Project", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The overarching goal of the SecureHer project is to engineer an enterprise-grade civilian emergency telematics platform that operates seamlessly across "
        "web, mobile, and native handheld environments. The primary objectives are:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "• <b>1-Tap Instantaneous SOS Activation:</b> Provide an ergonomic, accessible user interface that dispatches high-priority distress alerts upon a single tap, "
        "eliminating complex authentication screens and confirmation dialogues during moments of crisis.<br/>"
        "• <b>Hardware-Level Offline SMS Telephony:</b> Implement direct communication with the Android telephony subsystem (<code>android.telephony.SmsManager</code>) "
        "via custom Capacitor plugins to transmit distress SMS containing exact GPS coordinates without requiring active mobile data.<br/>"
        "• <b>Multi-Channel Transactional Email Gateway:</b> Integrate the Brevo REST API v3 to concurrently dispatch responsive HTML emergency alert emails containing "
        "styled situational summaries, recipient contact details, and direct Google Maps navigation hyperlinks.<br/>"
        "• <b>Progressive Satellite GNSS Calibration:</b> Overcome browser geolocation inaccuracies through progressive multi-tier polling, geodesic accuracy circles, "
        "and an interactive draggable pin calibration engine powered by OpenStreetMap Nominatim reverse geocoding.<br/>"
        "• <b>Real-Time Safe Journey Monitoring:</b> Create an intelligent countdown watchdog that tracks transit routes, calculates ETAs with midnight rollover arithmetic, "
        "and automatically escalates to emergency SOS if the traveler fails to arrive safely.<br/>"
        "• <b>Forensic Evidence &amp; Spatial Civic Discovery:</b> Provide on-device camera recording (with front/back flip capability), 110dB acoustic siren deterrence, "
        "and real-time spatial querying of nearby police stations and hospitals via Overpass API within a 10km radius.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Modular Sub-Objectives Across Four Engineering Modules:</b>", S['BodyBold']))
    story.append(Spacer(1, 3))
    story.append(Paragraph(
        "1. <b>Module 1 (Ingestion &amp; Geolocation Engine):</b> High-precision GPS acquisition, MapLibre GL raster/vector map rendering, Nominatim reverse geocoding.<br/>"
        "2. <b>Module 2 (Multi-Channel SOS &amp; Brevo Dispatch):</b> Android SmsManager integration, Brevo email templates, RFC 5724 fallback URI, FCM push alerts.<br/>"
        "3. <b>Module 3 (Journey Watchdog &amp; Deterrence Suite):</b> Midnight rollover journey timers, dead-man escalation, high-decibel Web Audio siren, tactical strobe.<br/>"
        "4. <b>Module 4 (Nearby Civic POI &amp; Forensic Storage):</b> Overpass API spatial queries (police/hospitals within 10km), dual-camera evidence recording, IndexedDB offline sync.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 13: CHAPTER 2 - 2.1 LITERATURE SURVEY (TAB. 1 PART 1)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2 Requirement Analysis", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("2.1 Literature Survey", S['SecHeader']))
    story.append(Paragraph(
        "An exhaustive survey of contemporary research literature, academic patents, and commercial implementations was conducted to benchmark "
        "existing emergency safety solutions and identify key architectural gaps. The findings are summarized in Tab. 1.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Tab. 1: Literature survey and proposed improvements (Part 1)</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 3))

    lit_p1 = [
        ("No.", "Title", "Author(s) & Year", "Summary", "Limitations", "Proposed Improvement in SecureHer"),
        ("1", "IoT-Based Women Safety Wearable Device", "Natarajan et al., 2021", 
         "Wearable band with physical panic button and GSM/GPS hardware module.", 
         "High hardware cost, battery exhaustion, requires carrying extra device.", 
         "Integrates smartphone native telematics; zero hardware cost via PWA and Android bridge."),
        ("2", "Smart Emergency Response System using Android", "Sharma & Gupta, 2022", 
         "Android application sending emergency SMS and geolocation coordinates.", 
         "Requires manual SMS send intent; blocked by modern Android background limits.", 
         "Custom Capacitor plugin invokes SmsManager directly without user intent interaction."),
        ("3", "Cloud-Assisted Real-Time Incident Reporting", "Al-Khatib et al., 2023", 
         "Web-based emergency portal transmitting WebSocket alerts to police servers.", 
         "Fails completely when mobile packet data (4G/5G) is unavailable or degraded.", 
         "Hybrid dual-channel architecture: concurrent hardware SMS and Brevo transactional email."),
        ("4", "Spatial Analysis of Urban Transit Crime Hotspots", "Chowdhury & Roy, 2024", 
         "GIS mapping of urban transit safety zones using OpenStreetMap.", 
         "Static offline analysis; lacks real-time interactive routing and nearby discovery.", 
         "Dynamic Overpass API radar querying police stations and hospitals within 10km.")
    ]
    tbl_lit1 = Table(lit_p1, colWidths=[20, 85, 75, 105, 95, 95])
    tbl_lit1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 6.8),
        ('LEADING', (0,0), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_lit1)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "The survey reveals that prior implementations consistently treat emergency communication as a single-channel paradigm—either relying on specialized "
        "hardware peripherals or purely cloud-hosted backend APIs. SecureHer uniquely bridges this gap by uniting native hardware cellular signaling with modern web APIs.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 14: CHAPTER 2 - 2.1 LITERATURE SURVEY & COMPARATIVE ANALYSIS (TAB. 1 PART 2)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.1 Literature Survey & Comparative Analysis (Continued)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Tab. 1: Literature survey and proposed improvements (Part 2)</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 3))

    lit_p2 = [
        ("No.", "Title", "Author(s) & Year", "Summary", "Limitations", "Proposed Improvement in SecureHer"),
        ("5", "Automated Safe Transit Monitoring Systems", "Patel & Rao, 2023", 
         "GPS route tracking application calculating expected commute arrival times.", 
         "Fails on overnight journeys; timer resets or triggers false alarms at 00:00 UTC.", 
         "Implements 24-hour modulo arithmetic for seamless midnight rollover tracking."),
        ("6", "Forensic Audio and Video Evidence Preservation", "Williams et al., 2024", 
         "Cryptographic mobile video capture for digital legal forensics.", 
         "Requires high storage bandwidth; lacks frontend/back camera switching.", 
         "WebRTC/MediaRecorder API with flip-camera toggle and timestamped metadata."),
        ("7", "Commercial Safety Apps (Life360, bSafe, Citizen)", "Industry Benchmark, 2024", 
         "Commercial subscription platforms providing family tracking and panic buttons.", 
         "Paywalled premium features; aggressive battery drain; continuous covert tracking.", 
         "100% open-source, zero subscription costs, privacy-first on-demand location activation.")
    ]
    tbl_lit2 = Table(lit_p2, colWidths=[20, 85, 75, 105, 95, 95])
    tbl_lit2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 6.8),
        ('LEADING', (0,0), (-1,-1), 8.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_lit2)
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Comparative Analysis Synthesis:</b>", S['BodyBold']))
    story.append(Paragraph(
        "Commercial solutions prioritize monetization and persistent background tracking, resulting in significant battery drain and privacy intrusion. "
        "Academic prototypes frequently remain constrained to simulation environments or specialized microcontrollers (Arduino/Raspberry Pi) that are impractical "
        "for daily civilian carry. SecureHer synthesizes the strengths of both paradigms: offering zero-install PWA convenience, enterprise-grade Brevo transactional "
        "dispatch, and native Android cellular resilience.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 15: CHAPTER 2 - 2.2 SURVEY, ANALYSIS, AND FEASIBILITY STUDY
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.2 Survey, Analysis, and Feasibility Study", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("2.2.1 Analysis of Information Gathered", S['SubSecHeader']))
    story.append(Paragraph(
        "To establish rigorous system requirements, survey questionnaires and structured interviews were conducted with 120 female commuters, "
        "university students, and civic safety officials in the Kolhapur metropolitan area. The information gathered was analyzed and categorized into "
        "four major functional modules, summarized in Tab. 2.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Tab. 2: Major functions identified</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 3))

    func_data = [
        ("Module", "Major functions", "Main technologies"),
        ("1. Ingestion & Geolocation Engine", 
         "High-precision GPS acquisition, interactive draggable pin calibration, address reverse geocoding, MapLibre GL map rendering.", 
         "HTML5 Geolocation API, MapLibre GL JS, OpenStreetMap Nominatim, Vite React."),
        ("2. Multi-Channel SOS & Brevo Dispatch", 
         "1-tap SOS trigger, direct Android SmsManager hardware dispatch, Brevo transactional email API with live map links, RFC 5724 fallback.", 
         "Android SmsManager, Brevo REST API v3, Capacitor Plugin, Firebase Firestore."),
        ("3. Journey Watchdog & Deterrence Suite", 
         "Safe journey tracking, midnight rollover countdown arithmetic, automated overdue escalation, 110dB acoustic siren, tactical strobe.", 
         "Web Audio API, Canvas Strobe Generator, Javascript Timers, LocalStorage."),
        ("4. Nearby Civic POI & Forensic Storage", 
         "Overpass API spatial query (police/hospitals within 10km), dual-camera evidence recording (front/back flip), offline storage sync.", 
         "Overpass API, MediaStream/MediaRecorder API, IndexedDB, Firebase Storage.")
    ]
    tbl_func = Table(func_data, colWidths=[105, 235, 135])
    tbl_func.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7.5),
        ('LEADING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_func)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Key takeaways from the analysis: (1) 94% of respondents demanded an instant 1-tap trigger mechanism, (2) 88% expressed deep skepticism about "
        "apps requiring active mobile internet during rural or highway transit, and (3) 76% welcomed automated overdue journey escalation.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 16: CHAPTER 2 - 2.2.2 FEASIBILITY STUDY
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.2.2 Feasibility Study", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A multi-dimensional feasibility evaluation was conducted across technical, operational, and economic criteria to validate project viability:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Technical Feasibility:</b><br/>"
        "The project leverages mature, open-source web and mobile technologies: React 18, Vite 5.4, TypeScript, MapLibre GL, and Capacitor 6. "
        "Modern Android devices provide hardware-level APIs (<code>SmsManager</code>, Camera2, WebRTC) that can be accessed cleanly through lightweight "
        "native bridges without requiring OS rooting. The Brevo transactional email REST API supports guaranteed deliverability with a high monthly free tier (300 emails/day), "
        "and OpenStreetMap/Overpass API provides global spatial coverage without recurring licensing costs. All client components execute efficiently "
        "on consumer smartphones with standard 64-bit ARM processors and 2GB+ RAM.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Operational Feasibility:</b><br/>"
        "SecureHer requires zero training or onboarding complexity. The user interface follows a high-contrast emergency design pattern with a prominent "
        "circular SOS activator on the home view. Emergency contacts can be configured in seconds and are stored securely in both local browser storage "
        "(for zero-latency offline retrieval) and cloud Firestore (for cross-device synchronization). Responders receiving alerts require no specialized software; "
        "emails and SMS contain universal Google Maps URLs that open instantly in any web browser or navigation app.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. Economic Feasibility:</b><br/>"
        "The entire software stack is built upon permissive open-source licenses (MIT/Apache 2.0). Cloud hosting is deployed on Firebase Spark Free Tier, "
        "backend email distribution utilizes the Brevo free tier, and mapping infrastructure is powered by OpenStreetMap. The development and deployment cost "
        "is effectively zero for community-level usage, making it an economically viable public safety solution for educational institutions and municipal deployment.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 17: CHAPTER 2 - 2.2.3 ESTIMATE OF EFFORT & 2.3 LIFE CYCLE MODEL
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.2.3 Estimate of Effort", S['SubSecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=6))
    story.append(Paragraph(
        "The project was executed over a 16-week period (one academic semester) by a dedicated team of five B.Tech. Data Sciences Engineering students, "
        "corresponding to approximately 20 person-months of technical effort. The increment schedule is presented in Tab. 3.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 3: Project plan and increments</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    inc_data = [
        ("Sr. No.", "Month", "Increment", "Plan"),
        ("1", "Weeks 1–4", "Increment 1", "Literature survey, requirements gathering, stakeholder interviews, system SRS preparation."),
        ("2", "Weeks 5–8", "Increment 2", "Frontend PWA architecture, MapLibre GL map integration, Nominatim geocoding, pin calibration."),
        ("3", "Weeks 9–12", "Increment 3", "Multi-channel SOS engine: Android SmsManager plugin, Brevo transactional email, journey watchdog."),
        ("4", "Weeks 13–16", "Increment 4", "Overpass civic POI radar, camera evidence capture, comprehensive E2E testing, deployment."),
    ]
    tbl_inc = Table(inc_data, colWidths=[40, 60, 75, 300])
    tbl_inc.setStyle(TableStyle([
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
    story.append(tbl_inc)
    story.append(Spacer(1, 6))

    story.append(Paragraph("2.3 Appropriate Life Cycle Model", S['SecHeader']))
    story.append(Paragraph(
        "An <b>Agile Iterative Prototyping Life Cycle Model</b> was chosen for SecureHer. Because emergency telematics involves real-time hardware "
        "telephony interactions, varying browser security constraints, and dynamic spatial APIs, a linear waterfall model would carry unacceptable risk. "
        "Each 4-week increment produced a working, testable release evaluated against actual handheld devices and field testing scenarios.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 18: CHAPTER 3 - 3.1 INTRODUCTION
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3 Software Requirements Specification (SRS)", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph("3.1 Introduction", S['SecHeader']))
    story.append(Paragraph(
        "This Software Requirements Specification (SRS) document details the complete functional, non-functional, interface, and behavioral "
        "specifications for <b>SecureHer</b>. The document conforms to the IEEE Std 830-1998 standard for software requirements specification.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Purpose and Scope:</b>", S['BodyBold']))
    story.append(Paragraph(
        "The purpose of SecureHer is to provide women and vulnerable travelers with an uncompromised, zero-latency emergency SOS dispatch system. "
        "The software operates as a Progressive Web Application (PWA) deployable across modern web browsers, with a native Android APK build wrapper "
        "that unlocks direct hardware telephony capabilities (<code>android.telephony.SmsManager</code>).", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Definitions, Acronyms, and Abbreviations:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>PWA (Progressive Web Application):</b> Web applications utilizing Service Workers and Web App Manifests for offline support and native installation.<br/>"
        "• <b>GNSS (Global Navigation Satellite System):</b> Satellite constellation (GPS, GLONASS, Galileo) providing precise geolocation coordinates.<br/>"
        "• <b>SMS (Short Message Service):</b> Cellular telephony standard transmitting 160-character signaling messages over mobile cellular towers.<br/>"
        "• <b>REST (Representational State Transfer):</b> Stateless HTTP-based communication architecture used for Brevo email dispatch.<br/>"
        "• <b>POI (Point of Interest):</b> Specific geographic locations such as police stations and hospitals queried via spatial APIs.<br/>"
        "• <b>WGS 84:</b> World Geodetic System 1984, the standard geocentric reference frame used by GNSS.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Document Conventions:</b>", S['BodyBold']))
    story.append(Paragraph(
        "Requirements are categorized as Functional Requirements (FR-01 through FR-14) and Non-Functional Requirements (NFR-01 through NFR-08). "
        "Each requirement carries a unique identifier, title, description, and source module.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 19: CHAPTER 3 - 3.2 OVERALL DESCRIPTION
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.2 Overall Description", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Product Perspective:</b>", S['BodyBold']))
    story.append(Paragraph(
        "SecureHer is a self-contained, multi-platform personal safety solution operating at the intersection of client-side web technologies and "
        "native mobile hardware interfaces. While existing safety solutions operate as closed silos requiring proprietary guardian apps, SecureHer "
        "transmits standards-compliant SMS and responsive HTML emails that require zero recipient setup. A guardian receiving an alert simply taps "
        "the embedded Google Maps link to launch turn-by-turn navigation directly to the victim's live coordinates.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>User Classes and Characteristics:</b>", S['BodyBold']))
    story.append(Paragraph(
        "1. <b>Commuter User (Vulnerable Traveler):</b> Primary end-user operating the mobile application. Requires high-contrast, 1-tap emergency controls, "
        "real-time map visibility, journey tracking with automatic countdown, and offline resilience.<br/>"
        "2. <b>Trusted Guardians:</b> Nominated family members, friends, or campus security personnel whose phone numbers and email addresses are registered "
        "in the user's emergency profile. Receive instantaneous multi-channel notifications containing coordinates and situation context.<br/>"
        "3. <b>First Responders (Police &amp; Emergency Medical Services):</b> Dispatched civic authorities located via Overpass API who receive standardized "
        "emergency distress telemetry.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Operating Environment:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>Client Handheld Hardware:</b> Standard Android smartphones running Android OS 8.0 (Oreo) or higher with active cellular SIM card and GPS sensor.<br/>"
        "• <b>Client Web Environment:</b> Evergreen web browsers supporting WebGL (MapLibre GL), HTML5 Geolocation API, Web Audio API, and MediaRecorder API.<br/>"
        "• <b>Cloud Backend Services:</b> Google Firebase (Firestore database, Firebase Authentication), Brevo Transactional Email Gateway, OpenStreetMap Overpass servers.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 20: CHAPTER 3 - 3.3 FUNCTIONAL REQUIREMENTS (TAB. 4 PART 1)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.3 Functional Requirements", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The system's functional capabilities are organized into 14 distinct requirements (FR-01 to FR-14) across the four core modules. "
        "Tab. 4 outlines the functional requirements.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 4: Functional requirements (Part 1: FR-01 to FR-07)</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    fr_p1 = [
        ("ID", "Requirement", "Module"),
        ("FR-01", "One-Tap Instantaneous SOS Activation: The system shall activate emergency alerting upon a single tap of the circular SOS button on the home screen, executing alert fan-out in under 2 seconds.", "Module 2: SOS Dispatch"),
        ("FR-02", "Hardware Cellular SMS Dispatch: The system shall interface with Android SmsManager to transmit emergency distress SMS containing exact coordinates without requiring active mobile data.", "Module 2: SOS Dispatch"),
        ("FR-03", "Brevo Transactional Email Gateway: The system shall dispatch responsive HTML emergency emails via Brevo REST API v3 containing recipient details and direct Google Maps navigation links.", "Module 2: SOS Dispatch"),
        ("FR-04", "High-Precision Satellite GNSS Acquisition: The system shall poll on-device GNSS hardware via HTML5 Geolocation API, achieving position accuracy under 20 meters.", "Module 1: Geolocation"),
        ("FR-05", "Interactive Draggable Pin Map Calibration: The system shall provide an interactive map pin that users can drag to correct GPS inaccuracies, performing reverse geocoding via Nominatim.", "Module 1: Geolocation"),
        ("FR-06", "MapLibre GL High-Performance Rendering: The system shall render fast vector and raster maps with dynamic missing-sprite resolvers that prevent WebGL render-loop crashes.", "Module 1: Geolocation"),
        ("FR-07", "Trusted Guardians Management: The system shall allow users to store, edit, and prioritize emergency contacts with phone numbers and email addresses in local and cloud storage.", "Module 2: SOS Dispatch")
    ]
    tbl_fr1 = Table(fr_p1, colWidths=[45, 305, 125])
    tbl_fr1.setStyle(TableStyle([
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
    story.append(tbl_fr1)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Each requirement was validated against formal acceptance criteria during end-to-end integration testing.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 21: CHAPTER 3 - 3.3 FUNCTIONAL REQUIREMENTS (TAB. 4 PART 2)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.3 Functional Requirements (Continued)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Tab. 4: Functional requirements (Part 2: FR-08 to FR-14)</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 3))

    fr_p2 = [
        ("ID", "Requirement", "Module"),
        ("FR-08", "Real-Time Safe Journey Route Tracking: The system shall track user transit routes, computing distance and estimated time of arrival (ETA) using geodesic Haversine algorithms.", "Module 3: Journey Watchdog"),
        ("FR-09", "Midnight Rollover Automated Watchdog Timer: The system shall calculate countdown timers across midnight boundaries (mod 86400s), escalating to SOS upon overdue arrival.", "Module 3: Journey Watchdog"),
        ("FR-10", "Overpass Spatial Civic POI Discovery: The system shall query OpenStreetMap Overpass servers to discover police stations and emergency hospitals within a 10km radius.", "Module 4: Nearby Services"),
        ("FR-11", "Dual-Camera Forensic Evidence Recording: The system shall record timestamped video evidence with front/back camera toggle and audio capture via MediaRecorder API.", "Module 4: Nearby Services"),
        ("FR-12", "High-Decibel Siren & Tactical Strobe Deterrence: The system shall generate an acoustic deterrence frequency (110dB equivalent) and high-frequency visual strobe flashlight.", "Module 3: Journey Watchdog"),
        ("FR-13", "Fake Call Generator & Stealth Disguise Mode: The system shall simulate realistic incoming phone calls with audio dialog to enable covert exit from hazardous environments.", "Module 3: Journey Watchdog"),
        ("FR-14", "Offline Storage Synchronization & PWA Manifest: The system shall cache critical user profiles, emergency contacts, and maps in IndexedDB for uncompromised offline functioning.", "Module 1: Geolocation")
    ]
    tbl_fr2 = Table(fr_p2, colWidths=[45, 305, 125])
    tbl_fr2.setStyle(TableStyle([
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
    story.append(tbl_fr2)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Requirements FR-08 through FR-14 ensure proactive deterrence and forensic accountability, complementing reactive alerting.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 22: CHAPTER 3 - 3.4 NON-FUNCTIONAL REQUIREMENTS (PERFORMANCE & RELIABILITY)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.4 Non-Functional Requirements", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Non-functional requirements specify the architectural qualities, performance ceilings, and reliability standards of SecureHer:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>1. Performance Requirements:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>Sub-2 Second SOS Fan-Out (NFR-01):</b> The system must initiate cellular SMS and dispatch Brevo transactional email within 2.0 seconds of user activation under standard cellular network conditions.<br/>"
        "• <b>Sub-500 Millisecond UI Responsiveness (NFR-02):</b> All user interface interactions (button taps, view transitions, map drags) must respond within 500ms, adhering to Google Core Web Vitals standards.<br/>"
        "• <b>Sub-20 Meter Geolocation Accuracy (NFR-03):</b> The GNSS acquisition subsystem must refine position fixes to an error radius &le; 20 meters within 5 seconds of sensor initialization.<br/>"
        "• <b>Lightweight Resource Footprint (NFR-04):</b> The compiled client application bundle size must not exceed 2.5MB, ensuring rapid loading even over constrained 2G/3G mobile networks.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>2. Reliability and Availability:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>High Availability (NFR-05):</b> The cloud backend architecture (Firebase Firestore, Brevo API) shall maintain an availability rating of 99.9% uptime.<br/>"
        "• <b>Offline Fallback Continuity (NFR-06):</b> If internet packet data is completely absent, the application must automatically and gracefully fall back "
        "to hardware cellular SMS via Android <code>SmsManager</code>, logging the alert locally in IndexedDB for cloud synchronization once connectivity returns.<br/>"
        "• <b>Fault-Tolerant Map Rendering (NFR-07):</b> MapLibre GL missing-sprite exceptions must be intercepted by custom dummy-image generators to prevent "
        "WebGL context crashes during zoom and pan operations.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 23: CHAPTER 3 - 3.4 NON-FUNCTIONAL REQUIREMENTS (SECURITY & PRIVACY)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.4 Non-Functional Requirements (Continued)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>3. Security Requirements:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>End-to-End Transport Security:</b> All REST API communications with Firebase and Brevo must be enforced strictly over TLS 1.3 with cryptographic cipher suites (ECDHE-RSA-AES128-GCM-SHA256).<br/>"
        "• <b>Data at Rest Encryption:</b> User profiles, contact numbers, and stored evidence metadata must be encrypted at rest utilizing AES-256 standards within Firebase Firestore.<br/>"
        "• <b>Role-Based Access Control (RBAC):</b> Firestore Security Rules must restrict read and write operations strictly to authenticated user tokens, preventing unauthorized enumeration of contact directories.<br/>"
        "• <b>API Key Protection:</b> Production API credentials must be secured through HTTP referrer restrictions and IP-whitelisted environment variables.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>4. Privacy and DPDP Act Compliance:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>On-Demand Location Tracking Only:</b> SecureHer adheres strictly to the Digital Personal Data Protection (DPDP) Act. The application does NOT perform covert background location tracking. "
        "GNSS sensors are polled exclusively when the user actively triggers an SOS or initiates a Trusted Journey.<br/>"
        "• <b>Explicit User Consent:</b> Emergency contacts and profile data are stored only upon explicit user confirmation, and users retain the ability to delete all profile data instantly.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>5. Battery &amp; Hardware Optimization:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>Opportunistic Polling:</b> GPS sensor polling rates dynamically throttle from 1Hz during active transit down to idle standby when stationary, limiting hourly battery consumption to &lt; 3.5%.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 24: CHAPTER 3 - 3.5 EXTERNAL INTERFACE & SYSTEM REQUIREMENTS (HARDWARE)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.5 External Interface and System Requirements", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "SecureHer interfaces with mobile handheld hardware, operating system telematics, external communication gateways, and cloud servers. "
        "The hardware specifications are detailed in Tab. 5.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 5: Hardware requirements</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    hw_data = [
        ("Item", "Specification"),
        ("Target Client Hardware", "Android Smartphones (ARM64-v8a / armeabi-v7a architecture) and Modern Tablets"),
        ("Minimum RAM (Client)", "2.0 GB RAM (4.0 GB Recommended for smooth WebGL map rendering)"),
        ("Display Resolution", "HD / Full HD (720 x 1280 pixels or higher, multi-touch capacitive screen)"),
        ("Sensors Required", "Assisted-GPS / GLONASS Receiver, Camera Module (Front & Rear), Accelerometer"),
        ("Telephony Hardware", "GSM / LTE / 5G Cellular Baseband Radio with Active Micro/Nano SIM Card"),
        ("Development Workstation", "Intel Core i5/i7 or AMD Ryzen 5/7, 16GB RAM, 512GB NVMe SSD, Windows 11 64-bit"),
        ("Peripherals for Testing", "Physical Android Test Device connected via USB Debugging (ADB enabled)")
    ]
    tbl_hw = Table(hw_data, colWidths=[140, 335])
    tbl_hw.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Times-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 7.5),
        ('LEADING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(tbl_hw)
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>User Interface Design Considerations:</b>", S['BodyBold']))
    story.append(Paragraph(
        "The mobile user interface is engineered for rapid one-handed operation. The primary SOS trigger occupies a prominent central placement "
        "with high-contrast red/dark palette, ensuring accessibility under poor ambient lighting or during acute physical duress.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 25: CHAPTER 3 - 3.5 EXTERNAL INTERFACE & SYSTEM REQUIREMENTS (SOFTWARE)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.5 External Interface and System Requirements (Continued)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The software stack, libraries, development runtimes, and external cloud communication interfaces are detailed in Tab. 6.", S['Body']
    ))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Tab. 6: Software requirements</b>", S['TableCaption'] if 'TableCaption' in S else S['BodyBold']))
    story.append(Spacer(1, 2))

    sw_data = [
        ("Item", "Specification"),
        ("Operating System (Client)", "Android 8.0 (Oreo, API Level 26) through Android 15, or Modern Desktop OS"),
        ("Web Browsers Supported", "Google Chrome 90+, Mozilla Firefox 88+, Apple Safari 14+, Microsoft Edge 90+"),
        ("Frontend Framework", "React 18.3.1 with TypeScript 5.5, Vite 5.4.2 build tool"),
        ("Styling & Icons", "Tailwind CSS 3.4, Lucide React icon library"),
        ("Mobile Runtime Bridge", "Capacitor 6.0 with Custom Android Telephony Plugin (@capacitor/core)"),
        ("Mapping & Geocoding", "MapLibre GL JS 4.7.1, OpenStreetMap Nominatim API, Overpass API"),
        ("Backend & Database", "Google Firebase 10.13.0 (Firestore Database, Firebase Authentication)"),
        ("Email Dispatch Gateway", "Brevo REST API v3 (Transactional Email Gateway with HTML Templates)"),
        ("Build & Tooling", "Node.js v20.x LTS, npm v10.x, Python 3.12, Android Studio Ladybug 2024.2")
    ]
    tbl_sw = Table(sw_data, colWidths=[140, 335])
    tbl_sw.setStyle(TableStyle([
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
    story.append(tbl_sw)
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Communication Protocols:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>HTTPS / TLS 1.3:</b> Secure transmission of Brevo REST emails, Firestore document read/writes, and Overpass spatial queries.<br/>"
        "• <b>GSM 03.40 / 3GPP TS 23.040:</b> Standard Short Message Service cellular signaling protocol for direct SMS dispatch via mobile telephony towers.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 26: CHAPTER 3 - 3.6 CONSTRAINTS, ASSUMPTIONS AND DATA REQUIREMENTS
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.6 Constraints, Assumptions and Data Requirements", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph("<b>Design and Implementation Constraints:</b>", S['BodyBold']))
    story.append(Paragraph(
        "• <b>Android Permission Boundaries:</b> Modern Android versions enforce strict runtime permission models. To execute direct SMS dispatch via <code>SmsManager</code>, "
        "the application must request and be granted <code>android.permission.SEND_SMS</code>. When running in a standard mobile browser (PWA mode), "
        "direct hardware SMS is restricted by sandbox boundaries; the system therefore initiates an RFC 5724 <code>sms:</code> URI pre-populated with coordinates.<br/>"
        "• <b>Browser Geolocation Security:</b> The W3C Geolocation API requires a secure context (HTTPS). Local testing requires loopback localhost origins.<br/>"
        "• <b>Rate Limiting on Free Tier Gateways:</b> Brevo free tier enforces a ceiling of 300 emails per calendar day. Overpass API enforces spatial query rate limits.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Operational Assumptions:</b>", S['BodyBold']))
    story.append(Paragraph(
        "1. The user's mobile device contains an active cellular SIM card with valid SMS balance/allowance for hardware telephony dispatch.<br/>"
        "2. The device has its GNSS / Location services toggled on in device system settings.<br/>"
        "3. Nominated emergency contacts maintain reachable cellular phone numbers and valid email addresses.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Data Requirements &amp; Schema Organization:</b>", S['BodyBold']))
    story.append(Paragraph(
        "Data persistence is organized into local client storage (localStorage / IndexedDB) for offline survivability, and distributed cloud collections "
        "(Google Firestore). Persistent data entities include:<br/>"
        "• <code>users/{userId}</code>: User profile containing name, phone, medical notes, emergency message template.<br/>"
        "• <code>users/{userId}/contacts/{contactId}</code>: Registered guardians with phone, email, priority rank, relationship.<br/>"
        "• <code>users/{userId}/events/{eventId}</code>: Audit log of triggered SOS alerts with timestamps, GPS coordinates, and dispatch status.<br/>"
        "• <code>users/{userId}/journeys/{journeyId}</code>: Transit logs with start/end destinations, estimated arrival times, and check-in statuses.", S['Body']
    ))
    story.append(PageBreak())
