import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Bios from './Bio';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';

interface ProfessionalCardProps {
  fullName: string;
  avatar?: string;
  bio?: string;
}

export default function ProfessionalCard({ fullName, avatar, bio }: ProfessionalCardProps) {

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/')
  }

  return (
    <View className="mb-8">
      {/* Título da seção: Slate-800 -> Slate-100 no dark */}
      <Text className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">
        O Profissional
      </Text>

      {/* Card principal: bg-slate-50 -> dark:bg-slate-800 */}
      <View className="flex-col bg-slate-50 dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <View className='flex-row'>
          
          {/* Container do Avatar/Iniciais: No dark o rose-200 vira um tom mais fechado */}
          <View className="w-14 h-14 bg-rose-200 dark:bg-rose-900/30 rounded-2xl items-center justify-center overflow-hidden">
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-full h-full" />
            ) : (
              <Text className="text-rose-700 dark:text-rose-400 font-bold text-xl">
                {fullName ? fullName.charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>

          <View className="ml-4 flex-1 justify-center">
            {/* Nome: Slate-800 -> Slate-100 */}
            <Text className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-6">
              {fullName}
            </Text>
            
            <View className="flex-row items-center mt-0.5">
              <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              <Text className="text-slate-500 dark:text-slate-400 text-xs ml-1 font-medium italic">
                Vizinho Verificado
              </Text>
            </View>
          </View>
        </View>

        {/* O componente Bios já está configurado para dark mode */}
        <Bios bio={bio as any} />
      </View>
    </View>
  );
}