# 🔔 Push Notifications Implementation Guide

## Overview

We'll implement push notifications using Expo Notifications with:
- Local notifications (in-app alerts)
- Remote notifications (Firebase Cloud Messaging)
- Deep linking integration
- Notification preferences
- Layered architecture pattern

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Notification Triggers (Backend)          │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│     Firebase Cloud Messaging / Expo Push         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Notification Service Layer               │
│         (Handle, Store, Process)                 │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Business Logic Layer (Hooks)             │
│         (Permissions, Navigation)                │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────┴────────────────────────────────┐
│         Presentation Layer (UI)                  │
└─────────────────────────────────────────────────┘
```

## Step 1: Installation

```bash
# Install Expo Notifications
npx expo install expo-notifications expo-device expo-constants

# Install for deep linking (already installed with Expo Router)
npx expo install expo-linking
```

## Step 2: Configuration Files

### File: `app.json` (Add notification config)

```json
{
  "expo": {
    "name": "Gemlay Mobile",
    "slug": "gemlay-mobile",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#D4AF37",
          "sounds": ["./assets/sounds/notification.wav"],
          "androidMode": "default",
          "androidCollapsedTitle": "#{unread_notifications} new notifications"
        }
      ]
    ],
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#D4AF37",
      "androidMode": "default",
      "androidCollapsedTitle": "#{unread_notifications} new interactions"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#D4AF37"
      },
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "POST_NOTIFICATIONS"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSUserNotificationsUsageDescription": "This app uses notifications to keep you updated on your orders and offers."
      }
    }
  }
}
```

## Step 3: Type Definitions

### File: `src/types/notification.types.ts`

```typescript
export enum NotificationType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_SHIPPED = 'ORDER_SHIPPED',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  WISHLIST_PRICE_DROP = 'WISHLIST_PRICE_DROP',
  NEW_ARRIVAL = 'NEW_ARRIVAL',
  FLASH_SALE = 'FLASH_SALE',
  CART_REMINDER = 'CART_REMINDER',
  PROMOTIONAL = 'PROMOTIONAL',
}

export interface NotificationData {
  type: NotificationType;
  title: string;
  body: string;
  data?: {
    orderId?: string;
    productId?: string;
    categoryId?: string;
    url?: string;
    [key: string]: any;
  };
}

export interface NotificationPermissions {
  granted: boolean;
  canAskAgain: boolean;
  ios?: {
    status: number;
    allowsAlert: boolean;
    allowsBadge: boolean;
    allowsSound: boolean;
  };
}

export interface PushToken {
  token: string;
  type: 'expo' | 'fcm' | 'apns';
}
```

## Step 4: Notification Service (Data Layer)

### File: `src/services/notifications/notification.service.ts`

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { NotificationData, PushToken } from '@/types/notification.types';

/**
 * Notification Service - Handles all notification operations
 */
class NotificationService {
  private notificationListener: any;
  private responseListener: any;

  /**
   * Initialize notification handlers
   */
  initialize() {
    // Set notification handler for foreground notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#D4AF37',
      });

      // Create channels for different notification types
      this.createNotificationChannels();
    }
  }

  /**
   * Create Android notification channels
   */
  private async createNotificationChannels() {
    const channels = [
      {
        id: 'orders',
        name: 'Order Updates',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Notifications about your orders',
      },
      {
        id: 'promotions',
        name: 'Promotions & Offers',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: 'Special offers and promotions',
      },
      {
        id: 'alerts',
        name: 'Price Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Price drop alerts for wishlist items',
      },
    ];

    for (const channel of channels) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        importance: channel.importance,
        description: channel.description,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#D4AF37',
      });
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Notifications only work on physical devices');
      return false;
    }

    const { status: existingStatus } = 
      await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission not granted for notifications');
      return false;
    }

    return true;
  }

  /**
   * Get Expo Push Token
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for push notifications');
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        throw new Error('Project ID not found');
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Schedule local notification
   */
  async scheduleLocalNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null = immediate
    });

    return notificationId;
  }

  /**
   * Cancel scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Add notification received listener
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    this.notificationListener = 
      Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    this.responseListener = 
      Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Remove listeners
   */
  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

export const notificationService = new NotificationService();
```

