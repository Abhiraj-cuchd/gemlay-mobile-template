import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const AppHeader = ({ searchQuery, onSearchChange, onMenuPress }) => {
    return (
        <View className="bg-[#0a3838] pt-12 pb-4 px-4">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={onMenuPress}>
                    <Ionicons name="menu" size={28} color="white" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-[#4ec9b0] rounded mr-2" />
                    <Text className="text-white text-xl font-bold">GEMLAY</Text>
                </View>

                <View className="flex-row">
                    <TouchableOpacity className="mr-3 relative">
                        <Ionicons name="heart-outline" size={24} color="white" />
                        <View className="absolute -top-1 -right-1 bg-[#4ec9b0] rounded-full w-4 h-4 items-center justify-center">
                            <Text className="text-white text-xs">0</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="relative">
                        <Ionicons name="cart-outline" size={24} color="white" />
                        <View className="absolute -top-1 -right-1 bg-[#4ec9b0] rounded-full w-4 h-4 items-center justify-center">
                            <Text className="text-white text-xs">0</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-[#0a3838] py-2">
                <Text className="text-white text-center text-sm">
                    Refer and earn extra discount
                </Text>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-[#1a4848] rounded-full px-4 py-3 mt-4">
                <Text className="text-gray-400 mr-2">Search</Text>
                <TextInput
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    className="flex-1 text-white"
                    placeholderTextColor="#666"
                />
                <TouchableOpacity className="mr-3">
                    <Ionicons name="camera-outline" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default AppHeader;