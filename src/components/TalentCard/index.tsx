import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind'; // Importante para as cores dos ícones

interface TalentCardProps {
  talent: any;
}

export default function TalentCard({ talent }: TalentCardProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const mainPhoto = talent.photos && talent.photos.length > 0 ? talent.photos[0] : null;
  const profile = Array.isArray(talent.profiles) ? talent.profiles[0] : talent.profiles;

  const handlePress = () => {
    router.push(`./details/${talent.id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      /* AJUSTADO: bg-white -> dark:bg-slate-900 | border-slate-100 -> dark:border-slate-800 */
      className="bg-white dark:bg-slate-900 mx-4 mb-4 p-4 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 flex-row"
    >
      {/* Imagem do Serviço ou Avatar */}
      {/* AJUSTADO: bg-rose-50 -> dark:bg-slate-800 */}
      <View className="w-20 h-20 bg-rose-50 dark:bg-slate-800 rounded-2xl items-center justify-center overflow-hidden">
        {mainPhoto ? (
          <Image 
            source={{ uri: mainPhoto }} 
            className="w-full h-full" 
            resizeMode="cover" 
          />
        ) : (
          <Ionicons name="image-outline" size={32} color="#FF5A5F" />
        )}
      </View>

      <View className="flex-1 ml-4 justify-center">
        <View className="flex-row justify-between items-start">
          {/* AJUSTADO: text-slate-800 -> dark:text-slate-100 */}
          <Text 
            className="text-slate-800 dark:text-slate-100 text-lg font-bold flex-1 mr-2" 
            numberOfLines={1}
          >
            {talent.title}
          </Text>
        </View>

        {/* AJUSTADO: text-slate-500 -> dark:text-slate-400 */}
        <Text className="text-slate-500 dark:text-slate-400 text-sm mb-1" numberOfLines={1}>
          {talent.category} • por {profile?.full_name || 'Vizinho'}
        </Text>
        
        <View className="flex-row items-center">
          <Ionicons name="location-sharp" size={14} color="#FF5A5F" />
          {/* AJUSTADO: text-slate-400 -> dark:text-slate-500 */}
          <Text className="text-slate-400 dark:text-slate-500 text-xs ml-1">
            {profile?.neighborhood || 'Bairro Próximo'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}