## Step 5: API Adapter for Notification Tokens

### File: `src/services/api/adapters/notifications.adapter.ts`

```typescript
import { api } from '../axios.config';
import { PushToken } from '@/types/notification.types';
import { ApiResponse } from '@/types/api.types';

export class NotificationsAdapter {
  private readonly basePath = '/notifications';

  /**
   * Register push token with backend
   */
  async registerPushToken(token: PushToken): Promise<void> {
    try {
      await api.post<ApiResponse<void>>(`${this.basePath}/register`, {
        token: token.token,
        type: token.type,
        platform: token.type === 'expo' ? 'expo' : 
                 token.type === 'fcm' ? 'android' : 'ios',
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Unregister push token
   */
  async unregisterPushToken(token: string): Promise<void> {
    try {
      await api.delete<ApiResponse<void>>(
        `${this.basePath}/unregister/${token}`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    priceAlerts: boolean;
    newArrivals: boolean;
  }): Promise<void> {
    try {
      await api.put<ApiResponse<void>>(
        `${this.basePath}/preferences`,
        preferences
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get notification history
   */
  async getNotificationHistory(page: number = 1, limit: number = 20) {
    try {
      const response = await api.get<ApiResponse<any>>(
        `${this.basePath}/history`,
        { params: { page, limit } }
      );
      return response.data.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.put<ApiResponse<void>>(
        `${this.basePath}/${notificationId}/read`
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 
                     'Notification operation failed';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const notificationsAdapter = new NotificationsAdapter();
```

## Step 6: Redux Slice for Notification State

### File: `src/store/slices/notificationSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationType } from '@/types/notification.types';

interface NotificationState {
  pushToken: string | null;
  permissionsGranted: boolean;
  unreadCount: number;
  preferences: {
    orderUpdates: boolean;
    promotions: boolean;
    priceAlerts: boolean;
    newArrivals: boolean;
  };
  lastNotification: {
    type: NotificationType;
    title: string;
    body: string;
    timestamp: number;
  } | null;
}

const initialState: NotificationState = {
  pushToken: null,
  permissionsGranted: false,
  unreadCount: 0,
  preferences: {
    orderUpdates: true,
    promotions: true,
    priceAlerts: true,
    newArrivals: true,
  },
  lastNotification: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPushToken: (state, action: PayloadAction<string>) => {
      state.pushToken = action.payload;
    },
    setPermissionsGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionsGranted = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<NotificationState['preferences']>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLastNotification: (
      state,
      action: PayloadAction<NotificationState['lastNotification']>
    ) => {
      state.lastNotification = action.payload;
    },
  },
});

