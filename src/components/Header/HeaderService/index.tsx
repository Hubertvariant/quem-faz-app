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
        <View className="flex-row justify-between items-start mt-6 p-6">
            <View className="flex-1 mr-4">
                {/* AJUSTADO: text-slate-800 -> dark:text-slate-100 */}
                <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-8">
                    {talent.title}
                </Text>

                <View className="flex-row items-center mt-2">
                    {/* Badge de Categoria: A cor vem do constante, mas adicionamos uma leve sombra para destaque */}
                    <View 
                        className="px-3 py-1 rounded-full flex-row items-center gap-1 shadow-sm" 
                        style={{ backgroundColor: category?.color || '#cbd5e1' }}
                    >
                        <Ionicons name={(category?.icon || 'help-circle') as any} size={14} color="#fff" />
                        <Text className="text-[10px] text-white font-black uppercase tracking-wider">
                            {talent.category}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-end items-center">
               {buttom && (
                 /* AJUSTADO: bg-white -> dark:bg-slate-800 | border-slate-100 -> dark:border-slate-700 */
                 <TouchableOpacity 
                    className='p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm items-center justify-center active:opacity-70' 
                    onPress={onPress}
                 >
                    <Ionicons name={icon} size={24} color="#FF5A5F" />
                 </TouchableOpacity>
               )}
            </View>
        </View>
    );
}