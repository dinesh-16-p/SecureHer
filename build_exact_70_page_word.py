import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

from generate_full_70_page_report import setup_styles
from report_sections_part1 import build_part1_pages
from report_sections_part2 import build_part2_pages
from report_sections_part3 import build_part3_pages
from reportlab.platypus import Paragraph as RLParagraph, PageBreak, Table as RLTable, Image as RLImage, Spacer

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
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
    shd.set(qn('w:fill'), color_hex.replace('#', ''))
    tcPr.append(shd)

def parse_html_to_runs(raw_text):
    clean = raw_text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"').replace('&nbsp;', ' ')
    tokens = re.split(r'(<[^>]+>)', clean)
    runs = []
    bold = False
    italic = False
    underline = False
    code = False
    for tok in tokens:
        if not tok:
            continue
        low = tok.lower().strip()
        if low in ['<br>', '<br/>', '<br />']:
            runs.append(('\n', bold, italic, underline, code))
        elif low == '<b>':
            bold = True
        elif low == '</b>':
            bold = False
        elif low == '<i>':
            italic = True
        elif low == '</i>':
            italic = False
        elif low == '<u>':
            underline = True
        elif low == '</u>':
            underline = False
        elif low == '<code>':
            code = True
        elif low == '</code>':
            code = False
        elif tok.startswith('<') and tok.endswith('>'):
            pass  # Ignore unrecognized tags
        else:
            runs.append((tok, bold, italic, underline, code))
    return runs

def add_paragraph_runs(p, runs, font_name, font_size, default_color=None):
    for text, bold, italic, underline, code in runs:
        r = p.add_run(text)
        r.bold = bold
        r.italic = italic
        r.underline = underline
        if code:
            r.font.name = 'Courier New'
            r.font.size = Pt(font_size - 1)
            r.font.color.rgb = RGBColor(30, 30, 30)
        else:
            r.font.name = font_name
            r.font.size = Pt(font_size)
            if default_color:
                r.font.color.rgb = default_color