export const {
  setPushToken,
  setPermissionsGranted,
  setUnreadCount,
  incrementUnreadCount,
  clearUnreadCount,
  updatePreferences,
  setLastNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
```

## Step 7: Business Logic Hook

### File: `src/hooks/useNotifications.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notifications/notification.service';
import { notificationsAdapter } from '@/services/api/adapters/notifications.adapter';
import {
  setPushToken,
  setPermissionsGranted,
  incrementUnreadCount,
  setLastNotification,
} from '@/store/slices/notificationSlice';
import { RootState } from '@/store';
import { NotificationType } from '@/types/notification.types';

/**
 * Main hook for notification management
 */
export const useNotifications = () => {
  const dispatch = useDispatch();
  const { pushToken, permissionsGranted, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  /**
   * Initialize notifications on mount
   */
  useEffect(() => {
    initializeNotifications();

    return () => {
      notificationService.removeListeners();
    };
  }, []);

  /**
   * Initialize notification service
   */
  const initializeNotifications = async () => {
    // Initialize service
    notificationService.initialize();

    // Request permissions
    const granted = await notificationService.requestPermissions();
    dispatch(setPermissionsGranted(granted));

    if (granted) {
      // Get push token
      const token = await notificationService.getExpoPushToken();
      if (token) {
        dispatch(setPushToken(token));
        
        // Register token with backend
        await registerPushToken(token);
      }

      // Setup listeners
      setupListeners();
    }
  };

  /**
   * Register push token with backend
   */
  const registerPushToken = async (token: string) => {
    try {
      await notificationsAdapter.registerPushToken({
        token,
        type: 'expo',
      });
    } catch (error) {
      console.error('Failed to register push token:', error);
    }
  };

  /**
   * Setup notification listeners
   */
  const setupListeners = () => {
    // Listen for notifications received while app is open
    notificationService.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      
      dispatch(incrementUnreadCount());
      dispatch(
        setLastNotification({
          type: notification.request.content.data?.type as NotificationType,
          title: notification.request.content.title || '',
          body: notification.request.content.body || '',
          timestamp: Date.now(),
        })
      );
    });

    // Listen for notification taps
    notificationService.addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      
      handleNotificationTap(response.notification);
    });
  };

  /**
   * Handle notification tap - Deep linking
   */
  const handleNotificationTap = useCallback(
    (notification: Notifications.Notification) => {
      const data = notification.request.content.data;
      const type = data?.type as NotificationType;

      // Route based on notification type
      switch (type) {
        case NotificationType.ORDER_PLACED:
        case NotificationType.ORDER_SHIPPED:
        case NotificationType.ORDER_DELIVERED:
          if (data?.orderId) {
            router.push(`/orders/${data.orderId}`);
          }
          break;

        case NotificationType.WISHLIST_PRICE_DROP:
        case NotificationType.NEW_ARRIVAL:
          if (data?.productId) {
            router.push(`/product/${data.productId}`);
          }
          break;

        case NotificationType.FLASH_SALE:
          if (data?.categoryId) {
            router.push(`/products?category=${data.categoryId}`);
          }
          break;

        case NotificationType.CART_REMINDER:
          router.push('/cart');
          break;

        case NotificationType.PROMOTIONAL:
          if (data?.url) {
            router.push(data.url);
          }
          break;

        default:
          router.push('/');
      }
    },
    []
  );

  /**
   * Schedule local notification
   */
  const scheduleNotification = useCallback(
    async (
      title: string,
      body: string,
      data?: any,
      trigger?: Notifications.NotificationTriggerInput
    ) => {
      return await notificationService.scheduleLocalNotification(
        {
          type: NotificationType.PROMOTIONAL,
          title,
          body,
          data,
        },
        trigger
      );
    },
    []
  );

  /**
   * Request permissions again
   */
  const requestPermissions = useCallback(async () => {
    const granted = await notificationService.requestPermissions();
    dispatch(setPermissionsGranted(granted));
    return granted;
  }, [dispatch]);

  return {
    // State
    pushToken,
    permissionsGranted,
    unreadCount,

    // Actions
    scheduleNotification,
    requestPermissions,
    clearBadge: () => notificationService.clearBadge(),
    getBadgeCount: () => notificationService.getBadgeCount(),
  };
};
```

## Step 8: Notification Settings Screen

### File: `app/(tabs)/profile/notifications.tsx`

```typescript
import { View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updatePreferences } from '@/store/slices/notificationSlice';
import { notificationsAdapter } from '@/services/api/adapters/notifications.adapter';

