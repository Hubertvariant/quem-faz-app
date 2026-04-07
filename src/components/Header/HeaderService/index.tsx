import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderServiceProps {
    talent: any;
    shareService: () => void;
}

export default function HeaderService({talent, shareService}: HeaderServiceProps) {
    return (
        <>
            <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 mr-4">
                    <Text className="text-2xl font-bold text-slate-800 leading-8">{talent.title}</Text>
                    <View className="flex-row items-center mt-1">
                        <View className="bg-rose-100 px-3 py-1 rounded-full">
                            <Text className="text-rose-600 text-xs font-bold uppercase">{talent.category}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={shareService} className="bg-slate-100 p-3 rounded-full">
                    <Ionicons name="share-social" size={20} color="#64748b" />
                </TouchableOpacity>
            </View>
        </>
    );
}