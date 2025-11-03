import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "@/components/common/AppHeader";
import DrawerMenu from "@/components/common/Drawer";

// Home Screen Component
export default function MockupScreen() {
  const [searchQuery, setSearchQuery] = useState("Necklace");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories = [
    { id: 1, name: "Pendants", image: "💎" },
    { id: 2, name: "Bangles", image: "💎" },
    { id: 3, name: "Gold Coins", image: "💎" },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const collections = [
    {
      id: 1,
      title: "Little Sparkles",
      subtitle: "Soft, Safe, and Seriously Cute",
    },
    { id: 2, title: "Festival Favorites", subtitle: "Tradition meets style" },
    { id: 3, title: "Daily Essentials", subtitle: "Everyday elegance" },
  ];

  const onMenuPress = () => {
      setIsDrawerOpen(true);
  }
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

  return (
    <View className="flex-1 bg-[#0a2f2f] mt-6">
      <StatusBar barStyle="light-content" backgroundColor="#0a3838" />

      {/* Header */}
        <AppHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onMenuPress={onMenuPress}
        />

      <ScrollView className="flex-1">
        {/* Festive Deal Banner */}
        <View className="bg-[#0d4d4d] m-4 rounded-2xl overflow-hidden">
          <View className="p-6">
            <Text className="text-[#4ec9b0] text-5xl font-light italic mb-4">
              Festive Deal
            </Text>

            {/* Product Images */}
            <View className="flex-row justify-around items-center my-6">
              <View className="w-20 h-20 bg-gray-700 rounded-lg" />
              <View className="w-32 h-24 bg-gray-700 rounded-lg" />
              <View className="w-24 h-32 bg-gray-700 rounded-lg" />
            </View>

            {/* Discount Badge */}
            <View className="bg-[#0a3838] rounded-lg p-4 flex-row items-center justify-between">
              <View>
                <Text className="text-white text-xs">UPTO</Text>
                <Text className="text-white text-4xl font-bold">50%</Text>
                <Text className="text-white text-xs">MAKING</Text>
                <Text className="text-white text-xs">OFF CHARGES</Text>
                <Text className="text-[#4ec9b0] text-xs mt-1">
                  ON DIAMOND JEWELLERY
                </Text>
              </View>
              <TouchableOpacity className="bg-[#4ec9b0] px-6 py-2 rounded-full">
                <Text className="text-[#0a3838] font-semibold">Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Shop by Category */}
        <View className="bg-white rounded-t-3xl px-4 py-6 mt-4">
          <Text className="text-[#0a3838] text-2xl font-bold text-center mb-2">
            Shop by Category
          </Text>
          <Text className="text-gray-600 text-sm text-center mb-6">
            Explore an array of beautiful jewellery designed to suit every
            style. Shop your favourite categories and find the perfect piece to
            make any moment special.
          </Text>

          {/* Category Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} className="mr-4 items-center">
                <View className="w-36 h-36 bg-[#0d4d4d] rounded-2xl mb-2 overflow-hidden">
                  {/* Category image placeholder */}
                  <View className="w-full h-full bg-gray-700" />
                </View>
                <Text className="text-[#0a3838] font-semibold">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View className="flex-1 bg-[#0a2f2f]">
          <StatusBar barStyle="light-content" backgroundColor="#0a3838" />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Collections Section */}
            <View className="bg-white rounded-t-3xl px-4 py-6 mt-4">
              <Text className="text-[#0a3838] text-2xl font-bold text-center mb-2">
                Collections You'll Love
              </Text>
              <Text className="text-gray-600 text-sm text-center mb-6">
                Let's take a glimpse at our featured collections before diving
                in!
              </Text>

              {/* Collection Cards */}
              <View className="items-center">
                <View className="relative w-full h-80 mb-4">
                  <View className="absolute top-0 left-8 w-40 h-64 bg-pink-200 rounded-2xl z-10" />
                  <View className="absolute top-12 right-8 w-48 h-72 bg-[#0d4d4d] rounded-2xl items-center justify-center">
                    <View className="w-32 h-32 bg-gray-700 rounded-full mb-4" />
                    <Text className="text-[#4ec9b0] text-2xl font-bold text-center">
                      Little
                    </Text>
                    <Text className="text-[#4ec9b0] text-2xl font-bold text-center">
                      Sparkles
                    </Text>
                    <Text className="text-white text-xs text-center mt-2">
                      Soft, Safe, and Seriously Cute
                    </Text>
                  </View>
                  <View className="absolute top-6 right-0 w-32 h-48 bg-amber-100 rounded-2xl z-0" />
                </View>

                {/* Navigation Arrows */}
                <View className="flex-row justify-center items-center my-4">
                  <TouchableOpacity
                    className="w-10 h-10 bg-[#0a3838] rounded-full items-center justify-center mr-4"
                    onPress={() =>
                      setCurrentSlide(Math.max(0, currentSlide - 1))
                    }
                  >
                    <Ionicons name="chevron-back" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-10 h-10 bg-[#0a3838] rounded-full items-center justify-center"
                    onPress={() =>
                      setCurrentSlide(
                        Math.min(collections.length - 1, currentSlide + 1),
                      )
                    }
                  >
                    <Ionicons name="chevron-forward" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Features Section */}
            <View className="bg-white px-4 py-6">
              <View className="flex-row justify-around">
                <View className="items-center flex-1 border-r border-gray-200">
                  <Ionicons name="car-outline" size={32} color="#0a3838" />
                  <Text className="text-[#0a3838] text-xs text-center mt-2 font-semibold">
                    Free Shipping with
                  </Text>
                  <Text className="text-[#0a3838] text-xs text-center">
                    Insured Delivery
                  </Text>
                </View>
                <View className="items-center flex-1 border-r border-gray-200">
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={32}
                    color="#0a3838"
                  />
                  <Text className="text-[#0a3838] text-xs text-center mt-2 font-semibold">
                    One year Product
                  </Text>
                  <Text className="text-[#0a3838] text-xs text-center">
                    Warranty
                  </Text>
                </View>
                <View className="items-center flex-1 border-r border-gray-200">
                  <Ionicons name="repeat-outline" size={32} color="#0a3838" />
                  <Text className="text-[#0a3838] text-xs text-center mt-2 font-semibold">
                    Lifetime
                  </Text>
                  <Text className="text-[#0a3838] text-xs text-center">
                    Exchange And Buyback
                  </Text>
                </View>
                <View className="items-center flex-1">
                  <Ionicons name="ribbon-outline" size={32} color="#0a3838" />
                  <Text className="text-[#0a3838] text-xs text-center mt-2 font-semibold">
                    IGI, GIA, SGL
                  </Text>
                  <Text className="text-[#0a3838] text-xs text-center">
                    GL Certified Jewellery
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Navigation */}
          <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            <View className="flex-row justify-around py-3">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
              <View className="w-12 h-1 bg-[#0a3838] rounded-full" />
            </View>
          </View>
        </View>
      </ScrollView>
        <DrawerMenu visible={isDrawerOpen} onClose={handleCloseDrawer} />
    </View>
  );
}
