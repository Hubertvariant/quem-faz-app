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
      <Text className="text-lg font-bold text-slate-800 mb-3">O Profissional</Text>

      <View className="flex-col bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <View className='flex-row'>
          <View className="w-14 h-14 bg-rose-200 rounded-2xl items-center justify-center overflow-hidden">
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-full h-full" />
            ) : (
              <Text className="text-rose-700 font-bold text-xl">
                {/* Usamos a inicial do Nome aqui, com segurança */}
                {fullName ? fullName.charAt(0).toUpperCase() : "?"}
              </Text>
            )}
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-bold text-slate-800 text-lg leading-6">{fullName}</Text>
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              <Text className="text-slate-500 text-xs ml-1 font-medium italic">Vizinho Verificado</Text>
            </View>
          </View>
        </View>
            <Bios bio={bio as any} />
      </View>
    </View>
  );
}