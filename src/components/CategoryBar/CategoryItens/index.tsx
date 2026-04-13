import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryItemProps {
  categoria: {
    id: string;
    name: string;
    icon: any;
    color: string;
  };
  onPress: () => void;
  variant?: 'vertical' | 'horizontal';
  active?: boolean;
}

export default function CategoryItem({ categoria, onPress, variant = 'vertical', active }: CategoryItemProps) {
  
  if (!categoria) return null;

  // --- VARIANTE HORIZONTAL (Usada na ScrollView da Home) ---
  if (variant === 'horizontal') {
    return (
      <View className='mr-4 items-center'>
        <TouchableOpacity 
          onPress={onPress}
          activeOpacity={0.7}
          style={{ 
            backgroundColor: categoria.color,
            // Adiciona borda branca quando ativo para destacar no Dark Mode
            borderWidth: active ? 2 : 0,
            borderColor: '#FFFFFF'
          }} 
          className={`w-12 h-12 rounded-full items-center justify-center mb-2 shadow-sm ${active ? 'scale-110' : 'opacity-90'}`}
        >
          <Ionicons name={categoria.icon} size={20} color="#fff" />
        </TouchableOpacity>
        
        <Text 
          className={`text-[10px] font-medium ${
            active 
            ? 'text-slate-900 dark:text-rose-400 font-bold' 
            : 'text-gray-700 dark:text-slate-300'
          }`}
        >
          {categoria.name}
        </Text>
      </View>
    );
  }

  // --- VARIANTE VERTICAL (Usada em Listas/Modais) ---
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center p-4 mb-2 rounded-2xl border ${
        active 
        ? 'bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/50' 
        : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'
      }`}
    >
      <View 
        style={{ backgroundColor: categoria.color }} 
        className="w-10 h-10 rounded-full items-center justify-center mr-4 shadow-sm"
      >
        <Ionicons name={categoria.icon} size={18} color="#fff" />
      </View>
      
      <Text 
        className={`font-bold text-base ${
          active 
          ? 'text-rose-600 dark:text-rose-400' 
          : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {categoria.name}
      </Text>

      {active && (
        <View className="ml-auto">
          <Ionicons name="checkmark-circle" size={20} color="#FF5A5F" />
        </View>
      )}
    </TouchableOpacity>
  );
}