import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
    fullName: string;
    avatar: string;
    button?: boolean;
    onPress: () => void;
}

export default function Avatar({ fullName, avatar, button, onPress }: AvatarProps) {
    return (
        <View className="items-center justify-center">
            {avatar ? (
                /* AJUSTADO: border-slate-300 -> dark:border-slate-700 */
                <View className="w-32 h-32 bg-rose-200 dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 rounded-full items-center justify-center overflow-hidden shadow-sm">
                    <Image source={{ uri: avatar }} className="w-full h-full" />
                </View>
            ) : (
                /* AJUSTADO: bg-rose-200 -> dark:bg-rose-500/20 | border-rose-300 -> dark:border-rose-500/30 */
                <View className="w-32 h-32 bg-rose-200 dark:bg-rose-500/20 border-4 border-rose-300 dark:border-rose-500/30 rounded-full items-center justify-center shadow-sm">
                    <Text className="text-rose-700 dark:text-rose-400 font-bold text-4xl">
                        {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                    </Text>
                </View>
            )}

            {button && (
                /* AJUSTADO: bg-slate-100 -> dark:bg-slate-800 | border-slate-200 -> dark:border-slate-700 */
                <TouchableOpacity 
                    className='bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full absolute bottom-0 border border-slate-200 dark:border-slate-700 flex-row items-center gap-2 shadow-lg' 
                    style={{ right: -40 }} // Ajustei o posicionamento para ficar mais orgânico
                    activeOpacity={0.8} 
                    onPress={onPress}
                >
                    <Ionicons name='pencil-sharp' size={16} color='#FF5A5F'/>
                    <Text className='text-slate-600 dark:text-slate-200 text-xs font-bold'>Editar Perfil</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}