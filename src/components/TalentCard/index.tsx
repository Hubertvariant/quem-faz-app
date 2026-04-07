import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 1. Importar o hook de navegação

interface TalentCardProps {
  talent: any;
  // Removi o onPress opcional para tornar a navegação interna e automática
}

export default function TalentCard({ talent }: TalentCardProps) {
  const router = useRouter(); // 2. Inicializar o router

  const mainPhoto = talent.photos && talent.photos.length > 0 ? talent.photos[0] : null;
  const profile = Array.isArray(talent.profiles) ? talent.profiles[0] : talent.profiles;

  // 3. Função de navegação interna
  const handlePress = () => {
    router.push(`./details/${talent.id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} // 4. Chamar a rota ao clicar
      activeOpacity={0.9}
      className="bg-white mx-4 mb-4 p-4 rounded-[24px] shadow-sm border border-slate-100 flex-row"
    >
      {/* Imagem do Serviço ou Avatar */}
      <View className="w-20 h-20 bg-rose-50 rounded-2xl items-center justify-center overflow-hidden">
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
          <Text 
            className="text-slate-800 text-lg font-bold flex-1 mr-2" 
            numberOfLines={1}
          >
            {talent.title}
          </Text>
          
          <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-lg">
            <Ionicons name="star" size={14} color="#FDCB6E" />
            <Text className="text-amber-600 font-bold ml-1 text-xs">
              {profile?.rating_avg?.toFixed(1) || "5.0"}
            </Text>
          </View>
        </View>

        <Text className="text-slate-500 text-sm mb-1" numberOfLines={1}>
          {talent.category} • por {profile?.full_name || 'Vizinho'}
        </Text>
        
        <View className="flex-row items-center">
          <Ionicons name="location-sharp" size={14} color="#FF5A5F" />
          <Text className="text-slate-400 text-xs ml-1">
            {profile?.neighborhood || 'Bairro Próximo'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}