import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiText } from 'moti';
import { router } from 'expo-router';

interface HeaderProps {
    title?: string;
    text?: string;
    buttom?: boolean;
    icon: "arrow-back" | "menu";
    onPress?: () => void;
}

export default function HeaderPage({ title, text, onPress, buttom, icon }: HeaderProps) {
 return (
   <View className='w-full p-6 mt-4'>
        <View className="flex-row justify-end items-center mb-4">
           {buttom && (
             <TouchableOpacity className='p-3 bg-white border border-slate-100 rounded-full shadow-sm items-center justify-center' onPress={onPress}>
                <Ionicons name={icon} size={24} color="#FF5A5F" />
             </TouchableOpacity>
           )}
        </View>
        <View>
            <MotiText 
              className='text-xl text-gray-500' 
              from={{ opacity: 0, translateX: -20 }} 
              animate={{ opacity: 1, translateX: 0 }} 
              transition={{ type: "spring", duration: 800, delay: 300 }}
            >
              {text}
            </MotiText>
            
            <MotiText 
              className='text-3xl font-bold text-slate-800 leading-tight' 
              from={{ opacity: 0, translateX: -20 }} 
              animate={{ opacity: 1, translateX: 0 }} 
              transition={{ type: "spring", duration: 800, delay: 400 }}
            >
              {title}
            </MotiText>
        </View>
   </View>
  );
}