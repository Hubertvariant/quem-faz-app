import { View, Text, TextInput } from 'react-native';

interface EditingInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
}

export default function EditingInput({ label, value, onChangeText, multiline }: EditingInputProps) {
    return (
        <>
            <Text className="text-xs font-bold text-blue-500 mb-1">{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                className="bg-white border border-slate-300 p-4 rounded-2xl text-slate-800"
                multiline={multiline}
            />
        </>
    );
}