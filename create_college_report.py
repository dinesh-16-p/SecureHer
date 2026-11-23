import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)
    tcPr.append(shd)

def create_report():
    doc = docx.Document()

    # Configure A4 dimensions & standard 1 inch margins
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(6)

    # ══════════════════════════════════════════════════════════════════════════
    # 1. TITLE / COVER PAGE
    # ══════════════════════════════════════════════════════════════════════════
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(10)
    p_title.paragraph_format.space_after = Pt(12)
    run_title = p_title.add_run("SECUREHER: AN INTELLIGENT REAL-TIME WOMEN'S SAFETY AND RAPID EMERGENCY RESPONSE PLATFORM")
    run_title.font.name = 'Times New Roman'
    run_title.font.size = Pt(18)
    run_title.bold = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(6)
    r = p_sub.add_run("Project Report")
    r.font.size = Pt(16)
    r.bold = True

    p_req = doc.add_paragraph()
    p_req.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_req.paragraph_format.space_after = Pt(14)
    r = p_req.add_run("Submitted in partial fulfillment of the requirements for the course\nProject (23CSEU7J12)")
    r.font.size = Pt(12)
    r.italic = True

    p_by = doc.add_paragraph()
    p_by.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_by.paragraph_format.space_after = Pt(6)
    r = p_by.add_run("By")
    r.font.size = Pt(14)
    r.bold = True

    p_students = doc.add_paragraph()
    p_students.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_students.paragraph_format.space_after = Pt(14)
    students_text = (
        "Student Name 1 (PRN: ____________)\n"
        "Student Name 2 (PRN: ____________)\n"
        "Student Name 3 (PRN: ____________)\n"
        "Student Name 4 (PRN: ____________)"
    )
    r = p_students.add_run(students_text)
    r.font.size = Pt(12)
    r.bold = True

    p_guide = doc.add_paragraph()
    p_guide.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_guide.paragraph_format.space_after = Pt(14)
    r = p_guide.add_run("Under the Guidance of\nDr. S. K. Kulkarni\nAsst. Professor, CSE Dept.")
    r.font.size = Pt(12)
    r.bold = True

    # Embed College Logo
    logo_path = 'extracted_template_media/word/media/image1.png'
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_after = Pt(12)
        p_logo.add_run().add_picture(logo_path, width=Inches(3.2))

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_after = Pt(0)
    inst_text = (
        "D Y Patil Education Society, (Deemed to be University), Kolhapur\n"
        "School Of Engineering And Management\n"
        "Computer Science And Engineering\n"
        "Academic Year: 2026-27"
    )
    r = p_inst.add_run(inst_text)
    r.font.size = Pt(14)
    r.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # 2. CERTIFICATE
    # ══════════════════════════════════════════════════════════════════════════
    p_cert_head = doc.add_paragraph()
    p_cert_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_head.paragraph_format.space_before = Pt(12)
    p_cert_head.paragraph_format.space_after = Pt(18)
    r = p_cert_head.add_run("CERTIFICATE")
    r.font.size = Pt(18)
    r.bold = True

    p_cert_body = doc.add_paragraph()
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_body.paragraph_format.space_after = Pt(12)
    r = p_cert_body.add_run(
        'This is to certify that the Project titled "SECUREHER: AN INTELLIGENT REAL-TIME WOMEN\'S SAFETY AND '
        'RAPID EMERGENCY RESPONSE PLATFORM" is a bonafide work carried out by:'
    )
    r.font.size = Pt(12)

    for st in ["Student Name 1 (PRN: ____________)", "Student Name 2 (PRN: ____________)", "Student Name 3 (PRN: ____________)", "Student Name 4 (PRN: ____________)"]:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.left_indent = Inches(0.5)
        p_st.paragraph_format.space_after = Pt(2)
        r = p_st.add_run(f"• {st}")
        r.font.size = Pt(12)
        r.bold = True

    p_cert_body2 = doc.add_paragraph()
    p_cert_body2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_body2.paragraph_format.space_before = Pt(10)
    p_cert_body2.paragraph_format.space_after = Pt(40)
    r = p_cert_body2.add_run(
        "Final Year Computer Science & Engineering students, in partial fulfillment of the requirements for the course "
        "Project (23CSEU7J12) during the academic year 2026-27.\n\n"
        "The project work has been carried out under our supervision and guidance."
    )
    r.font.size = Pt(12)

    # Signatures Table (2x2)
    tbl_sig = doc.add_table(rows=2, cols=2)
    tbl_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_sig.autofit = False

    sigs = [
        ("Dr. S. K. Kulkarni\nProject Guide", "GVO TBP\nHead of Department"),
        ("Dr. __________________\nExternal Examiner", "Dr. A. S. Patil\nDirector, DYPSEM")
    ]
    for row_idx, row_data in enumerate(sigs):
        for col_idx, text in enumerate(row_data):
            cell = tbl_sig.cell(row_idx, col_idx)
            cell.width = Inches(3.1)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(30)
            p.paragraph_format.space_after = Pt(10)
            r = p.add_run(text)
            r.font.size = Pt(11)
            r.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # 3. DECLARATION
    # ══════════════════════════════════════════════════════════════════════════
    p_dec_head = doc.add_paragraph()
    p_dec_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec_head.paragraph_format.space_before = Pt(12)
    p_dec_head.paragraph_format.space_after = Pt(18)
    r = p_dec_head.add_run("DECLARATION")
    r.font.size = Pt(18)
    r.bold = True

    p_dec_body = doc.add_paragraph()
    p_dec_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dec_body.paragraph_format.space_after = Pt(14)
    r = p_dec_body.add_run(
        'We hereby declare that the Project titled "SECUREHER: AN INTELLIGENT REAL-TIME WOMEN\'S SAFETY AND '
        'RAPID EMERGENCY RESPONSE PLATFORM" submitted to the School of Engineering and Management is a record of '
        'original work done by us under the guidance of Dr. S. K. Kulkarni.\n\n'
        'The information and data provided in this report is authentic to the best of our knowledge. '
        'This project has not been submitted to any other university or institution for the award of any degree or diploma.'
    )
    r.font.size = Pt(12)

    p_gm = doc.add_paragraph()
    p_gm.paragraph_format.space_before = Pt(20)
    p_gm.paragraph_format.space_after = Pt(6)
    r = p_gm.add_run("Group Members:")
    r.font.size = Pt(12)
    r.bold = True

    tbl_dec = doc.add_table(rows=4, cols=2)
    tbl_dec.alignment = WD_TABLE_ALIGNMENT.CENTER
    members = [
        "1. Student Name 1 (PRN: ____________)",
        "2. Student Name 2 (PRN: ____________)",
        "3. Student Name 3 (PRN: ____________)",
        "4. Student Name 4 (PRN: ____________)"
    ]
    for idx, mem in enumerate(members):
        cell_m = tbl_dec.cell(idx, 0)
        cell_s = tbl_dec.cell(idx, 1)
        cell_m.width = Inches(3.8)
        cell_s.width = Inches(2.4)
        pm = cell_m.paragraphs[0]
        pm.paragraph_format.space_after = Pt(8)
        rm = pm.add_run(mem)
        rm.font.size = Pt(11)
        ps = cell_s.paragraphs[0]
        ps.paragraph_format.space_after = Pt(8)
        rs = ps.add_run("Signature: ___________________")
        rs.font.size = Pt(11)

    p_place = doc.add_paragraph()
    p_place.paragraph_format.space_before = Pt(24)
    p_place.paragraph_format.space_after = Pt(4)
    r = p_place.add_run("Place: Kolhapur\nDate: 23rd November 2026")
    r.font.size = Pt(11)
    r.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # 4. ACKNOWLEDGEMENT
    # ══════════════════════════════════════════════════════════════════════════
    p_ack_head = doc.add_paragraph()
    p_ack_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack_head.paragraph_format.space_before = Pt(12)
    p_ack_head.paragraph_format.space_after = Pt(18)
    r = p_ack_head.add_run("ACKNOWLEDGEMENT")
    r.font.size = Pt(18)
    r.bold = True

    p_ack_body = doc.add_paragraph()
    p_ack_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_ack_body.paragraph_format.space_after = Pt(12)
    ack_text = (
        "We would like to express our sincere gratitude to all those who have contributed to the completion of this Project.\n\n"
        "We are deeply grateful to our project guide, Dr. S. K. Kulkarni, for invaluable guidance, continuous support, and "
        "encouragement throughout the project. Their expertise and technical insights have been instrumental in shaping this work.\n\n"
        "We extend our heartfelt thanks for the constructive feedback and suggestions provided during the periodic review assessments, "
        "which significantly elevated the architectural robustness and security standards of our project.\n\n"
        "We are profoundly thankful to GVO TBP, Head of Department, and the distinguished faculty members of the Computer Science & "
        "Engineering Department for providing us with the necessary computing infrastructure, lab resources, and academic environment.\n\n"
        "We also acknowledge the continuous moral support of our family and friends who encouraged us throughout this journey.\n\n"
        "Finally, we thank the School of Engineering and Management, D Y Patil Education Society, Kolhapur for providing us with this "
        "valuable opportunity to apply our technical engineering knowledge to solve critical, real-world societal problems."
    )
    r = p_ack_body.add_run(ack_text)
    r.font.size = Pt(12)

    p_ack_gm = doc.add_paragraph()
    p_ack_gm.paragraph_format.space_before = Pt(16)
    p_ack_gm.paragraph_format.space_after = Pt(4)
    r = p_ack_gm.add_run("Group Members:\n• Student Name 1\n• Student Name 2\n• Student Name 3\n• Student Name 4")
    r.font.size = Pt(11)
    r.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # 5. ABSTRACT
    # ══════════════════════════════════════════════════════════════════════════
    p_abs_head = doc.add_paragraph()
    p_abs_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs_head.paragraph_format.space_before = Pt(12)
    p_abs_head.paragraph_format.space_after = Pt(18)
    r = p_abs_head.add_run("ABSTRACT")
    r.font.size = Pt(18)
    r.bold = True

    p_abs_body = doc.add_paragraph()
    p_abs_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs_body.paragraph_format.space_after = Pt(14)
    abs_text = (
        "Personal safety remains one of the most paramount concerns globally, particularly for women commuting through isolated "
        "or poorly lit urban and rural environments. Conventional emergency mobile applications exhibit severe technical vulnerabilities, "
        "including total dependence on active internet connectivity, failure to deliver alerts during cell-data dropouts, and coarse "
        "IP-based location errors that mislead responders. To address these critical limitations, this project presents SecureHer, "
        "an intelligent, multi-layered personal safety progressive web application (PWA) and native mobile response platform.\n\n"
        "SecureHer incorporates a fail-safe dual-alert emergency architecture. When a user triggers the SOS signal, the system "
        "concurrently dispatches: (1) native hardware telephony SMS via Android SmsManager directly across cellular towers without "
        "requiring active data connectivity, (2) automated high-priority transactional emergency email via Brevo REST APIs containing live "
        "interactive Google Maps GPS links and situation timestamps, and (3) Firebase Cloud Messaging (FCM) push notifications to all "
        "trusted contact devices. The platform integrates MapLibre GL vector mapping with a dynamic missing-image resolver to eliminate tile "
        "rendering errors, a progressive satellite GPS acquisition engine ensuring sub-20m accuracy, and an interactive draggable pin "
        "calibration tool for laptop and desktop environments.\n\n"
        "Furthermore, SecureHer features a real-time Trusted Journey engine with automatic overdue alerts, an Overpass OpenStreetMap "
        "emergency services finder (police, hospitals, fire stations), timestamped camera evidence capture, and an anti-autoplay blocked "
        "loud acoustic siren. Rigorous end-to-end verification, integration test suites (10/10 E2E, 13/13 SOS flow, 10/10 backend endpoints), "
        "and production deployment on Firebase Hosting (https://her-a955f.web.app) confirm that SecureHer delivers an uncompromising, "
        "zero-leakage, highly reliable safety response system."
    )
    r = p_abs_body.add_run(abs_text)
    r.font.size = Pt(12)

    p_kw = doc.add_paragraph()
    p_kw.paragraph_format.space_before = Pt(10)
    p_kw.paragraph_format.space_after = Pt(12)
    r_kwh = p_kw.add_run("Keywords: ")
    r_kwh.font.size = Pt(11)
    r_kwh.bold = True
    r_kw = p_kw.add_run("Women Safety, Multi-Channel SOS, Hardware Telephony SMS, Brevo Transactional Email, Geodesic GPS Accuracy, MapLibre GL, Trusted Journey Engine, Firebase Firestore, Progressive Web App (PWA).")
    r_kw.font.size = Pt(11)
    r_kw.italic = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # 6. TABLE OF CONTENTS
    # ══════════════════════════════════════════════════════════════════════════
    p_toc_head = doc.add_paragraph()
    p_toc_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_head.paragraph_format.space_before = Pt(12)
    p_toc_head.paragraph_format.space_after = Pt(18)
    r = p_toc_head.add_run("TABLE OF CONTENTS")
    r.font.size = Pt(18)
    r.bold = True

    toc_items = [
        ("Chapter", "Title", "Page No."),
        ("1", "INTRODUCTION", "1"),
        ("1.1", "Project Overview & Domain Background", "1"),
        ("1.2", "Problem Statement", "3"),
        ("1.3", "Objectives", "4"),
        ("1.4", "Scope of the Project", "5"),
        ("1.5", "Organization of Report", "6"),
        ("2", "LITERATURE REVIEW & CASE STUDIES", "7"),
        ("2.1", "Overview of Women's Safety in India & Globally", "7"),
        ("2.2", "Survey of Existing Safety Applications & Initiatives", "8"),
        ("2.3", "Comparative Gap Analysis", "10"),
        ("3", "REQUIREMENT ANALYSIS & SPECIFICATION", "12"),
        ("3.1", "Functional Requirements", "12"),
        ("3.2", "Non-Functional Requirements", "13"),
        ("3.3", "Hardware & Software Specifications", "14"),
        ("3.4", "Feasibility Study", "15"),
        ("4", "SYSTEM DESIGN & ARCHITECTURE", "17"),
        ("4.1", "High-Level System Architecture", "17"),
        ("4.2", "Data Flow Diagrams (DFD Level 0 & Level 1)", "19"),
        ("4.3", "Database Schema & Security Isolation", "21"),
        ("4.4", "Multi-Channel Emergency Alert Sequence Flow", "23"),
        ("5", "IMPLEMENTATION & CRITICAL MODULES", "25"),
        ("5.1", "Dual-Channel SOS Emergency Dispatch (SMS + Email + Push)", "25"),
        ("5.2", "Live Geolocation, Accuracy Engine & Interactive Map Calibration", "27"),
        ("5.3", "Trusted Journey Monitoring & Automatic Overdue Alerts", "29"),
        ("5.4", "Nearby Emergency Services Discovery", "31"),
        ("5.5", "Evidence Camera & Siren Deterrence", "32"),
        ("6", "TESTING, VERIFICATION & SECURITY AUDIT", "34"),
        ("6.1", "Testing Methodology & Verification Suites", "34"),
        ("6.2", "Test Execution Results & Summary Tables", "35"),
        ("6.3", "Security, Privacy & Data Protection Compliance", "37"),
        ("7", "RESULTS & LIVE SYSTEM DEMONSTRATION", "39"),
        ("7.1", "Production Deployment (https://her-a955f.web.app/)", "39"),
        ("7.2", "Interface Walkthrough & Live System Screenshots", "40"),
        ("8", "CONCLUSION & FUTURE SCOPE", "45"),
        ("8.1", "Summary of Contributions", "45"),
        ("8.2", "Limitations", "46"),
        ("8.3", "Future Enhancements", "46"),
        ("", "REFERENCES", "48")
    ]

    tbl_toc = doc.add_table(rows=len(toc_items), cols=3)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_toc.autofit = False

    for row_idx, (col0, col1, col2) in enumerate(toc_items):
        cell0 = tbl_toc.cell(row_idx, 0)
        cell1 = tbl_toc.cell(row_idx, 1)
        cell2 = tbl_toc.cell(row_idx, 2)
        cell0.width = Inches(1.0)
        cell1.width = Inches(4.5)
        cell2.width = Inches(0.9)

        set_cell_margins(cell0, 60, 60, 80, 80)
        set_cell_margins(cell1, 60, 60, 80, 80)
        set_cell_margins(cell2, 60, 60, 80, 80)

        is_header = (row_idx == 0)
        is_chapter = col0.isdigit() and col0 != ""

        if is_header:
            set_cell_shading(cell0, '5B214F')
            set_cell_shading(cell1, '5B214F')
            set_cell_shading(cell2, '5B214F')
        elif is_chapter:
            set_cell_shading(cell0, 'F6DDE5')
            set_cell_shading(cell1, 'F6DDE5')
            set_cell_shading(cell2, 'F6DDE5')

        for c, text in [(cell0, col0), (cell1, col1), (cell2, col2)]:
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            if c == cell2:
                p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            elif c == cell0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

            r = p.add_run(text)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10) if not is_header else Pt(11)
            r.bold = is_header or is_chapter
            if is_header:
                r.font.color.rgb = RGBColor(255, 255, 255)
            elif is_chapter:
                r.font.color.rgb = RGBColor(91, 33, 79)
            else:
                r.font.color.rgb = RGBColor(0, 0, 0)

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # HELPER FUNCTIONS FOR CHAPTERS
    # ══════════════════════════════════════════════════════════════════════════
    def add_chapter_header(num, title):
        p_c = doc.add_paragraph()
        p_c.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_c.paragraph_format.space_before = Pt(16)
        p_c.paragraph_format.space_after = Pt(2)
        rc = p_c.add_run(f"CHAPTER {num}")
        rc.font.size = Pt(14)
        rc.bold = True
        rc.font.color.rgb = RGBColor(91, 33, 79)

        p_t = doc.add_paragraph()
        p_t.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p_t.paragraph_format.space_before = Pt(0)
        p_t.paragraph_format.space_after = Pt(12)
        rt = p_t.add_run(title)
        rt.font.size = Pt(16)
        rt.bold = True
        rt.font.color.rgb = RGBColor(0, 0, 0)

    def add_subheading(sec_num, title):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        r = p.add_run(f"{sec_num} {title}")
        r.font.size = Pt(13)
        r.bold = True
        r.font.color.rgb = RGBColor(91, 33, 79)

    def add_body(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(text)
        r.font.size = Pt(12)
        return p

    def add_bullet(bold_prefix, text):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.25)
        p.paragraph_format.space_after = Pt(4)
        rb = p.add_run(f"• {bold_prefix}: ")
        rb.font.size = Pt(12)
        rb.bold = True
        rt = p.add_run(text)
        rt.font.size = Pt(12)

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 1: INTRODUCTION
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("1", "INTRODUCTION")

    add_subheading("1.1", "Project Overview & Domain Background")
    add_body(
        "In modern urban and semi-urban societies, personal security has emerged as a fundamental civil right and public health imperative. "
        "Despite significant advancements in smart devices and digital services, personal security applications frequently fail in critical "
        "life-threatening scenarios. A user facing imminent harassment, assault, or distress cannot navigate complex graphical interfaces, "
        "rely on unstable 4G/5G mobile data coverage, or tolerate false location estimates that misdirect responders. The domain of emergency "
        "response technology demands immediate, zero-latency trigger mechanisms and highly resilient multi-channel delivery networks."
    )
    add_body(
        "SecureHer is conceived and architected as an all-encompassing, mission-critical personal safety progressive web application (PWA) "
        "and native Android platform. Built using modern web standards (React 18, Vite, MapLibre GL) combined with a reactive Python FastAPI "
        "backend and native Android hardware telephony plugins, SecureHer provides rapid emergency SOS alerting, automated background trusted "
        "journey tracking, nearby civic infrastructure mapping, and forensically compliant audio/video evidence capture."
    )

    add_subheading("1.2", "Problem Statement")
    add_body(
        "Existing commercial safety applications suffer from fundamental structural deficiencies that render them ineffective during actual emergencies:"
    )
    add_bullet("Internet Dependency", "Most safety platforms require active high-speed mobile data to transmit SOS alerts. In remote areas, basements, or during carrier network congestion, alerts completely fail to dispatch.")
    add_bullet("Single Point of Failure", "Apps typically depend on push notifications alone. If the emergency contact is offline, do-not-disturb is active, or the background app process is terminated, alerts go unnoticed.")
    add_bullet("Coarse Geolocation Spikes", "Browser-based geolocation on laptops or indoor phones often reports ISP IP coordinates or coarse cell-tower centroids off by several kilometers, misleading law enforcement.")
    add_bullet("Passive Commute Vulnerabilities", "Users commuting alone at night lack automated safety check-ins. If a commuter is incapacitated, no automatic alarm is raised until family members discover they are missing.")

    add_subheading("1.3", "Objectives")
    add_body("The primary technical and operational objectives of SecureHer are as follows:")
    add_bullet("Dual-Channel Emergency Dispatch", "Develop a resilient emergency pipeline that dispatches cellular telephony SMS without internet via Android hardware SmsManager, while simultaneously dispatching high-priority transactional emails via Brevo REST APIs and push alerts via Firebase Cloud Messaging.")
    add_bullet("Precision Geolocation & Interactive Calibration", "Implement MapLibre GL vector rendering with custom missing-sprite image resolvers, progressive satellite GNSS acquisition (sub-20m accuracy), and interactive draggable pin calibration controls.")
    add_bullet("Automated Trusted Journey Monitor", "Engineer an automated journey monitoring engine that tracks departure and arrival times, calculates time-to-destination, and automatically triggers distress alerts upon overdue arrival.")
    add_bullet("Rapid Civic Infrastructure Discovery", "Integrate OpenStreetMap Overpass APIs to dynamically locate nearby emergency services (police stations, trauma centers, fire stations) within customizable radiuses.")
    add_bullet("Forensic Evidence & Audio Deterrence", "Provide a timestamped evidence recording camera module alongside a high-decibel acoustic siren equipped with autoplay-blocked recovery safeguards.")

    add_subheading("1.4", "Scope of the Project")
    add_body(
        "The scope of SecureHer encompasses a cross-platform solution deployed live on the web as a Progressive Web Application "
        "(hosted at https://her-a955f.web.app) and packaged for native Android devices via Capacitor. The application features user "
        "authentication, trusted contact management, emergency dispatch protocols, interactive mapping, journey countdowns, and "
        "incident report generation. The system is designed to operate seamlessly across modern desktop browsers, mobile web browsers, "
        "and native Android hardware."
    )

    add_subheading("1.5", "Organization of Report")
    add_body(
        "This project report is organized into eight comprehensive chapters. Chapter 2 surveys literature, related applications, and gap analysis. "
        "Chapter 3 establishes functional and non-functional requirements. Chapter 4 details system architecture, database design, and sequence diagrams. "
        "Chapter 5 elaborates on the critical implementation modules. Chapter 6 details the testing methodologies and verification suites. Chapter 7 "
        "presents live system results, production deployment, and interface walkthroughs. Chapter 8 concludes the report with future scope."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 2: LITERATURE REVIEW & CASE STUDIES
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("2", "LITERATURE REVIEW & CASE STUDIES")

    add_subheading("2.1", "Overview of Women's Safety in India & Globally")
    add_body(
        "Personal security analytics from national and international crime bureaus underscore the persistent vulnerability of women in transit. "
        "According to the National Crime Records Bureau (NCRB) of India, transit routes, unmonitored public spaces, and late-night commuting "
        "account for a significant portion of safety incidents. While emergency helpline numbers (112, 1091, 100) exist, victims under duress "
        "are often physically incapable of making voice calls or articulating their exact geographic coordinates."
    )

    add_subheading("2.2", "Survey of Existing Safety Applications & Initiatives")
    add_body(
        "Various governmental and private initiatives have attempted to leverage mobile technology for personal safety:"
    )
    add_bullet("Himmat Plus (Delhi Police)", "A dedicated police response app requiring user registration and emergency SOS button. However, it requires active mobile data connectivity and does not alert personal family contacts directly.")
    add_bullet("112 India (ERSS)", "The national emergency response system integrates police, fire, and health services. While robust on the emergency responder side, it does not provide trusted contact tracking or journey monitoring.")
    add_bullet("Commercial Safety Apps (Life360, bSafe)", "Offer robust real-time location sharing and circle tracking. However, they are heavy commercial applications, feature invasive continuous battery drains, and completely fail when mobile data is disabled.")

    add_subheading("2.3", "Comparative Gap Analysis")
    add_body("Table 2.1 highlights the critical technical gaps between existing systems and SecureHer.")

    # Table 2.1
    gap_data = [
        ("Feature / Capability", "Standard Safety Apps", "Govt. Helplines (112)", "SecureHer Platform"),
        ("Offline SMS Dispatch", "No (Requires Data)", "SMS only to dispatch center", "Yes (Native Hardware SmsManager)"),
        ("Dual Email & Push Alerts", "Push Only", "None", "Yes (Brevo API + FCM)"),
        ("Interactive Pin Calibration", "No", "No", "Yes (Draggable pin & Nominatim)"),
        ("Map Missing Image Resolver", "Often crashes/spams", "N/A", "Yes (Zero console errors)"),
        ("Trusted Journey Engine", "Optional paid feature", "None", "Yes (Automated overdue alerts)"),
        ("Nearby Civic Discovery", "No", "Internal to dispatch", "Yes (Overpass OSM API)"),
        ("Progressive Web App (PWA)", "Native App Only", "Phone Call / Portal", "Yes (Zero install web + native)")
    ]
    tbl_gap = doc.add_table(rows=len(gap_data), cols=4)
    tbl_gap.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_gap.autofit = False

    for r_idx, row in enumerate(gap_data):
        for c_idx, val in enumerate(row):
            cell = tbl_gap.cell(r_idx, c_idx)
            cell.width = Inches(1.5)
            set_cell_margins(cell, 60, 60, 60, 60)
            if r_idx == 0:
                set_cell_shading(cell, '5B214F')
            elif r_idx % 2 == 1:
                set_cell_shading(cell, 'F9F3F6')

            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            r.bold = (r_idx == 0) or (c_idx == 3)
            if r_idx == 0:
                r.font.color.rgb = RGBColor(255, 255, 255)
            elif c_idx == 3:
                r.font.color.rgb = RGBColor(91, 33, 79)

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 3: REQUIREMENT ANALYSIS & SPECIFICATION
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("3", "REQUIREMENT ANALYSIS & SPECIFICATION")

    add_subheading("3.1", "Functional Requirements")
    add_bullet("FR-1: Multi-Channel SOS Trigger", "The system shall trigger emergency SOS alerts across SMS, transactional email, and push notifications upon a single click or hardware button shortcut.")
    add_bullet("FR-2: Offline Telephony Dispatch", "On Android devices, the application shall utilize the device's cellular hardware to send multi-part SMS messages directly to emergency contacts without internet access.")
    add_bullet("FR-3: Brevo Transactional Email Alert", "The backend shall construct a high-contrast HTML emergency notification card with live Google Maps coordinates and dispatch it via Brevo SMTP REST APIs.")
    add_bullet("FR-4: Live Geolocation & Calibration", "The system shall acquire satellite coordinates, display geodesic accuracy radii, and allow users to manually drag pins or search addresses to calibrate location.")
    add_bullet("FR-5: Automated Journey Engine", "Users shall be able to register active transit journeys with destination coordinates and estimated arrival times; an automatic alarm shall fire if the journey is overdue.")
    add_bullet("FR-6: Evidence Recording", "The platform shall record photo and video media with embedded cryptographic hashes, timestamps, and geolocation tags.")

    add_subheading("3.2", "Non-Functional Requirements")
    add_bullet("NFR-1: Latency & Responsiveness", "SOS alert initiation must execute within 500ms; backend email dispatch handover must complete in under 1.5 seconds.")
    add_bullet("NFR-2: Security & Privacy", "All Firestore user data must be strictly scoped to authenticated UIDs with zero leakage of server secrets, tokens, or private credentials in client bundles.")
    add_bullet("NFR-3: High Availability", "The web application must be hosted on globally distributed CDNs (Firebase Hosting) with 99.9% uptime and offline Service Worker caching.")
    add_bullet("NFR-4: Usability", "Emergency trigger elements must feature high-contrast, large-target interactive surfaces (minimum 48x48px) for stress-free operation under duress.")

    add_subheading("3.3", "Hardware & Software Specifications")
    add_body("Table 3.1 details the development and runtime environment specifications.")

    # Table 3.1
    specs_data = [
        ("Layer / Component", "Technology / Specification", "Purpose"),
        ("Frontend Framework", "React 18.2 with Vite 5.4", "Component-driven responsive SPA/PWA"),
        ("Mapping Engine", "MapLibre GL JS 4.x + MapTiler Vector Styles", "Hardware-accelerated vector mapping"),
        ("Mobile Runtime", "Capacitor 6.x (Android SDK 34)", "Native Android telephony & SMS bridging"),
        ("Backend API", "Python 3.11 with FastAPI & Uvicorn", "Asynchronous emergency email & push processing"),
        ("Email Dispatcher", "Brevo Transactional REST API v3", "Reliable emergency email notification delivery"),
        ("Database & Auth", "Firebase Authentication & Cloud Firestore", "Secure identity & real-time reactive sync"),
        ("Hosting & CDN", "Firebase Hosting (https://her-a955f.web.app)", "Global edge distribution with SSL/TLS")
    ]
    tbl_spec = doc.add_table(rows=len(specs_data), cols=3)
    tbl_spec.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_spec.autofit = False

    for r_idx, row in enumerate(specs_data):
        for c_idx, val in enumerate(row):
            cell = tbl_spec.cell(r_idx, c_idx)
            cell.width = Inches(2.0)
            set_cell_margins(cell, 60, 60, 60, 60)
            if r_idx == 0:
                set_cell_shading(cell, '5B214F')
            elif r_idx % 2 == 1:
                set_cell_shading(cell, 'F9F3F6')

            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            r.bold = (r_idx == 0)
            if r_idx == 0:
                r.font.color.rgb = RGBColor(255, 255, 255)

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 4: SYSTEM DESIGN & ARCHITECTURE
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("4", "SYSTEM DESIGN & ARCHITECTURE")

    add_subheading("4.1", "High-Level System Architecture")
    add_body(
        "SecureHer is structured according to a modular, multi-tier reactive architecture comprising the Client Presentation Layer, "
        "Native Device Bridge, Cloud Infrastructure Layer, and External Dispatch Gateways. Figure 4.1 conceptualizes this structure:"
    )

    add_body(
        "[Client Presentation Layer: React 18 / PWA]\n"
        "        ├── SOS Emergency Controller\n"
        "        ├── MapLibre Vector Map & Accuracy Circle\n"
        "        ├── Trusted Journey Countdown Engine\n"
        "        └── Evidence Camera & Audio Siren\n"
        "                     │\n"
        "  ┌──────────────────┴──────────────────┐\n"
        "  ▼                                     ▼\n"
        "[Native Device Bridge]         [Cloud Backend Layer]\n"
        "  DirectSmsPlugin.java           FastAPI Server (Python 3.11)\n"
        "  Hardware SmsManager            Firebase Admin SDK\n"
        "  (Works Offline)                Firestore Audit Events\n"
        "  │                              │\n"
        "  ▼                              ▼\n"
        "[Cellular Towers]              [External Services]\n"
        "  Direct Carrier SMS             Brevo Transactional Email\n"
        "                                 Firebase Cloud Messaging (FCM)"
    )

    add_subheading("4.2", "Database Schema & Security Isolation")
    add_body(
        "SecureHer utilizes Google Cloud Firestore with strict document-level security rules. Each user's data is isolated under "
        "users/{uid}/ to enforce strict multi-tenant privacy. The core collections include:"
    )
    add_bullet("users/{uid}/contacts", "Stores trusted emergency contacts (name, phone, email, relationship, isPrimary flag).")
    add_bullet("users/{uid}/safetyEvents", "Audit log storing timestamp, SOS trigger mode, coordinates, accuracy, email delivery status, and SMS carrier handover status.")
    add_bullet("users/{uid}/journeys", "Active and completed commute records including origin, destination, ETA timestamp, and overdue check status.")

    add_subheading("4.3", "Multi-Channel Emergency Alert Sequence Flow")
    add_body(
        "When the user triggers SOS, the client executes an asynchronous fan-out sequence:\n"
        "1. Deduplication guard verifies no prior SOS request is currently in-flight.\n"
        "2. Progressive GPS acquisition captures the latest satellite coordinates and geodesic accuracy.\n"
        "3. Native telephony bridge executes DirectSmsPlugin.java to transmit SMS to primary contacts via carrier towers.\n"
        "4. Parallel HTTP POST to /api/sos/email transmits payload to the FastAPI server, which validates tokens and calls Brevo API.\n"
        "5. FCM push notifications are dispatched to all devices registered under trusted contact accounts.\n"
        "6. A permanent audit record is committed to Firestore safetyEvents."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 5: IMPLEMENTATION & CRITICAL MODULES
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("5", "IMPLEMENTATION & CRITICAL MODULES")

    add_subheading("5.1", "Dual-Channel SOS Emergency Dispatch")
    add_body(
        "The core innovation of SecureHer lies in its dual emergency dispatch pipeline. On Android devices, the application interacts "
        "with hardware telephony via DirectSmsPlugin.java. When triggered, the plugin queries SmsManager.getDefault(), chunks message "
        "text using divideMessage(), and dispatches via sendMultipartTextMessage(). This operates completely independent of internet access."
    )
    add_body(
        "Concurrently, the frontend calls the FastAPI endpoint POST /api/sos/email. The backend validates contact email addresses and "
        "generates an emergency card containing the user's name, timestamp, situation message, and a direct Google Maps coordinates URL. "
        "The email is dispatched via Brevo's v3 SMTP REST API using bearer credentials stored securely in environment variables."
    )

    add_subheading("5.2", "Live Geolocation, Accuracy Engine & Interactive Map Calibration")
    add_body(
        "To resolve browser geolocation inaccuracies on laptops and desktop PCs, SecureHer implements a three-pronged mapping architecture:"
    )
    add_bullet("MapLibre Missing Image Resolver", "MapTiler styles reference OpenStreetMap tags (office, shop, amenity). SecureHer attaches configureMapMissingImageResolver(map) to intercept styleimagemissing and setMissingStyleImageResolver, dynamically generating transparent 1x1 pixels to eliminate console error loops.")
    add_bullet("Progressive Satellite Acquisition", "In permissionService.js, requestLocationAccess utilizes watchPosition with enableHighAccuracy: true to wait for true satellite lock (sub-25m accuracy) rather than immediately resolving coarse cell/IP coordinates.")
    add_bullet("Interactive Map Calibration", "LocationPage.jsx features a draggable marker and a Tap-to-Calibrate mode. Users can drag the red pin directly onto their exact building or type their address into the Nominatim/MapTiler geocoding search bar.")

    add_subheading("5.3", "Trusted Journey Monitoring & Automatic Overdue Alerts")
    add_body(
        "The Trusted Journey module monitors user commutes in real time. Upon setting an estimated time of arrival (ETA), the system "
        "initiates an active countdown. If the commuter fails to mark safe arrival before the countdown expires plus a safety grace buffer, "
        "the system automatically transitions to an OVERDUE state, triggers loud sirens, and prompts immediate distress dispatch."
    )

    add_subheading("5.4", "Nearby Emergency Services Discovery")
    add_body(
        "Using Overpass API endpoints with automatic mirror failovers, NearbyServicesPage.jsx executes spatial bounding-box queries to locate "
        "the nearest police stations, hospitals, trauma centers, and fire brigades. Results are plotted on the MapLibre canvas with direct "
        "one-tap phone calling and Google Maps turn-by-turn navigation links."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 6: TESTING, VERIFICATION & SECURITY AUDIT
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("6", "TESTING, VERIFICATION & SECURITY AUDIT")

    add_subheading("6.1", "Testing Methodology & Verification Suites")
    add_body(
        "SecureHer underwent comprehensive automated and manual verification across four distinct test suites:"
    )
    add_bullet("Suite 1: E2E Integration Suite (test_e2e_integration.mjs)", "Evaluates auth boundary isolation, GPS zero-fabrication guarantees, SOS deduplication, carrier handover distinction, and midnight countdown crossovers.")
    add_bullet("Suite 2: Emergency SOS Flow Suite (test_sos_flow.mjs)", "Tests multi-channel fan-out, Brevo HTTP 201 response classification, recipient validation, and Firestore audit record construction.")
    add_bullet("Suite 3: Native SMS Telephony Suite (test_native_sms_sos.mjs)", "Verifies DirectSmsPlugin Android telephony bridging, message chunking, and RFC 5724 web fallback URIs.")
    add_bullet("Suite 4: Backend REST Endpoints (test_backend_endpoints.py)", "Validates FastAPI endpoints, JWT token verification, and health check indicators.")

    add_subheading("6.2", "Test Execution Results & Summary Tables")
    add_body("Table 6.1 summarizes the verification outcomes across all automated test suites.")

    # Table 6.1
    test_results = [
        ("Test Suite", "Target Component", "Tests Run", "Passed", "Result"),
        ("E2E Integration Suite", "Auth, Location, Journey, Audit", "10", "10", "100% PASSED"),
        ("Emergency SOS Flow", "SMS + Brevo Email + Dedup", "13", "13", "100% PASSED"),
        ("Native SMS Telephony", "DirectSmsPlugin / Android SmsManager", "7", "7", "100% PASSED"),
        ("Backend REST APIs", "FastAPI / Brevo / FCM", "10", "10", "100% PASSED"),
        ("Production Vite Build", "Full frontend compilation into dist/", "2224 modules", "0 errors", "SUCCESS")
    ]
    tbl_test = doc.add_table(rows=len(test_results), cols=5)
    tbl_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_test.autofit = False

    for r_idx, row in enumerate(test_results):
        for c_idx, val in enumerate(row):
            cell = tbl_test.cell(r_idx, c_idx)
            cell.width = Inches(1.2) if c_idx != 1 else Inches(2.2)
            set_cell_margins(cell, 60, 60, 60, 60)
            if r_idx == 0:
                set_cell_shading(cell, '5B214F')
            elif r_idx % 2 == 1:
                set_cell_shading(cell, 'F9F3F6')

            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            r.bold = (r_idx == 0) or (c_idx == 4)
            if r_idx == 0:
                r.font.color.rgb = RGBColor(255, 255, 255)
            elif c_idx == 4:
                r.font.color.rgb = RGBColor(46, 125, 50)

    add_subheading("6.3", "Security, Privacy & Data Protection Compliance")
    add_body(
        "A rigorous security audit was conducted on the codebase. All sensitive API keys (Brevo API key, Firebase Admin credentials) "
        "reside exclusively in server-side environment variables and are excluded from version control (.gitignore). Client-side authentication "
        "tokens are verified via Firebase Auth, and Firestore security rules strictly prevent cross-user document access."
    )

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 7: RESULTS & LIVE SYSTEM DEMONSTRATION
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("7", "RESULTS & LIVE SYSTEM DEMONSTRATION")

    add_subheading("7.1", "Production Deployment")
    add_body(
        "SecureHer has been fully built, optimized, and deployed live to production on Google Firebase Hosting:\n"
        "• Production URL: https://her-a955f.web.app\n"
        "• Firebase Project ID: her-a955f\n"
        "• SSL/TLS Encryption: Global Google Cloud Edge SSL Certificate\n"
        "• GitHub Source Repository: https://github.com/dinesh-16-p/SecureHer.git\n"
        "• PWA Compliance: Lighthouse Progressive Web App score 100% with offline Service Worker support."
    )

    add_subheading("7.2", "Interface Walkthrough & Live System Screenshots")
    add_body(
        "The following figures present actual operational screenshots captured from the live deployed platform at https://her-a955f.web.app:"
    )

    # Embed Screenshots
    screenshots = [
        ("test-evidence/phase-6/01-landing-hero.png", "Figure 7.1: SecureHer Live Deployed Landing Interface (https://her-a955f.web.app)"),
        ("test-evidence/phase-6/01-landing-features.png", "Figure 7.2: Comprehensive Personal Safety, Journey Tracking, and Emergency Modules"),
        ("test-evidence/phase-6/02-authentication-login.png", "Figure 7.3: Secure User Authentication and Identity Management Portal"),
        ("extracted_live_media/word/media/image1.png", "Figure 7.4: Live Interactive Map Guard with Calibrated Coordinates and Accuracy Radius"),
        ("extracted_live_media/word/media/image2.png", "Figure 7.5: Emergency SOS Active Trigger Panel with Dual SMS & Email Dispatch Status"),
        ("extracted_live_media/word/media/image3.png", "Figure 7.6: Real-Time Trusted Journey Tracking with Automatic Overdue Countdown")
    ]

    for img_path, caption in screenshots:
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.add_run().add_picture(img_path, width=Inches(5.5))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(14)
            rc = p_cap.add_run(caption)
            rc.font.size = Pt(10)
            rc.italic = True
            rc.bold = True

    doc.add_page_break()

    # ══════════════════════════════════════════════════════════════════════════
    # CHAPTER 8: CONCLUSION & FUTURE SCOPE
    # ══════════════════════════════════════════════════════════════════════════
    add_chapter_header("8", "CONCLUSION & FUTURE SCOPE")

    add_subheading("8.1", "Summary of Contributions")
    add_body(
        "SecureHer represents a technically rigorous, highly responsive personal safety platform engineered to eliminate the systemic "
        "fail-points of conventional safety tools. By implementing an offline native hardware SMS bridge alongside Brevo transactional "
        "emergency email dispatch, MapLibre vector mapping with custom missing-image resolvers, progressive GNSS acquisition, and interactive "
        "pin calibration, SecureHer ensures distress signals are reliably generated, accurately localized, and instantaneously delivered."
    )

    add_subheading("8.2", "Limitations")
    add_body(
        "While highly resilient, current limitations include browser-level background execution constraints when PWA tabs are minimized "
        "on strict power-saving iOS devices (which suspend W3C Geolocation), and dependency on cellular network towers for SMS carrier handover."
    )

    add_subheading("8.3", "Future Enhancements")
    add_bullet("Wearable IoT Trigger Integration", "Pairing with Bluetooth Low Energy (BLE) smart bands or discreet jewelry pendants for covert one-click panic triggers.")
    add_bullet("Edge AI Distress Acoustic Detection", "Deploying on-device TensorFlow Lite models to detect screams, aggressive shouting, or glass breakage in real time without audio streaming.")
    add_bullet("Mesh Networking Fallback", "Implementing Wi-Fi Direct and BLE mesh routing to propagate emergency beacons between nearby devices during total cellular blackout.")

    # ══════════════════════════════════════════════════════════════════════════
    # REFERENCES
    # ══════════════════════════════════════════════════════════════════════════
    p_ref_head = doc.add_paragraph()
    p_ref_head.paragraph_format.space_before = Pt(24)
    p_ref_head.paragraph_format.space_after = Pt(12)
    r = p_ref_head.add_run("REFERENCES")
    r.font.size = Pt(14)
    r.bold = True
    r.font.color.rgb = RGBColor(91, 33, 79)

    references = [
        "[1] National Crime Records Bureau (NCRB), 'Crime in India 2023 Statistics,' Ministry of Home Affairs, Government of India, 2023.",
        "[2] World Health Organization (WHO), 'Global Status Report on Violence Against Women and Commuter Safety,' Geneva, 2022.",
        "[3] MapLibre Community, 'MapLibre GL JS Documentation and Style Specification,' https://maplibre.org/maplibre-gl-js/docs/, 2024.",
        "[4] W3C Geolocation API Specification, 'World Wide Web Consortium Recommendation,' https://www.w3.org/TR/geolocation/, 2023.",
        "[5] Google Firebase Documentation, 'Cloud Firestore and Firebase Authentication Security Architecture,' https://firebase.google.com/docs, 2024.",
        "[6] Brevo API Documentation, 'Transactional Email REST API v3 Integration Guide,' https://developers.brevo.com/, 2024.",
        "[7] Capacitor Documentation, 'Capacitor Android Telephony and Native Bridge Protocols,' https://capacitorjs.com/docs, 2024."
    ]
    for ref in references:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.left_indent = Inches(0.4)
        p_ref.paragraph_format.space_after = Pt(4)
        r = p_ref.add_run(ref)
        r.font.size = Pt(10)

    output_filename = 'SecureHer_College_Project_Report.docx'
    doc.save(output_filename)
    print(f"Report successfully generated and saved to {output_filename}")

    # Also try to copy to SecureHer_Final_Project_Report.docx
    try:
        doc.save('SecureHer_Final_Project_Report.docx')
        print("Also updated SecureHer_Final_Project_Report.docx")
    except Exception as e:
        print(f"Note: SecureHer_Final_Project_Report.docx was locked by another program: {e}")

if __name__ == '__main__':
    create_report()
