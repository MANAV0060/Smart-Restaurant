import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
)
from reportlab.pdfgen import canvas

def build_checklist_pdf(output_path):
    # Tight 36 pt margins for an elegant, high-impact 1-page checklist
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
        fontSize=13.5,
        leading=17,
        textColor=colors.black,
        alignment=1,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'MainSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.black,
        alignment=1,
        spaceAfter=3
    )

    meta_style = ParagraphStyle(
        'MetaLine',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.5,
        textColor=colors.black,
        alignment=1,
        spaceAfter=5
    )

    category_title_style = ParagraphStyle(
        'CategoryTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=11.5,
        textColor=colors.black,
        spaceAfter=4
    )

    # Crisp checklist bullet style (No descriptions, just concise points)
    check_item_style = ParagraphStyle(
        'CheckItem',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.0,
        leading=11.2,
        textColor=colors.black,
        leftIndent=12,
        firstLineIndent=-12,
        spaceAfter=3.2
    )

    footer_item_style = ParagraphStyle(
        'FooterWhiteItem',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white
    )

    story = []

    # TCET institutional header banner
    header_img_path = 'd:/resrtorant/presentation_assets/tcet_header.jpeg'
    if os.path.exists(header_img_path):
        story.append(Image(header_img_path, width=content_width, height=36))
        story.append(Spacer(1, 4))

    # Header Titles
    story.append(Paragraph(
        "PROJECT IMPROVEMENTS &amp; ARCHITECTURAL ROADMAP CHECKLIST",
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
        "<b>Live Production URL:</b> <b>https://smart-restaurant-2za8.vercel.app/</b> &nbsp;|&nbsp; "
        "<b>Comprehensive 1-Page Master Action Checklist</b>",
        meta_style
    ))
    story.append(HRFlowable(width="100%", thickness=1.2, color=colors.black, spaceAfter=6))

    # Column Width
    col_w = 265

    # ------------------------------------------------------------------
    # Domain 1: Spatial AR/VR & 3D Computing Checklist
    # ------------------------------------------------------------------
    d1_items = [
        Paragraph("1. SPATIAL AR/VR COMPUTING &amp; 3D ENGINE", category_title_style),
        Paragraph("[  ] <b>WebRTC Synchronized Multi-User AR:</b> Communal shared table 3D dish interaction at 60Hz", check_item_style),
        Paragraph("[  ] <b>Automated NeRF &amp; 3D Gaussian Splatting:</b> Instant 3D food asset pipeline from 45s chef video", check_item_style),
        Paragraph("[  ] <b>WebGPU Hardware Acceleration:</b> High-fidelity fluid, sauce translucency &amp; micro-textures at 120 FPS", check_item_style),
        Paragraph("[  ] <b>WebXR Ambient Light Estimation:</b> Dynamic environmental illuminance &amp; candlelit shadow matching", check_item_style),
        Paragraph("[  ] <b>Sub-Millimeter Metric Scale Clamping:</b> Universal 1:1 real-world physical portion preservation", check_item_style),
        Paragraph("[  ] <b>Enhanced Cross-Platform Fallback:</b> Native WebXR ➔ Scene Viewer ➔ Apple QuickLook USDZ", check_item_style)
    ]

    # ------------------------------------------------------------------
    # Domain 2: Artificial Intelligence & Computer Vision Checklist
    # ------------------------------------------------------------------
    d2_items = [
        Paragraph("2. ARTIFICIAL INTELLIGENCE &amp; VISION QA", category_title_style),
        Paragraph("[  ] <b>On-Device Generative AI Voice Sommelier:</b> Edge LLM wine pairings &amp; cellar recommendations", check_item_style),
        Paragraph("[  ] <b>Overhead Computer Vision Kitchen QA:</b> YOLOv8/ViT plate symmetry &amp; garnish inspection at pass", check_item_style),
        Paragraph("[  ] <b>Dynamic Multi-Allergen Safety Engine:</b> Real-time cross-contamination warnings &amp; substitutions", check_item_style),
        Paragraph("[  ] <b>AI Dynamic Surge &amp; Margin Pricing:</b> Real-time yield management for desserts and cocktails", check_item_style),
        Paragraph("[  ] <b>Conversational Dish Storytelling:</b> Interactive farm provenance, organic sourcing &amp; chef notes", check_item_style),
        Paragraph("[  ] <b>Multilingual Voice Translation:</b> Instant speech ordering in 12+ international languages", check_item_style)
    ]

    # ------------------------------------------------------------------
    # Domain 3: Kitchen Display System (KDS) & Operations Checklist
    # ------------------------------------------------------------------
    d3_items = [
        Paragraph("3. KITCHEN OPERATIONS &amp; KDS STATE ENGINE", category_title_style),
        Paragraph("[  ] <b>Distributed WebSocket &amp; Redis Cluster:</b> Zero-latency multi-kitchen terminal cloud synchronization", check_item_style),
        Paragraph("[  ] <b>Predictive Prep-Time Engine:</b> AI ticket duration pacing &amp; cook station load balancing", check_item_style),
        Paragraph("[  ] <b>Wearable Staff Haptic Notifications:</b> Smartwatch runner alerts upon passing visual QA gate", check_item_style),
        Paragraph("[  ] <b>Station-Specific Acoustic Chimes:</b> Frequency differentiation for rush, bar, and allergy orders", check_item_style),
        Paragraph("[  ] <b>Split-Station Ticket Routing:</b> Automated order slicing across grill, pantry, bar, and pastry lines", check_item_style),
        Paragraph("[  ] <b>Kitchen Production Analytics:</b> Real-time bottleneck detection &amp; cook throughput metrics", check_item_style)
    ]

    # ------------------------------------------------------------------
    # Domain 4: Enterprise POS, ERP & Cloud Billing Checklist
    # ------------------------------------------------------------------
    d4_items = [
        Paragraph("4. ENTERPRISE POS, ERP &amp; BILLING INTEGRATION", category_title_style),
        Paragraph("[  ] <b>Global POS REST Webhooks:</b> Certified connectors for Oracle Micros Simphony &amp; Toast POS", check_item_style),
        Paragraph("[  ] <b>Regional Hospitality POS Integration:</b> Direct terminal bridges for Petpooja and POSist", check_item_style),
        Paragraph("[  ] <b>Automated Real-Time 86'ing:</b> Instant menu item graying upon kitchen ingredient depletion", check_item_style),
        Paragraph("[  ] <b>Live Wine Cellar Depletion API:</b> Automated vintage bottle stock lock and inventory decrement", check_item_style),
        Paragraph("[  ] <b>Contactless Cloud Billing:</b> Automated GST/VAT calculation, split-bill checks &amp; UPI / Apple Pay", check_item_style),
        Paragraph("[  ] <b>Centralized Multi-Location Menu Sync:</b> Chain-wide menu updates pushed in single click", check_item_style)
    ]

    # ------------------------------------------------------------------
    # Domain 5: IoT Hardware & Environmental Sustainability Checklist
    # ------------------------------------------------------------------
    d5_items = [
        Paragraph("5. IOT HARDWARE &amp; SUSTAINABILITY ENGINEERING", category_title_style),
        Paragraph("[  ] <b>Tabletop BLE Load-Cell Weight Coasters:</b> Proactive beverage refill alerts at 15% threshold", check_item_style),
        Paragraph("[  ] <b>100% Zero-Paper Circularity:</b> Complete elimination of laminated plastic/paper printouts", check_item_style),
        Paragraph("[  ] <b>28% Food Plate Waste Reduction:</b> Mitigating order remorse via 1:1 true-scale pre-visualization", check_item_style),
        Paragraph("[  ] <b>Low-Power Mobile Edge Delivery:</b> Draco mesh quantization saving device battery &amp; mobile data", check_item_style),
        Paragraph("[  ] <b>Smart Table Turnover Sensors:</b> Infrared occupancy sensors reporting real-time busing readiness", check_item_style),
        Paragraph("[  ] <b>ESG Sustainability Dashboard:</b> Commercial carbon &amp; food waste audit metrics for managers", check_item_style)
    ]

    # ------------------------------------------------------------------
    # Domain 6: Luxury Fine Dining Strategy & Survey Reset Checklist
    # ------------------------------------------------------------------
    d6_items = [
        Paragraph("6. STRATEGIC PIVOT TO LUXURY FINE DINING", category_title_style),
        Paragraph("[  ] <b>Target Market Realignment:</b> Shifting from casual (AOV ₹500) to fine dining (AOV ₹1.8k–₹5.5k+)", check_item_style),
        Paragraph("[  ] <b>High-End Survey Execution:</b> Sampling N=150 luxury diners &amp; N=25 Michelin/fine-dining chefs", check_item_style),
        Paragraph("[  ] <b>Multi-Course Tasting Menu Flights:</b> Sequential 5-to-7 course AR journey through chef specials", check_item_style),
        Paragraph("[  ] <b>White-Tablecloth Luxury UI:</b> Elegant minimalist typography, dark mode &amp; discreet interactions", check_item_style),
        Paragraph("[  ] <b>VIP Guest Recognition:</b> Private allergy records, preferred table seating &amp; sommelier history", check_item_style),
        Paragraph("[  ] <b>Empirical Validation &amp; Publication:</b> Finalizing IEEE conference research paper submission", check_item_style)
    ]

    # 2-Column Table Grid
    grid_data = [
        [d1_items, d4_items],
        [d2_items, d5_items],
        [d3_items, d6_items]
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
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_grid)
    story.append(Spacer(1, 4))

    # Bottom Implementation Summary Bar
    summary_box_white = [
        [
            Paragraph("<b>Phase 1 (Live Now):</b> Zero-Install WebXR | 1:1 Metric Clamping | Live KDS | Acoustic Chimes | Vercel CDN", footer_item_style),
            Paragraph("<b>Phase 2 (Horizon 1):</b> Luxury Fine Dining Pivot | AI Voice Sommelier | Reset Survey Execution", footer_item_style)
        ],
        [
            Paragraph("<b>Phase 3 (Horizon 2):</b> WebRTC Multi-User Table AR | Automated NeRF &amp; Gaussian Splatting Pipeline", footer_item_style),
            Paragraph("<b>Phase 4 (Horizon 3):</b> Kitchen Plating Vision QA Gate | Oracle Micros &amp; Toast POS ERP Webhooks", footer_item_style)
        ]
    ]
    t_summary = Table(summary_box_white, colWidths=[col_w, col_w])
    t_summary.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#0F172A')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#334155')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_summary)

    # Build document
    doc.build(story)
    print(f"Successfully generated pure checklist 1-page PDF at: {output_path}")

if __name__ == '__main__':
    target = 'd:/resrtorant/Smart_Restaurant_Project_Improvements_1Page.pdf'
    build_checklist_pdf(target)
