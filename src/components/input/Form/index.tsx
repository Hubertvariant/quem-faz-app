import { View, Text, TextInput } from 'react-native';

export default function InputForm({...props}) {
    return (
        <View>
            <Text className="text-slate-600 mb-2 ml-1 font-medium">{props.label}</Text>
            <TextInput
                className="bg-slate-100 p-4 rounded-2xl text-slate-800"
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder={props.placeholder}
                autoCapitalize={props.autocapitalize}
                secureTextEntry={props.secureTextEntry}
                keyboardType={props.keyboardType}
            />
        </View>
    );
}