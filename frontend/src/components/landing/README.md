# SignConnect Landing Page

A high-end, aesthetic landing page built with React, Tailwind CSS, and Framer Motion.

## Features

### Design
- **Glassmorphism Theme**: Soft pastel blue and lavender color scheme
- **Animated Gradient Background**: Mesh gradient with floating blurred orbs
- **Modern Typography**: Inter and Outfit fonts for a clean, modern look

### Interactive Elements
- **Fade-in-up Animations**: All text elements animate on page load
- **Feature Preview Cards**: Interactive glassmorphic cards showcasing key features
- **AI Status Badge**: Floating badge indicating "Live Detection Ready" with pulse animation
- **Shimmer Effect**: Main CTA button has an animated shimmer effect

### Components
- **Hero Section**: Bold heading and sub-headline with CTA buttons
- **Feature Cards**: Real-time Recognition, HD Video Calls, Global Accessibility
- **Stats Section**: Key metrics with animated counters
- **Bottom CTA**: Final call-to-action with glassmorphic styling

### Accessibility
- High contrast text over pastel backgrounds
- Hover scale effects on all interactive elements
- Semantic HTML structure
- Keyboard navigation support

## Usage

The landing page is automatically displayed when users visit the root URL (`/`). 

### Navigation
- **Get Started** button → Redirects to `/login`
- **Watch Demo** button → Can be configured to show demo video/modal

## Customization

### Colors
The color scheme uses Tailwind CSS classes and can be easily modified:
- Primary: Blue (blue-400 to blue-600)
- Secondary: Purple (purple-400 to purple-600)
- Accent: Pink (pink-400 to pink-600)

### Animations
All animations are built with Framer Motion and can be customized by modifying the motion components' props.

### Content
Text content, stats, and feature descriptions can be easily updated in the component file.