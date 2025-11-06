# 🔗 Deep Linking Strategy - Complete Implementation

## Overview

Deep linking allows users to navigate directly to specific content within your app from:
- Push notifications
- Email links
- SMS messages
- Social media
- QR codes
- Web browser links
- Other apps

## Deep Linking Types

### 1. **Standard Deep Links** (Custom URL Scheme)
```
gemlay://product/123
gemlay://cart
```

### 2. **Universal Links (iOS)** / **App Links (Android)**
```
https://gemlay.com/product/123
https://gemlay.com/cart
```

### 3. **Deferred Deep Links**
- Install app if not installed
- Open specific screen after installation

## Architecture

```
┌─────────────────────────────────────────────────┐
│         External Sources (Push, Email, Web)      │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Deep Link Handler (Middleware)           │
│         Parse, Validate, Extract params          │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Route Mapper (Business Logic)            │
│         Map URL patterns to app routes           │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Navigation Layer (Expo Router)           │
│         Execute navigation with params           │
└─────────────────────────────────────────────────┘
```

## Step 1: Configuration

### File: `app.json` (Deep Link Config)

```json
{
  "expo": {
    "scheme": "gemlay",
    "name": "Gemlay Mobile",
    "slug": "gemlay-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "platforms": ["ios", "android", "web"],
    
    "ios": {
      "bundleIdentifier": "com.gemlay.mobile",
      "associatedDomains": [
        "applinks:gemlay.com",
        "applinks:www.gemlay.com"
      ],
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["gemlay"],
            "CFBundleURLName": "com.gemlay.mobile"
          }
        ]
      }
    },
    
    "android": {
      "package": "com.gemlay.mobile",
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "gemlay.com",
              "pathPrefix": "/"
            },
            {
              "scheme": "https",
              "host": "www.gemlay.com",
              "pathPrefix": "/"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        },
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "gemlay"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    
    "web": {
      "bundler": "metro"
    },
    
    "plugins": [
      "expo-router"
    ],
    
    "extra": {
      "router": {
        "origin": false
      }
    }
  }
}
```

## Step 2: Type Definitions

### File: `src/types/deeplink.types.ts`

```typescript
export enum DeepLinkRoute {
  HOME = 'HOME',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS',
  PRODUCT_LIST = 'PRODUCT_LIST',
  CATEGORY = 'CATEGORY',
  CART = 'CART',
  WISHLIST = 'WISHLIST',
  CHECKOUT = 'CHECKOUT',
  ORDER_DETAILS = 'ORDER_DETAILS',
  PROFILE = 'PROFILE',
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  SEARCH = 'SEARCH',
  OFFERS = 'OFFERS',
  JEWEL_POOL = 'JEWEL_POOL',
  NOTIFICATIONS = 'NOTIFICATIONS',
}

export interface DeepLinkParams {
  [key: string]: string | number | boolean | undefined;
}

export interface ParsedDeepLink {
  route: DeepLinkRoute;
  params: DeepLinkParams;
  url: string;
  hostname?: string;
  path: string;
  queryParams: Record<string, string>;
}

export interface DeepLinkConfig {
  pattern: RegExp;
  route: DeepLinkRoute;
  extractParams?: (matches: RegExpMatchArray) => DeepLinkParams;
  requiresAuth?: boolean;
}
```

## Step 3: Deep Link Service

### File: `src/services/deeplink/deeplink.service.ts`

