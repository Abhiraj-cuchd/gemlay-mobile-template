# 🏗️ Gemlay Mobile - Technical Documentation

> Enterprise-grade React Native e-commerce application for jewelry shopping

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Core Concepts](#-core-concepts)
- [Development Workflow](#-development-workflow)
- [Code Quality](#-code-quality)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Real-time Features](#-real-time-features)
- [Styling System](#-styling-system)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

### Core Framework

- **React Native** (via Expo SDK) - Cross-platform mobile development
- **Expo Router** - File-based routing with deep linking support
- **TypeScript** - Type-safe development

### State Management

- **Redux Toolkit** - Global state management (auth, cart, preferences)
- **TanStack Query (React Query)** - Server state, caching, and data fetching

### UI & Styling

- **NativeWind v4** - Tailwind CSS for React Native
- **React Native Reanimated** - Smooth animations
- **Moti** - Declarative animations
- **FlashList** - High-performance lists

### Networking

- **Axios** - HTTP client with interceptors
- **Socket.IO Client** - Real-time bidirectional communication

### Code Quality

- **ESLint v9** - Code linting with flat config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitlint** - Conventional commit messages

### Build & Deployment

- **Expo EAS Build** - Cloud building and OTA updates
- **GitLab CI/CD** - Continuous integration and deployment

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- **Git** >= 2.x
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (Mac only) or **Android Studio** with Android Emulator
- **Expo Go** app on your physical device (optional)

### Development Tools (Recommended)

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - React Native Tools

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd gemlay-mobile
```

### 2. Install Dependencies

```bash
npm install
```

[//]: # "### 3. Environment Setup"
[//]: #
[//]: # "Create `.env` file in the root directory:"
[//]: # "```bash"
[//]: # "cp .env.example .env"
[//]: # "```"
[//]: #
[//]: # "Update the following variables:"
[//]: # "```env"
[//]: # "# API Configuration"
[//]: # "API_BASE_URL=https://api.testgemlay.com"
[//]: # "API_TIMEOUT=30000"
[//]: #
[//]: # "# Socket.IO"
[//]: # "SOCKET_URL=https://socket.testgemlay.com"
[//]: #
[//]: # "# Razorpay"
[//]: # "RAZORPAY_KEY_ID=your_razorpay_key"
[//]: # "RAZORPAY_KEY_SECRET=your_razorpay_secret"
[//]: #
[//]: # "# Environment"
[//]: # "NODE_ENV=development"
[//]: # "```"

### 4. Start Development Server

```bash
# Start Expo dev server
npm start

# Run on iOS Simulator (Mac only)
npm run ios

# Run on Android Emulator
npm run android

# Run on web browser
npm run web
```

### 5. Verify Setup

Open the app and you should see the home screen with styled components. If NativeWind styles are not applied, run:

```bash
npx expo start -c
```

---

## 🏛️ Project Architecture

This project follows a **modular, feature-based architecture** with clear separation of concerns.

### Architecture Principles

1. **Modularity** - Each feature is self-contained in its own module
2. **Separation of Concerns** - UI, business logic, and data layers are separated
3. **Reusability** - Common components and utilities are shared across features
4. **Type Safety** - TypeScript ensures compile-time type checking
5. **Performance** - Optimized rendering with memoization and lazy loading

### Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   Presentation Layer            │
│           (Screens, Components, Navigation)     │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│              Business Logic Layer               │
│           (Hooks, Utils, Validators)            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│              State Management Layer             │
│           (Redux Slices, TanStack Query)        │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│              Data Access Layer                  │
│  (API Services, Socket.IO, Local Storage)       │
└─────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
gemlay-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # Tabs layout configuration
│   │   ├── mockup.tsx             # Home screen
│   │   ├── categories.tsx        # Categories screen
│   │   ├── cart.tsx              # Cart screen
│   │   ├── wishlist.tsx          # Wishlist screen
│   │   └── profile.tsx           # Profile screen
│   ├── (auth)/                   # Auth screens group (no tabs)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── otp.tsx
│   │   └── forgot-password.tsx
│   ├── product/
│   │   ├── [id].tsx              # Dynamic product details
│   │   └── list.tsx              # Product listing with filters
│   ├── checkout/
│   │   ├── mockup.tsx             # Checkout main
│   │   ├── address.tsx           # Address selection
│   │   └── payment.tsx           # Payment screen
│   ├── _layout.tsx               # Root layout (providers, etc.)
│   └── +not-found.tsx            # 404 screen
│
├── src/
│   ├── modules/                  # Feature modules (self-contained)
│   │   ├── auth/
│   │   │   ├── components/       # Auth-specific components
│   │   │   ├── hooks/            # useAuth, useOTP, etc.
│   │   │   └── services/         # Auth API calls
│   │   ├── cart/
│   │   │   ├── components/       # CartItem, CartSummary, etc.
│   │   │   ├── hooks/            # useCart, useCartSync
│   │   │   └── services/         # Cart API + Socket.IO
│   │   ├── wishlist/
│   │   ├── profile/
│   │   ├── products/
│   │   ├── checkout/
│   │   └── jewelPool/
│   │
│   ├── components/               # Shared/reusable components
│   │   ├── ui/                   # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── common/               # Common app components
│   │   │   ├── Header.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── product/              # Product-specific components
│   │       ├── ProductCard.tsx
│   │       └── ProductCarousel.tsx
│   │
│   ├── hooks/                    # Global custom hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useCart.ts            # Cart operations
│   │   ├── useSocket.ts          # Socket.IO connection
│   │   ├── useDebounce.ts        # Debounce utility
│   │   ├── useResponsive.ts      # Responsive dimensions
│   │   └── useKeyboard.ts        # Keyboard handling
│   │
│   ├── store/                    # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.ts      # Auth state
│   │   │   ├── cartSlice.ts      # Cart state
│   │   │   └── wishlistSlice.ts  # Wishlist state
│   │   └── index.ts              # Store configuration
│   │
│   ├── services/                 # External services
│   │   ├── api/
│   │   │   ├── axios.config.ts   # Axios instance with interceptors
│   │   │   ├── auth.api.ts       # Auth endpoints
│   │   │   ├── products.api.ts   # Product endpoints
│   │   │   └── orders.api.ts     # Order endpoints
│   │   ├── socket/
│   │   │   └── socket.config.ts  # Socket.IO setup
│   │   └── queries/              # TanStack Query hooks
│   │       ├── useProducts.ts    # Product queries
│   │       ├── useOrders.ts      # Order queries
│   │       └── useUser.ts        # User queries
│   │
│   ├── utils/                    # Utilities & helpers
│   │   ├── constants.ts          # App constants
│   │   ├── design-system.ts      # Design tokens & responsive helpers
│   │   ├── helpers.ts            # Utility functions
│   │   ├── validation.ts         # Form validation schemas
│   │   └── storage.ts            # AsyncStorage wrapper
│   │
│   ├── types/                    # TypeScript types
│   │   ├── api.types.ts          # API response types
│   │   ├── product.types.ts      # Product-related types
│   │   ├── user.types.ts         # User-related types
│   │   └── navigation.types.ts   # Navigation types
│   │
│   └── assets/                   # Static assets
│       ├── images/
│       ├── icons/
│       └── fonts/
│
├── .husky/                       # Git hooks
├── .vscode/                      # VS Code settings
├── global.css                    # NativeWind/Tailwind imports
├── eslint.config.mjs             # ESLint v9 flat config
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── metro.config.js               # Metro bundler config
├── babel.config.js               # Babel configuration
├── app.json                      # Expo configuration
└── package.json                  # Dependencies & scripts
```

---

## 🧩 Core Concepts

### 1. File-Based Routing (Expo Router)

Expo Router uses the file system as the API for routing:

```typescript
// app/(tabs)/mockup.tsx → /
// app/(tabs)/profile.tsx → /profile
// app/product/[id].tsx → /product/:id
// app/(auth)/login.tsx → /login
```

**Route Groups** - Folders wrapped in parentheses `(tabs)` don't appear in the URL:

- `app/(tabs)/mockup.tsx` → `/` (not `/tabs`)
- `app/(auth)/login.tsx` → `/login` (not `/auth/login`)

**Dynamic Routes** - Files with brackets `[param]`:

```typescript
// app/product/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  // id contains the dynamic segment
}
```

**Navigation**:

```typescript
import { router } from "expo-router";

// Push
router.push("/product/123");

// Replace (no back button)
router.replace("/login");

// Go back
router.back();
```

### 2. State Management Strategy

We use a **hybrid approach**:

#### Redux Toolkit (Client State)

Use for:

- Authentication state
- Cart items (synced with backend)
- Wishlist items
- UI preferences
- Global app state

```typescript
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

const dispatch = useDispatch();
const cartItems = useSelector((state) => state.cart.items);

dispatch(addToCart(product));
```

#### TanStack Query (Server State)

Use for:

- API data fetching
- Caching
- Background refetching
- Optimistic updates

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["products", category],
  queryFn: () => fetchProducts(category),
});

const mutation = useMutation({
  mutationFn: updateProduct,
  onSuccess: () => {
    queryClient.invalidateQueries(["products"]);
  },
});
```

### 3. Socket.IO Integration

Real-time updates for cart and wishlist across devices:

```typescript
// src/services/socket/socket.config.ts
import io from "socket.io-client";

export const socket = io(process.env.SOCKET_URL, {
  auth: {
    token: getAuthToken(),
  },
});

// Listen to events
socket.on("cart:updated", (data) => {
  dispatch(setCartItems(data.items));
});

// Emit events
socket.emit("cart:add", { productId, quantity });
```

### 4. Design System

Centralized design tokens in `src/utils/design-system.ts`:

```typescript
import { colors, spacing, typography } from '@/utils/design-system';

// Use in JavaScript
<View style={{ backgroundColor: colors.primary, padding: spacing.md }} />

// Or with NativeWind
<View className="bg-primary p-4" />
```

**Responsive Helpers**:

```typescript
import { responsive } from "@/utils/design-system";

const width = responsive.wp(80); // 80% of screen width
const fontSize = responsive.scaleFont(16); // Scaled for device
```

### 5. API Integration

Axios instance with interceptors:

```typescript
// src/services/api/axios.config.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 30000,
});

// Request interceptor (add auth token)
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      router.replace("/login");
    }
    return Promise.reject(error);
  },
);
```

---

## 💻 Development Workflow

### 1. Creating a New Feature

```bash
# Create feature branch
git checkout -b feat/product-filters

# Create module structure
mkdir -p src/modules/filters/{components,hooks,services}

# Implement feature...

# Run checks
npm run lint:fix
npm run type-check

# Commit (triggers pre-commit hooks)
git commit -m "feat: add product filters with price range"

# Push
git push origin feat/product-filters
```

### 2. Adding a New Screen

```typescript
// 1. Create file in app/ directory
// app/orders/[id].tsx

import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Order #{id}</Text>
    </View>
  );
}

// 2. Navigate to it
router.push(`/orders/${orderId}`);
```

### 3. Creating Reusable Components

```typescript
// src/components/ui/Badge.tsx
import { View, Text, ViewProps } from 'react-native';

interface BadgeProps extends ViewProps {
  variant?: 'success' | 'error' | 'warning';
  children: string;
}

export const Badge = ({ variant = 'success', children }: BadgeProps) => {
  const variantClasses = {
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <View className={`px-2 py-1 rounded ${variantClasses[variant]}`}>
      <Text className="text-xs font-medium">{children}</Text>
    </View>
  );
};
```

### 4. Adding API Endpoints

```typescript
// src/services/api/products.api.ts
import { api } from "./axios.config";
import { Product, ProductFilters } from "@/types/product.types";

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    api.get<Product[]>("/products", { params: filters }),

  getById: (id: string) => api.get<Product>(`/products/${id}`),

  search: (query: string) =>
    api.get<Product[]>("/products/search", { params: { q: query } }),
};

// Use with TanStack Query
// src/services/queries/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/api/products.api";

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getAll(filters),
  });
};
```

---

## 🎨 Styling System

### NativeWind (Tailwind CSS)

We use NativeWind v4 for styling. It provides Tailwind CSS utility classes for React Native.

#### Basic Usage

```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold text-primary">Hello</Text>
  <Pressable className="bg-primary rounded-lg py-3 px-6 active:opacity-80">
    <Text className="text-white font-semibold">Press Me</Text>
  </Pressable>
</View>
```

#### Custom Colors

Defined in `tailwind.config.js`:

```javascript
colors: {
  primary: '#D4AF37',
  secondary: '#1F2937',
  // Use as: className="bg-primary text-secondary"
}
```

#### Responsive Design

```typescript
// Use responsive helper
import { responsive } from '@/utils/design-system';

<View style={{ width: responsive.wp(90) }}>
  {/* 90% of screen width */}
</View>

// Or conditional rendering
{responsive.screen.isSmallDevice && <CompactView />}
{responsive.screen.isLargeDevice && <ExpandedView />}
```

#### Platform-Specific Styles

```typescript
import { Platform } from 'react-native';

<View className={`p-4 ${Platform.OS === 'ios' ? 'pt-12' : 'pt-4'}`}>
  {/* Different padding for iOS */}
</View>
```

---

## ✅ Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Formatting

```bash
# Check formatting
npm run format:check

# Format all files
npm run format
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Pre-commit Hooks

Husky automatically runs on `git commit`:

1. Lints staged files
2. Formats staged files
3. Runs type checking
4. Validates commit message format

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

git commit -m "feat(cart): add quantity selector"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs: update API documentation"
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Maintenance tasks

---

## 🧪 Testing

### Unit Testing (Coming Soon)

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Component Testing

We'll use React Native Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/ui/Button';

test('Button handles press', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <Button onPress={onPress}>Press Me</Button>
  );

  fireEvent.press(getByText('Press Me'));
  expect(onPress).toHaveBeenCalled();
});
```

---

## 🚀 Deployment

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Build for both
eas build --platform all
```

### OTA Updates

```bash
# Publish update
eas update --branch production --message "Fix cart bug"
```

### Environment Management

```bash
# Development
eas build --profile development

# Staging
eas build --profile staging

# Production
eas build --profile production
```

---

## 🐛 Troubleshooting

### NativeWind styles not applying

```bash
# Clear cache
npx expo start -c

# Verify global.css import in app/_layout.tsx
import '../global.css';

# Check metro.config.js has NativeWind plugin
```

### TypeScript errors

```bash
# Regenerate types
npx expo customize tsconfig.json

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Redux state not persisting

```bash
# Check AsyncStorage permissions
# Verify persistor is configured in _layout.tsx
```

### Socket.IO not connecting

```bash
# Check SOCKET_URL in .env
# Verify auth token is being sent
# Check network connectivity
```

### Build errors

```bash
# Clear all caches
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install

# Clear Gradle cache (Android)
cd android && ./gradlew clean && cd ..

# Clear CocoaPods cache (iOS)
cd ios && pod cache clean --all && pod install && cd ..
```

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## 📄 License

This project is proprietary and confidential.

---

## 💬 Support

For technical issues or questions, contact the development team:

- **Tech Lead**: Gopal Arya
- **Developer**: Abhiraj Ghosh
