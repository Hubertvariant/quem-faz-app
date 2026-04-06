import { View, TouchableOpacity, Text } from 'react-native';

export default function ButtomForm({ ...props }: any) {
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
                disabled={props.disabled}
                className="bg-rose-500 p-4 rounded-2xl items-center mt-8 shadow-md"
            >
                <Text className="text-white font-bold text-lg">
                    {props.label}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={props.onPress}
                className="mt-6 items-center"
            ></TouchableOpacity>
        </View>
    );
}