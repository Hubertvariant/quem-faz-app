import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfessionalCardProps {
    fullName: string;
    role: string;
    avatar: string;
}


export default function ProfessionalCard({ fullName, role, avatar }: ProfessionalCardProps) {
 return (
    <>
        <Text className="text-lg font-bold text-slate-800 mb-3">O Profissional</Text>
          <View className="flex-row items-center bg-slate-50 p-4 rounded-3xl mb-8 border border-slate-100">
            <View className="w-14 h-14 bg-rose-200 rounded-2xl items-center justify-center overflow-hidden">
              {avatar ? (
                <Image source={{ uri:  }} className="w-full h-full" />
              ) : (
                <Text className="text-rose-700 font-bold text-xl">
                  {fullName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-bold text-slate-800 text-lg leading-6">{fullName}</Text>
              <View className="flex-row items-center">
                <Ionicons name="checkmark" size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1 font-medium italic">{role}</Text>
              </View>
            </View>
          </View>
   </>
  );
}