export default function NotificationSettingsScreen() {
  const dispatch = useDispatch();
  const preferences = useSelector(
    (state: RootState) => state.notification.preferences
  );
  
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePreference = async (
    key: keyof typeof preferences,
    value: boolean
  ) => {
    setIsUpdating(true);
    
    const newPreferences = { ...preferences, [key]: value };
    
    try {
      await notificationsAdapter.updatePreferences(newPreferences);
      dispatch(updatePreferences({ [key]: value }));
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-gray">
      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl font-bold text-text-primary mt-4 mb-2">
          Notification Settings
        </Text>
        <Text className="text-text-secondary mb-6">
          Manage your notification preferences
        </Text>

        {/* Order Updates */}
        <View className="bg-white rounded-xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-text-primary mb-1">
                Order Updates
              </Text>
              <Text className="text-sm text-text-secondary">
                Get notified about your order status
              </Text>
            </View>
            <Switch
              value={preferences.orderUpdates}
              onValueChange={(value) => updatePreference('orderUpdates', value)}
              disabled={isUpdating}
              trackColor={{ false: '#D1D5DB', true: '#D4AF37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Promotions */}
        <View className="bg-white rounded-xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-text-primary mb-1">
                Promotions & Offers
              </Text>
              <Text className="text-sm text-text-secondary">
                Receive notifications about sales and offers
              </Text>
            </View>
            <Switch
              value={preferences.promotions}
              onValueChange={(value) => updatePreference('promotions', value)}
              disabled={isUpdating}
              trackColor={{ false: '#D1D5DB', true: '#D4AF37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Price Alerts */}
        <View className="bg-white rounded-xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-text-primary mb-1">
                Price Alerts
              </Text>
              <Text className="text-sm text-text-secondary">
                Get notified when wishlist items drop in price
              </Text>
            </View>
            <Switch
              value={preferences.priceAlerts}
              onValueChange={(value) => updatePreference('priceAlerts', value)}
              disabled={isUpdating}
              trackColor={{ false: '#D1D5DB', true: '#D4AF37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* New Arrivals */}
        <View className="bg-white rounded-xl p-4 mb-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-4">
              <Text className="text-base font-semibold text-text-primary mb-1">
                New Arrivals
              </Text>
              <Text className="text-sm text-text-secondary">
                Be the first to know about new products
              </Text>
            </View>
            <Switch
              value={preferences.newArrivals}
              onValueChange={(value) => updatePreference('newArrivals', value)}
              disabled={isUpdating}
              trackColor={{ false: '#D1D5DB', true: '#D4AF37' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
```

## Step 9: Initialize in Root Layout

### File: `app/_layout.tsx` (Add notification initialization)

```typescript
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';
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

  useEffect(() => {
    console.log('Notifications permissions:', permissionsGranted);
  }, [permissionsGranted]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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

## Step 10: Testing Local Notifications

### File: `src/utils/testNotifications.ts`

```typescript
import { notificationService } from '@/services/notifications/notification.service';
import { NotificationType } from '@/types/notification.types';

/**
 * Test notification functions
 */
export const testNotifications = {
  // Immediate notification
  async sendTestNotification() {
    await notificationService.scheduleLocalNotification({
      type: NotificationType.PROMOTIONAL,
      title: '🎉 Test Notification',
      body: 'This is a test notification from Gemlay!',
      data: { test: true },
    });
  },

  // Scheduled notification (5 seconds)
  async sendScheduledNotification() {
    await notificationService.scheduleLocalNotification(
      {
        type: NotificationType.ORDER_PLACED,
        title: '📦 Order Placed',
        body: 'Your order has been placed successfully!',
        data: { orderId: 'TEST123' },
      },
      { seconds: 5 }
    );
  },

  // Repeating notification (daily)
  async sendDailyReminder() {
    await notificationService.scheduleLocalNotification(
      {
        type: NotificationType.CART_REMINDER,
        title: '🛒 Cart Reminder',
        body: 'You have items in your cart!',
        data: {},
      },
      { seconds: 60, repeats: true }
    );
  },
};
```

## Usage Examples

### Example 1: Send notification when order is placed

```typescript
// In your checkout success handler
import { notificationService } from '@/services/notifications/notification.service';

const handleOrderSuccess = async (orderId: string) => {
  await notificationService.scheduleLocalNotification({
    type: NotificationType.ORDER_PLACED,
    title: '🎉 Order Placed Successfully!',
    body: `Order #${orderId} has been placed.`,
    data: { orderId },
  });
};
```

### Example 2: Badge count management

```typescript
// Update badge when cart items change
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { notificationService } from '@/services/notifications/notification.service';

const CartBadgeManager = () => {
  const cartItemCount = useSelector((state) => state.cart.totalItems);

  useEffect(() => {
    notificationService.setBadgeCount(cartItemCount);
  }, [cartItemCount]);

  return null;
};
```

## Testing Push Notifications

```bash
# 1. Build development client
eas build --profile development --platform android

# 2. Install on device
# Download from EAS and install

# 3. Get push token from app logs

# 4. Send test notification using Expo Push Tool
# Visit: https://expo.dev/notifications
```

## Production Checklist

✅ Add notification icons (see app.json)

✅ Configure Firebase (google-services.json for Android)

✅ Set up APNs certificates (iOS)

✅ Test on physical devices

✅ Implement notification analytics

✅ Add notification sound files

✅ Handle notification permissions properly

✅ Test deep linking flows

✅ Implement notification retry logic

✅ Add notification logging for debugging