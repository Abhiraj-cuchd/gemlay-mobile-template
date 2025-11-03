import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    Modal,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Drawer Component
const DrawerMenu = ({ visible, onClose }) => {
    const [slideAnim] = useState(new Animated.Value(-width * 0.8));

    React.useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -width * 0.8,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const menuItems = [
        { id: 1, icon: 'home-outline', label: 'Home' },
        { id: 2, icon: 'grid-outline', label: 'Categories' },
        { id: 3, icon: 'heart-outline', label: 'Wishlist' },
        { id: 4, icon: 'cart-outline', label: 'My Cart' },
        { id: 5, icon: 'person-outline', label: 'My Account' },
        { id: 6, icon: 'receipt-outline', label: 'My Orders' },
        { id: 7, icon: 'gift-outline', label: 'Refer & Earn' },
        { id: 8, icon: 'settings-outline', label: 'Settings' },
        { id: 9, icon: 'help-circle-outline', label: 'Help & Support' },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View className="flex-1 flex-row">
                <Animated.View
                    style={{
                        transform: [{ translateX: slideAnim }],
                    }}
                    className="w-4/5 bg-white h-full"
                >
                    {/* Drawer Header */}
                    <View className="bg-[#0a3838] pt-12 pb-6 px-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-16 h-16 bg-[#4ec9b0] rounded-full items-center justify-center mr-4">
                                <Ionicons name="person" size={32} color="white" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold">Welcome!</Text>
                                <Text className="text-[#4ec9b0] text-sm">Login / Sign Up</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <ScrollView className="flex-1 px-4 py-6">
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                className="flex-row items-center py-4 border-b border-gray-100"
                            >
                                <Ionicons name={item.icon} size={24} color="#0a3838" />
                                <Text className="text-[#0a3838] text-base ml-4 font-medium">
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Drawer Footer */}
                    <View className="border-t border-gray-200 p-4">
                        <TouchableOpacity className="flex-row items-center py-3">
                            <Ionicons name="log-out-outline" size={24} color="#dc2626" />
                            <Text className="text-red-600 text-base ml-4 font-medium">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Overlay */}
                <TouchableOpacity
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={onClose}
                />
            </View>
        </Modal>
    );
};

export default DrawerMenu;