import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectedProps {
  category: string;
  setShowOptions: (value: boolean) => void;
  color: string;
}

export default function Selected({ category, setShowOptions, color }: SelectedProps) {
  return (
    <View className="mb-6">
      <Text className="text-slate-600 mb-2 ml-1 font-medium">Categoria</Text>
      
      <TouchableOpacity
        onPress={() => setShowOptions(true)}
        style={{ borderLeftWidth: 6, borderLeftColor: color }}
        className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row justify-between items-center"
      >
        <Text className={category ? "text-slate-800 font-bold" : "text-slate-400"}>
          {category ? category : "Selecione..."}
        </Text>
        
        <Ionicons name="chevron-down" size={20} color="#FF5A5F" />
      </TouchableOpacity>
    </View>
  );
}