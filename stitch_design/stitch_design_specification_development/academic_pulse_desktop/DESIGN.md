---
name: Academic Pulse Desktop
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dae0'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f9'
  surface-container: '#E5EEFF'
  surface-container-high: '#e7e8ee'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#454650'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f6'
  outline: '#757682'
  outline-variant: '#c5c5d2'
  surface-tint: '#495aa0'
  primary: '#12266b'
  on-primary: '#ffffff'
  primary-container: '#2c3e82'
  on-primary-container: '#9bacf8'
  inverse-primary: '#b7c4ff'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#6df5e1'
  on-secondary-container: '#006f64'
  tertiary: '#422700'
  on-tertiary: '#ffffff'
  tertiary-container: '#603b00'
  on-tertiary-container: '#f49d09'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#304286'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
  success: '#10B981'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 64px
  section-gap: 80px
  component-padding-lg: 24px
  component-padding-md: 16px
---

## Brand & Style

The design system is an evolution of the "Academic-but-Friendly" personality, specifically optimized for high-productivity desktop environments. It balances the intellectual rigor of a research institution with the fluid responsiveness of modern SaaS. The style is **Modern Corporate** with a focus on **Minimalism**, prioritizing wide layout spans, expansive whitespace, and structural clarity to facilitate deep work and academic focus.

The desktop experience emphasizes a sense of "digital space"—avoiding the cramped feel of mobile-first ports. It uses a sophisticated interplay of deep indigos and soft teals to evoke a professional yet optimistic atmosphere. By utilizing a high-legibility typographic scale and refined UI boundaries, the system ensures that complex data and long-form research papers remain accessible and non-intimidating.

## Colors

The palette is anchored by **Deep Indigo (#2C3E82)**, which serves as the primary driver for brand identity, core actions, and navigational structure. **Warm Teal (#14B8A6)** acts as a secondary accent for progress indicators and success states, while **Amber (#F59E0B)** is utilized for alerts and high-priority metadata.

The desktop experience utilizes a layered neutral approach. The main background is a very light, cool-tinted blue-white to reduce glare on large monitors. Surface containers use slight tonal shifts (rather than borders) to separate functional areas like sidebars from the main content canvas. Text hierarchy is maintained through varying shades of slate and deep navy, ensuring high contrast for accessibility.

## Typography

This design system exclusively employs **Hanken Grotesk**. The typographic scale has been shifted upward for the desktop environment to ensure effortless legibility at typical viewing distances.

- **Scale Increase:** The base body size is established at 18px (`body-md`), ensuring that research content and data tables are comfortable to read over long durations.
- **Visual Rhythm:** Headlines use tighter tracking and increased leading to create clear structural breaks in content-heavy layouts.
- **Labels:** Meta-information (tags, authors, dates) uses the Medium and Semi-Bold weights to maintain presence without competing with primary body text.

## Layout & Spacing

The layout is built on a **12-column fixed-max grid** with a maximum container width of 1440px. This prevents line lengths from becoming too wide on ultra-wide monitors, preserving optimal reading ergonomics.

- **Generous Margins:** Desktop margins are increased to 64px to frame the content and provide visual "breathing room."
- **Desktop Grid Patterns:** 
  - **The Research Layout:** A 3-column split (2-column sidebar, 7-column main, 3-column utility).
  - **The Dashboard Layout:** Evenly spaced 4-column cards for resource discovery.
- **Spacing Rhythm:** Vertical spacing between major sections is doubled compared to mobile, using 80px gaps to signal distinct thematic shifts. Gutters are widened to 32px to ensure elements do not feel crowded.

## Elevation & Depth

Visual hierarchy is established primarily through **Tonal Layering** and **Ambient Shadows**. This approach minimizes visual noise while clearly defining interactive zones.

- **Tonal Stepping:** The background uses the neutral base, while primary content containers use the white "lowest" surface. Secondary sidebars or navigation drawers use a "surface-container" tint to recede visually.
- **Desktop Shadows:** Large containers like cards and modals utilize a highly diffused, multi-layered shadow (Blur: 24px, Spread: -4px, Opacity: 6%) that suggests a slight lift from the surface without being aggressive.
- **Interaction States:** Hover states on interactive cards should transition from a flat state to a slight shadow lift (2px Y-offset) accompanied by a subtle 1px border highlight in the primary indigo at 10% opacity.

## Shapes

The system uses a **Rounded (Level 2)** shape language to maintain the friendly academic aesthetic. On desktop, these radii are applied with precision to maintain a professional look.

- **Primary Containers:** Large cards and content blocks use a 1rem (16px) radius to soften the layout.
- **Input & Navigation:** Text inputs, search bars, and buttons use a 0.5rem (8px) radius for a more structured, tool-like feel.
- **Utility Elements:** Tooltips and small badges use the 0.25rem (4px) soft radius, while status chips remain fully pill-shaped to differentiate them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid Deep Indigo (#2C3E82) with White text. Large desktop padding (16px 32px).
- **Secondary:** Outlined 1.5px Indigo. Includes a soft indigo tint on hover.
- **Action Icons:** Ghost buttons with 8px radius for toolbar actions, using subtle slate colors that shift to indigo on focus.

### Cards & Data Containers
- White background with a 16px radius and a subtle 1px outline (#E5EEFF). 
- Inner padding is fixed at 24px (`lg`) for desktop to allow for complex internal layouts including metadata rows and action footers.

### Form Inputs
- Search bars feature a 48px height for desktop prominence. 
- Backgrounds are white with a 1px soft-gray border that transforms to a 2px Deep Indigo border on focus.

### Navigation Sidebar
- Vertical orientation with 280px fixed width.
- Active states use a "capsule" background in the primary indigo with white text, providing a clear "You are here" indicator.

### Data Tables
- Clean, borderless rows with 16px vertical padding. 
- Alternating row tints are avoided in favor of a subtle hover-highlight (Soft Teal at 5% opacity) to keep the interface feeling light and modern.