```typescript
import * as Linking from 'expo-linking';
import { DeepLinkRoute, ParsedDeepLink, DeepLinkConfig } from '@/types/deeplink.types';

/**
 * Deep Link Service - Handles all deep linking operations
 */
class DeepLinkService {
  private prefix = Linking.createURL('/');
  
  /**
   * Deep link patterns configuration
   * Priority matters - more specific patterns should come first
   */
  private readonly patterns: DeepLinkConfig[] = [
    // Product Details: /product/:id or /products/:id
    {
      pattern: /^\/products?\/([a-zA-Z0-9-]+)$/,
      route: DeepLinkRoute.PRODUCT_DETAILS,
      extractParams: (matches) => ({ id: matches[1] }),
    },
    
    // Product List with Category: /products?category=rings
    {
      pattern: /^\/products$/,
      route: DeepLinkRoute.PRODUCT_LIST,
    },
    
    // Category: /category/:slug
    {
      pattern: /^\/category\/([a-zA-Z0-9-]+)$/,
      route: DeepLinkRoute.CATEGORY,
      extractParams: (matches) => ({ slug: matches[1] }),
    },
    
    // Order Details: /orders/:id
    {
      pattern: /^\/orders\/([a-zA-Z0-9-]+)$/,
      route: DeepLinkRoute.ORDER_DETAILS,
      extractParams: (matches) => ({ orderId: matches[1] }),
      requiresAuth: true,
    },
    
    // Search: /search?q=diamond
    {
      pattern: /^\/search$/,
      route: DeepLinkRoute.SEARCH,
    },
    
    // Cart
    {
      pattern: /^\/cart$/,
      route: DeepLinkRoute.CART,
    },
    
    // Wishlist
    {
      pattern: /^\/wishlist$/,
      route: DeepLinkRoute.WISHLIST,
      requiresAuth: true,
    },
    
    // Checkout
    {
      pattern: /^\/checkout$/,
      route: DeepLinkRoute.CHECKOUT,
      requiresAuth: true,
    },
    
    // Profile
    {
      pattern: /^\/profile$/,
      route: DeepLinkRoute.PROFILE,
      requiresAuth: true,
    },
    
    // Notifications
    {
      pattern: /^\/notifications$/,
      route: DeepLinkRoute.NOTIFICATIONS,
      requiresAuth: true,
    },
    
    // Offers
    {
      pattern: /^\/offers$/,
      route: DeepLinkRoute.OFFERS,
    },
    
    // Jewel Secure Pool
    {
      pattern: /^\/jewel-pool$/,
      route: DeepLinkRoute.JEWEL_POOL,
      requiresAuth: true,
    },
    
    // Auth routes
    {
      pattern: /^\/login$/,
      route: DeepLinkRoute.LOGIN,
    },
    {
      pattern: /^\/signup$/,
      route: DeepLinkRoute.SIGNUP,
    },
    
    // Home (catch-all)
    {
      pattern: /^\/$/,
      route: DeepLinkRoute.HOME,
    },
  ];

  /**
   * Parse deep link URL
   */
  parseUrl(url: string): ParsedDeepLink | null {
    try {
      const parsed = Linking.parse(url);
      const { hostname, path, queryParams } = parsed;

      // Normalize path
      const normalizedPath = path?.startsWith('/') ? path : `/${path || ''}`;

      // Find matching pattern
      for (const config of this.patterns) {
        const matches = normalizedPath.match(config.pattern);
        
        if (matches) {
          const params = config.extractParams 
            ? config.extractParams(matches) 
            : {};

          return {
            route: config.route,
            params: { ...params, ...queryParams },
            url,
            hostname,
            path: normalizedPath,
            queryParams: queryParams || {},
          };
        }
      }

      // No match found - default to home
      console.warn('No matching deep link pattern found:', url);
      return {
        route: DeepLinkRoute.HOME,
        params: {},
        url,
        hostname,
        path: normalizedPath,
        queryParams: queryParams || {},
      };
    } catch (error) {
      console.error('Error parsing deep link:', error);
      return null;
    }
  }

  /**
   * Get initial URL (app opened via deep link)
   */
  async getInitialUrl(): Promise<string | null> {
    return await Linking.getInitialURL();
  }

  /**
   * Add URL change listener
   */
  addUrlListener(callback: (url: string) => void): { remove: () => void } {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      callback(url);
    });

    return {
      remove: () => subscription.remove(),
    };
  }

  /**
   * Create deep link URL
   */
  createUrl(path: string, params?: Record<string, string>): string {
    const queryString = params 
      ? '?' + new URLSearchParams(params).toString() 
      : '';
    
    return Linking.createURL(path + queryString);
  }

  /**
   * Open external URL
   */
  async openUrl(url: string): Promise<boolean> {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    return false;
  }

  /**
   * Check if pattern requires authentication
   */
  requiresAuth(route: DeepLinkRoute): boolean {
    const config = this.patterns.find((p) => p.route === route);
    return config?.requiresAuth || false;
  }
}

export const deepLinkService = new DeepLinkService();
```

