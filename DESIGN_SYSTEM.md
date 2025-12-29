# Smart Farm Platform - Design System

## Overview

This document defines the standard design system for the Smart Farm IoT Platform, ensuring consistency across all pages.

---

## Theme

### Core Concept
**Glassmorphism + Neon + Smooth Animations**

### Color Palette

**Primary Colors:**
- Emerald: `#10b981` (green-500)
- Teal: `#0f766e` (teal-700)
- Green: `#22c55e` (green-500)

**Gradients:**
```css
/* Primary Gradient */
from-emerald-300 via-teal-200 to-emerald-300

/* Background Gradient */
from-emerald-900 via-teal-800 to-emerald-950
```

**Neon Colors (for cards):**
- Temperature: `from-red-400 via-orange-400 to-yellow-400`
- Humidity: `from-blue-400 via-cyan-400 to-teal-400`
- Soil: `from-green-400 via-emerald-400 to-teal-400`
- Light: `from-yellow-400 via-amber-400 to-orange-400`
- pH: `from-purple-400 via-pink-400 to-rose-400`
- TDS: `from-teal-400 via-cyan-400 to-blue-400`

---

## Components

### 1. PageLayout
**Location:** `components/layout/PageLayout.tsx`

**Usage:**
```tsx
import PageLayout from '@/components/layout/PageLayout';

export default function MyPage() {
  return (
    <PageLayout title="Page Title" subtitle="Optional subtitle">
      {/* Your content */}
    </PageLayout>
  );
}
```

**Features:**
- Animated background (blob animations)
- Navigation bar with logo
- Responsive menu
- Footer

---

### 2. Card Components
**Location:** `components/ui/Card.tsx`

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card neonColor="from-emerald-400 to-teal-500" delay="0">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
</Card>
```

**Props:**
- `neonColor`: Gradient for hover glow effect
- `delay`: Animation delay in ms (for staggered animations)

---

### 3. Button Component
**Location:** `components/ui/Button.tsx`

**Usage:**
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

**Variants:**
- `primary`: Emerald gradient
- `secondary`: Glass with border
- `danger`: Red gradient

**Sizes:**
- `sm`: Small
- `md`: Medium (default)
- `lg`: Large

---

## CSS Classes

### Glass Effects

**`.glass`**
```css
background: rgba(10, 10, 10, 0.6);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

**`.glass-card`**
```css
/* Same as .glass but with padding and rounded corners */
padding: 1.5rem;
border-radius: 0.75rem;
```

---

### Animations

**Blob Animation** (Background)
```css
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-blob {
  animation: blob 7s infinite;
}
```

**Float Animation** (Icons)
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

**Fade In Up** (Cards)
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}
```

**Gradient Animation** (Text)
```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}
```

---

## Typography

### Headings
```tsx
// Page Title
<h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent animate-gradient">
  Title
</h1>

// Section Title
<h2 className="text-2xl font-bold text-emerald-200">
  Section
</h2>

// Card Title
<h3 className="text-xl font-semibold text-emerald-300">
  Card Title
</h3>
```

### Body Text
```tsx
// Primary text
<p className="text-emerald-100/90">Content</p>

// Secondary text
<p className="text-emerald-200/70">Subtitle</p>

// Muted text
<p className="text-emerald-200/50">Helper text</p>
```

---

## Spacing

**Standard spacing scale:**
- Gap between cards: `gap-6` (1.5rem)
- Card padding: `p-6` (1.5rem)
- Section margin: `mb-6` (1.5rem)
- Page padding: `p-4 md:p-8`

---

## Responsive Design

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Grid Layouts:**
```tsx
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## Animation Delays

For staggered card animations:
```tsx
<Card delay="0">...</Card>
<Card delay="100">...</Card>
<Card delay="200">...</Card>
<Card delay="300">...</Card>
```

---

## Best Practices

### 1. Always use PageLayout
```tsx
// ✅ Good
export default function MyPage() {
  return (
    <PageLayout title="My Page">
      <Card>Content</Card>
    </PageLayout>
  );
}

// ❌ Bad
export default function MyPage() {
  return <div>Content</div>;
}
```

### 2. Use Card components for content blocks
```tsx
// ✅ Good
<Card neonColor="from-emerald-400 to-teal-500">
  <CardTitle>Title</CardTitle>
  <CardContent>Content</CardContent>
</Card>

// ❌ Bad
<div className="p-4 bg-white">Content</div>
```

### 3. Add neon colors to important cards
```tsx
// ✅ Good - Adds visual hierarchy
<Card neonColor="from-emerald-400 to-teal-500">
  Important content
</Card>

// ⚠️ OK - For less important content
<Card>
  Regular content
</Card>
```

### 4. Use animation delays for lists
```tsx
// ✅ Good - Staggered animation
{items.map((item, i) => (
  <Card key={item.id} delay={`${i * 100}`}>
    {item.content}
  </Card>
))}
```

---

## Examples

### Dashboard Page
See: `app/dashboard/page.tsx`

### Documentation Page
See: `app/docs/page.tsx`

### Homepage
See: `app/page.tsx`

---

**Last Updated**: 2025-12-29  
**Version**: 1.0
