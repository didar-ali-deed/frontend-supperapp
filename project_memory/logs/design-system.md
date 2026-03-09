# SupperApp Design System — Reference

## Color Palette

### Neutral
| Token                    | Value     | Usage                    |
|--------------------------|-----------|--------------------------|
| --color-neutral-0        | #ffffff   | Pure white                |
| --color-neutral-50       | #fafafa   | Page backgrounds          |
| --color-neutral-100      | #f5f5f5   | Muted surfaces            |
| --color-neutral-200      | #e5e5e5   | Borders                   |
| --color-neutral-300      | #d4d4d4   | Strong borders            |
| --color-neutral-400      | #a3a3a3   | Muted text                |
| --color-neutral-500      | #737373   | Secondary text            |
| --color-neutral-600      | #525252   | Body text                 |
| --color-neutral-900      | #171717   | Primary text              |
| --color-neutral-950      | #0a0a0a   | Dark bg                   |

### Brand (Primary = Indigo)
| Token                   | Value     |
|-------------------------|-----------|
| --color-primary-50      | #eef2ff   |
| --color-primary-500     | #6366f1   |
| --color-primary-600     | #4f46e5   |
| --color-primary-700     | #4338ca   |

### Semantic
| Token                   | Value     |
|-------------------------|-----------|
| --color-success-500     | #10b981   |
| --color-warning-500     | #f59e0b   |
| --color-danger-500      | #ef4444   |

## Typography Scale

| Token           | Size   | Usage                  |
|-----------------|--------|------------------------|
| --text-2xs      | 10px   | Tiny labels            |
| --text-xs       | 12px   | Captions, badges       |
| --text-sm       | 14px   | Body, UI text          |
| --text-base     | 16px   | Default body           |
| --text-lg       | 18px   | Lead text              |
| --text-xl       | 20px   | Sub-headings           |
| --text-2xl      | 24px   | Section titles         |
| --text-3xl      | 30px   | Page headings          |
| --text-4xl      | 36px   | Hero headings          |
| --text-5xl      | 48px   | Display                |

## Spacing Scale
4px base unit. Steps: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 64, 80, 96px

## Components

### Button
Variants: `primary` | `default` | `destructive` | `outline` | `ghost` | `success` | `link`
Sizes: `xs` | `sm` | `md` | `lg` | `xl` | `icon` | `icon-sm` | `icon-lg`
Props: `loading`, `leftIcon`, `rightIcon`

### Input
- `Input` — text/email/password fields, supports `leftIcon`, `rightIcon`, `error`
- `Textarea` — multi-line, configurable `resize`
- `Select` — native select with custom chevron

### Form
- `Form` — form wrapper
- `FormField` — field container (label + input + error)
- `FormLabel` — accessible label with optional required marker
- `FormHint` — helper text below field
- `FormError` — validation error message with icon
- `FormSection` — group of related fields
- `FormActions` — submit/cancel row

### Card
Variants: `default` | `flat` | `outlined` | `interactive` | `primary`
Padding: `none` | `sm` | `md` | `lg`
Sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter
Special: `StatCard` — metric card for dashboards

### Modal
- `Modal` — full overlay with backdrop, Escape key, body scroll lock
- `ModalHeader` — title + optional description + close button
- `ModalBody` — padded content area
- `ModalFooter` — action row
- `ConfirmModal` — pre-built confirmation dialog
Sizes: `sm` | `md` | `lg` | `xl` | `full`

### Alert
Variants: `info` | `success` | `warning` | `danger` | `neutral`
Props: `title`, `onDismiss`

### Checkbox & Switch
- `Checkbox` — accessible, supports `indeterminate`, `label`, `description`, `error`
- `Switch` — toggle with smooth animation

### Avatar
Sizes: `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl`
Shapes: `circle` | `square`
`AvatarGroup` — stacked with overflow count

### Badge
Variants: `default` | `primary` | `secondary` | `success` | `warning` | `danger` | `outline`
Sizes: `sm` | `md` | `lg`
Prop: `dot` — adds a colored status dot

### Tabs
- `Tabs` + `TabList` + `Tab` + `TabPanel` — pill/box style
- `TabListUnderline` + `TabUnderline` — underline style (page nav)

### Typography
- `Heading` — h1-h6 with scale
- `Text` — with size/weight/color variants
- `Code` — inline code block
- `Lead` — intro paragraph
- `Muted` — secondary text

### Feedback
- `Spinner` / `LoadingScreen`
- `Skeleton` / `SkeletonText` / `SkeletonCard` / `SkeletonAvatar`
- `EmptyState` — zero-data placeholder
- `Divider` — horizontal or vertical with optional label
