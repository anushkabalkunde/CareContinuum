#!/usr/bin/env python3
"""
Generates valid OpenXML Microsoft Word (.docx) files for CareContinuum documentation.
Uses standard Python library (zipfile, xml.sax.saxutils) with zero external dependencies.
"""

import os
import zipfile
import xml.sax.saxutils as saxutils

def make_docx(input_md_path, output_docx_path, title):
    with open(input_md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Build word/document.xml content
    body_paragraphs = []
    
    # Title style
    body_paragraphs.append(f"""
    <w:p>
      <w:pPr>
        <w:pStyle w:val="Title"/>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
          <w:b/>
          <w:color w:val="1E7B99"/>
          <w:sz w:val="56"/>
        </w:rPr>
        <w:t>{saxutils.escape(title)}</w:t>
      </w:r>
    </w:p>
    <w:p/>
    """)

    in_code_block = False

    for line in lines:
        line_str = line.strip()
        if not line_str:
            body_paragraphs.append('<w:p/>')
            continue

        if line_str.startswith('```'):
            in_code_block = not in_code_block
            continue

        if in_code_block:
            escaped = saxutils.escape(line_str)
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:ind w:left="400"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>
                  <w:sz w:val="18"/>
                  <w:color w:val="334155"/>
                </w:rPr>
                <w:t xml:space="preserve">{escaped}</w:t>
              </w:r>
            </w:p>
            """)
            continue

        # Headings
        if line_str.startswith('# '):
            text = saxutils.escape(line_str[2:].strip())
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading1"/>
                <w:spacing w:before="240" w:after="120"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:b/>
                  <w:color w:val="1E7B99"/>
                  <w:sz w:val="36"/>
                </w:rPr>
                <w:t>{text}</w:t>
              </w:r>
            </w:p>
            """)
        elif line_str.startswith('## '):
            text = saxutils.escape(line_str[3:].strip())
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading2"/>
                <w:spacing w:before="180" w:after="80"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:b/>
                  <w:color w:val="0F172A"/>
                  <w:sz w:val="28"/>
                </w:rPr>
                <w:t>{text}</w:t>
              </w:r>
            </w:p>
            """)
        elif line_str.startswith('### '):
            text = saxutils.escape(line_str[4:].strip())
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:pStyle w:val="Heading3"/>
                <w:spacing w:before="120" w:after="60"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:b/>
                  <w:color w:val="334155"/>
                  <w:sz w:val="24"/>
                </w:rPr>
                <w:t>{text}</w:t>
              </w:r>
            </w:p>
            """)
        elif line_str.startswith('- ') or line_str.startswith('* '):
            text = saxutils.escape(line_str[2:].strip())
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:ind w:left="360"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:b/>
                  <w:color w:val="1E7B99"/>
                </w:rPr>
                <w:t>• </w:t>
              </w:r>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:sz w:val="22"/>
                  <w:color w:val="334155"/>
                </w:rPr>
                <w:t>{text}</w:t>
              </w:r>
            </w:p>
            """)
        else:
            text = saxutils.escape(line_str)
            body_paragraphs.append(f"""
            <w:p>
              <w:pPr>
                <w:spacing w:after="100"/>
              </w:pPr>
              <w:r>
                <w:rPr>
                  <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
                  <w:sz w:val="22"/>
                  <w:color w:val="1E293B"/>
                </w:rPr>
                <w:t>{text}</w:t>
              </w:r>
            </w:p>
            """)

    doc_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(body_paragraphs)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>"""

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>"""

    with zipfile.ZipFile(output_docx_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.writestr('[Content_Types].xml', content_types)
        zf.writestr('_rels/.rels', rels)
        zf.writestr('word/_rels/document.xml.rels', doc_rels)
        zf.writestr('word/document.xml', doc_xml)

    print(f"Generated DOCX successfully: {output_docx_path}")

if __name__ == '__main__':
    doc_dir = '/app/applet/CareContinuum/documentation'
    make_docx(
        os.path.join(doc_dir, 'Project_Report.md'),
        os.path.join(doc_dir, 'Project_Report.docx'),
        'CareContinuum: Project Engineering Report'
    )
    make_docx(
        os.path.join(doc_dir, 'Software_Requirements.md'),
        os.path.join(doc_dir, 'Software_Requirements.docx'),
        'CareContinuum: Software Requirements Specification'
    )
