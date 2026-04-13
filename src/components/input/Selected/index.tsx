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
      {/* Label: Slate-600 -> dark:text-slate-400 */}
      <Text className="text-slate-600 dark:text-slate-400 mb-2 ml-1 font-medium">
        Categoria
      </Text>
      
      <TouchableOpacity
        onPress={() => setShowOptions(true)}
        // O borderLeftColor dinâmico continua funcionando perfeitamente no Dark Mode
        style={{ borderLeftWidth: 6, borderLeftColor: color }}
        /* AJUSTADO: bg-slate-50 -> dark:bg-slate-900 | border-slate-100 -> dark:border-slate-800 */
        className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex-row justify-between items-center"
      >
        <Text className={
          category 
            ? "text-slate-800 dark:text-slate-100 font-bold" // Texto claro quando selecionado
            : "text-slate-400 dark:text-slate-500"          // Texto discreto quando vazio
        }>
          {category ? category : "Selecione..."}
        </Text>
        
        {/* Mantivemos o Rose para o ícone para manter a identidade visual */}
        <Ionicons name="chevron-down" size={20} color="#FF5A5F" />
      </TouchableOpacity>
    </View>
  );
}