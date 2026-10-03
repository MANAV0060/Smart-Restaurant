import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
)
from reportlab.pdfgen import canvas

def build_one_page_improvements_pdf(output_path):
    # Tight 36 pt (0.5 inch) margins for an exact 1-page executive sheet
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    content_width = 540 # 612 - 72

    styles = getSampleStyleSheet()

    # Typographic styles (All text black, headlines black bold)
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.black,
        alignment=1,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'MainSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.black,
        alignment=1,
        spaceAfter=4
    )

    meta_style = ParagraphStyle(
        'MetaLine',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.black,
        alignment=1,
        spaceAfter=6
    )

    category_title_style = ParagraphStyle(
        'CategoryTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.black,
        spaceAfter=2
    )

    item_style = ParagraphStyle(
        'ImprovementItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.8,
        textColor=colors.black,
        leftIndent=8,
        firstLineIndent=-8,
        spaceAfter=2
    )

    table_header_style = ParagraphStyle(
        'THeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )

    story = []

    # Optional TCET institutional header banner
    header_img_path = 'd:/resrtorant/presentation_assets/tcet_header.jpeg'
    if os.path.exists(header_img_path):
        story.append(Image(header_img_path, width=content_width, height=36))
        story.append(Spacer(1, 4))

    # Header Titles
    story.append(Paragraph(
        "MASTER PROJECT IMPROVEMENTS &amp; ARCHITECTURAL ROADMAP CHECKLIST",
        title_style
    ))
    story.append(Paragraph(
        "An Intelligent AI-Powered Restaurant Ordering System Using Augmented Reality",
        subtitle_style
    ))
    story.append(Paragraph(
        "<b>TCET Department of Computer Engineering | Capstone Evaluation (A.Y. 2026-27)</b> &nbsp;|&nbsp; "
        "<b>Team:</b> Manav Singh, Sanskar Suryavanshi, Kesar Singh &nbsp;|&nbsp; "
        "<b>Guide:</b> Prof. Vinitta Sunish<br/>"
        "<b>Production URL:</b> <b>https://smart-restaurant-2za8.vercel.app/</b> &nbsp;|&nbsp; "
        "<b>Executive 1-Page Comprehensive Project Analysis</b>",
        meta_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.2, color=colors.black, spaceAfter=5))

    # Grid of 6 High-Impact Improvement Domains (2 columns x 3 rows)
    # Col 1: Domains 1, 2, 3 | Col 2: Domains 4, 5, 6
    col_w = 265

    # Domain 1
    d1_content = [
        Paragraph("1. SPATIAL AR/VR COMPUTING &amp; 3D RENDERING", category_title_style),
        Paragraph("• <b>WebRTC Synchronized Multi-User AR:</b> Peer-to-peer data mesh synchronizing 3D dish transform matrices at 60Hz so entire banquet parties view/rotate shared platters simultaneously.", item_style),
        Paragraph("• <b>NeRF &amp; 3D Gaussian Splatting Pipeline:</b> Instant 3D food asset reconstruction from a 45s chef smartphone video sweep, eliminating manual 3D modeling bottlenecks in &lt;12 minutes.", item_style),
        Paragraph("• <b>WebGPU Acceleration &amp; Sub-Millimeter Depth:</b> Upgrading from WebGL to WebGPU for 120 FPS high-fidelity fluid/sauce rendering and micro-texture photorealism.", item_style),
        Paragraph("• <b>WebXR Ambient Light Estimation:</b> Using `XRLightEstimate` to match real-world candlelit restaurant illuminance, shadows, and color temperature dynamically.", item_style)
    ]

    # Domain 2
    d2_content = [
        Paragraph("2. ARTIFICIAL INTELLIGENCE &amp; VISION QA", category_title_style),
        Paragraph("• <b>On-Device Generative AI Voice Sommelier:</b> Lightweight edge LLM answering conversational pairing questions (<i>\"Which wine under ₹4k matches this ribeye?\"</i>) with live cellar queries.", item_style),
        Paragraph("• <b>Computer Vision Kitchen Plating QA:</b> Overhead 4K camera running YOLOv8/ViT at the pass, checking volumetric mass, garnish placement, and sauce drizzle against the 3D standard.", item_style),
        Paragraph("• <b>Dynamic Multi-Allergen Safety Engine:</b> Automated cross-contamination alerts and intelligent ingredient substitution recommendations based on guest profile history.", item_style),
        Paragraph("• <b>AI Dynamic Pricing &amp; Menu Engineering:</b> Real-time surge pricing algorithms optimizing dessert and specialty cocktail margins during peak dining hours.", item_style)
    ]

    # Domain 3
    d3_content = [
        Paragraph("3. KITCHEN DISPLAY SYSTEM (KDS) &amp; STATE ENGINE", category_title_style),
        Paragraph("• <b>Enterprise WebSocket / Redis Cluster:</b> Upgrading local state synchronization to a distributed multi-terminal cloud pub/sub cluster for zero-latency multi-kitchen routing.", item_style),
        Paragraph("• <b>Predictive Prep-Time &amp; Station Load Balancing:</b> AI algorithms predicting dish preparation duration and balancing ticket routing across grill, pantry, and dessert lines.", item_style),
        Paragraph("• <b>Wearable Staff Haptic Notifications:</b> Pushing silent smartwatch vibrations and table call alerts to waitstaff when dishes pass visual QA and are ready for runner dispatch.", item_style),
        Paragraph("• <b>Acoustic Station-Specific Chime Differentiation:</b> Synthesizing unique frequency chimes for rush orders, allergen warnings, and beverage bar dispatches.", item_style)
    ]

    # Domain 4
    d4_content = [
        Paragraph("4. ENTERPRISE POS, ERP &amp; BILLING INTEGRATION", category_title_style),
        Paragraph("• <b>Bidirectional POS Integration:</b> Certified REST webhooks for Oracle Micros Simphony, Toast POS, Petpooja, and POSist for automated table order-to-terminal synchronization.", item_style),
        Paragraph("• <b>Automated Real-Time 86'ing:</b> Instantaneous inventory depletion webhooks graying out sold-out items in diner AR menus to prevent awkward order cancellations.", item_style),
        Paragraph("• <b>Integrated Fiscal Billing &amp; Cloud Checkout:</b> Direct digital guest checks with automated GST/VAT calculation, split-bill math, and Apple Pay / Google Pay / UPI checkout.", item_style),
        Paragraph("• <b>Automated Cellar Vintage Depletion:</b> Live cellar stock synchronization removing rare vintage bottles from sommelier recommendations upon uncorking.", item_style)
    ]

    # Domain 5
    d5_content = [
        Paragraph("5. IOT HARDWARE &amp; SUSTAINABILITY ENGINEERING", category_title_style),
        Paragraph("• <b>IoT Tabletop BLE Load-Cell Weight Coasters:</b> Continuous beverage level sensing beneath glassware dispatching silent refill prompts to waitstaff at 15% threshold.", item_style),
        Paragraph("• <b>100% Zero-Paper Circularity:</b> Complete elimination of laminated paper menus, saving kilograms of single-use plastic and reducing restaurant plate return waste by up to 28%.", item_style),
        Paragraph("• <b>Dynamic Low-Power Mobile Edge Delivery:</b> Edge CDN caching and Draco mesh quantization saving device battery life and mobile network bandwidth.", item_style),
        Paragraph("• <b>Smart Table Occupancy &amp; Turn Sensors:</b> Low-power infrared sensors tracking table cleanliness and turnover readiness for floor management.", item_style)
    ]

    # Domain 6
    d6_content = [
        Paragraph("6. STRATEGIC PIVOT TO LUXURY FINE DINING", category_title_style),
        Paragraph("• <b>Strategic Pivot from Midrange to Fine Dining:</b> Shifting focus from fast-turn casual dining (AOV ₹500) to luxury bistros (AOV ₹1,800–₹5,500+) where 3D depth drives high-margin spend.", item_style),
        Paragraph("• <b>Reset Survey Execution:</b> Executing redesigned research survey across N=150 luxury gastronomy diners and N=25 Michelin/fine-dining executive chefs.", item_style),
        Paragraph("• <b>Multi-Course Chef Tasting Menu Journey:</b> Curating sequential 5-to-7 course AR walkthroughs that guide diners through amuse-bouche, entrees, and dessert wine flights.", item_style),
        Paragraph("• <b>Luxury Ambiance White-Tablecloth UI:</b> Refined minimalist typography, dark luxury mode, and discreet guest interaction respecting formal dining etiquette.", item_style)
    ]

    # 2-Column Table Layout
    grid_data = [
        [d1_content, d4_content],
        [d2_content, d5_content],
        [d3_content, d6_content]
    ]

    t_grid = Table(grid_data, colWidths=[col_w, col_w])
    t_grid.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
        ('LINELEFT', (0,0), (0,0), 3.0, colors.black),
        ('LINELEFT', (1,0), (1,0), 3.0, colors.black),
        ('LINELEFT', (0,1), (0,1), 3.0, colors.black),
        ('LINELEFT', (1,1), (1,1), 3.0, colors.black),
        ('LINELEFT', (0,2), (0,2), 3.0, colors.black),
        ('LINELEFT', (1,2), (1,2), 3.0, colors.black),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_grid)
    story.append(Spacer(1, 4))

    # Bottom Implementation Summary Table (1 Row)
    summary_box = [
        [
            Paragraph("<b>Phase 1 (Live Now):</b> Zero-Install WebXR PWA • 1:1 Metric Clamping • Live KDS Kanban • Acoustic Web Audio • Vercel CDN", item_style),
            Paragraph("<b>Phase 2 (Q4 2026 - Q1 2027):</b> Luxury Fine Dining Pivot • On-Device AI Voice Sommelier • Luxury UI", item_style)
        ],
        [
            Paragraph("<b>Phase 3 (Q2 2027 - Q3 2027):</b> WebRTC Multi-User AR Dining • Automated NeRF / Gaussian Splatting Video Pipeline", item_style),
            Paragraph("<b>Phase 4 (Q4 2027 - Q1 2028):</b> Kitchen Computer Vision Plating QA • Oracle Micros &amp; Toast POS Webhooks", item_style)
        ]
    ]
    t_summary = Table(summary_box, colWidths=[col_w, col_w])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.white),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    # For white text in the bottom bar:
    item_white_style = ParagraphStyle(
        'WhiteSummary', parent=item_style, textColor=colors.white, fontName='Helvetica'
    )
    summary_box_white = [
        [
            Paragraph("<b>Phase 1 (Live Now):</b> Zero-Install WebXR • 1:1 Metric Clamping • Live KDS • Acoustic Chimes • Vercel CDN", item_white_style),
            Paragraph("<b>Phase 2 (Horizon 1):</b> Luxury Dining Pivot • AI Voice Sommelier • Survey Reset Execution", item_white_style)
        ],
        [
            Paragraph("<b>Phase 3 (Horizon 2):</b> WebRTC Multi-User Table AR • Automated NeRF / Gaussian Splatting 3D Pipeline", item_white_style),
            Paragraph("<b>Phase 4 (Horizon 3):</b> Kitchen Plating Vision QA Gate • Oracle Micros / Toast POS ERP Connectors", item_white_style)
        ]
    ]
    t_summary_white = Table(summary_box_white, colWidths=[col_w, col_w])
    t_summary_white.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0F172A')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#334155')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_summary_white)

    # Build the document
    doc.build(story)
    print(f"Successfully generated 1-page improvements PDF at: {output_path}")

if __name__ == '__main__':
    target = 'd:/resrtorant/Smart_Restaurant_Project_Improvements_1Page.pdf'
    build_one_page_improvements_pdf(target)
