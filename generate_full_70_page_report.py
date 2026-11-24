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
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#5B214F"))

        # Running Header (pages 2-70)
        self.setStrokeColor(colors.HexColor("#D8C5D3"))
        self.setLineWidth(0.6)
        self.line(54, A4[1] - 38, A4[0] - 54, A4[1] - 38)
        self.drawString(54, A4[1] - 32, "SecureHer — Intelligent Real-Time Women's Safety & Emergency Response Platform")
        self.drawRightString(A4[0] - 54, A4[1] - 32, "Final Year Project (23CSEU7J12)")

        # Running Footer (pages 2-70)
        self.line(54, 42, A4[0] - 54, 42)
        self.setFillColor(colors.HexColor("#635564"))
        self.drawString(54, 30, "D. Y. Patil Education Society, Kolhapur — Dept. of Computer Science & Engineering")
        
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#5B214F"))
        self.drawRightString(A4[0] - 54, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

# Palette definition
PRIMARY = colors.HexColor("#5B214F")
SECONDARY = colors.HexColor("#C75B7A")
DARK_TEXT = colors.HexColor("#221B24")
MUTED_TEXT = colors.HexColor("#5C4D5D")
BG_LIGHT = colors.HexColor("#FAF6F9")
BG_ALT = colors.HexColor("#F4ECF2")
BORDER_COLOR = colors.HexColor("#E2D3DF")
SUCCESS_GREEN = colors.HexColor("#2E7D32")
ALERT_RED = colors.HexColor("#D92D3A")

def setup_styles():
    base = getSampleStyleSheet()
    styles = {}
    styles['CoverTitle'] = ParagraphStyle(
        'CoverTitle', parent=base['Heading1'], fontName='Helvetica-Bold', fontSize=20, leading=24,
        textColor=PRIMARY, alignment=1, spaceAfter=8
    )
    styles['CoverSubtitle'] = ParagraphStyle(
        'CoverSubtitle', parent=base['Normal'], fontName='Helvetica', fontSize=11, leading=15,
        textColor=SECONDARY, alignment=1, spaceAfter=14
    )
    styles['ChapHeader'] = ParagraphStyle(
        'ChapHeader', parent=base['Heading1'], fontName='Helvetica-Bold', fontSize=14, leading=17,
        textColor=PRIMARY, spaceBefore=0, spaceAfter=4, keepWithNext=True
    )
    styles['SecHeader'] = ParagraphStyle(
        'SecHeader', parent=base['Heading2'], fontName='Helvetica-Bold', fontSize=11.5, leading=14.5,
        textColor=PRIMARY, spaceBefore=4, spaceAfter=3, keepWithNext=True
    )
    styles['SubSecHeader'] = ParagraphStyle(
        'SubSecHeader', parent=base['Heading3'], fontName='Helvetica-Bold', fontSize=9.5, leading=12.5,
        textColor=SECONDARY, spaceBefore=4, spaceAfter=2, keepWithNext=True
    )
    styles['Body'] = ParagraphStyle(
        'Body', parent=base['Normal'], fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=DARK_TEXT, alignment=4, spaceAfter=4
    )
    styles['Bullet'] = ParagraphStyle(
        'Bullet', parent=base['Normal'], fontName='Helvetica', fontSize=8.2, leading=11.5,
        textColor=DARK_TEXT, leftIndent=10, spaceAfter=2.5
    )
    styles['Code'] = ParagraphStyle(
        'Code', parent=base['Normal'], fontName='Courier', fontSize=7.2, leading=9.2,
        textColor=colors.HexColor("#1A1A1A"), backColor=BG_ALT, borderPadding=3, spaceAfter=4
    )
    styles['Caption'] = ParagraphStyle(
        'Caption', parent=base['Normal'], fontName='Helvetica-Oblique', fontSize=7.8, leading=10,
        textColor=PRIMARY, alignment=1, spaceBefore=2, spaceAfter=5
    )
    styles['Callout'] = ParagraphStyle(
        'Callout', parent=base['Normal'], fontName='Helvetica', fontSize=8.2, leading=11.5,
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
