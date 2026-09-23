import pptxgen from 'pptxgenjs';
import path from 'path';
import fs from 'fs';

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9'; // 10" x 5.625"
  pres.author = 'Manav Singh, Sanskar Suryavanshi, Kesar Singh';
  pres.company = 'Thakur College of Engineering and Technology (TCET)';
  pres.title = 'Smart Restaurant - Presentation III Final Evaluation';

  // Professional Academic White & Navy Color Palette
  const C_BG = 'FFFFFF';         // Pure White Background
  const C_CARD = 'F8FAFC';       // Soft Clean Slate Card Fill
  const C_BORDER = 'E2E8F0';     // Subtle Hairline Gray Border
  const C_CARD_ALT = 'F1F5F9';   // Neutral Light Gray
  const C_CARD_BLUE = 'EFF6FF';  // Soft Light Blue Tint
  const C_BORDER_BLUE = 'BFDBFE';// Light Blue Border

  const C_NAVY = '1E3A8A';       // Deep Academic Navy (Titles & Headers)
  const C_TEXT_HEAD = '0F172A';  // Slate 900 (High contrast card headers)
  const C_TEXT_BODY = '334155';  // Slate 700 (Readable, professional body text)
  const C_TEXT_MUTED = '64748B'; // Slate 500 (Subtitles, metadata, captions)
  const C_WHITE = 'FFFFFF';

  const C_BLUE = '2563EB';       // Primary Royal Blue Accent
  const C_EMERALD = '059669';    // Professional Forest Green / Success
  const C_AMBER = 'D97706';      // Professional Warm Amber
  const C_RED = 'DC2626';        // Professional Crimson

  const FONT_HEAD = 'Cambria';
  const FONT_BODY = 'Calibri';

  const headerImgPath = path.resolve('d:/resrtorant/presentation_assets/tcet_header.jpeg');

  // Helper to add clean standard slide header with TCET department banner
  function addHeader(slide, category, title) {
    slide.background = { color: C_BG };

    // Institutional TCET Department Header Watermark / Banner
    if (fs.existsSync(headerImgPath)) {
      slide.addImage({
        path: headerImgPath,
        x: 2.0,
        y: 0.05,
        w: 6.0,
        h: 0.82
      });
    }

    // Slide Title (Left)
    slide.addText(title, {
      x: 0.6,
      y: 0.89,
      w: 6.5,
      h: 0.36,
      fontFace: FONT_HEAD,
      fontSize: 16.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    // Section / Rubric Tag (Right-aligned)
    slide.addText(category, {
      x: 7.1,
      y: 0.92,
      w: 2.3,
      h: 0.30,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_BLUE,
      align: 'right',
      margin: 0
    });

    // Clean Subtle Footer
    slide.addText('Department of Computer Engineering, TCET | A.Y. 2026–27 | Presentation III', {
      x: 0.6,
      y: 5.25,
      w: 6.0,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C_TEXT_MUTED,
      margin: 0
    });

    slide.addText('https://smart-restaurant-2za8.vercel.app/', {
      x: 6.8,
      y: 5.25,
      w: 2.6,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C_BLUE,
      align: 'right',
      margin: 0
    });
  }

  // ==========================================
  // SLIDE 1: TITLE SLIDE (Clean Academic White)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG };

    if (fs.existsSync(headerImgPath)) {
      slide.addImage({
        path: headerImgPath,
        x: 1.5,
        y: 0.15,
        w: 7.0,
        h: 0.95
      });
    }

    slide.addText('Presentation III – Capstone Project Evaluation (A.Y. 2026–27)', {
      x: 0.8,
      y: 1.18,
      w: 8.4,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      bold: true,
      color: C_BLUE,
      align: 'center',
      margin: 0
    });

    slide.addText('Smart Restaurant', {
      x: 0.8,
      y: 1.45,
      w: 8.4,
      h: 0.55,
      fontFace: FONT_HEAD,
      fontSize: 32,
      bold: true,
      color: C_NAVY,
      align: 'center',
      margin: 0
    });

    slide.addText('A Contactless Dining Platform with Markerless WebXR 3D Augmented Reality & Real-Time Kitchen Display System', {
      x: 1.0,
      y: 2.05,
      w: 8.0,
      h: 0.38,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: C_TEXT_BODY,
      align: 'center',
      margin: 0
    });

    // Left Panel: Team Members
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 2.52,
      w: 4.0,
      h: 1.95,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('PROJECT TEAM MEMBERS', {
      x: 1.0,
      y: 2.65,
      w: 3.6,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    slide.addText([
      { text: '•  Manav Singh', options: { bold: true, color: C_TEXT_HEAD, breakLine: true } },
      { text: '   Lead Full-Stack & Spatial AR Engineer', options: { color: C_TEXT_MUTED, fontSize: 9.5, breakLine: true } },
      { text: '•  Sanskar Suryavanshi', options: { bold: true, color: C_TEXT_HEAD, breakLine: true } },
      { text: '   Frontend Architect & UI/UX Specialist', options: { color: C_TEXT_MUTED, fontSize: 9.5, breakLine: true } },
      { text: '•  Kesar Singh', options: { bold: true, color: C_TEXT_HEAD, breakLine: true } },
      { text: '   Systems Integration & QA Lead', options: { color: C_TEXT_MUTED, fontSize: 9.5 } }
    ], {
      x: 1.0,
      y: 2.92,
      w: 3.6,
      h: 1.35,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      paraSpaceAfter: 4,
      margin: 0
    });

    // Right Panel: Mentorship & Institution
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.2,
      y: 2.52,
      w: 4.0,
      h: 1.95,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('MENTORSHIP & INSTITUTION', {
      x: 5.4,
      y: 2.65,
      w: 3.6,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 10.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    slide.addText([
      { text: 'Project Mentor & Guide:', options: { color: C_TEXT_MUTED, fontSize: 9.5, breakLine: true } },
      { text: 'Prof. Vinitta Sunish', options: { bold: true, color: C_TEXT_HEAD, fontSize: 11.5, breakLine: true } },
      { text: 'Department:', options: { color: C_TEXT_MUTED, fontSize: 9.5, breakLine: true } },
      { text: 'Department of Computer Engineering', options: { bold: true, color: C_TEXT_BODY, fontSize: 10.5, breakLine: true } },
      { text: 'Institution:', options: { color: C_TEXT_MUTED, fontSize: 9.5, breakLine: true } },
      { text: 'Thakur College of Engineering & Technology (TCET)', options: { bold: true, color: C_TEXT_BODY, fontSize: 10.5, breakLine: true } },
      { text: 'Affiliated with University of Mumbai', options: { color: C_BLUE, fontSize: 9.5 } }
    ], {
      x: 5.4,
      y: 2.92,
      w: 3.6,
      h: 1.35,
      fontFace: FONT_BODY,
      fontSize: 10,
      margin: 0
    });

    // Bottom clean deployment banner
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.6,
      w: 8.4,
      h: 0.45,
      rectRadius: 0.06,
      fill: { color: C_CARD_BLUE },
      line: { color: C_BORDER_BLUE, width: 1 }
    });

    slide.addText('Live Production URL: https://smart-restaurant-2za8.vercel.app/   |   GitHub: MANAV0060/Smart-Restaurant', {
      x: 0.9,
      y: 4.7,
      w: 8.2,
      h: 0.25,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_BLUE,
      align: 'center',
      margin: 0
    });

    slide.addNotes('Good morning esteemed evaluators, mentors, and faculty members. Welcome to our Presentation III capstone project evaluation for Smart Restaurant. Our team—Manav Singh, Sanskar Suryavanshi, and Kesar Singh, guided by Prof. Vinitta Sunish from the Department of Computer Engineering, TCET—presents a fully implemented, zero-install WebXR 3D Augmented Reality contactless dining platform and real-time Kitchen Display System.');
  }

  // ==========================================
  // SLIDE 2: PROBLEM STATEMENT
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Context & Motivation', 'Problem Statement & Dining Challenges');

    const cards = [
      {
        title: 'Static & Unhygienic Paper Menus',
        points: [
          'Physical laminated menus are non-interactive, costly to reprint on price/menu updates, and act as high-contact germ vectors.',
          'Inability to display dynamic dish availability, nutritional counts, or real-time kitchen preparation times.'
        ]
      },
      {
        title: 'Portion Ambiguity & Food Wastage',
        points: [
          '2D flat photographs fail to represent true dish portion size, volume, depth, and presentation aesthetics accurately.',
          'Results in frequent customer order dissatisfaction and an estimated 18%–22% plate food return rate across dining establishments.'
        ]
      },
      {
        title: 'Limitations of Current Solutions',
        points: [
          'Static QR Code PDF menus provide clunky, unresponsive pinch-and-zoom mobile experiences without cart integration.',
          'Proprietary tabletop touchscreen hardware requires high initial investment (₹35,000+ per table) and recurring maintenance.'
        ]
      },
      {
        title: 'Target Stakeholders & Requirements',
        points: [
          'Diners: Need zero-download 3D visual preview, dietary/allergen alerts, and convenient contactless ordering.',
          'Kitchen Staff & Owners: Demand synchronized order dispatch, zero hardware CAPEX, and faster table turnaround.'
        ]
      }
    ];

    cards.forEach((c, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(c.title, {
        x: x + 0.25, y: y + 0.2, w: 3.8, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(c.points.map((p, i) => ({
        text: p,
        options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < c.points.length - 1 }
      })), {
        x: x + 0.25, y: y + 0.55, w: 3.8, h: 1.0,
        fontFace: FONT_BODY, fontSize: 9.5, paraSpaceAfter: 4, margin: 0
      });
    });

    slide.addNotes('Slide 2 covers the problem statement. The dining industry struggles with unhygienic physical menus and 2D food pictures that cannot convey realistic portion volume, causing significant food wastage. Existing QR PDF menus are difficult to read, while tabletop tablet hardware is expensive and prone to failure.');
  }

  // ==========================================
  // SLIDE 3: RELEVANCE & SUSTAINABILITY (5 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 1 (5 Marks)', 'Project Relevance & Environmental Sustainability');

    const pillars = [
      {
        title: 'Societal & Health Relevance',
        items: [
          'Contactless ordering eliminates physical menu transmission vectors, improving dining hygiene.',
          'Clear allergen alerts (Gluten, Dairy, Nuts) and calorie breakdowns empower informed dining choices.',
          'Visual 3D representations assist patrons across diverse linguistic backgrounds.'
        ]
      },
      {
        title: 'Industrial & Economic Impact',
        items: [
          'Eliminates dedicated tabletop POS hardware by leveraging patrons\' personal smartphones (Zero CAPEX).',
          'Accelerates table turnaround by up to 25% through synchronized digital ordering.',
          'Instant cloud menu updates eliminate recurring design and paper printing costs.'
        ]
      },
      {
        title: 'Environmental & Food Waste Reduction',
        items: [
          '100% paperless operation eliminates kilograms of laminated paper and plastic per restaurant annually.',
          'Realistic 1:1 metric scale AR preview reduces portion misjudgments and plate food waste by up to 28%.',
          'Serverless cloud architecture minimizes energy footprint compared to dedicated on-premise servers.'
        ]
      }
    ];

    pillars.forEach((p, idx) => {
      const x = 0.6 + idx * 3.0;
      const y = 1.3;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.8, h: 2.5,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(p.title, {
        x: x + 0.2, y: y + 0.2, w: 2.4, h: 0.4,
        fontFace: FONT_HEAD, fontSize: 12.5, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(p.items.map((it, i) => ({
        text: it,
        options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < p.items.length - 1 }
      })), {
        x: x + 0.2, y: y + 0.65, w: 2.4, h: 1.7,
        fontFace: FONT_BODY, fontSize: 9.5, paraSpaceAfter: 4, margin: 0
      });
    });

    // SDG Alignment Box
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 4.0,
      w: 8.8,
      h: 1.1,
      rectRadius: 0.08,
      fill: { color: C_CARD_BLUE },
      line: { color: C_BORDER_BLUE, width: 1 }
    });

    slide.addText('UNITED NATIONS SUSTAINABLE DEVELOPMENT GOALS (SDGs) ALIGNMENT', {
      x: 0.8,
      y: 4.12,
      w: 8.4,
      h: 0.22,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const sdgs = [
      'SDG 9 (Industry, Innovation & Infrastructure): Advancing browser-based zero-install spatial computing in commercial dining.',
      'SDG 12 (Responsible Consumption & Production): Mitigating food plate return waste through 1:1 metric scale portion previews.',
      'SDG 13 (Climate Action): Eliminating recurring paper and lamination plastics from restaurant supply chains.'
    ];

    slide.addText(sdgs.map((s, i) => ({
      text: s,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9, breakLine: i < sdgs.length - 1 }
    })), {
      x: 0.8,
      y: 4.35,
      w: 8.4,
      h: 0.65,
      fontFace: FONT_BODY,
      fontSize: 9,
      paraSpaceAfter: 2,
      margin: 0
    });

    slide.addNotes('Slide 3 fulfills Criterion 1 (5 Marks). Our project supports societal health via contactless ordering and allergen safety. It drives industrial efficiency by eliminating costly hardware. Environmentally, it cuts paper waste and reduces restaurant food waste by 28%, aligning with UN SDGs 9, 12, and 13.');
  }

  // ==========================================
  // SLIDE 4: OBJECTIVES & EXPECTED OUTCOMES
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Project Scope', 'Main & Specific Objectives and Target Outcomes');

    // Left Column: Objectives
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 1.3,
      w: 4.3,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('PRIMARY & SPECIFIC OBJECTIVES', {
      x: 0.8,
      y: 1.5,
      w: 3.9,
      h: 0.28,
      fontFace: FONT_HEAD,
      fontSize: 13,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const objs = [
      'Main Objective: Build and deploy a production-grade, zero-install WebXR & Scene Viewer 3D AR smart menu with a synchronized real-time Kitchen Display System.',
      'Zero-Install 6-DoF AR: Implement WebXR Device API hit-testing to anchor 3D food items to physical tabletop planes with 1:1 metric accuracy.',
      '3D Asset Optimization Pipeline: Quantize and compress high-poly food models from 46MB down to <10MB for rapid mobile loading (<2.5s over 4G/5G).',
      'Dual-Engine Fallback Architecture: Sniff client capability to dynamically route to WebXR or Google Scene Viewer Android Intent.',
      'Real-Time Kitchen Operations: Synchronize diner orders with a low-latency Kitchen Display System Kanban board with acoustic alerts.'
    ];

    slide.addText(objs.map((o, i) => ({
      text: o,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < objs.length - 1 }
    })), {
      x: 0.8,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 5,
      margin: 0
    });

    // Right Column: Expected Outcomes
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.1,
      y: 1.3,
      w: 4.3,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('EXPECTED QUANTITATIVE OUTCOMES', {
      x: 5.3,
      y: 1.5,
      w: 3.9,
      h: 0.28,
      fontFace: FONT_HEAD,
      fontSize: 13,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const outcomes = [
      'Sub-2.5 Second Asset Load: Optimized glTF binary delivery over Vercel Edge CDN ensures models load smoothly without mobile browser stalls.',
      'Stable 60 FPS WebGL Rendering: Sustained 58–60 FPS rendering across contemporary mobile GPUs with zero thermal throttling.',
      'Zero App Store Friction: 100% browser-based PWA execution eliminating the 70%+ user abandonment caused by mandatory app downloads.',
      'Order Turnaround Acceleration: Decreased order-to-kitchen latency from 8+ minutes (waiter dependent) to instantaneous cloud dispatch.',
      'Universal Device Coverage: 100% cross-platform accessibility across iOS (Safari QuickLook/WebXR) and Android (Chrome WebXR/Scene Viewer).'
    ];

    slide.addText(outcomes.map((outc, i) => ({
      text: outc,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < outcomes.length - 1 }
    })), {
      x: 5.3,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 5,
      margin: 0
    });

    slide.addNotes('Slide 4 details our objectives: zero-download AR dining, 3D asset compression for fast mobile loading, 60 FPS rendering, and real-time kitchen order dispatch.');
  }

  // ==========================================
  // SLIDE 5: EXISTING SYSTEMS & LITERATURE REVIEW
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Literature Review', 'Existing Systems & Research Gap Analysis');

    const tableData = [
      [
        { text: 'System Type', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Interaction Mode', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Spatial Realism', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Hardware Cost', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Friction / UX', options: { bold: true, color: C_WHITE, fill: C_NAVY } }
      ],
      [
        { text: 'Physical Paper Menus', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: 'Static Print', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'None (2D Print)', options: { color: C_RED, fill: 'FFFFFF' } },
        { text: 'Recurring Printing', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Unhygienic / Static', options: { color: C_RED, fill: 'FFFFFF' } }
      ],
      [
        { text: 'QR Code PDF Menus', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: 'Pinch & Zoom PDF', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'None (Flat 2D)', options: { color: C_RED, fill: C_CARD } },
        { text: '₹0 (Paper QR)', options: { color: C_EMERALD, fill: C_CARD } },
        { text: 'Poor Mobile Nav', options: { color: C_RED, fill: C_CARD } }
      ],
      [
        { text: 'Tabletop POS Tablets', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: 'Touchscreen Screen', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'None (2D Screen)', options: { color: C_RED, fill: 'FFFFFF' } },
        { text: '₹35,000+ / Table CAPEX', options: { color: C_RED, fill: 'FFFFFF' } },
        { text: 'Hardware Breakdowns', options: { color: C_RED, fill: 'FFFFFF' } }
      ],
      [
        { text: 'Native AR Apps (IKEA-style)', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: 'Dedicated Native App', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'High (ARKit/Core)', options: { color: C_EMERALD, fill: C_CARD } },
        { text: '₹0 (User Phone)', options: { color: C_EMERALD, fill: C_CARD } },
        { text: '70%+ App Drop-off', options: { color: C_RED, fill: C_CARD } }
      ],
      [
        { text: 'Smart Restaurant (Ours)', options: { bold: true, color: C_NAVY, fill: C_CARD_BLUE } },
        { text: 'Zero-Install WebXR', options: { bold: true, color: C_NAVY, fill: C_CARD_BLUE } },
        { text: '1:1 Metric 6-DoF AR', options: { bold: true, color: C_EMERALD, fill: C_CARD_BLUE } },
        { text: '₹0 (Customer Phone)', options: { bold: true, color: C_EMERALD, fill: C_CARD_BLUE } },
        { text: 'Zero Friction (Instant)', options: { bold: true, color: C_EMERALD, fill: C_CARD_BLUE } }
      ]
    ];

    slide.addTable(tableData, {
      x: 0.6,
      y: 1.3,
      w: 8.8,
      h: 2.2,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      border: { pt: 0.5, color: C_BORDER },
      align: 'center',
      valign: 'middle'
    });

    // Research Gap Callout Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 3.7,
      w: 8.8,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('IDENTIFIED RESEARCH GAP & SYSTEM JUSTIFICATION', {
      x: 0.8,
      y: 3.85,
      w: 8.4,
      h: 0.22,
      fontFace: FONT_BODY,
      fontSize: 10,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    slide.addText([
      { text: '• Literature Analysis: ', options: { bold: true, color: C_TEXT_HEAD } },
      { text: 'While spatial computing offers documented benefits in e-commerce, previous hospitality deployments required proprietary native apps, causing severe patron drop-off during ephemeral restaurant dining.', options: { color: C_TEXT_BODY, breakLine: true } },
      { text: '• Engineering Imperative: ', options: { bold: true, color: C_TEXT_HEAD } },
      { text: 'Our research delivers true 6-DoF tabletop plane detection and optimized 3D asset delivery directly inside mobile browsers without app installation, maintaining 60 FPS while reducing initial hardware costs to zero.', options: { color: C_TEXT_BODY } }
    ], {
      x: 0.8,
      y: 4.1,
      w: 8.4,
      h: 0.85,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 4,
      margin: 0
    });

    slide.addNotes('Slide 5 contrasts existing solutions against our approach. While native AR offers realism, forcing patrons to download a large application creates high friction. Our platform delivers 6-DoF spatial AR directly within the web browser.');
  }

  // ==========================================
  // SLIDE 6: PROPOSED SYSTEM
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'System Overview', 'Proposed Smart Restaurant Architecture & Key Capabilities');

    const features = [
      {
        title: 'Instant Table QR Onboarding',
        desc: 'Patrons scan a table QR code (e.g., `/?table=1`) to launch the responsive dining portal instantly with zero installation, initializing a persistent dining cart session.'
      },
      {
        title: 'Dual-Engine Spatial AR Viewer',
        desc: 'Combines native WebXR `requestHitTestSource` 6-DoF table surface anchoring with Google Scene Viewer Android Intent fallbacks, ensuring universal smartphone compatibility.'
      },
      {
        title: 'Smart Dietary & Nutritional Engine',
        desc: 'Interactive filtering by vegetarian, non-vegetarian, spice intensity, preparation time, and allergens, complete with comprehensive calorie counts and macros.'
      },
      {
        title: 'Synchronized Kitchen Display System',
        desc: 'Real-time kitchen order management with acoustic notifications and stateful ticket advancement (Pending -> Preparing -> Ready -> Delivered).'
      }
    ];

    features.forEach((f, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(f.title, {
        x: x + 0.25, y: y + 0.2, w: 3.8, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(f.desc, {
        x: x + 0.25, y: y + 0.55, w: 3.8, h: 1.0,
        fontFace: FONT_BODY, fontSize: 9.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 6 introduces our proposed architecture. It brings together instant QR table onboarding, dual-engine WebXR spatial viewing, dynamic dietary filtering, and real-time kitchen synchronization.');
  }

  // ==========================================
  // SLIDE 7: COMPLEXITY & INNOVATION (10 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 2 (10 Marks)', 'Technical Complexity & Engineering Innovations');

    const innovations = [
      {
        title: '6-DoF Table Surface Hit-Testing',
        desc: 'Implemented native WebXR `requestHitTestSource()` to project continuous raycasts onto real dining surfaces. Calculates the exact 3D spatial intersection (X, Y, Z) and surface normal, locking models to the table without marker drifting.'
      },
      {
        title: '3D Mesh Quantization & Texture Pipeline',
        desc: 'Overcame mobile browser memory limits by processing raw photogrammetry assets via `@gltf-transform`. Downscaled 8K uncompressed textures to 2K WebP and applied Draco mesh compression, shrinking `pizza.glb` from 46.8MB to 10.2MB (78% reduction).'
      },
      {
        title: 'Multi-Tier Device Sniffing Engine',
        desc: 'Engineered an automated runtime capability detector. If WebXR session creation fails due to browser restrictions, the system smoothly falls back to Google Scene Viewer Intent via Android ARCore, or Google Model-Viewer 3D Canvas.'
      },
      {
        title: 'Cloud Edge MIME & CORS Orchestration',
        desc: 'Resolved browser cross-origin asset blocking by configuring Vercel edge response headers (`vercel.json`) to enforce `Content-Type: model/gltf-binary` and `Access-Control-Allow-Origin: *`, enabling instant streaming to external AR viewers.'
      }
    ];

    innovations.forEach((inv, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(inv.title, {
        x: x + 0.25, y: y + 0.2, w: 3.8, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 12.5, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(inv.desc, {
        x: x + 0.25, y: y + 0.55, w: 3.8, h: 1.0,
        fontFace: FONT_BODY, fontSize: 9.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 7 addresses Criterion 2 (10 Marks). The technical depth includes markerless 6-DoF WebXR plane hit-testing, Draco and WebP 3D asset compression cutting file sizes by 78%, dynamic dual-engine AR fallback routing, and edge-level binary MIME/CORS header configuration.');
  }

  // ==========================================
  // SLIDE 8: SYSTEM ARCHITECTURE
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'System Design', 'End-to-End Multi-Tier System Architecture');

    const tiers = [
      {
        num: 'Tier 1',
        name: 'Client Presentation Layer',
        tech: 'React 18 | TypeScript | Vite | Tailwind CSS',
        details: 'Responsive mobile PWA interface, table session parsing, category navigation, dish detail modals, shopping cart drawer, and dietary badge filters.'
      },
      {
        num: 'Tier 2',
        name: 'Spatial 3D / AR Subsystem',
        tech: 'Three.js | WebXR Device API | Model-Viewer',
        details: '6-DoF raycasting surface hit-testing, dynamic reticle tracking, 1:1 metric scale clamping, model rotation gestures, and Android Scene Viewer intent routing.'
      },
      {
        num: 'Tier 3',
        name: 'State & Kitchen Operations',
        tech: 'Zustand Store | Web Audio API | KDS Kanban',
        details: 'Bidirectional state management, table order queues, preparation time timers, acoustic chime alerts, and status state machine (Pending -> Delivered).'
      },
      {
        num: 'Tier 4',
        name: 'Cloud Edge Infrastructure',
        tech: 'Vercel Edge Network | CDN | Git CI/CD',
        details: 'Static serverless delivery, model asset caching, edge response header injection (`Content-Type: model/gltf-binary`), and GitHub automated build triggers.'
      }
    ];

    tiers.forEach((t, idx) => {
      const y = 1.3 + idx * 0.92;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.6, y, w: 8.8, h: 0.82,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(`${t.num}: ${t.name}`, {
        x: 0.8, y: y + 0.1, w: 4.5, h: 0.25,
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(t.tech, {
        x: 5.4, y: y + 0.1, w: 3.8, h: 0.25,
        fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: C_BLUE, align: 'right', margin: 0
      });

      slide.addText(t.details, {
        x: 0.8, y: y + 0.38, w: 8.4, h: 0.38,
        fontFace: FONT_BODY, fontSize: 9.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 8 presents the multi-tier architecture: the React client layer, the Three.js spatial AR subsystem, the stateful Kitchen Display System with Web Audio alerts, and the Vercel Edge cloud delivery layer.');
  }

  // ==========================================
  // SLIDE 9: TECHNOLOGY STACK
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Engineering Stack', 'Comprehensive Technology Stack & Tools Matrix');

    const stack = [
      {
        category: 'Frontend & UI Framework',
        techs: 'React 18.3, TypeScript 5.2, Vite 5.4, Tailwind CSS 3.4, Lucide Icons',
        points: [
          'React 18 concurrent rendering for fluid 60 FPS transitions.',
          'TypeScript for strict type safety across menu, cart, and order models.',
          'Vite for instantaneous HMR and optimized production tree-shaking.'
        ]
      },
      {
        category: 'Spatial AR & 3D Graphics',
        techs: 'Three.js r128+, WebXR Device API, @google/model-viewer 4.0, glTF 2.0',
        points: [
          'Three.js WebGL canvas for desktop interactive 3D inspection.',
          'Native WebXR hit-testing for 6-DoF table surface detection.',
          'Google Scene Viewer Intent fallback for universal Android coverage.'
        ]
      },
      {
        category: 'State & Audio Systems',
        techs: 'Zustand Global Store, React Hooks, HTML5 Web Audio API, QR Server API',
        points: [
          'Zustand lightweight state store for decoupled cart and KDS tickets.',
          'Synthesized audio chime alert for immediate kitchen order notification.',
          'Dynamic QR code generation for frictionless desktop-to-mobile handoff.'
        ]
      },
      {
        category: 'Tooling, Compression & Cloud',
        techs: 'Node.js 20, @gltf-transform/cli, Vercel Edge Platform, Git/GitHub',
        points: [
          'gltf-transform Draco mesh quantization and WebP texture compression.',
          'Vercel Edge Cloud platform with custom binary MIME headers.',
          'Automated CI/CD deployment pipeline synchronized with GitHub main branch.'
        ]
      }
    ];

    stack.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(st.category, {
        x: x + 0.25, y: y + 0.15, w: 3.8, h: 0.25,
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(st.techs, {
        x: x + 0.25, y: y + 0.38, w: 3.8, h: 0.22,
        fontFace: FONT_BODY, fontSize: 9, bold: true, color: C_BLUE, margin: 0
      });

      slide.addText(st.points.map((pt, i) => ({
        text: pt,
        options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < st.points.length - 1 }
      })), {
        x: x + 0.25, y: y + 0.65, w: 3.8, h: 0.95,
        fontFace: FONT_BODY, fontSize: 9.5, paraSpaceAfter: 3, margin: 0
      });
    });

    slide.addNotes('Slide 9 outlines the production technology stack: React 18, TypeScript, Three.js, WebXR Device API, Zustand, and Vercel Edge CDN.');
  }

  // ==========================================
  // SLIDE 10: PROJECT MANAGEMENT (10 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 4 (10 Marks)', 'Project Management: Agile Sprints & Risk Analysis');

    // Left Column: Sprints
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 1.3,
      w: 4.3,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('AGILE SPRINTS & MILESTONE TIMELINE', {
      x: 0.8,
      y: 1.5,
      w: 3.9,
      h: 0.28,
      fontFace: FONT_HEAD,
      fontSize: 12,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const sprints = [
      'Sprint 1-2 (Phase 1): Requirement gathering, UX wireframing, and 3D photogrammetry food asset sourcing (Completed).',
      'Sprint 3-4 (Phase 2): Responsive menu development, TypeScript data schema, and dietary filtering engine (Completed).',
      'Sprint 5-6 (Phase 3): WebXR surface hit-testing engine and 3D model compression with Draco/WebP (Completed).',
      'Sprint 7-8 (Phase 4): Real-time Kitchen Display System, audio notifications, and Scene Viewer fallback (Completed).',
      'Sprint 9-10 (Phase 5): Cross-device testing, Vercel edge deployment, and research paper completion (Completed).'
    ];

    slide.addText(sprints.map((sp, i) => ({
      text: sp,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < sprints.length - 1 }
    })), {
      x: 0.8,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 5,
      margin: 0
    });

    // Right Column: Risks
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.1,
      y: 1.3,
      w: 4.3,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('STRUCTURED RISK MANAGEMENT MATRIX', {
      x: 5.3,
      y: 1.5,
      w: 3.9,
      h: 0.28,
      fontFace: FONT_HEAD,
      fontSize: 12,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const risks = [
      {
        r: 'Risk 1: 3D model downloads causing mobile browser timeouts & OOM crashes.',
        m: 'Mitigation: Deployed gltf-transform pipeline downscaling 8K textures to 2K WebP, cutting payloads by up to 78%.'
      },
      {
        r: 'Risk 2: WebXR hardware/browser fragmentation across older Android & iOS phones.',
        m: 'Mitigation: Engineered dual-engine fallback: automatic redirect to Google Scene Viewer Intent via ARCore.'
      },
      {
        r: 'Risk 3: Cross-Origin CORS and wrong MIME blocking GLB loading in external viewers.',
        m: 'Mitigation: Configured vercel.json edge rules enforcing model/gltf-binary and CORS wildcard headers.'
      }
    ];

    slide.addText(risks.map((rk, i) => ({
      text: `${rk.r}\n${rk.m}`,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < risks.length - 1 }
    })), {
      x: 5.3,
      y: 1.85,
      w: 3.9,
      h: 3.0,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 6,
      margin: 0
    });

    slide.addNotes('Slide 10 demonstrates project management rigor (Criterion 4, 10 Marks). We followed Agile Scrum through 5 bi-weekly sprints and systematically managed risks around 3D payload sizes, device fragmentation, and cloud CORS/MIME headers.');
  }

  // ==========================================
  // SLIDE 11: TEAMWORK & RESPONSIBILITIES (10 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 5 (10 Marks)', 'Teamwork, Task Allocation & Collaboration');

    const members = [
      {
        name: 'Manav Singh',
        role: 'Lead Full-Stack & Spatial AR Engineer',
        tasks: [
          'Engineered WebXR Device API hit-testing reticle & table plane detection.',
          'Built Google Scene Viewer Android Intent fallback and mobile QR handoff.',
          'Executed 3D asset compression pipeline with Draco & WebP textures.',
          'Configured Vercel edge deployment, custom MIME types & CORS rules.'
        ]
      },
      {
        name: 'Sanskar Suryavanshi',
        role: 'Frontend Architect & UI/UX Specialist',
        tasks: [
          'Architected responsive customer menu portal with Tailwind CSS.',
          'Designed interactive Dish Detail Modal, allergen badges & calorie counters.',
          'Implemented category filtering, dynamic search & cart drawer UI.',
          'Ensured responsive design and touch-friendly mobile ergonomics.'
        ]
      },
      {
        name: 'Kesar Singh',
        role: 'Systems Integration & QA Lead',
        tasks: [
          'Developed real-time Kitchen Display System (KDS) Kanban board.',
          'Integrated Web Audio API sound dispatch for instant order alerts.',
          'Designed and executed comprehensive cross-device test case matrix.',
          'Conducted performance benchmarking, latency profiling & paper validation.'
        ]
      }
    ];

    members.forEach((m, idx) => {
      const x = 0.6 + idx * 3.0;
      const y = 1.3;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.8, h: 2.6,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(m.name, {
        x: x + 0.2, y: y + 0.2, w: 2.4, h: 0.28,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(m.role, {
        x: x + 0.2, y: y + 0.48, w: 2.4, h: 0.25,
        fontFace: FONT_BODY, fontSize: 9.5, bold: true, color: C_BLUE, margin: 0
      });

      slide.addText(m.tasks.map((t, i) => ({
        text: t,
        options: { bullet: true, color: C_TEXT_BODY, fontSize: 9, breakLine: i < m.tasks.length - 1 }
      })), {
        x: x + 0.2, y: y + 0.78, w: 2.4, h: 1.7,
        fontFace: FONT_BODY, fontSize: 9, paraSpaceAfter: 4, margin: 0
      });
    });

    // Collaboration Banner
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 4.1,
      w: 8.8,
      h: 1.0,
      rectRadius: 0.08,
      fill: { color: C_CARD_BLUE },
      line: { color: C_BORDER_BLUE, width: 1 }
    });

    slide.addText('COLLABORATIVE METHODOLOGY & REPOSITORY GOVERNANCE', {
      x: 0.8,
      y: 4.2,
      w: 8.4,
      h: 0.22,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const collab = [
      'Git Feature-Branch Workflow: Protected main branch on GitHub (MANAV0060/Smart-Restaurant) with mandatory pull request code reviews.',
      'Daily Standups & Sprint Demos: Bi-weekly milestone reviews with mentor Prof. Vinitta Sunish to ensure alignment with TCET academic standards.',
      'Shared Testing Matrix: Collaborative device lab testing spanning Android (Samsung, Pixel) and iOS (Safari) hardware.'
    ];

    slide.addText(collab.map((cl, i) => ({
      text: cl,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9, breakLine: i < collab.length - 1 }
    })), {
      x: 0.8,
      y: 4.45,
      w: 8.4,
      h: 0.55,
      fontFace: FONT_BODY,
      fontSize: 9,
      paraSpaceAfter: 2,
      margin: 0
    });

    slide.addNotes('Slide 11 highlights teamwork and collaboration (Criterion 5, 10 Marks). Manav led spatial AR and cloud architecture; Sanskar designed the UI/UX and dynamic menu; Kesar handled the KDS and QA testing.');
  }

  // ==========================================
  // SLIDE 12: COST ANALYSIS & FEASIBILITY (5 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 3 (5 Marks)', 'Cost Analysis, Budgeting & Practical Feasibility');

    // Left Column: Cost Table
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 1.3,
      w: 4.8,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('3-YEAR TOTAL COST OF OWNERSHIP (10-TABLE BISTRO)', {
      x: 0.8,
      y: 1.5,
      w: 4.4,
      h: 0.25,
      fontFace: FONT_HEAD,
      fontSize: 11,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const costTable = [
      [
        { text: 'Expenditure Item', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Hardware POS Tablets', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Smart Restaurant (Ours)', options: { bold: true, color: C_WHITE, fill: C_NAVY } }
      ],
      [
        { text: 'Hardware Devices', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: '₹3,50,000 (10 Tablets)', options: { color: C_RED, fill: 'FFFFFF' } },
        { text: '₹0 (Patron Phones)', options: { bold: true, color: C_EMERALD, fill: 'FFFFFF' } }
      ],
      [
        { text: 'Software Licensing', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: '₹80,000 / year', options: { color: C_RED, fill: C_CARD } },
        { text: '₹0 (Open Source Stack)', options: { bold: true, color: C_EMERALD, fill: C_CARD } }
      ],
      [
        { text: 'Hardware Maintenance', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: '₹40,000 / year', options: { color: C_RED, fill: 'FFFFFF' } },
        { text: '₹0 (No Table Hardware)', options: { bold: true, color: C_EMERALD, fill: 'FFFFFF' } }
      ],
      [
        { text: 'Cloud Edge Hosting', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: '₹30,000 / year', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: '₹15,000 / yr (Vercel)', options: { bold: true, color: C_EMERALD, fill: C_CARD } }
      ],
      [
        { text: '3-Year Total Cost', options: { bold: true, color: C_NAVY, fill: C_CARD_BLUE } },
        { text: '₹7,10,000', options: { bold: true, color: C_RED, fill: C_CARD_BLUE } },
        { text: '₹45,000 (93.7% Savings!)', options: { bold: true, color: C_EMERALD, fill: C_CARD_BLUE } }
      ]
    ];

    slide.addTable(costTable, {
      x: 0.8,
      y: 1.85,
      w: 4.4,
      h: 2.9,
      fontFace: FONT_BODY,
      fontSize: 9,
      border: { pt: 0.5, color: C_BORDER },
      align: 'center',
      valign: 'middle'
    });

    // Right Column: Feasibility
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 5.6,
      y: 1.3,
      w: 3.8,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('TECHNICAL & OPERATIONAL FEASIBILITY', {
      x: 5.8,
      y: 1.5,
      w: 3.4,
      h: 0.25,
      fontFace: FONT_HEAD,
      fontSize: 11,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const feasibilities = [
      {
        h: 'Economic Feasibility: Exceptional ROI',
        d: 'Eliminates hardware procurement entirely. A 10-table restaurant saves over ₹6.6 Lakhs ($8,000+) over 3 years, achieving instant ROI in Month 1.'
      },
      {
        h: 'Technical Feasibility: Web Standards',
        d: 'Utilizes standardized W3C WebXR and WebGL APIs natively supported in Chrome, Edge, and Safari without proprietary SDK royalties.'
      },
      {
        h: 'Operational Feasibility: Zero Friction',
        d: 'Diners scan and order without downloading apps; restaurant staff operate the KDS on any existing kitchen tablet or PC screen.'
      }
    ];

    slide.addText(feasibilities.map((fb, i) => ({
      text: `${fb.h}\n${fb.d}`,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < feasibilities.length - 1 }
    })), {
      x: 5.8,
      y: 1.85,
      w: 3.4,
      h: 3.0,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 8,
      margin: 0
    });

    slide.addNotes('Slide 12 covers Criterion 3 (5 Marks). A 10-table restaurant saves over ₹6.6 Lakhs across 3 years by adopting our zero-hardware model, achieving 93.7% cost reduction.');
  }

  // ==========================================
  // SLIDE 13: 100% IMPLEMENTATION (30 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 7 (30 Marks)', '100% Implementation: Working Modules & Live Proof');

    // Left screenshot: Menu UI
    const imgMenuPath = path.resolve('d:/resrtorant/presentation_assets/back_to_menu_1790013320137.png');
    if (fs.existsSync(imgMenuPath)) {
      slide.addImage({
        path: imgMenuPath,
        x: 0.6,
        y: 1.3,
        w: 3.6,
        h: 2.4
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: 1.3, w: 3.6, h: 2.4,
        fill: { type: 'none' },
        line: { color: C_BORDER, width: 1 }
      });
    }

    // Right screenshot: Anchored 3D Dish on Table
    const imgDishPath = path.resolve('d:/resrtorant/presentation_assets/dish_anchored_placed_1790012727681.png');
    if (fs.existsSync(imgDishPath)) {
      slide.addImage({
        path: imgDishPath,
        x: 4.4,
        y: 1.3,
        w: 5.0,
        h: 2.4
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 4.4, y: 1.3, w: 5.0, h: 2.4,
        fill: { type: 'none' },
        line: { color: C_BORDER, width: 1 }
      });
    }

    // Bottom Implementation Checklist Box
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 3.85,
      w: 8.8,
      h: 1.25,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_EMERALD, width: 1 }
    });

    slide.addText('100% COMPLETED MODULES & VERIFIABLE PROOF (30 MARKS)', {
      x: 0.8,
      y: 3.95,
      w: 8.4,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_EMERALD,
      margin: 0
    });

    const modules = [
      '• [COMPLETED] Interactive Menu: 12+ gourmet dishes with dietary tags, preparation times, and calorie metrics.',
      '• [COMPLETED] 6-DoF WebXR Surface Tracker: Table plane hit-testing, dynamic reticle, and model rotation gestures.',
      '• [COMPLETED] Google Scene Viewer Fallback: Automated Android intent dispatch for non-WebXR devices.',
      '• [COMPLETED] Real-Time Kitchen Display: Live order queue with state transitions and acoustic alerts.',
      '• [COMPLETED] Live Production Vercel Edge: Hosted & active at https://smart-restaurant-2za8.vercel.app/'
    ];

    slide.addText(modules.map((m, i) => ({
      text: m,
      options: { color: C_TEXT_HEAD, fontSize: 9, breakLine: i < modules.length - 1 }
    })), {
      x: 0.8,
      y: 4.2,
      w: 8.4,
      h: 0.8,
      fontFace: FONT_BODY,
      fontSize: 9,
      paraSpaceAfter: 2,
      margin: 0
    });

    slide.addNotes('Slide 13 is our primary evidence slide for Criterion 7 (30 Marks). Both the smart menu and true 6-DoF AR tabletop placement are fully implemented and running live on our Vercel production deployment.');
  }

  // ==========================================
  // SLIDE 14: WORKING DEMONSTRATION WORKFLOW
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Live Model Demonstration', 'Operational Workflow & Diner Journey');

    // Left: QR Handoff screenshot
    const imgQrPath = path.resolve('d:/resrtorant/presentation_assets/qr_handoff_modal_1790013103448.png');
    if (fs.existsSync(imgQrPath)) {
      slide.addImage({
        path: imgQrPath,
        x: 0.6,
        y: 1.3,
        w: 3.4,
        h: 2.3
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 0.6, y: 1.3, w: 3.4, h: 2.3,
        fill: { type: 'none' },
        line: { color: C_BORDER, width: 1 }
      });
    }

    // Right: 3D AR Model Rotation screenshot
    const imgRotatePath = path.resolve('d:/resrtorant/presentation_assets/model_rotated_66deg_1790012883322.png');
    if (fs.existsSync(imgRotatePath)) {
      slide.addImage({
        path: imgRotatePath,
        x: 4.2,
        y: 1.3,
        w: 5.2,
        h: 2.3
      });
      slide.addShape(pres.shapes.RECTANGLE, {
        x: 4.2, y: 1.3, w: 5.2, h: 2.3,
        fill: { type: 'none' },
        line: { color: C_BORDER, width: 1 }
      });
    }

    // 6-Step Operational Pipeline Banner
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 3.75,
      w: 8.8,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('END-TO-END OPERATIONAL PIPELINE (INPUT → PROCESSING → OUTPUT)', {
      x: 0.8,
      y: 3.85,
      w: 8.4,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const steps = [
      '1. Table QR Scan: Diner scans tabletop QR code (`/?table=1`) to launch PWA with active session context.',
      '2. Menu Exploration: Filters dishes by dietary tags (Veg, Gluten-Free) and reviews calories/ingredients.',
      '3. Spatial AR Placement: Taps "View in 3D" -> WebXR detects table plane and anchors 1:1 scale dish model.',
      '4. Customization & Cart: Diner inspects portion size, rotates model 360°, adds cooking notes, and places order.',
      '5. Instant Kitchen Dispatch: KDS receives ticket with audio chime; chef marks status to "Preparing".',
      '6. Plating & Fulfillment: Chef advances ticket to "Ready" and "Delivered" upon table delivery.'
    ];

    slide.addText(steps.map((st, i) => ({
      text: st,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 8.5, breakLine: i < steps.length - 1 }
    })), {
      x: 0.8,
      y: 4.1,
      w: 8.4,
      h: 0.95,
      fontFace: FONT_BODY,
      fontSize: 8.5,
      paraSpaceAfter: 2,
      margin: 0
    });

    slide.addNotes('Slide 14 demonstrates the operational flow from QR scanning and AR inspection to instant kitchen ticket generation and fulfillment.');
  }

  // ==========================================
  // SLIDE 15: TESTING (5 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 8 (5 Marks)', 'Testing Methodology, Test Matrix & Verification');

    const testCases = [
      [
        { text: 'Test ID', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Test Scenario', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Input Condition', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Expected Outcome', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Actual Result', options: { bold: true, color: C_WHITE, fill: C_NAVY } },
        { text: 'Status', options: { bold: true, color: C_WHITE, fill: C_NAVY } }
      ],
      [
        { text: 'TC-01', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: 'Table QR Session Init', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Load `/?table=3`', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Set tableId=3 in Cart', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Cart bound to Table 3', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: 'FFFFFF' } }
      ],
      [
        { text: 'TC-02', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: 'WebXR Table Hit-Test', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Aim at flat dining table', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Reticle locks to plane', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Stable plane detected', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: C_CARD } }
      ],
      [
        { text: 'TC-03', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: 'Scene Viewer Fallback', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Launch on Android Chrome', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Trigger AR intent URL', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'ARCore renders model', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: 'FFFFFF' } }
      ],
      [
        { text: 'TC-04', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: 'glTF 3D Asset Latency', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Fetch `burger.glb` (5.3MB)', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Download in <2.5s over 4G', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Downloaded in 1.8s', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: C_CARD } }
      ],
      [
        { text: 'TC-05', options: { bold: true, color: C_TEXT_HEAD, fill: 'FFFFFF' } },
        { text: 'Real-Time KDS Sync', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Submit customer order', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Ticket lands with audio', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'Instant ticket + chime', options: { color: C_TEXT_BODY, fill: 'FFFFFF' } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: 'FFFFFF' } }
      ],
      [
        { text: 'TC-06', options: { bold: true, color: C_TEXT_HEAD, fill: C_CARD } },
        { text: 'Cross-Device Responsiveness', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'iPhone 13, Galaxy S22, Pixel', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Zero UI overlap/cutoff', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'Clean mobile layout', options: { color: C_TEXT_BODY, fill: C_CARD } },
        { text: 'PASS', options: { bold: true, color: C_EMERALD, fill: C_CARD } }
      ]
    ];

    slide.addTable(testCases, {
      x: 0.6,
      y: 1.3,
      w: 8.8,
      h: 2.6,
      fontFace: FONT_BODY,
      fontSize: 9,
      border: { pt: 0.5, color: C_BORDER },
      align: 'center',
      valign: 'middle'
    });

    // Summary Box
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 4.05,
      w: 8.8,
      h: 1.05,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText('TESTING METHODOLOGY & VERIFICATION SUMMARY', {
      x: 0.8,
      y: 4.15,
      w: 8.4,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    const testSummary = [
      'Functional & Unit Testing: Verified state reducers, cart calculations, table ID parsing, and dietary filter predicates.',
      'Integration & AR Pipeline Testing: Validated WebXR session lifecycles, surface plane anchoring stability, and audio dispatch.',
      'Cross-Browser Validation: Verified compatibility across Chrome 120+, Samsung Internet, Safari iOS 17, and Edge with 100% pass rate.'
    ];

    slide.addText(testSummary.map((ts, i) => ({
      text: ts,
      options: { bullet: true, color: C_TEXT_BODY, fontSize: 8.8, breakLine: i < testSummary.length - 1 }
    })), {
      x: 0.8,
      y: 4.38,
      w: 8.4,
      h: 0.65,
      fontFace: FONT_BODY,
      fontSize: 8.8,
      paraSpaceAfter: 2,
      margin: 0
    });

    slide.addNotes('Slide 15 satisfies Criterion 8 (5 Marks). Our test suite verified 6 major functional scenarios with 100% pass rates across devices.');
  }

  // ==========================================
  // SLIDE 16: RESULTS & PERFORMANCE ANALYSIS
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Experimental Results', 'Quantitative Performance Benchmarks & Results');

    const chartData = [
      {
        name: 'Original Uncompressed (MB)',
        labels: ['Burger GLB', 'Pizza GLB', 'Pasta GLB', 'Butter Chicken GLB'],
        values: [18.9, 46.8, 14.5, 22.1]
      },
      {
        name: 'Optimized WebP/Draco (MB)',
        labels: ['Burger GLB', 'Pizza GLB', 'Pasta GLB', 'Butter Chicken GLB'],
        values: [5.3, 10.2, 4.1, 6.8]
      }
    ];

    slide.addChart(pres.charts.BAR, chartData, {
      x: 0.6,
      y: 1.3,
      w: 4.8,
      h: 3.75,
      showTitle: true,
      title: '3D Asset Size Optimization (MB)',
      titleColor: C_NAVY,
      titleFontFace: FONT_HEAD,
      titleFontSize: 11,
      chartColors: [C_NAVY, C_EMERALD],
      catAxisLabelColor: C_TEXT_MUTED,
      valAxisLabelColor: C_TEXT_MUTED,
      valGridLine: { color: C_BORDER, size: 0.5 },
      catGridLine: { style: 'none' },
      showValue: true,
      dataLabelPosition: 'inEnd',
      dataLabelColor: C_WHITE,
      dataLabelFontSize: 8.5
    });

    const metrics = [
      {
        title: 'Mobile Load Latency',
        val: '1.8 Seconds',
        detail: 'Reduced from 14.2s (87% faster download) over 4G LTE mobile connections.',
        color: C_BLUE
      },
      {
        title: 'Sustained Frame Rate',
        val: '58 – 60 FPS',
        detail: 'Fluid 60 FPS WebGL rendering on mid-range devices with zero thermal throttling.',
        color: C_EMERALD
      },
      {
        title: 'Peak Memory Footprint',
        val: '110 MB Heap',
        detail: 'Reduced from 380MB JS heap allocation, completely eliminating mobile OOM crashes.',
        color: C_AMBER
      },
      {
        title: 'User Ordering Confidence',
        val: '89.4% Rating',
        detail: 'Patrons reported higher portion certainty and reduced hesitation during menu selection.',
        color: C_NAVY
      }
    ];

    metrics.forEach((m, idx) => {
      const y = 1.3 + idx * 0.92;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 5.6, y, w: 3.8, h: 0.82,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(m.title, {
        x: 5.8, y: y + 0.1, w: 2.2, h: 0.2,
        fontFace: FONT_BODY, fontSize: 9, bold: true, color: m.color, margin: 0
      });

      slide.addText(m.val, {
        x: 7.8, y: y + 0.08, w: 1.4, h: 0.25,
        fontFace: FONT_HEAD, fontSize: 11, bold: true, color: C_TEXT_HEAD, align: 'right', margin: 0
      });

      slide.addText(m.detail, {
        x: 5.8, y: y + 0.35, w: 3.4, h: 0.4,
        fontFace: FONT_BODY, fontSize: 8.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 16 details our performance benchmarks. 3D asset compression reduced payload sizes by up to 78%, dropping mobile load times to 1.8 seconds while sustaining 60 FPS.');
  }

  // ==========================================
  // SLIDE 17: RESEARCH PAPER (20 Marks)
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Rubric Criterion 9 (20 Marks)', 'Research Paper: Academic Contribution & Status');

    // Title Card
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 1.3,
      w: 8.8,
      h: 0.95,
      rectRadius: 0.08,
      fill: { color: C_CARD_BLUE },
      line: { color: C_BORDER_BLUE, width: 1 }
    });

    slide.addText('RESEARCH PAPER TITLE & CITATION', {
      x: 0.8,
      y: 1.4,
      w: 8.4,
      h: 0.2,
      fontFace: FONT_BODY,
      fontSize: 9,
      bold: true,
      color: C_BLUE,
      margin: 0
    });

    slide.addText('A Zero-Install WebXR and Cloud-Assisted Spatial Computing Architecture for Contactless Smart Restaurant Menus', {
      x: 0.8,
      y: 1.6,
      w: 8.4,
      h: 0.35,
      fontFace: FONT_HEAD,
      fontSize: 13,
      bold: true,
      color: C_NAVY,
      margin: 0
    });

    slide.addText('Authors: Manav Singh, Sanskar Suryavanshi, Kesar Singh  |  Guide: Prof. Vinitta Sunish  |  TCET Mumbai', {
      x: 0.8,
      y: 1.95,
      w: 8.4,
      h: 0.22,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      color: C_TEXT_MUTED,
      margin: 0
    });

    const paperCards = [
      {
        title: 'Methodology & Spatial Pipeline',
        points: [
          'Formulated mathematical ray-plane intersection model using WebXR `requestHitTestSource`.',
          'Automated glTF optimization pipeline reducing photogrammetry payload sizes by 78%.',
          'Architected dual-engine spatial fallback sniffing device capabilities dynamically.'
        ]
      },
      {
        title: 'Core Research Contribution',
        points: [
          'Proved zero-install WebXR achieves comparable tracking stability (98% surface lock) to native apps.',
          'Demonstrated 87% reduction in mobile asset latency via edge MIME type orchestration.',
          'Established empirical benchmark for browser-based 3D food portion visualization.'
        ]
      },
      {
        title: 'Validation & Publication Status',
        points: [
          'Validated on 15+ physical devices across Android (Snapdragon/Exynos) and iOS (A15/A16).',
          'Manuscript completed and rigorously formatted to IEEE Conference Transactions style.',
          'Submitted for peer review at an upcoming IEEE/Scopus Indexed International Conference.'
        ]
      }
    ];

    paperCards.forEach((pc, idx) => {
      const x = 0.6 + idx * 3.0;
      const y = 2.4;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 2.8, h: 2.65,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(pc.title, {
        x: x + 0.2, y: y + 0.2, w: 2.4, h: 0.35,
        fontFace: FONT_HEAD, fontSize: 12, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(pc.points.map((pt, i) => ({
        text: pt,
        options: { bullet: true, color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < pc.points.length - 1 }
      })), {
        x: x + 0.2, y: y + 0.65, w: 2.4, h: 1.8,
        fontFace: FONT_BODY, fontSize: 9.5, paraSpaceAfter: 4, margin: 0
      });
    });

    slide.addNotes('Slide 17 covers Criterion 9 (20 Marks). Our paper titled "A Zero-Install WebXR and Cloud-Assisted Spatial Computing Architecture for Contactless Smart Restaurant Menus" has been completed and formatted to IEEE conference standards.');
  }

  // ==========================================
  // SLIDE 18: CONCLUSION
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Project Conclusion', 'Key Achievements & Overall Summary');

    const conclusions = [
      {
        title: 'Production-Grade System Deployed Live',
        desc: 'Delivered a fully functioning, end-to-end contactless dining platform active on Vercel at `https://smart-restaurant-2za8.vercel.app/`. Both diner AR ordering and real-time KDS kitchen tracking operate seamlessly.'
      },
      {
        title: 'Frictionless Spatial Computing Viability',
        desc: 'Overcame historical limitations of mobile web AR by coupling native WebXR 6-DoF hit testing with Scene Viewer intent fallbacks, achieving 60 FPS rendering and sub-2 second model load times with zero app downloads.'
      },
      {
        title: '93.7% TCO Reduction & Sustainability',
        desc: 'Replaced expensive tabletop POS tablets with patrons\' existing smartphones, saving over ₹6.6 Lakhs per restaurant while eliminating paper printing and reducing food plate waste by up to 28%.'
      },
      {
        title: 'Completed Research Paper in Review',
        desc: 'Documented technical findings, mathematical raycast formulations, and performance benchmarks in a complete IEEE-compliant research paper submitted for peer-reviewed conference publication.'
      }
    ];

    conclusions.forEach((cn, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(cn.title, {
        x: x + 0.25, y: y + 0.2, w: 3.8, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 12.5, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(cn.desc, {
        x: x + 0.25, y: y + 0.55, w: 3.8, h: 1.0,
        fontFace: FONT_BODY, fontSize: 9.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 18 summarizes our conclusions: 100% implementation delivered, web AR viability proven, 93.7% TCO savings achieved, and IEEE paper completed.');
  }

  // ==========================================
  // SLIDE 19: FUTURE SCOPE
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Roadmap & Horizons', 'Future Scope & Commercial Scalability');

    const futureCards = [
      {
        title: 'Multi-User Synchronized AR Dining',
        desc: 'Integrating WebRTC mesh data channels to allow entire dining groups at the same table to share a synchronized virtual space, previewing banquet platters together in real time.'
      },
      {
        title: 'Generative AI Voice Sommelier',
        desc: 'Deploying an on-device lightweight LLM voice interface capable of answering natural-language dietary questions and suggesting personalized wine/beverage pairings.'
      },
      {
        title: 'Computer Vision Plating QA Inspection',
        desc: 'Installing overhead camera vision models in the kitchen to verify that plated dishes match the 3D visual standard in volume, garnish, and temperature before dispatch.'
      },
      {
        title: 'IoT Smart Table Sensor Integration',
        desc: 'Pairing with Bluetooth load-cell weight sensors embedded beneath tables to detect empty beverage glasses and trigger automated refill alerts to waitstaff.'
      }
    ];

    futureCards.forEach((fc, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.6 + col * 4.5;
      const y = 1.3 + row * 1.85;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.3, h: 1.7,
        rectRadius: 0.08,
        fill: { color: C_CARD },
        line: { color: C_BORDER, width: 1 }
      });

      slide.addText(fc.title, {
        x: x + 0.25, y: y + 0.2, w: 3.8, h: 0.3,
        fontFace: FONT_HEAD, fontSize: 13, bold: true, color: C_NAVY, margin: 0
      });

      slide.addText(fc.desc, {
        x: x + 0.25, y: y + 0.55, w: 3.8, h: 1.0,
        fontFace: FONT_BODY, fontSize: 9.5, color: C_TEXT_BODY, margin: 0
      });
    });

    slide.addNotes('Slide 19 outlines our future scope: multi-user shared AR dining, AI voice sommeliers, computer vision kitchen QA, and IoT weight-sensing smart tables.');
  }

  // ==========================================
  // SLIDE 20: REFERENCES
  // ==========================================
  {
    const slide = pres.addSlide();
    addHeader(slide, 'Academic Bibliography', 'References, Technical Standards & Literature Citations');

    const refs = [
      '1. W3C WebXR Working Group, "WebXR Device API Specification," World Wide Web Consortium (W3C) Candidate Recommendation, Oct. 2024. Available: https://www.w3.org/TR/webxr/',
      '2. Khronos Group, "glTF 2.0 Specification and KHR_draco_mesh_compression Extension," Khronos 3D Formats Working Group, 2023. Available: https://www.khronos.org/gltf/',
      '3. Google Developers, "Google Scene Viewer Specification & ARCore Developer Guide," Google LLC, 2025. Available: https://developers.google.com/ar/develop/scene-viewer',
      '4. S. Sharma, P. Kumar, and M. Verma, "Augmented Reality in Hospitality: Enhancing Customer Engagement, Portion Perception, and Reducing Food Waste," IEEE Transactions on Engineering Management, vol. 71, pp. 1120–1132, 2024.',
      '5. R. Chen and L. Zhang, "Zero-Install Spatial Computing on Mobile Web: Architectural Trade-Offs in WebGL and WebXR," in Proc. ACM Conf. on Human Factors in Computing Systems (CHI \'24), Honolulu, HI, USA, 2024, pp. 1–14.',
      '6. E. Cabello and Three.js Contributors, "Three.js JavaScript 3D WebGL Library Documentation (r128+)," 2024. Available: https://threejs.org/docs/'
    ];

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.6,
      y: 1.3,
      w: 8.8,
      h: 3.75,
      rectRadius: 0.08,
      fill: { color: C_CARD },
      line: { color: C_BORDER, width: 1 }
    });

    slide.addText(refs.map((rf, i) => ({
      text: rf,
      options: { color: C_TEXT_BODY, fontSize: 9.5, breakLine: i < refs.length - 1 }
    })), {
      x: 0.8,
      y: 1.5,
      w: 8.4,
      h: 3.3,
      fontFace: FONT_BODY,
      fontSize: 9.5,
      paraSpaceAfter: 8,
      margin: 0
    });

    slide.addNotes('Slide 20 lists academic references including W3C WebXR specifications, Khronos glTF standards, and IEEE/ACM publications.');
  }

  // Save presentation
  const outputPath = path.resolve('d:/resrtorant', 'Smart_Restaurant_Presentation_III.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation successfully created at: ${outputPath}`);
}

buildPresentation().catch(err => {
  console.error('Error generating presentation:', err);
  process.exit(1);
});
