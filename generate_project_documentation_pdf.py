import os
import sys
import re
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return  # Skip cover page
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#7A6878"))
        
        # Header rule & text
        self.setStrokeColor(colors.HexColor("#E2D4DE"))
        self.setLineWidth(0.5)
        self.line(54, letter[1] - 40, letter[0] - 54, letter[1] - 40)
        self.drawString(54, letter[1] - 34, "SecureHer — Comprehensive Technical Project Documentation")

        # Footer rule & text
        self.line(54, 45, letter[0] - 54, 45)
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 32, page_text)
        self.drawString(54, 32, "Confidential — For Academic & Technical Review")
        self.restoreState()

def convert_md_inline(text):
    # Escape xml entities first
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    # Convert bold **text** -> <b>text</b>
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    # Convert inline code `text` -> <font face="Courier">\1</font>
    text = re.sub(r'`(.*?)`', r'<font face="Courier">\1</font>', text)
    return text

def generate_pdf():
    pdf_filename = "SecureHer_Complete_Project_Documentation.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom color palette matching SecureHer
    PRIMARY = colors.HexColor("#5B214F")
    SECONDARY = colors.HexColor("#C75B7A")
    DARK_TEXT = colors.HexColor("#29212A")
    MUTED_TEXT = colors.HexColor("#635564")
    BG_CARD = colors.HexColor("#FAF5F8")
    BORDER_COLOR = colors.HexColor("#EADEE5")

    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY,
        alignment=1,
        spaceAfter=15
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        alignment=1,
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        spaceAfter=5
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1A1A1A"),
        backColor=colors.HexColor("#F4EEF2"),
        borderPadding=5,
        spaceAfter=5
    )

    story = []

    # ---------------- COVER PAGE ----------------
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("SecureHer", title_style))
    story.append(Paragraph("Next-Generation Women Safety, Emergency Dispatch, and Personal Health Platform", subtitle_style))
    story.append(HRFlowable(width="60%", thickness=2, color=SECONDARY, spaceBefore=8, spaceAfter=20))
    
    meta_data = [
        [Paragraph("<b>Project Specification:</b>", body_style), Paragraph("Production-Grade Architecture & Academic Manual", body_style)],
        [Paragraph("<b>Primary Application:</b>", body_style), Paragraph("React (v18.3) + Vite + Capacitor (Android Native)", body_style)],
        [Paragraph("<b>Backend Engine:</b>", body_style), Paragraph("FastAPI + Firebase Admin Python + Uvicorn", body_style)],
        [Paragraph("<b>Production Web URL:</b>", body_style), Paragraph("https://her-a955f.web.app", body_style)],
        [Paragraph("<b>Date of Release:</b>", body_style), Paragraph("October 14, 2026", body_style)],
        [Paragraph("<b>Document Version:</b>", body_style), Paragraph("2.0 (Native SMS & FCM Push Edition)", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[150, 330])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 1.5 * inch))
    story.append(Paragraph("<b>Confidentiality Note:</b> This document contains verified technical architectures, API specifications, and operational manuals derived directly from the active SecureHer codebase.", ParagraphStyle('Note', parent=body_style, fontSize=8, textColor=MUTED_TEXT, alignment=1)))
    story.append(PageBreak())

    # ---------------- READ MARKDOWN SOURCE & RENDER ----------------
    with open("SecureHer_Complete_Project_Documentation.md", "r", encoding="utf-8") as f:
        md_text = f.read()

    lines = md_text.split("\n")
    in_code_block = False
    code_lines = []
    in_table = False
    table_rows = []

    for line in lines:
        stripped = line.strip()

        # Handle Code Blocks
        if stripped.startswith("```"):
            if in_code_block:
                code_content = "<br/>".join([c.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace(" ", "&nbsp;") for c in code_lines])
                story.append(Paragraph(code_content, code_style))
                code_lines = []
                in_code_block = False
            else:
                in_code_block = True
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        # Handle Tables
        if "|" in line and (line.startswith("|") or line.endswith("|")):
            if "---" in line:
                continue # Header separator
            cells = [convert_md_inline(c.strip()) for c in line.split("|")[1:-1]]
            if len(cells) > 0:
                table_rows.append(cells)
                in_table = True
                continue
        else:
            if in_table and len(table_rows) > 0:
                num_cols = len(table_rows[0])
                available_width = letter[0] - 108 # 504 pt
                col_width = available_width / float(num_cols)
                formatted_table_data = []
                for row_idx, r in enumerate(table_rows):
                    row_cells = []
                    for c in r:
                        style_to_use = body_style
                        if row_idx == 0:
                            style_to_use = ParagraphStyle('TH', parent=body_style, fontName='Helvetica-Bold', textColor=PRIMARY, fontSize=8)
                        else:
                            style_to_use = ParagraphStyle('TD', parent=body_style, fontSize=7.5)
                        row_cells.append(Paragraph(c, style_to_use))
                    formatted_table_data.append(row_cells)
                
                t = Table(formatted_table_data, colWidths=[col_width] * num_cols)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), BG_CARD),
                    ('BOX', (0,0), (-1,-1), 1, BORDER_COLOR),
                    ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
                    ('TOPPADDING', (0,0), (-1,-1), 3),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                    ('LEFTPADDING', (0,0), (-1,-1), 5),
                    ('RIGHTPADDING', (0,0), (-1,-1), 5),
                ]))
                story.append(t)
                story.append(Spacer(1, 4))
                table_rows = []
                in_table = False

        if not stripped:
            story.append(Spacer(1, 3))
            continue

        # Headings
        if stripped.startswith("# "):
            story.append(Spacer(1, 10))
            story.append(Paragraph(convert_md_inline(stripped[2:]), h1_style))
            story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceBefore=3, spaceAfter=6))
        elif stripped.startswith("## "):
            story.append(Paragraph(convert_md_inline(stripped[3:]), h2_style))
        elif stripped.startswith("### "):
            story.append(Paragraph(convert_md_inline(stripped[4:]), h3_style))
        elif stripped.startswith("---"):
            story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceBefore=6, spaceAfter=6))
        elif stripped.startswith("- "):
            bullet_text = "&bull; " + convert_md_inline(stripped[2:])
            story.append(Paragraph(bullet_text, ParagraphStyle('Bullet', parent=body_style, leftIndent=10)))
        else:
            p_text = convert_md_inline(stripped)
            story.append(Paragraph(p_text, body_style))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF build complete:", pdf_filename)

if __name__ == "__main__":
    generate_pdf()
