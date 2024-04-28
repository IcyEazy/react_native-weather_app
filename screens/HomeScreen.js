import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { theme } from "../theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  faDroplet,
  faMapPin,
  faSearch,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faSun } from "@fortawesome/free-regular-svg-icons";
// import { debounce } from "lodash";
import { fetchForecastWeather, fetchLocations } from "../api/weather";
import ForecastCard from "../components/ForecastCard";
import * as Progress from "react-native-progress";
import debounce from "lodash.debounce";
import { getData, storeData } from "../utils/asyncStorage";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let storedCity = await getData("city");
    let cityName = "Lagos";
    if (storedCity) cityName = storedCity;
    fetchForecastWeather({
      cityName,
      days: "7",
    }).then((data) => {
      //   console.log("get forecast: ", data);
      setWeather(data); // set weather data
      setLoading(false);
    });
  };

  const handleSearch = (value) => {
    //fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        // console.log("get locations: ", data);
        setLocations(data);
      });
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []); // debounce search

  const handleLocation = (location) => {
    // console.log("location: ", location);
    setLocations([]);
    toggleSearch(false);
    // fetch weather
    setLoading(true);
    fetchForecastWeather({
      cityName: location.name,
      days: "7",
    }).then((data) => {
      //   console.log("get forecast: ", data);
      setWeather(data); // set weather data
      setLoading(false);
      storeData("city", location.name);
    });
  };

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar barStyle="light-content" />
      <Image
        blurRadius={70}
        source={require("../assets/images/astronaut.jpg")}
        className="absolute w-full h-full"
      />
      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={160} color="#0bb3b2" />
        </View>
      ) : (
        <SafeAreaView className="flex-1 flex">
          {/* search section */}
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
            <View
              className="flex-row justify-end items-center rounded-full h-16"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search"
                  placeholderTextColor="lightgray"
                  className="pl-6 pb-1 flex-1 text-base text-white"
                />
              ) : null}
              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-full p-3 m-1"
              >
                <FontAwesomeIcon icon={faSearch} size={25} color="white" />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full top-16 bg-gray-300 rounded-3xl">
                {locations.map((location, index) => {
                  let showBorder = index !== locations.length - 1;
                  let borderClass = showBorder
                    ? "border-b-2 border-b-gray-400"
                    : "";
                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(location)}
                      key={index}
                      className={`flex-row items-center p-3 border-0 px-4 mb-1 cursor-pointer ${borderClass}`}
                    >
                      <FontAwesomeIcon icon={faMapPin} size={20} color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {location?.name}, {location?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* forecast section */}
          <View className="mx-4 flex justify-around flex-1 mb-2">
            {/* location */}
            <Text className="text-2xl font-bold text-white text-center">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {" " + location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View className="flex-row justify-center">
              <Image
                source={{ uri: "https:" + current?.condition?.icon }}
                className="w-52 h-52"
              />
              {/* <FontAwesomeIcon icon={faCloudSun} size={208} color="white" /> */}
            </View>
            {/* degree celsius */}
            <View className="space-y-2">
              <Text className="text-center font-bold text-6xl text-white ml-5">
                {current?.temp_c}°C
              </Text>
              <Text className="text-center text-xl text-white tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* other stats */}
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <FontAwesomeIcon icon={faWind} size={24} color="white" />
                <Text className="text-white text-base font-semibold">
                  {current?.wind_kph} kph
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <FontAwesomeIcon icon={faDroplet} size={24} color="white" />
                <Text className="text-white text-base font-semibold">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <FontAwesomeIcon icon={faSun} size={24} color="white" />
                <Text className="text-white text-base font-semibold">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          {/* forecast for next 7 days */}
          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <FontAwesomeIcon icon={faCalendar} size={22} color="white" />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 15 }}
            >
              {weather?.forecast?.forecastday?.map((item, index) => {
                return <ForecastCard item={item} key={index} />;
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
