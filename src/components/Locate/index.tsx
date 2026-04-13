import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocateProps {
  local: string;
  // Mantive a prop color mas adicionei a flexibilidade do dark mode nela
  color?: string; 
}

export default function Locate({ local, color = "border-slate-200 dark:border-slate-800" }: LocateProps) {
 return (
    <View className={`flex-row items-center mb-2 border-b ${color} pb-6`}>
      {/* Badge do Ícone: No Dark Mode usamos uma opacidade de 10-20% do verde */}
      <View className="bg-emerald-50 dark:bg-emerald-500/10 p-2 rounded-lg">
        <Ionicons name="location" size={20} color="#10b981" />
      </View>

      <View className="ml-3">
        {/* Label: Slate-500 no light, Slate-400 no dark para mais contraste */}
        <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          Atende em:
        </Text>
        
        {/* Valor: Slate-800 no light, Slate-100 (nosso off-white) no dark */}
        <Text className="text-slate-800 dark:text-slate-100 font-semibold text-base">
          {local || "Não definido..."}
        </Text>
      </View>
    </View>
  );
}