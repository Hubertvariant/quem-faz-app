import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Adicionamos as { } para pegar a propriedade 'local' do objeto de props
export default function Locate({ local }: { local: string }) {
 return (
    <View className="flex-row items-center mb-6 border-b border-slate-50 pb-6">
      <View className="bg-emerald-50 p-2 rounded-lg">
        <Ionicons name="location" size={20} color="#10b981" />
      </View>
      <View className="ml-3">
        <Text className="text-slate-500 text-xs">Atende em:</Text>
        <Text className="text-slate-800 font-semibold">{local}</Text>
      </View>
    </View>
  );
}