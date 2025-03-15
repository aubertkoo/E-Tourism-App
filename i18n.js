import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define translations
const resources = {
  en: {
    translation: {
      home: "Home",
      attractions: "Attractions",
      map: "Map",
      itinerary: "Itinerary",
      settings: "Settings",
      pick_date: "Pick a Date",
      pick_time: "Pick a Time",
      add_plan: "Add Plan",
      my_itinerary: "📌 My Itinerary",
      enter_trip: "Enter trip details (e.g., Visit Bako National Park)",
      trip_details: "📌 Trip Details",
      close: "Close",
      delete: "Delete",
      // Updated Settings Labels
      dark_mode: "Dark Mode",
      language: "Language",
      select_language: "Select Language",
      cancel: "Cancel",
      logout: "Logout",
      // Itinerary Screen Keys
      no_plans: "No Plans",
      deleted: "Deleted",
      itinerary_item_removed: "Itinerary Item Removed",
      updated: "Updated",
      itinerary_item_updated: "The itinerary item has been updated",
      error: "Error",
      trip_description_required: "Trip description is required",
      enter_trip_details: "Enter Trip Details",
      edit_trip: "Edit Trip",
      current_trip: "Current Trip",
      current_date: "Current Date",
      edit_date: "Edit Date",
      edit_time: "Edit Time",
      save: "Save",
      date: "Date",
      time: "Time",
      attraction: "Attraction",
      // Profile Screen Keys
      my_profile: "My Profile",
      enter_username: "Enter Username",
      enter_phone_number: "Enter Phone Number",
      save_profile: "Save Profile",
      profile_saved: "Profile Updated!",
      success: "Success",
      failed_to_update_profile: "Failed to update profile.",
      no_user: "No user is logged in.",
      ok: "OK",
    },
  },
  zh: {
    translation: {
      home: "主页",
      attractions: "景点",
      map: "地图",
      itinerary: "行程",
      settings: "设置",
      pick_date: "选择日期",
      pick_time: "选择时间",
      add_plan: "添加计划",
      my_itinerary: "📌 我的行程",
      enter_trip: "输入行程详情 (例如：访问巴哥国家公园)",
      trip_details: "📌 行程详情",
      close: "关闭",
      delete: "删除",
      // Updated Settings Labels (Chinese)
      dark_mode: "深色模式",
      language: "语言",
      select_language: "选择语言",
      cancel: "取消",
      logout: "登出",
      // Itinerary Screen Keys (Chinese translations)
      no_plans: "没有计划",
      deleted: "已删除",
      itinerary_item_removed: "行程项目已移除",
      updated: "已更新",
      itinerary_item_updated: "行程项目已更新",
      error: "错误",
      trip_description_required: "需要行程描述",
      enter_trip_details: "输入行程详情",
      edit_trip: "编辑行程",
      current_trip: "当前行程",
      current_date: "当前日期",
      edit_date: "编辑日期",
      edit_time: "编辑时间",
      save: "保存",
      date: "日期",
      time: "时间",
      attraction: "景点",
      // Profile Screen Keys (Chinese translations)
      my_profile: "我的个人资料",
      enter_username: "输入用户名",
      enter_phone_number: "输入电话号码",
      save_profile: "保存个人资料",
      profile_saved: "个人资料已更新！",
      success: "成功",
      failed_to_update_profile: "无法更新个人资料。",
      no_user: "没有用户登录。",
      ok: "确定",
    },
  },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Function to change language and save to AsyncStorage
export const changeLanguage = async (lng) => {
  await AsyncStorage.setItem("language", lng);
  i18n.changeLanguage(lng);
};

// Function to load saved language
export const loadLanguage = async () => {
  const savedLang = await AsyncStorage.getItem("language");
  if (savedLang) {
    i18n.changeLanguage(savedLang);
  }
};

export default i18n;