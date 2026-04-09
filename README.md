<<<<<<< HEAD


# Interactive Wall Calendar Component

A polished, interactive Web Component built with **Next.js** and **React**, balancing aesthetics and functionality, designed for the Frontend Engineering Challenge.

## ✨ Features & Architecture

This component satisfies all baseline challenge requirements and includes a few "Stand Out" creative additions:

*   **Wall Calendar Aesthetic:** Uses layout, spacing, and CSS drop-shadows alongside a prominent image (`hero-image.png`) to emulate the physical hanging presence of a spiral-bound wall calendar.
*   **Day Range Selector:** Users can click a start and end date to select a range smoothly. Hovering across dates highlights the span dynamically using CSS properties, and days within the bounds turn light blue while start/end points stand out solid.
*   **Integrated Notes Section:** A tightly responsive note section handles input tied exactly to a user's selection (Default Month notes, Single-Day notes, or Date Range notes). 
*   **Strictly Frontend:** Adhering strictly to constraints, note data is persisted persistently yet gracefully entirely client-side using `localStorage`. No backend database is required.
*   **Fully Responsive:** Designed meticulously to show a split side-by-side view on desktop monitors, scaling down via dynamic CSS transform values on smaller mobile devices to preserve advanced flip animations without clunky layout reflows.

**Creative Liberty (Stand Out Features):**
*   **Holographic 3D Tilt:** The hero text box tracks the mouse cursor via `framer-motion`, resulting in a dynamic physical 3D tilt effect across the UI element, complete with responsive digital light glare.
*   **180-Degree Page Flip:** Pressing `Next` or `Previous` fires a spring-physics 180° page flip animation, literally rotating the calendar out of your way and dropping the new month into view.
*   **Continuous Particle Snowfall:** A deterministic animated snowfall drifts down inside the Hero Image perimeter.

## 🛠 Tech Stack
*   **Next.js (App Router)** - React framework
*   **TypeScript** - Type safety
*   **Framer Motion** - Interaction animations and 3D effects
*   **Lucide React** - UI Icons
*   **Vanilla CSS / Inline styles** - Core styling relying on custom hooks and mathematical transforms

=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 57a6604 (Initial commit)
