# Button Component

A comprehensive, customizable button component for React Native with support for multiple variants, colors, shapes, and sizes.

## Features

- **Multiple Variants**: solid, outlined, ghost, text
- **Color Schemes**: primary, secondary, success, warning, error, neutral
- **Shapes**: rounded, pill, square
- **Sizes**: small (sm), medium (md), large (lg)
- **Icon Support**: Phosphor icons with customizable size and weight
- **Loading State**: Built-in loading indicator
- **Disabled State**: Proper disabled styling
- **Full Width**: Option to make button full width
- **Custom Styling**: Support for custom styles and text styles

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Button text |
| `subtitle` | `string` | - | Secondary text below title |
| `icon` | `PhosphorIcon` | - | Icon component from phosphor-react-native |
| `iconSize` | `number` | Auto | Custom icon size (overrides size-based sizing) |
| `iconWeight` | `IconWeight` | `'regular'` | Icon weight (thin, light, regular, bold, fill, duotone) |
| `onPress` | `() => void` | - | Press handler |
| `isIconOnly` | `boolean` | `false` | Show only icon without text |
| `variant` | `ButtonVariant` | `'solid'` | Button style variant |
| `color` | `ButtonColor` | `'primary'` | Button color scheme |
| `shape` | `ButtonShape` | `'rounded'` | Button shape |
| `size` | `ButtonSize` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `loading` | `boolean` | `false` | Show loading state |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `style` | `ViewStyle` | - | Custom button styles |
| `textStyle` | `TextStyle` | - | Custom text styles |

## Variants

### Solid (Default)
Filled button with background color and white text.

```tsx
<Button title="Solid Button" variant="solid" color="primary" />
```

### Outlined
Button with border and transparent background.

```tsx
<Button title="Outlined Button" variant="outlined" color="primary" />
```

### Ghost
Button with light background and colored text.

```tsx
<Button title="Ghost Button" variant="ghost" color="primary" />
```

### Text
Minimal button with only text, no background or border.

```tsx
<Button title="Text Button" variant="text" color="primary" />
```

## Colors

Available color schemes that work with all variants:

- `primary` - Brand blue color
- `secondary` - Neutral gray color
- `success` - Green color for success actions
- `warning` - Orange color for warnings
- `error` - Red color for errors
- `neutral` - Light gray color

```tsx
<Button title="Success" color="success" />
<Button title="Warning" color="warning" />
<Button title="Error" color="error" />
```

## Shapes

### Rounded (Default)
Standard rounded corners (12px border radius).

```tsx
<Button title="Rounded" shape="rounded" />
```

### Pill
Fully rounded button (50px border radius).

```tsx
<Button title="Pill" shape="pill" />
```

### Square
Minimal rounded corners (4px border radius).

```tsx
<Button title="Square" shape="square" />
```

## Sizes

### Small (sm)
Compact button for tight spaces.

```tsx
<Button title="Small" size="sm" />
```

### Medium (md) - Default
Standard button size.

```tsx
<Button title="Medium" size="md" />
```

### Large (lg)
Prominent button for important actions.

```tsx
<Button title="Large" size="lg" />
```

## Icon Support

### Icon with Text
```tsx
import { Plus } from "phosphor-react-native";

<Button 
  title="Add Item" 
  icon={Plus} 
  onPress={() => console.log('Pressed')} 
/>
```

### Icon Only
```tsx
<Button 
  icon={Plus} 
  isIconOnly 
  onPress={() => console.log('Pressed')} 
/>
```

### Custom Icon Size and Weight
```tsx
<Button 
  title="Custom Icon" 
  icon={Plus} 
  iconSize={32} 
  iconWeight="bold" 
/>
```

## States

### Loading State
```tsx
<Button 
  title="Loading..." 
  loading={true} 
  onPress={() => {}} 
/>
```

### Disabled State
```tsx
<Button 
  title="Disabled" 
  disabled={true} 
  onPress={() => {}} 
/>
```

## Full Width
```tsx
<Button 
  title="Full Width Button" 
  fullWidth 
  onPress={() => {}} 
/>
```

## Custom Styling
```tsx
<Button 
  title="Custom Style" 
  style={{ marginTop: 20 }}
  textStyle={{ fontFamily: 'CustomFont' }}
/>
```

## Complete Examples

### Primary Action Button
```tsx
<Button 
  title="Save Changes" 
  variant="solid" 
  color="primary" 
  size="lg" 
  fullWidth 
  onPress={handleSave} 
/>
```

### Secondary Action Button
```tsx
<Button 
  title="Cancel" 
  variant="outlined" 
  color="neutral" 
  onPress={handleCancel} 
/>
```

### Success Button with Icon
```tsx
import { Check } from "phosphor-react-native";

<Button 
  title="Success" 
  icon={Check} 
  variant="solid" 
  color="success" 
  onPress={handleSuccess} 
/>
```

### Warning Button
```tsx
<Button 
  title="Delete" 
  variant="outlined" 
  color="error" 
  onPress={handleDelete} 
/>
```

### Ghost Button with Subtitle
```tsx
<Button 
  title="Learn More" 
  subtitle="Discover new features" 
  variant="ghost" 
  color="primary" 
  onPress={handleLearnMore} 
/>
```

## TypeScript Support

The component is fully typed with TypeScript. You can import the types:

```tsx
import Button, { ButtonProps, ButtonVariant, ButtonColor, ButtonShape, ButtonSize } from './Button';
```

## Accessibility

The button component includes proper accessibility features:
- Touch target meets minimum size requirements
- Proper contrast ratios for all color combinations
- Loading and disabled states are properly communicated
- Icons are properly labeled when used with text

## Design System Integration

The button component uses the app's design system colors and follows consistent spacing and typography patterns. All colors are pulled from the theme configuration, ensuring consistency across the application.
