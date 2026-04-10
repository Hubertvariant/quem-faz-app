import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvatarProps {
    fullName: string;
    avatar: string;
    button?: boolean
    onPress: () => void
}

export default function Avatar({ fullName, avatar, button, onPress }: AvatarProps) {
    return (
        <View>
            {avatar ? (
                <View className="w-32 h-32 bg-rose-200 border-4 border-slate-300 rounded-full items-center justify-center overflow-hidden">
                    <Image source={{ uri: avatar }} className="w-full h-full" />
                </View>
            ) : (
                <View className="w-32 h-32 bg-rose-200 border-4 border-rose-300 rounded-full items-center justify-center ">
                    <Text className="text-rose-700 font-bold text-3xl">
                        {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                    </Text>
                </View>
            )}

            {button && <TouchableOpacity className='bg-slate-100 p-2 rounded-full absolute bottom-0 border border-slate-200 flex-row items-center gap-2' style={{ right: -70 }} activeOpacity={0.8} onPress={onPress}>
                <Ionicons name='pencil-sharp' size={16} color='#64748b'/>
                <Text className='text-slate-500 text-sm'>Editar Perfil</Text>
            </TouchableOpacity>}
        </View>
    );
}