## Step 4: Deep Link Navigator

### File: `src/services/deeplink/deeplink.navigator.ts`

```typescript
import { router } from 'expo-router';
import { DeepLinkRoute, ParsedDeepLink } from '@/types/deeplink.types';
import { store } from '@/store';

/**
 * Deep Link Navigator - Maps parsed links to app routes
 */
class DeepLinkNavigator {
  /**
   * Navigate based on parsed deep link
   */
  navigate(parsedLink: ParsedDeepLink): void {
    const { route, params, queryParams } = parsedLink;

    // Check authentication if required
    if (this.requiresAuth(route) && !this.isAuthenticated()) {
      // Store intended route for after login
      this.storeIntendedRoute(parsedLink);
      router.replace('/login');
      return;
    }

    // Navigate to appropriate route
    switch (route) {
      case DeepLinkRoute.HOME:
        router.push('/');
        break;

      case DeepLinkRoute.PRODUCT_DETAILS:
        if (params.id) {
          router.push(`/product/${params.id}`);
        }
        break;

      case DeepLinkRoute.PRODUCT_LIST:
        const categoryParam = queryParams.category 
          ? `?category=${queryParams.category}` 
          : '';
        router.push(`/products${categoryParam}`);
        break;

      case DeepLinkRoute.CATEGORY:
        if (params.slug) {
          router.push(`/products?category=${params.slug}`);
        }
        break;

      case DeepLinkRoute.ORDER_DETAILS:
        if (params.orderId) {
          router.push(`/orders/${params.orderId}`);
        }
        break;

      case DeepLinkRoute.SEARCH:
        const searchQuery = queryParams.q ? `?q=${queryParams.q}` : '';
        router.push(`/search${searchQuery}`);
        break;

      case DeepLinkRoute.CART:
        router.push('/cart');
        break;

      case DeepLinkRoute.WISHLIST:
        router.push('/wishlist');
        break;

      case DeepLinkRoute.CHECKOUT:
        router.push('/checkout');
        break;

      case DeepLinkRoute.PROFILE:
        router.push('/profile');
        break;

      case DeepLinkRoute.NOTIFICATIONS:
        router.push('/notifications');
        break;

      case DeepLinkRoute.OFFERS:
        router.push('/offers');
        break;

      case DeepLinkRoute.JEWEL_POOL:
        router.push('/jewel-pool');
        break;

      case DeepLinkRoute.LOGIN:
        router.replace('/login');
        break;

      case DeepLinkRoute.SIGNUP:
        router.replace('/signup');
        break;

      default:
        router.push('/');
    }
  }

  /**
   * Check if user is authenticated
   */
  private isAuthenticated(): boolean {
    const state = store.getState();
    return state.auth.isAuthenticated;
  }

  /**
   * Check if route requires authentication
   */
  private requiresAuth(route: DeepLinkRoute): boolean {
    const authRequiredRoutes = [
      DeepLinkRoute.ORDER_DETAILS,
      DeepLinkRoute.WISHLIST,
      DeepLinkRoute.CHECKOUT,
      DeepLinkRoute.PROFILE,
      DeepLinkRoute.NOTIFICATIONS,
      DeepLinkRoute.JEWEL_POOL,
    ];
    return authRequiredRoutes.includes(route);
  }

  /**
   * Store intended route for after login
   */
  private storeIntendedRoute(parsedLink: ParsedDeepLink): void {
    // Store in AsyncStorage or Redux
    try {
      const intendedRoute = JSON.stringify(parsedLink);
      // You can use AsyncStorage here
      console.log('Storing intended route:', intendedRoute);
    } catch (error) {
      console.error('Error storing intended route:', error);
    }
  }

  /**
   * Navigate to stored intended route (after login)
   */
  navigateToIntendedRoute(): void {
    // Retrieve and navigate to stored route
    // Implement based on your storage solution
  }
}

export const deepLinkNavigator = new DeepLinkNavigator();
```

