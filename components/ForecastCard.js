import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { theme } from "../theme";
import { useNavigation } from "@react-navigation/native";

export default function ForecastCard({ item }) {
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

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Details", item)}
      className="cursor-pointer"
    >
      <View
        className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
        style={{ backgroundColor: theme.bgWhite(0.15) }}
      >
        <Image
          source={{ uri: "https:" + item?.day?.condition?.icon }}
          className="h-11 w-11"
        />
        <Text className="text-white">{dayName}</Text>
        <Text className="text-white text-xl font-semibold">
          {item?.day?.maxtemp_c}°C
        </Text>
        {/* <Text className="text-white text-xl font-semibold">
          {item?.day?.avghumidity}%
        </Text> */}
      </View>
    </TouchableOpacity>
  );
}
