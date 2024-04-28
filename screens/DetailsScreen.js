import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCloud, faDroplet, faWind } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";

export default function DetailsScreen() {
  const { params: item } = useRoute();

  const dayOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const date = new Date(item?.date);
  const dayName = dayOfWeek[date.getDay()];

  return (
    <View
      className="flex-1 items-center justify-evenly"
      style={{ padding: 15 }}
    >
      <View className="flex-1 text-center">
        <Text className="font-semibold text-3xl text-center">{dayName}</Text>
        <Image
          source={{ uri: "https:" + item?.day?.condition?.icon }}
          className="h-40 w-40"
        />
        <Text className="font-medium text-xl text-center">
          {item?.day?.condition?.text}
        </Text>
        <Text className="font-medium text-lg text-center mt-5">
          Other Details
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        className="mt-12"
      >
        <View className="w-24 h-32 items-center justify-center space-y-3 py-3 border border-gray-500 rounded-lg bg-gray-500 mr-4">
          <FontAwesomeIcon icon={faDroplet} size={24} color="white" />
          <Text className="text-center font-semibold text-lg text-white">
            Humidity
          </Text>
          <Text className="text-center font-medium text-lg text-white">
            {item?.day?.avghumidity}%
          </Text>
        </View>
        <View className="w-24 h-32 items-center justify-center space-y-3 py-3 border border-gray-500 rounded-lg bg-gray-500 mr-4">
          <FontAwesomeIcon icon={faWind} size={24} color="white" />
          <Text className="text-center font-semibold text-lg text-white">
            Wind
          </Text>
          <Text className="text-center font-medium text-lg text-white">
            {item?.day?.maxwind_kph} kph
          </Text>
        </View>
        <View className="w-24 h-32 items-center justify-center space-y-3 py-3 border border-gray-500 rounded-lg bg-gray-500 mr-4">
          <FontAwesomeIcon icon={faSun} size={24} color="white" />
          <Text className="text-center font-semibold text-lg text-white">
            Temp
          </Text>
          <Text className="text-center font-medium text-lg text-white">
            {item?.day?.maxtemp_c}°C
          </Text>
        </View>
        <View className="w-24 h-32 items-center justify-center space-y-3 py-3 border border-gray-500 rounded-lg bg-gray-500 mr-4">
          <FontAwesomeIcon icon={faCloud} size={24} color="white" />
          <Text className="text-center font-semibold text-lg text-white">
            Visibility
          </Text>
          <Text className="text-center font-medium text-lg text-white">
            {item?.day?.avgvis_km} km
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
