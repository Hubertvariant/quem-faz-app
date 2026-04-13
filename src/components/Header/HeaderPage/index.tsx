import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiText } from 'moti';
import { useColorScheme } from 'nativewind'; // Importante para lógica de cores de ícones

interface HeaderProps {
  title?: string;
  text?: string;
  buttom?: boolean;
  icon: "arrow-back" | "person";
  onPress?: () => void;
}

export default function HeaderPage({ title, text, onPress, buttom, icon }: HeaderProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className='w-full p-6 mt-4'>
      <View className="flex-row justify-end items-center mb-4">
        {buttom && (
          /* AJUSTE: bg-white -> dark:bg-slate-800 | border-slate-100 -> dark:border-slate-700 */
          <TouchableOpacity 
            className='p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full shadow-sm items-center justify-center' 
            onPress={onPress}
          >
            {/* O ícone continua Rose para manter a identidade, ou podemos clarear levemente no dark se preferir */}
            <Ionicons 
              name={icon} 
              size={24} 
              color={colorScheme === 'dark' ? '#FF7675' : '#FF5A5F'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <View>
        <MotiText 
          /* AJUSTE: text-gray-500 -> dark:text-slate-400 */
          className='text-xl text-gray-500 dark:text-slate-400' 
          from={{ opacity: 0, translateX: -20 }} 
          animate={{ opacity: 1, translateX: 0 }} 
          transition={{ type: "spring", duration: 800, delay: 300 }}
        >
          {text}
        </MotiText>
        
        <MotiText 
          /* AJUSTE: text-slate-800 -> dark:text-slate-100 */
          className='text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight' 
          from={{ opacity: 0, translateX: -20 }} 
          animate={{ opacity: 1, translateX: 0 }} 
          transition={{ type: "spring", duration: 800, delay: 400 }}
        >
          {title}
        </MotiText>
      </View>
    </View>
  );
}