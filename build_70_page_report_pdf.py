import os
import sys
import re
from PIL import Image

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, PageBreak, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
)
from reportlab.pdfgen import canvas

# ═════════════════════════════════════════════════════════════════════════════
# NUMBERED CANVAS: DYNAMIC TWO-PASS RUNNING HEADER & FOOTER ("Page X of 70")
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
        print(f"Total compiled pages in PDF: {num_pages}")
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

        # Header rule & title
        self.setStrokeColor(colors.HexColor("#D8C5D3"))
        self.setLineWidth(0.6)
        self.line(54, A4[1] - 38, A4[0] - 54, A4[1] - 38)
        self.drawString(54, A4[1] - 32, "SecureHer — Intelligent Real-Time Women's Safety & Emergency Response Platform")
        self.drawRightString(A4[0] - 54, A4[1] - 32, "B.Tech Project Report (23CSEU7J12)")

        # Footer rule & metadata
        self.line(54, 42, A4[0] - 54, 42)
        self.setFillColor(colors.HexColor("#635564"))
        self.drawString(54, 30, "D. Y. Patil Education Society, Kolhapur — Dept. of Computer Science & Engineering")
        
        # Bold page number
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#5B214F"))
        self.drawRightString(A4[0] - 54, 30, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

print("NumberedCanvas70 initialized.")
