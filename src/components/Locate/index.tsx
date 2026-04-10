import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocateProps {
  local: string;
  color: "border-slate-50" | "border-slate-200";
}

export default function Locate({ local, color }: LocateProps) {
 return (
    <View className={`flex-row items-center mb-2 border-b ${color} pb-6`}>
      <View className="bg-emerald-50 p-2 rounded-lg">
        <Ionicons name="location" size={20} color="#10b981" />
      </View>
      <View className="ml-3">
        <Text className="text-slate-500 text-xs">Atende em:</Text>
        <Text className="text-slate-800 font-semibold">{local || "Não definido..."}</Text>
      </View>
    </View>
  );
}