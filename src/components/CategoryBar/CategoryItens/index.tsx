import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryItem({ categoria, onPress, variant = 'vertical' }: any) {
  
  if (!categoria) return null;

  if (variant === 'horizontal') {
    return (
      <View className='mr-4 items-center'>
        <TouchableOpacity 
          onPress={onPress}
          style={{ backgroundColor: categoria.color }} 
          className='w-12 h-12 rounded-full items-center justify-center mb-2'
        >
          <Ionicons name={categoria.icon} size={20} color="#fff" />
        </TouchableOpacity>
        <Text className='text-[10px] text-gray-700'>{categoria.name}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-4 mb-2 bg-slate-50 rounded-2xl border border-slate-100"
    >
      <View 
        style={{ backgroundColor: categoria.color }} 
        className="w-10 h-10 rounded-full items-center justify-center mr-4 shadow-sm"
      >
        <Ionicons name={categoria.icon} size={18} color="#fff" />
      </View>
      <Text className="text-slate-700 font-bold text-base">{categoria.name}</Text>
    </TouchableOpacity>
  );
}