## Step 5: Deep Link Hook (Business Logic)

### File: `src/hooks/useDeepLinking.ts`

```typescript
import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppState, AppStateStatus } from 'react-native';
import { deepLinkService } from '@/services/deeplink/deeplink.service';
import { deepLinkNavigator } from '@/services/deeplink/deeplink.navigator';

/**
 * Deep Linking Hook - Handles all deep link navigation
 */
export const useDeepLinking = () => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const hasHandledInitialUrl = useRef(false);

  /**
   * Handle deep link URL
   */
  const handleDeepLink = useCallback((url: string) => {
    console.log('Deep link received:', url);

    // Parse URL
    const parsedLink = deepLinkService.parseUrl(url);
    
    if (parsedLink) {
      console.log('Parsed deep link:', parsedLink);
      
      // Navigate
      deepLinkNavigator.navigate(parsedLink);
      
      // Track deep link analytics
      trackDeepLink(parsedLink.route, parsedLink.params);
    }
  }, []);

  /**
   * Track deep link for analytics
   */
  const trackDeepLink = useCallback((route: string, params: any) => {
    // Implement your analytics tracking here
    console.log('Deep link tracked:', { route, params });
    
    // Example: Firebase Analytics
    // analytics().logEvent('deep_link_opened', { route, ...params });
  }, []);

  /**
   * Handle app state changes (background to foreground)
   */
  const handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground - check for deep link
        const url = await deepLinkService.getInitialUrl();
        if (url) {
          handleDeepLink(url);
        }
      }
      appState.current = nextAppState;
    },
    [handleDeepLink]
  );

  /**
   * Initialize deep linking
   */
  useEffect(() => {
    // Handle initial URL (app opened via deep link)
    const handleInitialUrl = async () => {
      if (hasHandledInitialUrl.current) return;
      
      const initialUrl = await deepLinkService.getInitialUrl();
      if (initialUrl) {
        hasHandledInitialUrl.current = true;
        // Add small delay to ensure app is ready
        setTimeout(() => handleDeepLink(initialUrl), 500);
      }
    };

    handleInitialUrl();

    // Listen for URL changes (app is already open)
    const urlListener = deepLinkService.addUrlListener(handleDeepLink);

    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Cleanup
    return () => {
      urlListener.remove();
      appStateSubscription.remove();
    };
  }, [handleDeepLink, handleAppStateChange]);

  /**
   * Manually trigger deep link
   */
  const openDeepLink = useCallback((url: string) => {
    handleDeepLink(url);
  }, [handleDeepLink]);

  /**
   * Create shareable deep link
   */
  const createShareableLink = useCallback((path: string, params?: Record<string, string>) => {
    return deepLinkService.createUrl(path, params);
  }, []);

  return {
    openDeepLink,
    createShareableLink,
  };
};
```

## Step 6: Initialize in Root Layout

### File: `app/_layout.tsx` (Add deep linking)

```typescript
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
import { useDeepLinking } from '@/hooks/useDeepLinking';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function RootLayoutContent() {
  const { permissionsGranted } = useNotifications();
  
  // Initialize deep linking
  useDeepLinking();

  useEffect(() => {
    console.log('App initialized with deep linking support');
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            title: 'Product Details',
            headerBackTitle: 'Back',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutContent />
      </QueryClientProvider>
    </Provider>
  );
}
```

