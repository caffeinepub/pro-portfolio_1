# Professional Portfolio Website

## Current State
Empty project. No existing application files.

## Requested Changes (Diff)

### Add
- Full portfolio website with 7 sections: Header/Nav, Hero, About, Projects, Services, Contact, Footer (no Experience Timeline)
- Admin editing mode: click-to-edit for all text fields, inline section editors
- Backend storage for all portfolio data (profile, projects, services, contact info, social links)
- Contact form with submission storage
- Image upload for profile photo and project thumbnails (blob-storage)
- Authorization for admin panel (only owner can edit)
- Dark theme with light/dark mode toggle
- Drag-and-drop project reordering
- Mobile-responsive layout with hamburger menu

### Modify
- N/A (new project)

### Remove
- Experience Timeline section (removed per user request)

## Implementation Plan

### Backend (Motoko)
- `PortfolioData` stable store: profile (name, titles, bio, email, phone, socialLinks, accentColor), skills[], projects[], services[], contactSubmissions[]
- CRUD for projects (add, update, delete, reorder)
- CRUD for services (add, update, delete)
- CRUD for skills (add, remove)
- Update profile info
- Add contact submission (public), get submissions (admin only)
- Authorization: owner-only write operations

### Frontend Components
1. **Nav** - sticky top nav, smooth scroll links, hamburger on mobile, admin toggle button
2. **Hero** - name, animated titles, CTA button, gradient background
3. **About** - bio text, skills badges, profile photo
4. **Projects** - card grid, drag-to-reorder, add/edit/delete modals, image upload
5. **Services** - icon cards, add/edit/delete
6. **Contact** - contact form (stores submissions), editable social links
7. **Footer** - auto year, social links, quick nav
8. **AdminBar** - floating edit mode toggle, theme/accent customizer
