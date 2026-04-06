import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar() {
 return (
   <View className='flex-row bg-slate-200 items-center justify-start mx-4 rounded-full px-2 py-1 mt-4'>
        <Ionicons name="search" size={20} color="#94a3b8"/>
        <TextInput
            placeholder='O que você precisa?'
            className='rounded-lg px-4 py-2 text-sm flex-1'
        />
        <TouchableOpacity onPress={() => {}} className='p-1'>
            <Ionicons name="options-outline" size={20} color="#FF5A5F" />
            <View className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
        </TouchableOpacity>
   </View>
  );
}