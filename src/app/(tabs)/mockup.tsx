// import { View, Text, Pressable } from 'react-native';
//
// export default function HomeScreen() {
//     return (
//         <View className="flex-1 items-center justify-center bg-primary">
//             <Text className="text-white text-3xl font-bold mb-4">
//                 NativeWind Test! 🎉
//             </Text>
//
//             <View className="bg-white p-6 rounded-2xl shadow-lg m-4">
//                 <Text className="text-secondary text-xl font-semibold mb-2">
//                     This is a Card
//                 </Text>
//                 <Text className="text-text-secondary">
//                     If you can see styled text, NativeWind is working!
//                 </Text>
//             </View>
//
//             <Pressable className="bg-secondary px-6 py-3 rounded-lg mt-4 active:opacity-80">
//                 <Text className="text-white font-semibold">Press Me</Text>
//             </Pressable>
//
//             <View className="mt-6 flex-row space-x-2">
//                 <View className="w-16 h-16 bg-success rounded-full" />
//                 <View className="w-16 h-16 bg-error rounded-full" />
//                 <View className="w-16 h-16 bg-warning rounded-full" />
//             </View>
//         </View>
//     );
// }

import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  const categories = [
    { id: 1, name: "Rings", icon: "💍" },
    { id: 2, name: "Necklaces", icon: "📿" },
    { id: 3, name: "Earrings", icon: "💎" },
    { id: 4, name: "Bracelets", icon: "⌚" },
  ];

  const featuredProducts = [
    { id: 1, name: "Gold Ring", price: 25000, image: "💍" },
    { id: 2, name: "Diamond Necklace", price: 85000, image: "📿" },
    { id: 3, name: "Pearl Earrings", price: 15000, image: "💎" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-gray">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-2xl font-bold text-secondary">
            Gemlay Jewellery
          </Text>
          <Text className="text-sm text-text-secondary mt-1">
            Discover timeless elegance
          </Text>
        </View>

        {/* Search Bar - Testing NativeWind */}
        <View className="px-4 py-4">
          <Pressable className="bg-white rounded-lg px-4 py-3 flex-row items-center shadow-sm border border-gray-200">
            <Text className="text-text-secondary">🔍</Text>
            <Text className="text-text-tertiary ml-2">
              Search for jewellery...
            </Text>
          </Pressable>
        </View>

        {/* Categories - Testing horizontal scroll with NativeWind */}
        <View className="px-4 mb-4">
          <Text className="text-lg font-semibold text-text-primary mb-3">
            Shop by Category
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                className="bg-white rounded-xl p-4 mr-3 items-center justify-center shadow-sm border border-gray-100 w-24 h-24"
                onPress={() => router.push("/categories")}
              >
                <Text className="text-3xl mb-1">{category.icon}</Text>
                <Text className="text-xs font-medium text-text-primary text-center">
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products - Testing Card Component with NativeWind */}
        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-text-primary">
              Featured Products
            </Text>
            <Pressable>
              <Text className="text-sm text-primary font-medium">View All</Text>
            </Pressable>
          </View>

          {featuredProducts.map((product) => (
            <Pressable
              key={product.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-md border border-gray-100"
              onPress={() => router.push(`/product/${product.id}`)}
            >
              <View className="flex-row">
                <View className="w-20 h-20 bg-gray-100 rounded-lg items-center justify-center mr-4">
                  <Text className="text-4xl">{product.image}</Text>
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-base font-semibold text-text-primary mb-1">
                    {product.name}
                  </Text>
                  <Text className="text-lg font-bold text-primary">
                    ₹{product.price.toLocaleString("en-IN")}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <View className="bg-success/10 px-2 py-1 rounded">
                      <Text className="text-xs text-success font-medium">
                        In Stock
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="justify-center">
                  <Pressable className="bg-primary/10 rounded-full p-2">
                    <Text>❤️</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Banner - Testing gradient-like effect with NativeWind */}
        <View className="mx-4 mb-6 bg-secondary rounded-2xl p-6 overflow-hidden">
          <Text className="text-2xl font-bold text-white mb-2">
            Special Offer
          </Text>
          <Text className="text-white/80 mb-4">
            Get 20% off on your first purchase
          </Text>
          <View className="flex gap-3 flex-row">
            <Pressable className="bg-primary rounded-lg py-3 px-6 self-start">
              <Text className="text-white font-semibold">Shop Now</Text>
            </Pressable>
            <Pressable
              className="bg-primary rounded-lg py-3 px-6 self-start"
              onPress={() => router.push("/(tabs)/two")}
            >
              <Text className="text-white font-semibold">Go to Mockup</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