## Step 7: Share Functionality

### File: `src/utils/sharing.ts`

```typescript
import { Share } from 'react-native';
import { deepLinkService } from '@/services/deeplink/deeplink.service';

/**
 * Sharing utilities with deep links
 */
export const sharing = {
  /**
   * Share product
   */
  async shareProduct(productId: string, productName: string) {
    const url = `https://gemlay.com/product/${productId}`;
    
    try {
      await Share.share({
        message: `Check out ${productName} on Gemlay!\n${url}`,
        url, // iOS only
        title: productName,
      });
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  },

  /**
   * Share offer/promotion
   */
  async shareOffer(title: string, description: string, offerCode?: string) {
    const url = 'https://gemlay.com/offers';
    const message = offerCode
      ? `${title}\n${description}\nUse code: ${offerCode}\n${url}`
      : `${title}\n${description}\n${url}`;

    try {
      await Share.share({
        message,
        url,
        title,
      });
    } catch (error) {
      console.error('Error sharing offer:', error);
    }
  },

  /**
   * Share app
   */
  async shareApp() {
    const url = 'https://gemlay.com/download';
    const message = `Check out Gemlay - Premium Jewelry Shopping App!\n${url}`;

    try {
      await Share.share({
        message,
        url,
        title: 'Gemlay - Premium Jewelry',
      });
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  },

  /**
   * Share category
   */
  async shareCategory(categorySlug: string, categoryName: string) {
    const url = `https://gemlay.com/category/${categorySlug}`;
    const message = `Browse ${categoryName} on Gemlay!\n${url}`;

    try {
      await Share.share({
        message,
        url,
        title: categoryName,
      });
    } catch (error) {
      console.error('Error sharing category:', error);
    }
  },
};
```

## Step 8: QR Code Generation

### File: `src/components/common/QRCodeGenerator.tsx`

```typescript
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeGeneratorProps {
  url: string;
  size?: number;
  logo?: any;
}

export const QRCodeGenerator = ({ 
  url, 
  size = 200,
  logo 
}: QRCodeGeneratorProps) => {
  return (
    <View className="items-center justify-center p-4 bg-white rounded-xl">
      <QRCode
        value={url}
        size={size}
        logo={logo}
        logoSize={size * 0.2}
        logoBackgroundColor="white"
        logoBorderRadius={10}
        color="#1F2937"
        backgroundColor="white"
      />
    </View>
  );
};

// Usage:
// <QRCodeGenerator 
//   url="https://gemlay.com/product/abc123" 
//   logo={require('@/assets/logo.png')}
// />
```

## Step 9: Testing Deep Links

### File: `src/utils/testDeepLinks.ts`

```typescript
import { deepLinkService } from '@/services/deeplink/deeplink.service';
import { Linking } from 'react-native';

/**
 * Test deep link functions
 */
export const testDeepLinks = {
  // Test product deep link
  async testProductLink(productId: string = 'test-123') {
    const url = `gemlay://product/${productId}`;
    await Linking.openURL(url);
  },

  // Test web link
  async testWebLink() {
    const url = 'https://gemlay.com/product/test-123';
    await Linking.openURL(url);
  },

  // Test with query params
  async testSearchLink() {
    const url = 'gemlay://search?q=diamond+rings';
    await Linking.openURL(url);
  },

  // Test cart link
  async testCartLink() {
    const url = 'gemlay://cart';
    await Linking.openURL(url);
  },

  // Parse test
  testParse() {
    const urls = [
      'gemlay://product/123',
      'https://gemlay.com/product/123',
      'gemlay://search?q=diamond',
      'gemlay://cart',
      'https://gemlay.com/orders/abc-123',
    ];

    urls.forEach((url) => {
      const parsed = deepLinkService.parseUrl(url);
      console.log('URL:', url);
      console.log('Parsed:', parsed);
      console.log('---');
    });
  },
};
```

## Step 10: Backend Integration

### File: `src/services/api/adapters/deeplink.adapter.ts`

```typescript
import { api } from '../axios.config';
import { ApiResponse } from '@/types/api.types';

