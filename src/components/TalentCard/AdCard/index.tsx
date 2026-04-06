// src/components/Cards/AdCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

export default function AdCard() {
  const router = useRouter();

  return (
    <TouchableOpacity className='bg-white mx-4 mb-4 p-4 rounded-[24px] shadow-sm border border-slate-100' activeOpacity={0.9}
    onPress={() => router.push('/register-talent')}>
        <View className="flex-row">
          <View className="w-20 h-20 bg-rose-100 rounded-2xl items-center justify-center">
            <Ionicons name="person" size={32} color="#FF5A5F" />
          </View>
          <View className="flex-1 ml-4 justify-center">
            <View className="flex-row justify-between items-start">
              <Text className="text-slate-800 text-base font-bold">Você também faz algo incrível?✨</Text>
              <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-lg">
              </View>
            </View>
            <Text className="text-slate-500 text-sm mb-1">Mostre seu talento para os vizinhos e comece a brilhar no bairro agora mesmo!</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2">
              <Text className="text-slate-200 text-xs ml-1 bg-rose-500 font-bold p-2 flex-1 text-center rounded-2xl">Começar agora</Text>
            </View>
    </TouchableOpacity>
  );
}
