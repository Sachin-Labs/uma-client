# SINA People Design System

Welcome, **UI/UX Designers**! This document outlines the aesthetic foundations of the SINA People project. 

## Design Philosophy
SINA People is designed to feel **Premium, Modern, and Reliable**. We use a minimal interface with high-contrast elements, subtle micro-interactions, and a "Glassmorphism" aesthetic for overlays.

## Color Palette

We use HSL-tailored colors for perfect harmony. These are defined as CSS variables in `src/index.css`.

### Core Colors
| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--accent` | Vibrant Indigo | Soft Teal | Brand colors, Primary buttons |
| `--background`| Pure White | Deep Obsidian | Page backgrounds |
| `--surface` | Light Gray | Charcoal | Cards, sidebars, header |
| `--bright` | Black | White | Headings, primary text |
| `--dim` | Slate | Ash | Secondary text, labels |

## Typography

We use a modern, geometric sans-serif stack:
- **Font**: `Inter` (Primary), `Geist` (Modern accents)
- **Weights**: 
  - `400`: Body text
  - `600`: Subheadings, button text
  - `700`: Main headings (tracking: `-0.02em`)

## UI Components

### 1. The "Auth Card"
The card used for Login/Register is designed with:
- `backdrop-blur: 12px`
- `border: 1px solid rgba(255,255,255,0.1)`
- `box-shadow: 0 10px 40px rgba(0,0,0,0.1)`

### 2. Status Indicators
| Status | Color | Usage |
| :--- | :--- | :--- |
| **Approved** | Green-500 | Successful attendance, Approved leave |
| **Pending** | Amber-500 | Awaiting HR review |
| **Rejected** | Rose-500 | Boundary failure, Declined leave |

## Iconography
We exclusively use **Lucide-React**. Icons should be:
- `size={18}` for navigation items
- `size={24}` for large status cards
- `strokeWidth={2}` for consistent weights

---
**Designer's Tip:**
When adding new pages, prioritize "Whitespace." SINA People should feel airy and focused on one task at a time.
