# V0 Mobile/PWA Design Prompt for NFA Bears MVP

## 🎯 Project Context
**NFA Bears** is a Grateful Dead-inspired Web3 community app focusing on authentic IRL connections. The motto is "Fuck crypto, real family shit" - this is anti-speculation, community-first culture preservation using Web3 tools.

**Current Status**: Fully functional MVP with security improvements, now needs mobile-first PWA optimization.

## 🎨 Design Language & Brand Identity

### Color Palette
```css
--primary: #ff3366 (hot pink/red - brand color)
--secondary: #1a1aff (electric blue)
--accent: #ffff00 (bright yellow)
--success: #00ff88 (neon green) 
--background: #000011 (deep space blue)
--text: #ffffff (white)
--text-muted: rgba(255,255,255,0.7)
```

### Visual Style
- **Psychedelic glassmorphic** aesthetic with Grateful Dead parking lot vibes
- **Liquid morphing animations** and **spiral backgrounds**
- **Neon glow effects** on text and buttons  
- **Tie-dye gradients** and **fractal patterns**
- **Mobile-first** with large touch targets (min 44px)

### Typography
- **Headers**: Bold, glowing text with psychedelic effects
- **Body**: Clean, readable sans-serif (system-ui)
- **Accent**: Grateful Dead-style decorative fonts for special elements

## 📱 Mobile PWA Requirements

### 1. App Shell Architecture
Create a **mobile-first app shell** with:
- **Bottom navigation bar** with 4 core sections:
  - 🏠 **Home** (landing/auth)
  - 📱 **Scan** (QR scanner)  
  - 🎪 **Dashboard** (member area)
  - 👤 **Profile** (wallet/settings)
- **Sticky header** with wallet connection status
- **Full-screen modals** for critical flows
- **Touch-optimized gestures** (swipe, pull-to-refresh)

### 2. Key Mobile Screens to Design

#### A. **Mobile Home/Landing**
- **Full-screen hero** with psychedelic background
- **Large CTA button** for wallet connection (Privy)
- **"Miracle SBT" onboarding** with visual explanation
- **Community stats** in cards (total members, recent activity)

#### B. **QR Scanner Interface** 
- **Full-screen camera view** with overlay
- **Scanning target** with animated border
- **Permission states**: Camera access, location access
- **Success/error feedback** with haptic feedback
- **Manual code entry fallback**

#### C. **Member Dashboard Mobile**
- **Card-based layout** with swipeable sections:
  - 🎫 **Your SBT** (membership card visual)
  - 🎪 **Events** (upcoming shows, meetups)
  - 💰 **Discounts** (vendor benefits)
  - 🤝 **Community** (recent activity)
- **Floating action button** for invite generation

#### D. **Invite Generation Flow**
- **Venue selection** with map integration
- **GPS verification** with live location display  
- **QR code generation** with save/share options
- **Timer display** for 15-minute expiry
- **Success animations** with share capabilities

#### E. **Genesis Dashboard** (Premium Users)
- **Enhanced member card** with special styling
- **DAO voting interface** optimized for mobile
- **Advanced metrics** with data visualizations
- **Miracle generation** with enhanced permissions

### 3. PWA-Specific Features

#### Touch Interactions
- **Large touch targets** (minimum 44x44px)
- **Haptic feedback** for important actions
- **Pull-to-refresh** on data screens  
- **Swipe gestures** for navigation
- **Long-press menus** for power users

#### Offline Capabilities  
- **Cached membership status**
- **Offline QR code scanning**
- **Background sync** for when connection returns
- **Offline indicator** with retry mechanisms

#### Native App Feel
- **Custom splash screen** with NFA Bears branding
- **Status bar styling** to match app theme
- **Safe area handling** for notched devices
- **Keyboard avoidance** for forms

## 🔧 Technical Implementation Notes

### Component Architecture Requests
Focus on these **mobile-optimized components**:

1. **`<MobileAppShell>`** - Bottom nav + header layout
2. **`<QRScannerMobile>`** - Full-screen camera interface  
3. **`<MobileCard>`** - Touch-optimized card component
4. **`<TouchButton>`** - Large, accessible button component
5. **`<MobileModal>`** - Full-screen modal with slide animations
6. **`<LocationPermission>`** - GPS access flow component
7. **`<MobileDashboard>`** - Swipeable dashboard layout
8. **`<ShareSheet>`** - Native-style sharing interface

### Responsive Breakpoints
```css
/* Mobile First Approach */
sm: '640px'   // Large phones, small tablets
md: '768px'   // Tablets  
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
```

### Animation & Interactions
- **Framer Motion** for page transitions
- **CSS transforms** for touch feedback
- **Intersection Observer** for scroll animations
- **Lottie animations** for loading states

## 🎪 User Experience Flows

### Core Mobile Journey
1. **Landing** → Large "Connect Wallet" button
2. **Auth Flow** → Privy mobile-optimized login  
3. **Onboarding** → SBT explanation with animations
4. **Dashboard** → Card-based member interface
5. **Scan Flow** → One-tap QR scanner launch
6. **Miracle Flow** → GPS → Scan → Mint → Success

### Error Handling
- **Network offline** → Friendly retry interface
- **GPS denied** → Clear permission request flow  
- **Camera denied** → Manual entry fallback
- **Rate limited** → Timer with retry countdown

## 🏗️ v0 Design Tasks Priority

### High Priority (Pay-per-use focus)
1. **Mobile App Shell** with bottom navigation
2. **QR Scanner Interface** with camera overlay
3. **Mobile Dashboard** with swipeable cards
4. **Touch-optimized buttons** and forms
5. **Permission flows** for camera/GPS

### Medium Priority  
6. **Invite generation flow** mobile UI
7. **Member card** visual design
8. **Loading states** and animations
9. **Error state** designs
10. **Share interfaces** for QR codes

### Visual Design Focus
- **Psychedelic glassmorphic** component library
- **Neon glow effects** and gradients
- **Mobile-first responsive** layouts
- **Touch feedback** animations
- **Brand-consistent** color usage

## 📋 Deliverables Expected

1. **Mobile app shell** component with navigation
2. **QR scanner interface** with camera overlay
3. **Mobile dashboard** layout with cards  
4. **Permission flow** screens (camera, GPS)
5. **Touch-optimized** button and form components
6. **Mobile-first** responsive breakpoint system
7. **Loading/error state** designs
8. **Component documentation** for implementation

## 💡 v0 Strengths to Leverage

- **Visual design system** creation
- **Component library** development  
- **Responsive layouts** with Tailwind
- **Interactive prototypes** with animations
- **Mobile-first** design patterns
- **Accessibility** considerations
- **Design tokens** and theming

Focus on creating a **cohesive mobile design system** that captures the psychedelic Deadhead aesthetic while being highly functional for Web3 interactions on mobile devices.

The technical implementation (API integration, Web3 logic, PWA service worker) will be handled separately - v0 should focus on the **visual design language** and **user experience flows** that make this app feel native and engaging on mobile.

**Remember**: This is about preserving authentic community culture through technology - the design should feel warm, welcoming, and anti-corporate while being technically sophisticated.