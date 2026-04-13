// src/components/Cards/AdCard.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function AdCard() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity 
      /* AJUSTADO: bg-white -> dark:bg-slate-900 | border-slate-100 -> dark:border-slate-800 */
      className='bg-white dark:bg-slate-900 mx-4 mb-4 p-4 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800' 
      activeOpacity={0.9}
      onPress={() => router.push('/register-talent')}
    >
      <View className="flex-row">
        {/* AJUSTADO: bg-rose-100 -> dark:bg-rose-500/10 (um brilho sutil de rosa no fundo do ícone) */}
        <View className="w-20 h-20 bg-rose-100 dark:bg-rose-500/10 rounded-2xl items-center justify-center">
          <Ionicons name="sparkles" size={32} color="#FF5A5F" />
        </View>

        <View className="flex-1 ml-4 justify-center">
          <View className="flex-row justify-between items-start">
            {/* AJUSTADO: text-slate-800 -> dark:text-slate-100 */}
            <Text className="text-slate-800 dark:text-slate-100 text-base font-bold">
              Você também faz algo incrível? ✨
            </Text>
          </View>
          
          {/* AJUSTADO: text-slate-500 -> dark:text-slate-400 */}
          <Text className="text-slate-500 dark:text-slate-400 text-sm mb-1 leading-snug">
            Mostre seu talento para os vizinhos e comece a brilhar no bairro agora mesmo!
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mt-3">
        {/* O botão Rose se mantém como o CTA principal (Call to Action) */}
        <View className="bg-rose-500 py-3 flex-1 items-center justify-center rounded-2xl shadow-sm shadow-rose-300 dark:shadow-none">
          <Text className="text-white font-bold text-sm">
            Começar agora
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}