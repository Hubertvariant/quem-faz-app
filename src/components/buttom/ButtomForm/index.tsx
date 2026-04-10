import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ButtomForm({ icon, color = '#f43f5e', width = 'w-full', ...props }: any) {
    return (
        <>
            <TouchableOpacity
                onPress={props.onPress}
                disabled={props.disabled}
                activeOpacity={0.8}
                className={`p-4 rounded-2xl items-center mt-2 shadow-md flex-row justify-center gap-2 ${width}`}
                style={{ backgroundColor: color }}
            >
                {icon &&(<Ionicons name={props.iconName} size={24} color="#fff" />)}
                <Text className="text-white font-bold text-lg">
                    {props.label}
                </Text>
            </TouchableOpacity>
        </>
    );
}