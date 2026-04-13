import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

export default function InputForm({ label, placeholder, value, onChangeText, secureTextEntry, ...props }: any) {
  const { colorScheme } = useColorScheme();
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPasswordInput = secureTextEntry;

  return (
    <View className="w-full">
      {/* Label adaptável */}
      {label && (
        <Text className="text-slate-600 dark:text-slate-300 mb-2 ml-1 font-medium">
          {label}
        </Text>
      )}
      
      <View className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 rounded-2xl flex-row items-center h-14">
        <TextInput
          className="flex-1 text-slate-800 dark:text-slate-100 h-full"
          placeholderTextColor={colorScheme === 'dark' ? '#64748b' : '#94a3b8'}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={isPasswordInput && !isPasswordVisible}
          {...props}
        />

        {isPasswordInput && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye" : "eye-off"} 
              size={22} 
              color="#94a3b8" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}