// styles/theme.ts
// Single source of truth — both landing and app import from here.

export const theme = {
  colors: {
    bg:        '#070709',
    bgRaise:   '#0c0c10',
    bgFloat:   '#111118',
    surface:   'rgba(255,255,255,0.028)',
    surfaceMid:'rgba(255,255,255,0.055)',
    surfaceHi: 'rgba(255,255,255,0.08)',
    border:    'rgba(255,255,255,0.065)',
    borderMid: 'rgba(255,255,255,0.12)',
    violet:  { 300:'#c4b5fd', 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed', 700:'#6d28d9' },
    blue:    { 400:'#60a5fa', 500:'#3b82f6', 600:'#2563eb' },
    cyan:    { 400:'#22d3ee', 500:'#06b6d4' },
    emerald: { 400:'#34d399', 500:'#10b981' },
    rose:    { 400:'#fb7185', 500:'#f43f5e' },
    amber:   { 400:'#fbbf24' },
  },
  gradients: {
    brand:     'linear-gradient(135deg, #7c3aed, #2563eb)',
    brandSoft: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    text:      'linear-gradient(90deg, #a78bfa, #60a5fa, #22d3ee)',
    // Glow radials — used for section background warmth
    glowViolet:'radial-gradient(ellipse, rgba(109,40,217,0.18) 0%, transparent 70%)',
    glowBlue:  'radial-gradient(ellipse, rgba(37,99,235,0.14) 0%, transparent 70%)',
    glowCyan:  'radial-gradient(ellipse, rgba(34,211,238,0.10) 0%, transparent 70%)',
  },
  shadows: {
    // Card at rest — ambient contact shadow + top-edge light
    card:     'inset 0 1px 0 rgba(255,255,255,0.055), 0 1px 3px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.4)',
    // Card on hover — deeper diffuse shadow
    cardLift: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.55)',
    // Dashboard/deep card
    dashCard: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.5), 0 32px 80px rgba(0,0,0,0.55)',
    // Button glow at rest
    glowV:    '0 0 44px rgba(139,92,246,0.52), 0 0 88px rgba(139,92,246,0.18)',
    // Button glow on hover (2× intensity, wider radius)
    glowVHover:'0 0 70px rgba(139,92,246,0.88), 0 0 140px rgba(139,92,246,0.36)',
    // Input focus ring
    focusRing: '0 0 0 3px rgba(139,92,246,0.13)',
  },
  radius: {
    sm:  '0.5rem',
    md:  '0.75rem',
    lg:  '1rem',
    xl:  '1.5rem',
    full:'9999px',
  },
  font: {
    sans: "'Geist', ui-sans-serif, system-ui, sans-serif",
    mono: "'Geist Mono', 'Fira Code', ui-monospace, monospace",
  },
  // Motion duration tiers — matched to interaction type:
  //   micro    → button press, focus ring, border color
  //   standard → card lift, state change, input feedback
  //   reveal   → content entering viewport (with blur)
  //   cinematic→ hero elements, section entries
  //   ambient  → looped background blobs, float animations
  duration: {
    micro:    0.18,   // 120–180ms range
    standard: 0.28,   // 220–280ms range
    reveal:   0.48,   // 380–550ms range (blur + translate)
    cinematic:0.85,   // 650–1100ms range (hero, section entries)
    ambient:  6,      // 2–8s looped (blobs, particles, float)
    // Named aliases used by existing design.ts:
    fast:     0.28,
    normal:   0.55,
    slow:     0.85,
  },
  ease: {
    // Out Expo — primary. Enters fast, settles softly. NEVER use for exits.
    out:    [0.16, 1, 0.3, 1],
    // Soft — gentler entry for content reveals, staggered cards.
    soft:   [0.22, 1, 0.36, 1],
    // Spring Back — completion states, checkmarks. Has overshoot.
    back:   [0.34, 1.56, 0.64, 1],
    // In — exits only. Elements leaving the screen accelerate away.
    in:     [0.4, 0, 1, 1],
    // In-Out — mode transitions, tab switches, view changes.
    inOut:  [0.87, 0, 0.13, 1],
  },

  // Z-index layers — never deviate from these values.
  // Each layer has a documented semantic meaning.
  zIndex: {
    bg:      0,      // WebGL canvas, ambient blobs, particle fields
    mid:     5,      // Content decorations, section backgrounds
    content: 10,     // Page content (sections, cards, text)
    float:   20,     // Floating badges, tooltips, popovers
    nav:     99_999, // Navbar (fixed, always on top)
    cursor:  99_999, // Custom cursor (pointer-events: none)
    splash:  99_999, // Splash/loading screen (exits on load)
  },
} as const;

export type Theme = typeof theme;