def build_word_document():
    print("Initializing ReportLab story...")
    S = setup_styles()
    story = []
    build_part1_pages(story, S)
    build_part2_pages(story, S)
    build_part3_pages(story, S)
    print(f"Total flowables extracted: {len(story)}")

    doc = docx.Document()

    # Configure A4 page & 0.75-inch margins
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

        # Header
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("SecureHer — Intelligent Real-Time Women's Safety & Emergency Response Platform (23CSEU7J12)")
        hrun.font.name = 'Times New Roman'
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(91, 33, 79)

        # Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("D. Y. Patil Education Society, Kolhapur — Department of Computer Science & Engineering")
        frun.font.name = 'Times New Roman'
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(99, 85, 100)

    # Base styling
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(34, 27, 36)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(3)

    c_primary = RGBColor(91, 33, 79)
    c_secondary = RGBColor(199, 91, 122)
    c_dark = RGBColor(34, 27, 36)

    print("Converting Flowables to native Word elements...")
    page_count = 1

    for idx, f in enumerate(story):
        if isinstance(f, PageBreak):
            doc.add_page_break()
            page_count += 1
            continue

        if isinstance(f, RLParagraph):
            style_name = f.style.name
            raw_text = f.text
            runs = parse_html_to_runs(raw_text)

            p = doc.add_paragraph()

            if style_name == 'CoverTitle':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(8)
                add_paragraph_runs(p, runs, 'Times New Roman', 17, c_primary)
            elif style_name == 'CoverSubtitle':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(8)
                add_paragraph_runs(p, runs, 'Times New Roman', 11, c_secondary)
            elif style_name == 'ChapHeader':
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(12)
                p.paragraph_format.space_after = Pt(4)
                add_paragraph_runs(p, runs, 'Times New Roman', 13.5, c_primary)
            elif style_name == 'SecHeader':
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(3)
                add_paragraph_runs(p, runs, 'Times New Roman', 11.5, c_primary)
            elif style_name == 'SubSecHeader':
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(2)
                add_paragraph_runs(p, runs, 'Times New Roman', 10.5, c_secondary)
            elif style_name == 'Bullet':
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                p.paragraph_format.left_indent = Inches(0.2)
                p.paragraph_format.space_after = Pt(2)
                add_paragraph_runs(p, runs, 'Times New Roman', 9.5, c_dark)
            elif style_name == 'Code':
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                p.paragraph_format.left_indent = Inches(0.25)
                p.paragraph_format.space_after = Pt(3)
                add_paragraph_runs(p, runs, 'Courier New', 8.5, RGBColor(20, 20, 20))
            elif style_name == 'Caption':
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(4)
                add_paragraph_runs(p, runs, 'Times New Roman', 9, c_primary)
            elif style_name == 'Callout':
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                p.paragraph_format.left_indent = Inches(0.15)
                p.paragraph_format.right_indent = Inches(0.15)
                p.paragraph_format.space_before = Pt(3)
                p.paragraph_format.space_after = Pt(4)
                add_paragraph_runs(p, runs, 'Times New Roman', 9.5, c_dark)
            else:  # Body
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                p.paragraph_format.space_after = Pt(3)
                add_paragraph_runs(p, runs, 'Times New Roman', 10, c_dark)

        elif isinstance(f, RLTable):
            raw_data = f._cellvalues
            num_rows = len(raw_data)
            num_cols = len(raw_data[0]) if num_rows > 0 else 0
            if num_rows == 0 or num_cols == 0:
                continue

            tbl = doc.add_table(rows=num_rows, cols=num_cols)
            tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
            tbl.autofit = False

            # Calculate proportional column widths (total ~6.77 inches)
            total_target_width = 6.77
            col_width = total_target_width / num_cols

            for r_idx, row in enumerate(raw_data):
                is_header = (r_idx == 0 and num_rows > 2)
                bg_hex = "F4ECF2" if is_header else ("FAF6F9" if r_idx % 2 == 1 else "FFFFFF")

                for c_idx, cell_val in enumerate(row):
                    cell = tbl.cell(r_idx, c_idx)
                    cell.width = Inches(col_width)
                    set_cell_shading(cell, bg_hex)
                    set_cell_margins(cell, 60, 60, 80, 80)

                    p = cell.paragraphs[0]
                    p.paragraph_format.space_before = Pt(1)
                    p.paragraph_format.space_after = Pt(1)

                    if isinstance(cell_val, RLParagraph):
                        runs = parse_html_to_runs(cell_val.text)
                        add_paragraph_runs(p, runs, 'Times New Roman', 8.5 if not is_header else 9, c_primary if is_header else c_dark)
                    elif isinstance(cell_val, list):
                        for item in cell_val:
                            if isinstance(item, RLParagraph):
                                runs = parse_html_to_runs(item.text)
                                add_paragraph_runs(p, runs, 'Times New Roman', 8.5, c_dark)
                    else:
                        r = p.add_run(str(cell_val))
                        r.font.name = 'Times New Roman'
                        r.font.size = Pt(8.5)
                        if is_header:
                            r.bold = True
                            r.font.color.rgb = c_primary

            doc.add_paragraph().paragraph_format.space_after = Pt(2)

        elif isinstance(f, RLImage):
            img_path = f.filename if hasattr(f, 'filename') else getattr(f, '_filename', None)
            if img_path and os.path.exists(img_path):
                p = doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(4)
                p.paragraph_format.space_after = Pt(3)

                # Scale appropriately to fit Word margins
                w_pt = getattr(f, 'drawWidth', 380)
                w_in = min(5.5, w_pt / 72.0)
                p.add_run().add_picture(img_path, width=Inches(w_in))

        elif isinstance(f, Spacer):
            pass

    print(f"Total Word pages compiled: ~{page_count}")

    # Output paths
    output_files = [
        "Project_Reports/SecureHer_Comprehensive_70Page_Project_Report.docx",
        "Project_Reports/SecureHer_College_Project_Report.docx",
        "Project_Reports/SecureHer_Final_Project_Report.docx",
        "Project_Reports/SecureHer_Project_Report_Live.docx",
        "SecureHer_Comprehensive_70Page_Project_Report.docx",
        "SecureHer_College_Project_Report.docx",
        "SecureHer_Final_Project_Report.docx",
        "public/SecureHer_Comprehensive_70Page_Project_Report.docx",
        "public/SecureHer_College_Project_Report.docx",
        "public/SecureHer_Final_Project_Report.docx"
    ]

    for out_path in output_files:
        os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
        try:
            doc.save(out_path)
            print(f"Saved: {out_path} ({os.path.getsize(out_path):,} bytes)")
        except Exception as e:
            print(f"Error saving {out_path}: {e}")

if __name__ == "__main__":
    build_word_document()
