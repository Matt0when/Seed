# Seed Frontend Engineering Take-Home

Next.js project using the Pages router
- Feel free to modify file structure, create components, add tests, rename things, etc
- You can style however you'd like (e.g., styled-components, css modules, scss, etc)

## Getting Started

```bash
npm install
npm run dev
```

The app should be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `pages/` - Next.js pages (uses Pages Router)
- `pages/index.tsx` - Homepage at /
- `pages/_app.tsx` - App wrapper, imports a styles/globals.css
- `styles/globals.css` - Global CSS with SeedSans font face definitions
- `public/fonts/` - SeedSans font files
- `pages/_document.tsx` - Next.js _document, preloads SeedSans font files

## Design Tokens

Design tokens are imported through the @seed-health/tokens package, and they can be used
in a variety of ways. Here's some examples below, but they may need to be tweaked to function

### CSS Variables

```jsx
import '@seed-health/tokens/build/css/variables.css';
import '@seed-health/tokens/build/css/styles.css';

function Button() {
  return (
    <button
      className="text-fixed-body-medium"
      style={{
        backgroundColor: 'var(--color-primary-500)',
        padding: 'var(--spacing-medium)'
      }}>
      Click me
    </button>
  );
}
```

### JavaScript/TypeScript

```jsx
import * as tokens from '@seed-health/tokens';

function Button() {
  return (
    <button style={{
      ...tokens.FixedLabelMedium,
      padding: tokens.SpacingX2
    }}>
      Click me
    </button>
  );
}
```

### SCSS

```scss
@use '@seed-health/tokens/build/scss/variables' as *;
@use '@seed-health/tokens/build/scss/mixins' as *;

.button {
  @include text-fixed-label-medium;
  background-color: $color-primary-500;
  padding: $spacing-medium;
}
```

### CSS Modules

```css
.button {
  background-color: var(--color-primary-500);
  padding: var(--spacing-medium);
}
```

### Styled Components

```tsx
import { GlobalTokenStyles } from '@seed-health/tokens/react';

function App() {
  return (
    <>
      <GlobalTokenStyles />
      {/* Your app content */}
    </>
  );
}
```
