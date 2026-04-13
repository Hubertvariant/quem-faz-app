import { View } from 'react-native';
import { MotiText } from 'moti';

interface HeaderFormProps {
  title: string;
  subtitle: string;
}

export default function HeaderForm({ title, subtitle }: HeaderFormProps) {
  return (
    <View>
      <MotiText 
        className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2"
        from={{ opacity: 0, translateY: -200 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 300 }}
      >
        {title}
      </MotiText>
      
      <MotiText 
        className="text-slate-500 dark:text-slate-400 mb-10"
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 800, delay: 300 }}
      >
        {subtitle}
      </MotiText>
    </View>
  );
}