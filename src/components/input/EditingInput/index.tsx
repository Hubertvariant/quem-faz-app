import { View, Text, TextInput, TextInputProps } from 'react-native';

interface EditingInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
}

export default function EditingInput({ label, value, onChangeText, multiline, ...props }: EditingInputProps) {
  return (
    <View className="mb-4">
      {/* Label com cor azul que se ajusta levemente no dark */}
      <Text className="text-xs font-bold text-blue-500 dark:text-blue-400 mb-1 ml-1">
        {label}
      </Text>
      
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor="#94a3b8" 
        className={`
          bg-white dark:bg-slate-900 
          border border-slate-300 dark:border-slate-800 
          p-4 rounded-2xl 
          text-slate-800 dark:text-slate-100
          ${multiline ? 'min-h-[100px]' : ''}
        `}
        {...props}
      />
    </View>
  );
}