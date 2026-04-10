import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIAS } from '@/src/constants/categories';


interface HeaderServiceProps {
    talent: any;
    buttom?: boolean;
    icon: "arrow-back";
    onPress?: () => void;
}

export default function HeaderService({ talent, buttom, icon, onPress }: HeaderServiceProps) {
    const category = CATEGORIAS.find((pegar) => pegar.name === talent.category);
    return (
        <>
            <View className="flex-row justify-between items-start mt-6 p-6">
                <View className="flex-1 mr-4">
                    <Text className="text-2xl font-bold text-slate-800 leading-8">{talent.title}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="px-3 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: category?.color || '#cbd5e1' }}>
                            <Ionicons name={(category?.icon || 'help-circle') as any} size={16} color="#fff" />
                            <Text className="text-xs text-white font-bold uppercase">{talent.category}</Text>
                        </View>
                    </View>
                </View>
        <View className="flex-row justify-end items-center mb-4">
           {buttom && (
             <TouchableOpacity className='p-3 bg-white border border-slate-100 rounded-full shadow-sm items-center justify-center' onPress={onPress}>
                <Ionicons name={icon} size={24} color="#FF5A5F" />
             </TouchableOpacity>
           )}
        </View>
            </View>
        </>
    );
}