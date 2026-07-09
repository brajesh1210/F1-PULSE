---
name: F1 Pulse Cinema
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e9bcb5'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8781'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#680200'
  primary-container: '#e10600'
  on-primary-container: '#fff2f0'
  inverse-primary: '#c00500'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c8c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#717070'
  on-tertiary-container: '#f8f5f4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#930300'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Anybody
    fontSize: 96px
    fontWeight: '800'
    lineHeight: 100%
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Anybody
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 110%
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Anybody
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 110%
    letterSpacing: 0.02em
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 140%
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 160%
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 160%
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 100%
    letterSpacing: 0.15em
spacing:
  base: 8px
  section-gap-desktop: 160px
  section-gap-mobile: 80px
  grid-margin: 64px
  gutter: 24px
---

## Brand & Style
The design system is engineered to evoke the high-stakes, adrenaline-fueled atmosphere of elite motorsport through a **Cinematic Dark** aesthetic. It prioritizes a high-budget documentary feel, utilizing deep contrast and dramatic lighting to frame the technical precision of Formula 1. 

The style combines **Minimalism** with **Glassmorphism** to create a sense of depth and luxury. Layouts should feel expansive, mirroring the scale of a racetrack, while UI elements remain sharp and disciplined. Visual interest is driven by high-quality photography treated with dark gradient overlays, allowing the "Racing Red" accent to serve as a high-velocity signal through the dark environment.

## Colors
This design system operates on a "Midnight-to-Flash" palette. The core environment is built on **Deep Black (#0A0A0A)** to ensure infinite depth on modern displays. 

- **Primary (Racing Red):** Used sparingly for critical calls to action, active states, and "velocity indicators" (thin borders or glows).
- **Surface & Glass:** Surface levels use **#1A1A1A** with varying levels of opacity (60-80%) and a `20px` backdrop blur to maintain the glassmorphic aesthetic.
- **Typography Colors:** Pure White (#FFFFFF) is reserved for primary headlines to maximize impact. Subtext uses **#CCCCCC** to reduce visual noise and maintain the cinematic hierarchy.

## Typography
Typography is a structural element in this design system. We utilize **Anybody** for headlines due to its aggressive, variable-width nature that feels mechanical and fast. Headlines must always be uppercase with increased letter spacing to mimic cinematic title cards.

**Hanken Grotesk** provides a clean, modern contrast for body copy, ensuring technical specifications remain legible. **JetBrains Mono** is used for "technical labels" (lap times, sector data, navigation hints), reinforcing the engineering-led nature of the sport.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop (12 columns, 1440px max-width) to maintain a premium, editorial feel. Massive vertical breathing room (160px gaps) between sections is required to allow high-resolution imagery to "breathe" and prevent the UI from feeling cramped.

On mobile, the system transitions to a 4-column fluid layout with 20px margins. Elements should favor vertical stacking with heavy use of horizontal "peek" scrolling for card collections (like driver lineups or track maps) to maintain momentum.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional drop shadows.

- **Level 0 (Floor):** Pure #0A0A0A background.
- **Level 1 (Card/Surface):** #1A1A1A with 70% opacity, 20px backdrop blur, and a 1px inner border of white at 10% opacity.
- **Level 2 (Active/Hover):** Add a subtle **Red Outer Glow** (hex: #E10600, blur: 15px, spread: -5px) to simulate the heat of a brake disc or the glow of a tail light. 

Shadows, if used, should be ultra-diffused and tinted with the primary red color at very low (5-8%) opacity to create an ambient "under-car" glow.

## Shapes
This design system utilizes **Sharp (0px)** corners for all structural elements. The sharp-edge philosophy reflects the precision engineering of carbon-fiber aerodynamic components. 

The only exception to the sharp-edge rule is for circular progress indicators or "Pill" style tags used exclusively for status indicators (e.g., "LIVE" or "TRACK LIMITS"), which should use the `rounded-full` property to stand out as dynamic UI elements.

## Components

### Buttons
- **Primary:** Sharp-edged, solid #E10600. Text is white, uppercase, using `label-caps`. Hover state triggers a horizontal "sheen" animation across the surface.
- **Ghost:** Sharp-edged, 1px white border (20% opacity). On hover, the border becomes 100% white and the background fills with a 10% white tint.

### Cards
Cards must utilize the glassmorphic treatment defined in Elevation. Content should be bottom-aligned to allow the top half of the card to showcase photography. Use a 1px red "racing stripe" on the left or top edge to denote featured content.

### Inputs
Text fields are bottom-border only (2px white at 20% opacity). When focused, the border turns Racing Red and a subtle red glow emanates from the line. Labels use `label-caps` and sit above the line.

### Interaction Details
- **Sliding Underlines:** Navigation links should feature a red underline that slides in from the left and expands on hover.
- **Pulsing Glows:** Live data points (e.g., current speed or interval) should have a soft, rhythmic red outer glow.
- **Photo Overlays:** All background imagery must have a 40% black overlay and a bottom-to-top gradient to ensure text readability.