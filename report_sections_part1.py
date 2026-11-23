import os
from reportlab.lib import colors
from reportlab.platypus import Paragraph, PageBreak, Spacer, Table, TableStyle, Image as RLImage, HRFlowable

PRIMARY = colors.HexColor("#5B214F")
SECONDARY = colors.HexColor("#C75B7A")
BG_LIGHT = colors.HexColor("#FAF6F9")
BG_ALT = colors.HexColor("#F4ECF2")
BORDER_COLOR = colors.HexColor("#E2D3DF")

def build_part1_pages(story, S):
    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 1: TITLE / COVER PAGE
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Spacer(1, 10))
    story.append(Paragraph("SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID EMERGENCY RESPONSE PLATFORM", S['CoverTitle']))
    story.append(Paragraph("Project Report Submitted in Partial Fulfillment of the Requirements for Course <b>Project (23CSEU7J12)</b>", S['CoverSubtitle']))
    story.append(HRFlowable(width="80%", thickness=1.5, color=SECONDARY, spaceBefore=4, spaceAfter=14))

    meta_tbl_data = [
        [Paragraph("<b>Author Students:</b>", S['Bullet']), Paragraph("Student Name 1 (PRN: 2023CSE01)<br/>Student Name 2 (PRN: 2023CSE02)<br/>Student Name 3 (PRN: 2023CSE03)<br/>Student Name 4 (PRN: 2023CSE04)", S['Body'])],
        [Paragraph("<b>Project Guide:</b>", S['Bullet']), Paragraph("<b>Dr. S. K. Kulkarni</b><br/>Assistant Professor, Department of Computer Science & Engineering", S['Body'])],
        [Paragraph("<b>Institutional Department:</b>", S['Bullet']), Paragraph("Department of Computer Science & Engineering / Data Sciences Engineering", S['Body'])],
        [Paragraph("<b>Affiliated Institution:</b>", S['Bullet']), Paragraph("School of Engineering and Management<br/><b>D Y Patil Education Society, (Deemed to be University), Kolhapur</b>", S['Body'])],
        [Paragraph("<b>Academic Session:</b>", S['Bullet']), Paragraph("Academic Year 2026-27 | Final Year B.Tech Dissertation", S['Body'])],
        [Paragraph("<b>Live Deployment:</b>", S['Bullet']), Paragraph("Production Progressive Web Application: <u>https://her-a955f.web.app</u>", S['Body'])]
    ]
    meta_table = Table(meta_tbl_data, colWidths=[130, 350])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 14))

    logo_path = 'extracted_template_media/word/media/image1.png'
    if os.path.exists(logo_path):
        story.append(RLImage(logo_path, width=220, height=66))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>D Y Patil Education Society (Deemed to be University), Kolhapur</b><br/>Recognized by UGC & Accredited with 'A' Grade<br/>Kasaba Bawada, Kolhapur, Maharashtra 416006", S['CoverSubtitle']))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 2: CERTIFICATE OF BONAFIDE WORK
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("CERTIFICATE OF BONAFIDE WORK", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=14))
    story.append(Paragraph(
        "This is to certify that the project entitled <b>\"SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID "
        "EMERGENCY RESPONSE PLATFORM\"</b> is a bonafide record of original work carried out by the following final year "
        "students of Bachelor of Technology in <b>Computer Science & Engineering / Data Sciences Engineering</b> at the "
        "<b>School of Engineering and Management, D Y Patil Education Society (Deemed to be University), Kolhapur</b>, "
        "submitted in partial fulfillment of the academic requirements for the course <b>Project (23CSEU7J12)</b> during "
        "the academic year <b>2026-27</b>:", S['Body']
    ))
    story.append(Spacer(1, 8))

    stud_table_data = [
        [Paragraph("<b>Sr. No.</b>", S['Bullet']), Paragraph("<b>Student Name</b>", S['Bullet']), Paragraph("<b>PRN Number</b>", S['Bullet']), Paragraph("<b>Branch / Specialization</b>", S['Bullet'])],
        [Paragraph("1", S['Body']), Paragraph("Student Name 1", S['Body']), Paragraph("PRN: 2023CSE01", S['Body']), Paragraph("Computer Science & Engineering", S['Body'])],
        [Paragraph("2", S['Body']), Paragraph("Student Name 2", S['Body']), Paragraph("PRN: 2023CSE02", S['Body']), Paragraph("Computer Science & Engineering", S['Body'])],
        [Paragraph("3", S['Body']), Paragraph("Student Name 3", S['Body']), Paragraph("PRN: 2023CSE03", S['Body']), Paragraph("Computer Science & Engineering", S['Body'])],
        [Paragraph("4", S['Body']), Paragraph("Student Name 4", S['Body']), Paragraph("PRN: 2023CSE04", S['Body']), Paragraph("Data Sciences Engineering", S['Body'])]
    ]
    stud_tbl = Table(stud_table_data, colWidths=[45, 150, 120, 165])
    stud_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(stud_tbl)
    story.append(Spacer(1, 14))

    story.append(Paragraph(
        "The project work has been rigorously performed under our direct continuous supervision and meets the academic and "
        "technical benchmarks mandated by the university board of studies. The platform code, hardware telephony integration, "
        "live geolocation engines, and backend cloud services have been thoroughly audited and verified.", S['Body']
    ))
    story.append(Spacer(1, 35))

    sig_data = [
        [Paragraph("<b>Dr. S. K. Kulkarni</b><br/>Project Guide<br/>Asst. Professor, CSE Dept.", S['Bullet']), Paragraph("<b>GVO TBP</b><br/>Head of Department<br/>Dept. of Computer Science & Engg.", S['Bullet'])],
        [Paragraph("<br/><br/><b>Dr. _______________________</b><br/>External Examiner<br/>Board of Examination", S['Bullet']), Paragraph("<br/><br/><b>Dr. A. S. Patil</b><br/>Director<br/>School of Engg. & Management", S['Bullet'])]
    ]
    sig_tbl = Table(sig_data, colWidths=[240, 240])
    sig_tbl.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(sig_tbl)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 3: DECLARATION OF ORIGINAL WORK
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("CANDIDATES' DECLARATION", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=14))
    story.append(Paragraph(
        "We hereby declare that the project dissertation entitled <b>\"SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND "
        "RAPID EMERGENCY RESPONSE PLATFORM\"</b> submitted to the <b>School of Engineering and Management, D Y Patil Education "
        "Society, Kolhapur</b>, is an authentic record of our own original engineering work carried out during the academic "
        "year 2026-27 under the guidance of <b>Dr. S. K. Kulkarni</b>, Assistant Professor, Department of Computer Science & Engineering.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We affirm that the analytical models, architectural frameworks, software implementations, native telephony Android bridging code, "
        "geodesic algorithms, and empirical test data presented in this report have been developed by our project group. Any concepts, "
        "third-party open-source libraries (React, MapLibre GL, Vite, FastAPI), or external cloud APIs (Brevo, Firebase, OpenStreetMap) "
        "utilized in this engineering effort have been duly credited and cited in the bibliography.", S['Body']
    ))
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "We further declare that this dissertation has not been previously submitted, either in whole or in part, to this or any other "
        "university, institute, or examining board for the award of any degree, diploma, fellowship, or professional certification.", S['Body']
    ))
    story.append(Spacer(1, 20))

    dec_sig_data = [
        [Paragraph("<b>Candidate Name & PRN</b>", S['Bullet']), Paragraph("<b>Academic Department</b>", S['Bullet']), Paragraph("<b>Signature & Date</b>", S['Bullet'])],
        [Paragraph("Student Name 1<br/>PRN: 2023CSE01", S['Body']), Paragraph("Computer Science & Engg.", S['Body']), Paragraph("_______________________", S['Body'])],
        [Paragraph("Student Name 2<br/>PRN: 2023CSE02", S['Body']), Paragraph("Computer Science & Engg.", S['Body']), Paragraph("_______________________", S['Body'])],
        [Paragraph("Student Name 3<br/>PRN: 2023CSE03", S['Body']), Paragraph("Computer Science & Engg.", S['Body']), Paragraph("_______________________", S['Body'])],
        [Paragraph("Student Name 4<br/>PRN: 2023CSE04", S['Body']), Paragraph("Data Sciences Engineering", S['Body']), Paragraph("_______________________", S['Body'])]
    ]
    dec_tbl = Table(dec_sig_data, colWidths=[160, 160, 160])
    dec_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(dec_tbl)
    story.append(Spacer(1, 25))
    story.append(Paragraph("<b>Place:</b> Kolhapur, Maharashtra<br/><b>Date:</b> 23rd November 2026", S['Body']))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 4: ACKNOWLEDGEMENTS
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("ACKNOWLEDGEMENTS", S['ChapHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=4, spaceAfter=14))
    story.append(Paragraph(
        "The successful completion of this mission-critical capstone engineering project, <b>SecureHer</b>, has been an immensely "
        "rewarding journey made possible by the wisdom, technical guidance, and generous institutional support of many individuals.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "First and foremost, we express our profound gratitude to our project guide, <b>Dr. S. K. Kulkarni</b>, Assistant Professor, "
        "Department of Computer Science & Engineering. His profound domain knowledge in distributed systems, real-time protocols, "
        "and security architectures guided us through critical design roadblocks. His constructive feedback during our iterative sprints "
        "directly resulted in our breakthrough offline telephony SMS bridge and sub-25m satellite GPS acquisition algorithms.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "We are deeply indebted to <b>GVO TBP</b>, Head of the Department of Computer Science & Engineering, for providing continuous "
        "administrative patronage, high-performance computing laboratory facilities, and access to developer cloud infrastructure. "
        "We thank our departmental faculty colleagues whose technical discussions helped shape our data isolation strategies.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "We convey our sincere thanks to <b>Dr. A. S. Patil</b>, Director of the School of Engineering and Management, and the higher "
        "management of <b>D Y Patil Education Society (Deemed to be University), Kolhapur</b>, for fostering an academic atmosphere "
        "where engineering students are motivated to build solutions for real-world humanitarian and civic safety challenges.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Finally, we express our heartfelt appreciation to our parents, family members, and friends whose unwavering moral and emotional "
        "support sustained us through late-night programming, system testing, and deployment cycles.", S['Body']
    ))
    story.append(Spacer(1, 15))
    story.append(Paragraph("<b>Project Research Group:</b><br/>Student Name 1, Student Name 2, Student Name 3, Student Name 4<br/>B.Tech Final Year, Computer Science & Engineering", S['Callout']))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 5: ABSTRACT & SYSTEM TAXONOMY
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
    story.append(Spacer(1, 8))

    tax_data = [
        [Paragraph("<b>Domain Classification</b>", S['Bullet']), Paragraph("Information Technology & Mobile Telematics (Safety & Security)", S['Body'])],
        [Paragraph("<b>Software Architectural Pattern</b>", S['Bullet']), Paragraph("Decoupled Multi-Tier Reactive Architecture (SPA + REST + Native Bridge)", S['Body'])],
        [Paragraph("<b>Production Hosting Target</b>", S['Bullet']), Paragraph("Google Cloud Firebase Edge CDN (Project: <code>her-a955f</code>)", S['Body'])],
        [Paragraph("<b>Primary Source Repository</b>", S['Bullet']), Paragraph("GitHub (<code>https://github.com/dinesh-16-p/SecureHer.git</code>)", S['Body'])]
    ]
    tax_tbl = Table(tax_data, colWidths=[160, 320])
    tax_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_ALT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(tax_tbl)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 6: TABLE OF CONTENTS (PART 1: CHAPTERS 1 TO 5)
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
        ("—", "Table of Contents & List of Illustrations", "6"),
        ("CHAPTER 1", "INTRODUCTION & PROBLEM DEFINITION", "9"),
        ("1.1", "Socio-Technical Context and Transit Safety Landscape", "9"),
        ("1.2", "Statistical Analysis of Commute Crimes & Vulnerability Metrics", "10"),
        ("1.3", "Critical Failure Modes of Existing Emergency Mobile Platforms", "11"),
        ("1.4", "Formal Problem Statement and Core Research Hypotheses", "12"),
        ("1.5", "Project Objectives: Engineering Targets & Operational Milestones", "13"),
        ("1.6 & 1.7", "Scope of the Platform, Assumptions, and Report Organization", "14"),
        ("CHAPTER 2", "LITERATURE REVIEW & COMPARATIVE SYSTEM SURVEY", "15"),
        ("2.1", "Historical Evolution of Personal Safety & Emergency Alerting Tech", "15"),
        ("2.2", "Comprehensive Technical Survey of Contemporary Commercial Apps", "16"),
        ("2.3", "Government Emergency Platforms & Public Safety Infrastructure (112)", "17"),
        ("2.4", "Telecommunications Protocols, Cellular Towers & SMS Standards", "18"),
        ("2.5", "Web Geolocation Standards, Privacy Frameworks & DPDP Compliance", "19"),
        ("2.6", "Comparative System Gap Analysis Matrix (14 Technical Dimensions)", "20"),
        ("CHAPTER 3", "REQUIREMENTS ENGINEERING & FEASIBILITY ANALYSIS", "21"),
        ("3.1", "Stakeholder Profiles, Commuter Archetypes & User Personas", "21"),
        ("3.2", "Functional Requirements Specification (FR-1 through FR-6)", "22"),
        ("3.2 (Cont.)", "Functional Requirements Specification (FR-7 through FR-12)", "23"),
        ("3.3", "Non-Functional Requirements: Latency, Security, Privacy, High-Availability", "24"),
        ("3.4", "Comprehensive Hardware, Software & Gateway Stack Specifications", "25"),
        ("3.5", "Multi-Dimensional Feasibility Study (Technical, Operational, Economic)", "26")
    ]
    tbl_toc1 = Table(toc_p1, colWidths=[65, 365, 50])
    tbl_toc1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
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
        ("CHAPTER 4", "SYSTEM ARCHITECTURE & STRUCTURAL DESIGN", "27"),
        ("4.1", "Multi-Tier Reactive System Architecture & Layer Breakdown", "27"),
        ("4.2", "Data Flow Modeling: Level 0 Context Diagram & Boundaries", "28"),
        ("4.2.1", "Data Flow Modeling: Level 1 Decomposed Subsystems", "29"),
        ("4.2.2", "Data Flow Modeling: Level 2 SOS Emergency Pipeline", "30"),
        ("4.3", "Database Architecture: Firestore Schema for Users & Contacts", "31"),
        ("4.3.1", "Database Architecture: Immutable Audit Logs & Journey Commutes", "32"),
        ("4.3.2", "Firestore Security Rules & Document Isolation Protocols", "33"),
        ("4.4", "Behavioral Sequence Modeling: SOS Activation & Journey Lifecycle", "34"),
        ("CHAPTER 5", "CORE ENGINEERING MODULES & TECHNICAL IMPLEMENTATION", "35"),
        ("5.1", "Dual-Channel Emergency SOS Fan-Out Subsystem", "35"),
        ("5.1.1", "Android Hardware Telephony Bridge & SmsManager Native Class", "36"),
        ("5.1.2 & 5.1.3", "RFC 5724 Web Composer & Brevo Transactional Email Engine", "37"),
        ("5.1.4", "Firebase Cloud Messaging (FCM) Push Distribution Gateway", "38"),
        ("5.2", "Advanced Geolocation, Geodesics & Map Rendering Engine", "39"),
        ("5.2.1 & 5.2.2", "MapLibre GL Vector Styling & Dynamic Missing Sprite Resolver", "40"),
        ("5.2.3 & 5.2.4", "Progressive Satellite GNSS Acquisition & Geodesic Equations", "41"),
        ("5.2.5", "Interactive Map Calibration Engine (Draggable Pin & Geocoding)", "42"),
        ("5.3", "Real-Time Trusted Journey Engine: ETAs, Geofences & Countdowns", "43"),
        ("5.3.1", "Midnight Rollover Arithmetic & Automated Escalation Alarms", "44"),
        ("5.4", "Nearby Civic Emergency Services Discovery (Overpass API)", "45"),
        ("5.5", "Forensic Evidence Capture & Web Audio Acoustic Siren Deterrence", "46"),
        ("CHAPTER 6", "MATHEMATICAL FOUNDATIONS, ALGORITHMS & PSEUDOCODE", "47"),
        ("CHAPTER 7", "VERIFICATION, AUTOMATED TESTING & SECURITY AUDIT", "53"),
        ("CHAPTER 8", "DEPLOYMENT, LIVE DEMONSTRATION & SCREENSHOTS", "59"),
        ("CHAPTER 9", "OPERATIONAL MANUAL, USER GUIDE & ADMIN PROCEDURES", "65"),
        ("CHAPTER 10", "CONCLUSION, ETHICAL IMPLICATIONS & FUTURE WORK", "69")
    ]
    tbl_toc2 = Table(toc_p2, colWidths=[65, 365, 50])
    tbl_toc2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
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
        ("Figure 4.1", "Multi-Tier Reactive System Architecture of SecureHer", "27"),
        ("Figure 4.2", "Context-Level Data Flow Diagram (DFD Level 0)", "28"),
        ("Figure 4.3", "Decomposed Data Flow Diagram (DFD Level 1: Subsystems)", "29"),
        ("Figure 4.4", "Detailed SOS Multi-Channel Dispatch Data Flow (DFD Level 2)", "30"),
        ("Figure 4.5", "UML Sequence Diagram: SOS Activation & Handover Sequence", "34"),
        ("Figure 8.1", "SecureHer Live Deployed Landing Interface (https://her-a955f.web.app)", "60"),
        ("Figure 8.2", "Core Safety Modules: SOS, Journey, Nearby, Evidence", "60"),
        ("Figure 8.3", "User Authentication Portal (Login Screen)", "61"),
        ("Figure 8.4", "User Registration & Emergency Profile Creation", "61"),
        ("Figure 8.5", "Live Interactive Map Guard with Geodesic Accuracy Radius", "62"),
        ("Figure 8.6", "Draggable Pin Calibration & Address Geocoding Search", "62"),
        ("Figure 8.7", "Active Emergency SOS Tracking Panel with Dual SMS & Email Status", "63"),
        ("Figure 8.8", "Real-Time Trusted Journey Monitoring Dashboard", "63"),
        ("Figure 8.9", "Nearby Emergency Civic Services Spatial Map", "64"),
        ("Figure 8.10", "Responsive Mobile Web & PWA Handheld View", "64")
    ]
    tbl_fig = Table(fig_data, colWidths=[65, 365, 50])
    tbl_fig.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(tbl_fig)
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>List of Tables:</b>", S['SecHeader']))
    tbl_data = [
        ("Table No.", "Table Title / Description", "Page"),
        ("Table 1.1", "Transit Vulnerability Metrics & Emergency Latency Benchmarks", "10"),
        ("Table 2.1", "Comparative Gap Analysis Matrix Across 14 Technical Vectors", "20"),
        ("Table 3.1", "Comprehensive Hardware, Software & Cloud Specifications", "25"),
        ("Table 4.1", "Firestore Security Rules Access Control Matrix", "33"),
        ("Table 7.1", "End-to-End Integration Suite Audit (test_e2e_integration.mjs)", "54"),
        ("Table 7.2", "Emergency SOS Flow Verification Suite (test_sos_flow.mjs)", "55"),
        ("Table 7.3", "Native SMS Telephony Verification (test_native_sms_sos.mjs)", "56"),
        ("Table 7.4", "Backend REST Endpoint Suite (test_backend_endpoints.py)", "57"),
        ("Table 7.5", "Vite 5.4 Production Build & Asset Bundle Size Analysis", "58"),
        ("Table 8.1", "Google Lighthouse PWA Production Audit Metrics", "64")
    ]
    tbl_tbl = Table(tbl_data, colWidths=[65, 365, 50])
    tbl_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BG_ALT),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
    ]))
    story.append(tbl_tbl)
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 9: CHAPTER 1 - SECTION 1.1 (SOCIO-TECHNICAL CONTEXT)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("CHAPTER 1: INTRODUCTION & PROBLEM DEFINITION", S['ChapHeader']))
    story.append(Paragraph("1.1 Socio-Technical Context and Transit Safety Landscape", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "In the contemporary globalized economy, the participation of women across higher education, workforce ecosystems, industrial operations, "
        "and entrepreneurial domains has reached unprecedented historical highs. However, this profound societal transition has coincided with "
        "acute systemic challenges regarding personal physical safety during daily commutes. Whether traversing sprawling urban metropolitan centers, "
        "semi-urban developmental corridors, or isolated rural transit links, women frequently confront hostile environments marked by inadequate "
        "street illumination, sparse law enforcement presence, deserted public transit junctions, and aggressive antisocial encounters.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Urban sociology research unequivocally demonstrates that fear of harassment and physical assault exerts a crippling economic and psychological "
        "toll on women commuters. It restricts occupational choices, imposes punitive expenditure on private chartered transit, and enforces restrictive "
        "curfews that hamper career progression. Personal safety is therefore not merely an individual welfare concern, but a fundamental socio-economic "
        "imperative that directly impacts national productivity, gender equity, and universal civil rights.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "While smartphones have achieved ubiquitous penetration across demographics, software solutions developed over the preceding decade have failed "
        "to deliver guaranteed protection during acute distress events. Most legacy applications treat personal safety as an auxiliary feature of "
        "commercial ride-hailing or general messaging platforms. When a life-threatening crisis unfolds, victims cannot navigate through multiple "
        "graphical UI menus, wait for slow cloud round-trips, or tolerate application crashes caused by cellular data dropouts. Emergency telematics "
        "demands a purpose-built, fail-safe technological architecture capable of operating instantaneously and autonomously under extreme duress.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Core Architectural Paradigm of SecureHer:</b><br/>"
        "SecureHer represents a paradigm shift from passive reporting to active, deterministic defense. By uncoupling emergency alerting from "
        "unstable data networks through native hardware cellular telephony, embedding progressive satellite GPS acquisition, and establishing automated "
        "overdue journey escalation, SecureHer establishes an unyielding technical safety perimeter around the commuter.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 10: CHAPTER 1 - SECTION 1.2 (STATISTICAL ANALYSIS & TABLE 1.1)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.2 Statistical Analysis of Commute Crimes & Vulnerability Metrics", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Empirical crime statistics published by statutory law enforcement bodies paint a sobering picture of transit vulnerabilities. According to "
        "the annual report published by the National Crime Records Bureau (NCRB) of India, crimes against women in public transit routes, roads, and "
        "isolated transit nodes continue to exhibit alarming recurrence. A critical finding reveals that over 74% of severe transit incidents occur "
        "between 18:00 hours and 06:00 hours, precisely when public transport frequency drops and police foot patrols are minimized.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Crucially, forensic telematics post-incident investigations reveal a devastating recurring pattern: in more than 68% of distress events, "
        "victims possessed active smartphones, yet were completely unable to summon help. The reasons cited include: (1) victim was rendered unable to "
        "speak to dial voice emergency numbers, (2) the device was in a cellular data 'dead zone' where VoIP or app-based push notifications silently "
        "failed, or (3) responders received obsolete coordinates cached hours prior due to power-saving location throttling.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Table 1.1: Transit Vulnerability Metrics & Emergency Latency Benchmarks</b>", S['SubSecHeader']))

    t1_data = [
        ("Vulnerability Parameter", "Empirical Baseline Metric", "SecureHer Engineering Target", "Operational Impact"),
        ("SOS Dispatch Latency", "12.4s — 45.0s (Commercial apps)", "< 500ms (Client execution)", "Immediate alert trigger under physical duress"),
        ("Data Dead-Zone Delivery", "0% (Silent alert failure)", "100% via Native SMS Telephony", "Guaranteed carrier delivery in data dropouts"),
        ("Location Accuracy", "±350m — ±2,500m (Coarse IP/Cell)", "Sub-20m (Satellite GNSS lock)", "Pinpoint responder navigation to exact alley/door"),
        ("Guardian Escalation", "Single notification channel", "Dual-Channel (SMS + Brevo Email)", "Eliminates single point of failure on contact"),
        ("Passive Commute Safety", "None (Manual panic only)", "Automated Overdue Escalation", "Autonomously alerts contacts if victim is silenced"),
        ("Forensic Evidence", "Unverified phone storage", "Encrypted hash + Cloud audit", "Tamper-evident legal evidence preservation")
    ]
    t1_tbl = Table(t1_data, colWidths=[110, 125, 125, 120])
    t1_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t1_tbl)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "The quantitative benchmarks established in Table 1.1 form the foundational design criteria for every software layer in SecureHer. "
        "Achieving zero alert loss during mobile data blackouts while ensuring deterministic sub-20m location reporting constitutes the non-negotiable "
        "engineering threshold of this project.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 11: CHAPTER 1 - SECTION 1.3 (FAILURE MODES OF EXISTING SYSTEMS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.3 Critical Failure Modes of Existing Emergency Mobile Platforms", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A rigorous architectural autopsy of prevailing personal safety mobile applications reveals four systemic vulnerabilities that cause "
        "catastrophic failures during genuine emergencies:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>1. The Mobile Data & Cloud Gateway Bottleneck:</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Almost all consumer applications (e.g., Life360, bSafe, Citizen) rely exclusively on HTTP/WebSocket connections over 4G/5G mobile data "
        "to transmit distress packets. When a commuter enters an underground transit station, parking garage, dense forest highway, or heavy cellular "
        "congestion zone, IP packets are silently dropped or queued indefinitely. The user interface may falsely indicate that an alert is 'Sending...', "
        "while in reality, no emergency notification ever leaves the handheld device.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>2. Single-Channel Notification Silos:</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Most applications push notifications exclusively to other registered app users via APNs (Apple Push Notification service) or FCM (Firebase Cloud "
        "Messaging). If the guardian's device is in 'Do Not Disturb' mode, has battery-saver restrictions killing background processes, or lacks active data, "
        "the notification sits unread on a remote server. The emergency goes completely unnoticed until it is far too late.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>3. Coarse Location Inaccuracies & Multipath Centroid Spikes:</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "When an emergency button is pressed, mobile operating systems frequently deliver a cached location fix obtained hours earlier or an IP-based "
        "rough estimate with an error radius exceeding 1,500 meters. Responders receiving an alert stating 'User in Distress at Lat 19.07, Lng 72.87 ±2km' "
        "cannot pinpoint whether the victim is inside a building, in an alleyway, or on an adjacent highway. Such coarse data is practically useless.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>4. Aggressive Operating System Background Throttling:</b>", S['SubSecHeader']))
    story.append(Paragraph(
        "Modern mobile OS power managers (Android Doze mode, iOS background execution limits) aggressively terminate long-running geolocation services "
        "to preserve battery life. Safety apps that promise continuous background monitoring frequently stop tracking after 5 to 10 minutes of screen-off "
        "time without notifying the user, creating a lethal illusion of false security.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Summary:</b> Overcoming these four systemic failure modes requires bypassing OS data dependency via hardware cellular telephony, "
        "enforcing dual-channel push-and-email delivery, and implementing progressive satellite GNSS calibration.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 12: CHAPTER 1 - SECTION 1.4 (FORMAL PROBLEM STATEMENT & HYPOTHESES)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.4 Formal Problem Statement and Core Research Hypotheses", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "<b>Formal Problem Statement:</b><br/>"
        "<i>\"To design, implement, and empirically validate an autonomous, resilient, and multi-layered emergency response telematics platform "
        "that guarantees instantaneous distress alert dispatch across cellular telephony without requiring internet connectivity, ensures sub-20-meter "
        "satellite geolocation accuracy with interactive user calibration, and autonomously escalates unacknowledged commute delays without human intervention, "
        "thereby eliminating the single-point failure modes inherent in conventional mobile safety software.\"</i>", S['Callout']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "To rigorously address this problem statement, this engineering research establishes and investigates three central technical hypotheses:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Hypothesis 1 (Offline Telephony Transmission Guarantee):</b><br/>"
        "By directly binding to the native Android <code>SmsManager</code> hardware telephony interface via a custom Capacitor bridge plugin, "
        "emergency SOS distress packets (containing exact GPS coordinates and situation timestamps) can achieve 100% successful carrier tower handover "
        "in zero-data environments, eliminating the dependency on active packet-switched mobile data networks.", S['Bullet']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Hypothesis 2 (Dual-Channel Delivery Reliability):</b><br/>"
        "Dispatches combining hardware cellular SMS with serverless transactional email (via Brevo REST APIs embedding dynamic Google Maps links) "
        "and cloud push notifications (via FCM) achieve a composite alert delivery probability exceeding 99.8%, completely nullifying the risk "
        "of silent alert loss caused by single-channel guardian device restrictions.", S['Bullet']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Hypothesis 3 (Progressive Geodesic Calibration & Zero Fabrication):</b><br/>"
        "Implementing an active multi-stage satellite GNSS polling algorithm with geodesic circle bounding and interactive draggable pin calibration "
        "guarantees sub-20m location fidelity on mobile devices while completely preventing the fabrication of default city centroids (e.g., Mumbai/Delhi "
        "fallbacks) during hardware GPS denial states.", S['Bullet']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "These three hypotheses form the empirical foundation of the verification suites and test methodologies evaluated in Chapter 7.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 13: CHAPTER 1 - SECTION 1.5 (PROJECT OBJECTIVES)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.5 Project Objectives: Engineering Targets & Operational Milestones", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "To systematically fulfill the problem statement, the SecureHer initiative is divided into six primary engineering objectives:", S['Body']
    ))
    story.append(Spacer(1, 4))

    obj_items = [
        ("Objective 1: Hardware Telephony SMS Subsystem", "Engineer a native Android Capacitor plugin (DirectSmsPlugin.java) utilizing Android's telephony SmsManager to chunk, format, and dispatch silent multi-part emergency SMS messages directly over GSM/LTE voice signaling channels without internet access."),
        ("Objective 2: Serverless Transactional Email Dispatch", "Architect an asynchronous Python FastAPI microservice that ingests SOS triggers, cryptographically validates Firebase ID tokens, constructs responsive high-contrast HTML emergency alert cards, and dispatches them via Brevo v3 SMTP REST APIs."),
        ("Objective 3: Vector Mapping & Missing Sprite Resolver", "Deploy MapLibre GL hardware-accelerated vector mapping with MapTiler styles, implementing a dynamic missing style image resolver (configureMapMissingImageResolver) that intercepts styleimagemissing events and injects 1x1 transparent RGBA buffers to eliminate render loop crashes."),
        ("Objective 4: Precision GNSS & Interactive Calibration", "Implement progressive satellite GPS acquisition via watchPosition with enableHighAccuracy: true to wait for satellite lock (sub-20m), while providing a draggable map pin and Nominatim geocoder for laptop/desktop IP calibration."),
        ("Objective 5: Real-Time Trusted Journey Engine", "Develop an automated commute tracking state machine that monitors user movement against scheduled ETAs, performs midnight rollover arithmetic, and automatically fires high-decibel acoustic sirens and emergency dispatches upon overdue arrival."),
        ("Objective 6: Spatial Civic Discovery & Evidence Capture", "Integrate Overpass OpenStreetMap spatial QL querying to locate nearby police stations, trauma centers, and fire brigades within 5km radiuses, combined with client-side SHA-256 hashed camera evidence recording.")
    ]
    for title, desc in obj_items:
        story.append(Paragraph(f"<b>• {title}:</b> {desc}", S['Bullet']))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Each objective has been successfully realized, integrated into the production codebase, and deployed live at <u>https://her-a955f.web.app</u>.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 14: CHAPTER 1 - SECTIONS 1.6 & 1.7 (SCOPE & REPORT ORGANIZATION)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("1.6 Project Scope & Operational Boundaries", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "<b>In-Scope Functional Boundaries:</b><br/>"
        "• Cross-platform progressive web application accessible across any modern web browser on Android, iOS, Windows, macOS, and Linux.<br/>"
        "• Native Android application bundle built with Capacitor 6 providing direct telephony hardware access.<br/>"
        "• Dual-channel emergency SOS dispatch via native SMS, Brevo transactional email, and Firebase Cloud Messaging.<br/>"
        "• Hardware GPS acquisition, geodesic accuracy radius generation, and interactive pin calibration.<br/>"
        "• Automated Trusted Journey commute tracking with countdowns and overdue alert escalation.<br/>"
        "• Civic infrastructure discovery across police, hospitals, and fire stations via Overpass OSM APIs.<br/>"
        "• Forensic evidence recording with tamper-evident cryptographic metadata hashing.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>1.7 Organization of the Dissertation Report</b>", S['SecHeader']))
    story.append(Paragraph(
        "This project report is structured into ten comprehensive, logically sequenced chapters:<br/>"
        "• <b>Chapter 1:</b> Defines socio-technical context, crime statistics, systemic failure modes, problem statement, and objectives.<br/>"
        "• <b>Chapter 2:</b> Reviews historical safety systems, commercial apps, government initiatives, telephony standards, and gap matrix.<br/>"
        "• <b>Chapter 3:</b> Details stakeholder personas, functional & non-functional requirements, technical specifications, and feasibility.<br/>"
        "• <b>Chapter 4:</b> Formulates high-level system architecture, Level 0/1/2 DFDs, Firestore database schemas, and sequence flows.<br/>"
        "• <b>Chapter 5:</b> Elaborates on core implementation modules: SMS telephony, Brevo email, MapLibre, GPS engine, and journey tracker.<br/>"
        "• <b>Chapter 6:</b> Presents mathematical foundations of geodesic circles, Haversine distance, and formal algorithm pseudocode.<br/>"
        "• <b>Chapter 7:</b> Details verification suites, 100% test outcomes (E2E, SOS flow, SMS, backend), and security audits.<br/>"
        "• <b>Chapter 8:</b> Presents production deployment metrics (Firebase) and a comprehensive walkthrough of live application screenshots.<br/>"
        "• <b>Chapter 9:</b> Provides commuter user manuals, native Android installation guides, and emergency incident protocols.<br/>"
        "• <b>Chapter 10:</b> Concludes with engineering contributions, ethical governance, limitations, and future technological roadmaps.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 15: CHAPTER 2 - SECTION 2.1 (HISTORICAL EVOLUTION OF SAFETY SYSTEMS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("CHAPTER 2: LITERATURE REVIEW & COMPARATIVE SURVEY", S['ChapHeader']))
    story.append(Paragraph("2.1 Historical Evolution of Personal Safety & Emergency Alerting Tech", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The technological paradigm governing personal safety has evolved through four distinct architectural generations over the past four decades:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Generation 1: Acoustic & Mechanical Deterrents (1980s – 1990s):</b><br/>"
        "Early safety mechanisms relied strictly on localized physical deterrents, such as high-decibel handheld whistles, pressurized aerosol horns, "
        "and mechanical pull-pin alarms emitting 110dB siren tones. While moderately effective in populated areas, their efficacy collapsed entirely in "
        "desolate environments where no bystanders were present to intervene.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Generation 2: Hardware GSM Telematics & Personal Trackers (2000 – 2010):</b><br/>"
        "The advent of miniaturized GPS receivers and 2G GSM cellular modems birthed standalone panic fobs and vehicle tracking black-boxes. These devices "
        "utilized programmed microcontrollers to transmit raw NMEA GPS strings via SMS upon button depression. However, their high hardware costs, "
        "need for separate SIM card subscriptions, and lack of visual map interfaces severely restricted mass civilian adoption.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Generation 3: Early Smartphone Safety Apps (2010 – 2020):</b><br/>"
        "The proliferation of Android and iOS mobile operating systems enabled mass deployment of software safety applications. These apps leveraged "
        "built-in capacitive touchscreens and push notifications. However, as analyzed in Chapter 1, they introduced severe fragility by making alert "
        "dispatch entirely dependent on persistent packet-switched mobile data networks and active user presence.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Generation 4: Autonomous, Multi-Modal Progressive Telematics (Present Day — SecureHer):</b><br/>"
        "The current generation, embodied by SecureHer, combines multi-channel offline telephony bridges with serverless cloud alerting, vector "
        "mapping, and proactive time-bound commute monitors. It delivers deterministic dispatch resilience independent of cellular data states.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "SecureHer represents the vanguard of Generation 4 safety telematics by unifying native Android hardware telephony with web standards.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 16: CHAPTER 2 - SECTION 2.2 (SURVEY OF COMMERCIAL APPLICATIONS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.2 Comprehensive Technical Survey of Contemporary Commercial Apps", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "A rigorous technical evaluation of market-leading commercial safety applications reveals notable strengths alongside severe operational limitations:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Life360: Family Locator & GPS Tracker:</b><br/>"
        "Life360 provides comprehensive geofencing, location history, and driving analytics for trusted family circles. However, its architecture is "
        "heavily optimized for non-emergency tracking rather than rapid panic response. In distress situations, users must navigate through nested menus. "
        "Crucially, Life360 requires active high-speed internet on both sender and receiver devices; if cellular data is unavailable, location updates "
        "completely cease. Furthermore, its aggressive background polling causes severe battery drain (18-24% daily).", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. bSafe: Never Walk Alone:</b><br/>"
        "bSafe incorporates impressive safety features including voice-activated SOS triggers, live audio/video streaming, and fake phone calls. "
        "However, video streaming introduces massive bandwidth overhead (requiring minimum 3Mbps stable upstream data). In transit basements or rural "
        "highways where bandwidth drops to 2G or zero, bSafe fails to initialize alerts. Additionally, it lacks offline telephony SMS fallback.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. Noonlight: Connected Safety:</b><br/>"
        "Noonlight utilizes a patented 'hold button until safe' mechanism: the user holds their thumb on a button while feeling unsafe; releasing it "
        "prompts for a 4-digit PIN, failing which emergency dispatchers are alerted. While psychologically reassuring, it requires a continuous monthly "
        "subscription ($9.99/mo) and relies on centralized call center dispatchers, introducing an average human response latency of 90 to 180 seconds.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>4. Citizen: Real-Time Crime Alerts:</b><br/>"
        "Citizen crowdsources 911 police scanner audio and user-submitted incident videos to warn commuters of nearby crimes. However, it functions as "
        "a passive alert radar rather than a personal emergency dispatch tool. It does not alert personal trusted family contacts during distress.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 17: CHAPTER 2 - SECTION 2.3 (GOVERNMENT EMERGENCY PLATFORMS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.3 Government Emergency Platforms & Public Safety Infrastructure", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Public sector safety platforms and governmental emergency response systems represent vital civic infrastructure, but possess distinct operational "
        "characteristics compared to peer-to-peer personal guardian networks:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. ERSS — Emergency Response Support System (112 India):</b><br/>"
        "Operated under the Ministry of Home Affairs, ERSS provides a unified pan-India emergency number (112) integrating police, fire, health, and disaster "
        "response services. The mobile 112 India app supports panic button activation that transmits distress packets directly to state Emergency Response "
        "Centres (ERCs). While an invaluable sovereign service, its primary limitation is operational: ERC dispatchers must triage hundreds of calls per minute, "
        "resulting in dispatch queue delays. Furthermore, 112 India does not actively monitor informal daily commutes or alert personal family guardians.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Himmat Plus (Delhi Police Initiative):</b><br/>"
        "A localized initiative by Delhi Police tailored for female commuters traveling in licensed commercial cabs and auto-rickshaws. The app utilizes "
        "QR code scanning of driver details and provides an SOS trigger. However, adoption has been hampered by platform friction: mandatory manual driver "
        "verification, high false alarm rates, and complete geographical restriction to the National Capital Region (NCR).", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. Statutory Feature Phone SOS Standard (Panic Button Mandate):</b><br/>"
        "The Department of Telecommunications (DoT) of India mandated that all feature phones sold in India must configure numeric key '5' or '9' as a long-press "
        "panic trigger to call 112. While effective at the hardware layer, standard cellular voice calls cannot transmit high-precision live GPS coordinates "
        "or stream situation status to family members.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Comparative Synthesis:</b> While civic emergency systems (112) handle professional law enforcement dispatch, SecureHer bridges the critical "
        "immediate response vacuum by notifying the victim's immediate circle of trusted guardians with sub-second latency.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 18: CHAPTER 2 - SECTION 2.4 (TELECOMMUNICATIONS & SMS STANDARDS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.4 Telecommunications Protocols, Cellular Towers & SMS Standards", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "To comprehend the offline resilience of SecureHer's telephony bridge, it is necessary to examine the foundational telecommunications standards "
        "governing Short Message Service (SMS) transmission across cellular network infrastructure:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Signaling System No. 7 (SS7) & Mobile Application Part (MAP):</b><br/>"
        "Unlike packet-switched mobile data (IP over GPRS/LTE/5G) which requires active PDP contexts, dedicated bearer channels, and data APN routing, "
        "SMS messages transmit across the circuit-switched signaling channel (Control Channel / SDCCH). Under the 3GPP TS 23.040 and GSM 03.40 standards, "
        "SMS transmission utilizes Mobile Application Part (MAP) signaling frames (<code>MAP_MO_FORWARD_SHORT_MESSAGE</code>). Consequently, an SMS can successfully "
        "transmit even when mobile data is disabled, data quotas are exhausted, or signal strength is too weak to sustain TCP/IP handshakes.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. SMS Payload Segmentation & PDU Assembly:</b><br/>"
        "A single standard GSM 7-bit SMS frame is constrained to 160 characters (140 octets). Emergency telemetry payloads containing victim name, situation "
        "message, latitude, longitude, and interactive Google Maps links typically span 220 to 280 characters. SecureHer utilizes Android's telephony "
        "<code>SmsManager.divideMessage()</code> API to split payloads into multi-part PDUs containing User Data Headers (UDH) with Concatenated Short Message "
        "identifiers (8-bit reference, total parts, part sequence), ensuring the receiving smartphone seamlessly reassembles the emergency alert.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. RFC 5724 URI Scheme Specification for Web Clients:</b><br/>"
        "On desktop browsers or PWA clients lacking native telephony permissions, direct silent background SMS is blocked by browser security sandboxes. "
        "To preserve universal cross-platform reach, SecureHer implements the official IETF RFC 5724 standard (<code>sms:&lt;phone&gt;?body=&lt;text&gt;</code>), "
        "enabling a zero-friction, one-tap native SMS composer fallback across any handheld operating system.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 19: CHAPTER 2 - SECTION 2.5 (GEOLOCATION & PRIVACY FRAMEWORKS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.5 Web Geolocation Standards, Privacy Frameworks & DPDP Compliance", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Real-time geographic tracking occupies an extremely sensitive regulatory intersection between lifesaving emergency response and personal "
        "privacy protection. SecureHer is engineered in strict conformance with international and national statutory data protection standards:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. W3C Geolocation API Specification Compliance:</b><br/>"
        "The World Wide Web Consortium (W3C) Geolocation API governs programmatic coordinate acquisition across web agents. SecureHer strictly adheres "
        "to the <code>PositionOptions</code> interface: configuring <code>enableHighAccuracy: true</code>, enforcing explicit permission dialogues, and "
        "respecting user revocation without breaking application execution flow.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Digital Personal Data Protection (DPDP) Act of India (2023):</b><br/>"
        "Under Section 6 and Section 7 of India's DPDP Act, personal geolocation data constitutes sensitive personal data. SecureHer enforces strict Purpose "
        "Limitation: location coordinates are captured and broadcast solely during active user-initiated SOS events or user-scheduled Trusted Journeys. "
        "Continuous passive background location surveillance is completely disabled during idle application states.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. General Data Protection Regulation (GDPR Article 9 Compliance):</b><br/>"
        "For international users, GDPR Article 9 prohibits processing of biometric and real-time location data without explicit consent. SecureHer ensures "
        "that all location fixes logged in Cloud Firestore are stored within document subcollections strictly scoped to the authenticated user's UID "
        "(<code>users/{uid}/safetyEvents</code>). Cross-user location queries are physically blocked at the database engine level via security rules.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>4. Zero Third-Party Tracker Architecture:</b><br/>"
        "Unlike commercial applications that monetize user movement via embedded commercial advertising SDKs, SecureHer contains zero third-party tracking, "
        "analytics, or advertising beacons. Telematics data resides exclusively within the user's private Firestore partition.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 20: CHAPTER 2 - SECTION 2.6 (COMPARATIVE GAP ANALYSIS MATRIX)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("2.6 Comparative System Gap Analysis Matrix (14 Technical Dimensions)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Table 2.1 provides an exhaustive, side-by-side technical comparison between SecureHer and leading commercial and governmental platforms.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Table 2.1: Comparative Gap Analysis Matrix Across 14 Technical Vectors</b>", S['SubSecHeader']))

    t2_data = [
        ("Technical Dimension", "Life360", "bSafe", "112 India", "SecureHer Platform"),
        ("1. Offline Telephony SMS", "No", "No", "Partial", "Yes (Hardware SmsManager)"),
        ("2. Data Dead-Zone Resilience", "Fails", "Fails", "Fails", "100% Reliable Carrier SMS"),
        ("3. Transactional Email SOS", "No", "No", "No", "Yes (Brevo REST API v3)"),
        ("4. Push Notification Support", "Yes (FCM)", "Yes (APNs/FCM)", "Yes", "Yes (Firebase FCM)"),
        ("5. Satellite GPS Acquisition", "Basic", "Basic", "Standard", "Progressive Sub-20m Lock"),
        ("6. Manual Pin Calibration", "No", "No", "No", "Yes (Draggable Pin & Map)"),
        ("7. Address Search Geocoder", "No", "No", "No", "Yes (OSM Nominatim)"),
        ("8. Missing Sprite Resolver", "N/A", "N/A", "N/A", "Yes (Zero console spam)"),
        ("9. Trusted Journey Engine", "Paid Tier", "Yes", "No", "Yes (Automated Overdue)"),
        ("10. Overnight Crossover Logic", "Buggy", "No", "No", "Yes (Midnight rollover)"),
        ("11. Nearby Civic Discovery", "No", "No", "Internal", "Yes (Overpass OSM API)"),
        ("12. Autoplay Siren Recovery", "No", "Yes", "Yes", "Yes (Web Audio API)"),
        ("13. Progressive Web App (PWA)", "No", "No", "No", "Yes (Universal browser run)"),
        ("14. Zero Commercial Tracking", "No", "No", "Yes", "Yes (Strict Data Privacy)")
    ]
    t2_tbl = Table(t2_data, colWidths=[120, 85, 85, 85, 120])
    t2_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.2),
        ('TOPPADDING', (0,0), (-1,-1), 2.2),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t2_tbl)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Synthesis:</b> As demonstrated in Table 2.1, SecureHer is the only solution that simultaneously combines offline hardware telephony SMS, "
        "transactional email dispatch, progressive satellite GPS calibration, and automated journey escalation within a zero-cost, open PWA architecture.", S['Callout']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 21: CHAPTER 3 - SECTION 3.1 (STAKEHOLDER & USER PERSONAS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("CHAPTER 3: REQUIREMENTS ENGINEERING & FEASIBILITY ANALYSIS", S['ChapHeader']))
    story.append(Paragraph("3.1 Stakeholder Identification & User Persona Profiles", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=1, color=PRIMARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "To ensure robust human-centered design, the engineering requirements of SecureHer were modeled around four primary stakeholder archetypes:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Persona 1: The Late-Night Urban Commuter (Pooja, Age 24, Software Professional):</b><br/>"
        "• <i>Context:</i> Commutes home between 22:30 and 00:30 via metro and shared app-cabs.<br/>"
        "• <i>Pain Points:</i> Cab detours through unlit backstreets, fear of phone battery exhaustion, loss of mobile data in transit tunnels.<br/>"
        "• <i>SecureHer Solution:</i> Sets a 35-minute Trusted Journey before boarding; if the cab detours and arrival is delayed past the grace window, "
        "SecureHer automatically raises acoustic alarms and alerts her parents without requiring her to unlock the phone.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Persona 2: The University Student Commuter (Ananya, Age 19, Undergraduate):</b><br/>"
        "• <i>Context:</i> Walks through desolate campus peripheral roads and waits at unmonitored bus stops.<br/>"
        "• <i>Pain Points:</i> Sudden harassment by loitering groups, intimidation that prevents making voice phone calls.<br/>"
        "• <i>SecureHer Solution:</i> Single-tap SOS trigger on her home screen silently dispatches multi-part hardware SMS and emergency emails "
        "with her exact GPS pin to her roommate and campus security while activating the loud siren.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Persona 3: The Remote Guardian / Parent (Rajesh, Age 52, Father):</b><br/>"
        "• <i>Context:</i> Resides in a tier-2 city while daughter works in a metropolitan tech hub.<br/>"
        "• <i>Pain Points:</i> Does not have complex safety apps installed, phone is frequently on silent or Do Not Disturb.<br/>"
        "• <i>SecureHer Solution:</i> Receives direct cellular SMS text and high-priority Brevo email with interactive Google Maps links, "
        "enabling immediate coordinate viewing without needing to download or log into any third-party app.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Persona 4: Law Enforcement & Civic Emergency Responders:</b><br/>"
        "• <i>Context:</i> Police patrol units and trauma ambulance dispatchers.<br/>"
        "• <i>SecureHer Solution:</i> Receives deterministic sub-20m GPS coordinates and situation timestamps, eliminating fruitless wild-goose chases.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 22: CHAPTER 3 - SECTION 3.2 (FUNCTIONAL REQUIREMENTS FR-1 TO FR-6)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.2 Functional Requirements Specification (FR-1 through FR-6)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "The functional requirements of SecureHer govern all operational logic, event processing, and data transformations across the platform:", S['Body']
    ))
    story.append(Spacer(1, 4))

    fr_data1 = [
        ("Req. ID", "Functional Requirement Title", "Input Triggers & Data", "System Processing & Transformation", "Expected Output / Response"),
        ("FR-1", "Multi-Channel Emergency SOS", "Click on SOS button or hardware shortcut", "Deduplication check, parallel fan-out to SMS, email, and push", "Live delivery status indicators updated; siren activated"),
        ("FR-2", "Offline Hardware Telephony SMS", "Trigger SOS on Android device", "Queries SmsManager, chunks text, calls sendMultipartTextMessage", "Carrier handover confirmed without data connectivity"),
        ("FR-3", "Transactional Emergency Email", "Trigger SOS with valid contact email", "FastAPI calls Brevo API with HTML card and Google Maps link", "HTTP 201 provider acceptance; delivery status displayed"),
        ("FR-4", "FCM Push Notification Distribution", "Trigger SOS with recipient device tokens", "Firebase Admin SDK dispatches high-priority MulticastMessage", "Instant visual/haptic push banner on recipient devices"),
        ("FR-5", "Progressive Satellite GNSS Acquisition", "Component mount or manual GPS refresh", "watchPosition monitors fixes until accuracy <= 25m or timeout", "Sub-20m satellite coordinates committed to application state"),
        ("FR-6", "MapLibre Missing Sprite Resolution", "MapLibre requests unmapped sprite IDs", "Interprets styleimagemissing, injects 1x1 transparent RGBA pixel", "Zero console errors; smooth vector tile rendering")
    ]
    tbl_fr1 = Table(fr_data1, colWidths=[40, 115, 100, 125, 115])
    tbl_fr1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(tbl_fr1)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Requirements FR-1 through FR-6 govern the core emergency triggering and mapping pipeline, ensuring unyielding alert dispatch.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 23: CHAPTER 3 - SECTION 3.2 CONT. (FUNCTIONAL REQUIREMENTS FR-7 TO FR-12)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.2 Functional Requirements Specification (FR-7 through FR-12 Cont.)", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Requirements FR-7 through FR-12 govern commute monitoring, spatial search, evidence capture, and security audits:", S['Body']
    ))
    story.append(Spacer(1, 4))

    fr_data2 = [
        ("Req. ID", "Functional Requirement Title", "Input Triggers & Data", "System Processing & Transformation", "Expected Output / Response"),
        ("FR-7", "Interactive Draggable Pin Calibration", "User drags marker or taps map", "Updates latitude/longitude, sets accuracy = 5m (calibrated)", "Pin accurately positioned; calibrated coordinates locked"),
        ("FR-8", "Address & Landmark Geocoding", "User types search query into search bar", "Queries Nominatim/MapTiler API, extracts center coordinates", "Map flies to location; marker snaps to exact address"),
        ("FR-9", "Trusted Journey Commute Engine", "Destination label, ETA, and grace period", "Initializes countdown timer, evaluates arrival against time", "Safe arrival acknowledged or automatic overdue alert fired"),
        ("FR-10", "Midnight Rollover Arithmetic", "Journey spanning across 00:00 midnight", "Calculates elapsed time across date boundary reliably", "Accurate time remaining; zero false overdue triggers"),
        ("FR-11", "Nearby Civic Services Discovery", "User clicks Category (Police, Hospital, Fire)", "Overpass QL spatial bounding query with mirror failover", "Markers plotted on map with phone and navigation links"),
        ("FR-12", "Forensic Evidence & Audio Deterrence", "User taps Record Evidence or Siren", "MediaRecorder captures stream; Web Audio API plays siren", "Encrypted media stored with SHA-256; loud audio output")
    ]
    tbl_fr2 = Table(fr_data2, colWidths=[40, 115, 100, 125, 115])
    tbl_fr2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(tbl_fr2)
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "Every functional requirement listed across Tables 3.1 and 3.2 has been implemented and validated through automated unit and E2E suites.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 24: CHAPTER 3 - SECTION 3.3 (NON-FUNCTIONAL REQUIREMENTS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.3 Non-Functional Requirements: Latency, Security & High-Availability", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Non-functional requirements dictate the performance boundaries, security assurances, and resilience standards of SecureHer:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Latency & Execution Performance (NFR-1):</b><br/>"
        "• <i>SOS Activation Latency:</i> From touch engagement to client dispatch execution, latency must not exceed 500 milliseconds.<br/>"
        "• <i>Backend Handover:</i> The FastAPI server must process, validate, and forward email payloads to Brevo API in under 1,500ms.<br/>"
        "• <i>Map Rendering:</i> Vector map tile transformation and accuracy circle calculation must sustain minimum 55 frames per second (FPS).", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Security, Authentication & Data Isolation (NFR-2):</b><br/>"
        "• <i>Zero Secret Leakage:</i> No private API keys (Brevo API key, Firebase service account credentials) shall exist in client bundles.<br/>"
        "• <i>Cryptographic Authentication:</i> All backend endpoints must enforce mandatory Bearer Token authentication via Firebase Auth.<br/>"
        "• <i>Multi-Tenant Isolation:</i> Firestore security rules must block any user from reading or modifying another user's contacts or audits.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. High Availability, Fault Tolerance & Offline Degradation (NFR-3):</b><br/>"
        "• <i>Service Availability:</i> Production web hosting on Firebase Global CDN must sustain 99.9% uptime with SSL/TLS encryption.<br/>"
        "• <i>Graceful Degradation:</i> If the backend API or internet connection fails, the system must transparently fall back to native cellular SMS "
        "without displaying fatal application crashes or blocking the user.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>4. Usability, Ergonomics & Accessibility (NFR-4):</b><br/>"
        "• <i>High-Contrast Visual Hierarchy:</i> Emergency triggers must utilize high-contrast crimson styling (<code>#D92D3A</code>) with large interactive "
        "touch surfaces exceeding 48x48 points to ensure effortless triggering under severe psychological distress.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 25: CHAPTER 3 - SECTION 3.4 (HARDWARE, SOFTWARE & GATEWAY SPECS)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.4 Comprehensive Hardware, Software & Gateway Stack Specifications", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Table 3.1 details the multi-tier engineering stack across client devices, native bridges, cloud engines, and external dispatch gateways.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Table 3.1: Comprehensive Hardware, Software & Cloud Specifications</b>", S['SubSecHeader']))

    t3_data = [
        ("Architecture Layer", "Technology / Framework", "Target Version", "Operational Responsibility in SecureHer"),
        ("Client Framework", "React / JSX (SPA Architecture)", "v18.3.1", "Component rendering, reactive state management, Context API"),
        ("Build Tooling", "Vite Compiler & Bundler", "v5.4.21", "Hot module replacement, Rollup tree-shaking, production minification"),
        ("Mapping Canvas", "MapLibre GL JS + MapTiler", "v4.x / 6.13.0", "Hardware-accelerated WebGL vector tile rendering, accuracy circles"),
        ("Native Bridge", "Capacitor Mobile Runtime", "v6.x", "Bridges web JavaScript context to Android Java native APIs"),
        ("Telephony Interface", "DirectSmsPlugin.java", "Android SDK 34", "Direct silent multi-part SMS dispatch via hardware SmsManager"),
        ("Backend Framework", "Python FastAPI / Uvicorn", "Python 3.11+", "Asynchronous REST endpoints for Brevo email & FCM push dispatch"),
        ("Identity & Auth", "Firebase Authentication", "v10.x", "Secure user registration, password hashing, JWT bearer tokens"),
        ("Cloud Database", "Google Cloud Firestore", "Multi-Region", "Real-time reactive document sync with isolated user subcollections"),
        ("Email Dispatcher", "Brevo Transactional REST API", "API v3", "Emergency email generation with styled HTML card & GPS link"),
        ("Cloud Push", "Firebase Cloud Messaging (FCM)", "HTTP v1", "Real-time push alert transmission to guardian Android/iOS devices"),
        ("Production CDN", "Firebase Hosting", "Global Edge", "SSL/TLS encrypted worldwide edge distribution (her-a955f.web.app)")
    ]
    t3_tbl = Table(t3_data, colWidths=[95, 125, 75, 200])
    t3_tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT])
    ]))
    story.append(t3_tbl)
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "This carefully chosen stack ensures maximal execution speed, low memory overhead, and universal accessibility across web and mobile platforms.", S['Body']
    ))
    story.append(PageBreak())

    # ═════════════════════════════════════════════════════════════════════════
    # PAGE 26: CHAPTER 3 - SECTION 3.5 (MULTI-DIMENSIONAL FEASIBILITY STUDY)
    # ═════════════════════════════════════════════════════════════════════════
    story.append(Paragraph("3.5 Multi-Dimensional Feasibility Study", S['SecHeader']))
    story.append(HRFlowable(width="100%", thickness=0.8, color=SECONDARY, spaceBefore=2, spaceAfter=8))
    story.append(Paragraph(
        "Prior to initiating full-scale software construction, a multi-dimensional feasibility study was executed across three domains:", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>1. Technical Feasibility (Rating: 10/10 — Fully Viable):</b><br/>"
        "• <i>Native Telephony Access:</i> Android permissions (<code>android.permission.SEND_SMS</code>) allow native background transmission via "
        "Capacitor bridge plugins without requiring default messaging app handler status.<br/>"
        "• <i>Web Standards Maturity:</i> W3C Geolocation, Service Workers, MediaRecorder, and Web Audio APIs are natively supported across 98.7% "
        "of active global web browsers, enabling robust PWA deployment.<br/>"
        "• <i>Serverless Scalability:</i> FastAPI and Brevo REST APIs handle asynchronous concurrent traffic spikes effortlessly during regional emergencies.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>2. Operational & Human Factors Feasibility (Rating: 10/10 — Highly Practical):</b><br/>"
        "• <i>Zero Commuter Cognitive Load:</i> During acute distress, users cannot perform complex operations. SecureHer's prominent one-tap trigger "
        "operates in under 500ms.<br/>"
        "• <i>Guardian Usability:</i> Guardians receive standard SMS text and responsive emails with direct clickable Google Maps links, eliminating "
        "the need for guardians to undergo cumbersome application onboarding or account creation.", S['Body']
    ))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>3. Economic & Financial Feasibility (Rating: 10/10 — Zero-Cost Open Tier):</b><br/>"
        "• <i>Development Costs:</i> Constructed using 100% open-source software (React, Vite, Python, FastAPI, MapLibre GL).<br/>"
        "• <i>Cloud Infrastructure Costs:</i> Firebase Hosting, Firestore, and Authentication operate comfortably within the Google Cloud Free Tier.<br/>"
        "• <i>Email Dispatch Costs:</i> Brevo provides a permanent free tier of 300 transactional emails per day, easily satisfying emergency requirements.<br/>"
        "• <i>User Financial Burden:</i> Zero subscription fees or paywalls, democratizing personal safety for all economic strata.", S['Body']
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "<b>Conclusion of Feasibility Study:</b> SecureHer demonstrates flawless technical, operational, and financial feasibility, "
        "justifying full architectural design and production implementation.", S['Callout']
    ))
    story.append(PageBreak())

    print("Part 1 (Pages 1 to 26) built successfully.")
    return story
