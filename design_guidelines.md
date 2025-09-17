# Habit Tracker Design Guidelines

## Design Approach
**System-Based Approach**: Using Material Design principles adapted for productivity applications, emphasizing clarity, consistency, and user motivation through visual feedback.

## Core Design Elements

### Color Palette
**Dark Mode Primary**:
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Primary: 200 100% 60%
- Success: 140 60% 50%
- Warning: 35 85% 55%
- Accent (sparingly): 280 70% 65%

**Light Mode Primary**:
- Background: 210 20% 98%
- Surface: 210 15% 95%
- Primary: 200 85% 45%
- Success: 140 50% 40%
- Warning: 35 75% 45%

### Typography
- **Primary**: Inter via Google Fonts
- **Secondary**: JetBrains Mono for numerical data and streaks
- Hierarchy: text-xs through text-3xl for consistent scaling

### Layout System
**Tailwind Spacing Units**: Use 2, 4, 6, 8, 12, 16 as core spacing primitives
- Micro spacing: p-2, gap-2
- Component spacing: p-4, m-6, gap-4
- Section spacing: p-8, mb-12, gap-8
- Large spacing: p-16 for major sections

### Component Library

#### Navigation
- Top navigation bar with user profile dropdown
- Sidebar navigation for main sections (Dashboard, Goals, Progress, Profile)
- Breadcrumb navigation for deeper pages

#### Goal Management
- Goal cards with progress rings and streak counters
- Inline editing with save/cancel states
- Category tags with color coding
- Quick-add floating action button

#### Progress Visualization
- Circular progress indicators for completion percentage
- Linear progress bars for time-based goals
- Streak flame icons with numerical counters
- Calendar heatmaps for long-term visualization

#### Data Display
- Statistics cards with large numerical displays
- Achievement badges with subtle animations
- Recent activity feed with timestamps
- Goal completion history tables

#### Forms & Inputs
- Floating label inputs with validation states
- Date/time pickers for goal scheduling
- Toggle switches for goal activation
- Multi-select dropdowns for categories

#### Motivational Elements
- Congratulatory toast notifications
- Progress celebration modals
- Inspirational quote cards
- Achievement unlock animations (subtle)

### Interactions & Feedback
- Hover states on all interactive elements
- Loading skeletons for data fetching
- Success animations for goal completions
- Gentle micro-animations on progress updates
- Haptic feedback indicators for mobile

### Layout Structure
- Dashboard with grid-based goal overview
- Individual goal detail pages with comprehensive stats
- Profile page with user achievements and settings
- Authentication pages with centered, minimal design

### Motivational Design Strategy
- Use progress visualization to create dopamine feedback loops
- Warm colors for achievements and streaks
- Clean, uncluttered interface to reduce cognitive load
- Prominent display of current streaks and milestones
- Visual hierarchy emphasizing positive reinforcement over failures

The design should feel like a personal coach—encouraging, clear, and focused on helping users build and maintain positive habits through thoughtful visual design and interaction patterns.