export class DeepLinkAdapter {
  private readonly basePath = '/deeplinks';

  /**
   * Track deep link usage
   */
  async trackDeepLink(data: {
    url: string;
    route: string;
    params: Record<string, any>;
    source?: string;
  }): Promise<void> {
    try {
      await api.post<ApiResponse<void>>(`${this.basePath}/track`, data);
    } catch (error) {
      console.error('Failed to track deep link:', error);
    }
  }

  /**
   * Generate short link (for sharing)
   */
  async generateShortLink(longUrl: string): Promise<string> {
    try {
      const response = await api.post<ApiResponse<{ shortUrl: string }>>(
        `${this.basePath}/shorten`,
        { longUrl }
      );
      return response.data.data.shortUrl;
    } catch (error) {
      console.error('Failed to generate short link:', error);
      return longUrl;
    }
  }

  /**
   * Get deep link analytics
   */
  async getAnalytics(startDate: string, endDate: string) {
    try {
      const response = await api.get<ApiResponse<any>>(
        `${this.basePath}/analytics`,
        {
          params: { startDate, endDate },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to get deep link analytics:', error);
      return null;
    }
  }
}

export const deepLinkAdapter = new DeepLinkAdapter();
```

## Universal Links Setup (iOS)

### File: `apple-app-site-association` (Host on your server)

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.gemlay.mobile",
        "paths": [
          "/product/*",
          "/category/*",
          "/orders/*",
          "/cart",
          "/wishlist",
          "/offers",
          "/search"
        ]
      }
    ]
  }
}
```

Host this file at:
```
https://gemlay.com/.well-known/apple-app-site-association
https://gemlay.com/apple-app-site-association
```

## App Links Setup (Android)

### File: `assetlinks.json` (Host on your server)

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.gemlay.mobile",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT"
      ]
    }
  }
]
```

Host this file at:
```
https://gemlay.com/.well-known/assetlinks.json
```

Get SHA256 fingerprint:
```bash
keytool -list -v -keystore my-release-key.keystore
```

## Testing Commands

### iOS Simulator
```bash
xcrun simctl openurl booted "gemlay://product/123"
xcrun simctl openurl booted "https://gemlay.com/product/123"
```

### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "gemlay://product/123" com.gemlay.mobile
adb shell am start -W -a android.intent.action.VIEW -d "https://gemlay.com/product/123" com.gemlay.mobile
```

### Using ADB for testing
```bash
# Test custom scheme
adb shell am start -a android.intent.action.VIEW -d "gemlay://cart"

# Test universal link
adb shell am start -a android.intent.action.VIEW -d "https://gemlay.com/product/123"
```

## Common Deep Link Patterns

```typescript
// Product details
gemlay://product/ABC123
https://gemlay.com/product/ABC123

// Category
gemlay://category/rings
https://gemlay.com/category/rings

// Search with query
gemlay://search?q=diamond+necklace
https://gemlay.com/search?q=diamond+necklace

// Order tracking
gemlay://orders/ORD-12345
https://gemlay.com/orders/ORD-12345

// Promotional campaign
gemlay://offers?campaign=diwali2024
https://gemlay.com/offers?campaign=diwali2024

// Cart
gemlay://cart
https://gemlay.com/cart

// Wishlist
gemlay://wishlist
https://gemlay.com/wishlist

// Profile
gemlay://profile
https://gemlay.com/profile
```


## Production Checklist

✅ Configure app.json with schemes

✅ Setup Universal Links (iOS)

✅ Setup App Links (Android)

✅ Host association files on server

✅ Test on physical devices

✅ Implement deferred deep linking


✅ Handle authentication flows

✅ Test all link patterns
