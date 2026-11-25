import os
import sys
import shutil
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
)
from reportlab.pdfgen import canvas

from report_sections_part1 import build_part1_pages
from report_sections_part2 import build_part2_pages
from report_sections_part3 import build_part3_pages

# ═════════════════════════════════════════════════════════════════════════════
# DYNAMIC TWO-PASS RUNNING HEADER & FOOTER CANVAS ("Page X of 70")
# ═════════════════════════════════════════════════════════════════════════════
class NumberedCanvas70(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas70, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        print(f"\n==========================================")
        print(f"  TOTAL COMPILED PDF PAGES: {num_pages}")
        print(f"==========================================\n")
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_header_footer(self, page_count):
        if self._pageNumber == 1:
            return  # Suppress running header/footer on title cover page

        self.saveState()
        self.setFont("Times-Roman", 8)

        # Running Header completely removed as per university requirements
        # (Header removed; names & institutional metadata present on Page 1)

        # Running Footer (pages 2-70) - Strict Black & White with Times-Roman
        self.setStrokeColor(colors.HexColor("#777777"))
        self.setLineWidth(0.5)
        self.line(54, 42, A4[0] - 54, 42)
        self.setFillColor(colors.HexColor("#333333"))
        self.drawString(54, 30, "D. Y. Patil Education Society, Kolhapur — Data Sciences Engineering")
        
        self.setFont("Times-Bold", 8)
        self.setFillColor(colors.HexColor("#000000"))
        self.drawRightString(A4[0] - 54, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

# Palette definition - Strict Black & White / Grayscale
PRIMARY = colors.HexColor("#000000")
SECONDARY = colors.HexColor("#333333")
DARK_TEXT = colors.HexColor("#000000")
MUTED_TEXT = colors.HexColor("#444444")
BG_LIGHT = colors.HexColor("#F8F8F8")
BG_ALT = colors.HexColor("#EFEFEF")
BORDER_COLOR = colors.HexColor("#999999")
SUCCESS_GREEN = colors.HexColor("#000000")
ALERT_RED = colors.HexColor("#000000")

def setup_styles():
    base = getSampleStyleSheet()
    styles = {}
    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle', parent=base['Heading1'], fontName='Times-Bold', fontSize=17, leading=22,
        textColor=PRIMARY, alignment=1, spaceAfter=6
    )
    styles['CoverSubtitle'] = ParagraphStyle(
        'CoverSubtitle', parent=base['Normal'], fontName='Times-Roman', fontSize=11, leading=15,
        textColor=DARK_TEXT, alignment=1, spaceAfter=6
    )
    styles['ChapHeader'] = ParagraphStyle(
        'ChapHeader', parent=base['Heading1'], fontName='Times-Bold', fontSize=14, leading=17,
        textColor=PRIMARY, spaceBefore=0, spaceAfter=4, keepWithNext=True
    )
    styles['ChapHeaderCenter'] = ParagraphStyle(
        'ChapHeaderCenter', parent=base['Heading1'], fontName='Times-Bold', fontSize=14, leading=17,
        textColor=PRIMARY, alignment=1, spaceBefore=0, spaceAfter=4, keepWithNext=True
    )
    styles['SecHeader'] = ParagraphStyle(
        'SecHeader', parent=base['Heading2'], fontName='Times-Bold', fontSize=11.5, leading=14.5,
        textColor=PRIMARY, spaceBefore=4, spaceAfter=3, keepWithNext=True
    )
    styles['SubSecHeader'] = ParagraphStyle(
        'SubSecHeader', parent=base['Heading3'], fontName='Times-Bold', fontSize=9.5, leading=12.5,
        textColor=SECONDARY, spaceBefore=4, spaceAfter=2, keepWithNext=True
    )
    styles['Body'] = ParagraphStyle(
        'Body', parent=base['Normal'], fontName='Times-Roman', fontSize=8.5, leading=12,
        textColor=DARK_TEXT, alignment=4, spaceAfter=4
    )
    styles['BodyCenter'] = ParagraphStyle(
        'BodyCenter', parent=base['Normal'], fontName='Times-Roman', fontSize=9.5, leading=14,
        textColor=DARK_TEXT, alignment=1, spaceAfter=3
    )
    styles['BodyCenterBold'] = ParagraphStyle(
        'BodyCenterBold', parent=base['Normal'], fontName='Times-Bold', fontSize=10.5, leading=14,
        textColor=DARK_TEXT, alignment=1, spaceAfter=3
    )
    styles['BodyIndent'] = ParagraphStyle(
        'BodyIndent', parent=base['Normal'], fontName='Times-Roman', fontSize=9, leading=14,
        textColor=DARK_TEXT, leftIndent=25, spaceAfter=3
    )
    styles['BodyBold'] = ParagraphStyle(
        'BodyBold', parent=base['Normal'], fontName='Times-Bold', fontSize=9.5, leading=13,
        textColor=DARK_TEXT, spaceAfter=3
    )
    styles['Bullet'] = ParagraphStyle(
        'Bullet', parent=base['Normal'], fontName='Times-Roman', fontSize=8.2, leading=11.5,
        textColor=DARK_TEXT, leftIndent=10, spaceAfter=2.5
    )
    styles['Code'] = ParagraphStyle(
        'Code', parent=base['Normal'], fontName='Courier', fontSize=7.2, leading=9.2,
        textColor=colors.HexColor("#1A1A1A"), backColor=BG_ALT, borderPadding=3, spaceAfter=4
    )
    styles['Caption'] = ParagraphStyle(
        'Caption', parent=base['Normal'], fontName='Times-Italic', fontSize=7.8, leading=10,
        textColor=PRIMARY, alignment=1, spaceBefore=2, spaceAfter=5
    )
    styles['Callout'] = ParagraphStyle(
        'Callout', parent=base['Normal'], fontName='Times-Roman', fontSize=8.2, leading=11.5,
        textColor=DARK_TEXT, backColor=BG_LIGHT, borderPadding=5, spaceAfter=4
    )
    return styles

def generate_70_page_report():
    output_filename = "SecureHer_Comprehensive_70Page_Project_Report.pdf"
    live_filename = "SecureHer_Project_Report_Live.pdf"
    
    print("Initializing document template...")
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    S = setup_styles()
    story = []
    
    print("Building Part 1 (Pages 1 to 26)...")
    build_part1_pages(story, S)
    
    print("Building Part 2 (Pages 27 to 46)...")
    build_part2_pages(story, S)
    
    print("Building Part 3 (Pages 47 to 70)...")
    build_part3_pages(story, S)
    
    print("Compiling PDF with NumberedCanvas70 (Two-Pass Page Numbering)...")
    doc.build(story, canvasmaker=NumberedCanvas70)
    
    if os.path.exists(output_filename):
        file_size = os.path.getsize(output_filename)
        print(f"Generated: {output_filename} ({file_size:,} bytes)")
        
        # Verify page count with regex
        with open(output_filename, 'rb') as f:
            pdf_bytes = f.read()
            page_matches = re.findall(rb'/Type\s*/Page[^s]', pdf_bytes)
            actual_pages = len(page_matches)
            print(f"Verified actual page objects in PDF: {actual_pages}")
            
        # Copy to destinations
        targets = [
            live_filename,
            "Project_Reports/SecureHer_Comprehensive_70Page_Project_Report.pdf",
            "Project_Reports/SecureHer_Project_Report_Live.pdf",
            "public/SecureHer_Comprehensive_70Page_Project_Report.pdf",
            "public/SecureHer_Project_Report_Live.pdf"
        ]
        for target in targets:
            os.makedirs(os.path.dirname(target) or '.', exist_ok=True)
            shutil.copyfile(output_filename, target)
            print(f"Successfully copied to {target}")
        return actual_pages
    else:
        print("Error: Output file not created.")
        return 0

if __name__ == "__main__":
    generate_70_page_report()
