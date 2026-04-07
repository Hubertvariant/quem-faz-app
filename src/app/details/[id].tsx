import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  View, Text, Image, ScrollView, TouchableOpacity, 
  Linking, ActivityIndicator, Share, Alert 
} from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import ButtomForm from '../../components/buttom/ButtomForm';
import PhotoCarousel from '@/src/components/PhotoCarousel';
import HeaderPage from '@/src/components/Header/HeaderPage';

export default function TalentDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('*, profiles(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTalent(data);
      } catch (error: any) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    if (id) getDetails();
  }, [id]);

  const handleWhatsApp = () => {
    const phone = talent?.profiles?.phone;
    if (!phone) return Alert.alert("Erro", "Telefone não disponível.");
    const message = `Olá! Vi seu anúncio de "${talent.title}" no Mural do Bairro.`;
    // Adicionei o código do país 55 caso não venha do banco
    const cleanPhone = phone.replace(/\D/g, "");
    Linking.openURL(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`);
  };

  const shareService = async () => {
    try {
      await Share.share({
        message: `Olha esse serviço de ${talent.title} no nosso bairro! Confira no app.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loading || !talent) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderPage 
          title="Detalhes" 
          text={talent.category} 
          icon="arrow-back" 
          buttom 
          onPress={() => router.back()}
        />
        
        <PhotoCarousel photos={talent.photos}/>

        <View className="p-6 -mt-6 bg-white rounded-t-[32px]">
          {/* CABEÇALHO DO SERVIÇO */}
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

          {/* LOCALIZAÇÃO RÁPIDA */}
          <View className="flex-row items-center mb-6 border-b border-slate-50 pb-6">
            <View className="bg-emerald-50 p-2 rounded-lg">
              <Ionicons name="location" size={20} color="#10b981" />
            </View>
            <View className="ml-3">
              <Text className="text-slate-500 text-xs">Atende em:</Text>
              <Text className="text-slate-800 font-semibold">{talent.profiles?.neighborhood}</Text>
            </View>
          </View>

          {/* DESCRIÇÃO */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-slate-800 mb-2">Sobre o serviço</Text>
            <Text className="text-slate-600 leading-6 text-base">
              {talent.description}
            </Text>
          </View>

          {/* CARD DO PROFISSIONAL */}
          <Text className="text-lg font-bold text-slate-800 mb-3">O Profissional</Text>
          <View className="flex-row items-center bg-slate-50 p-4 rounded-3xl mb-8 border border-slate-100">
            <View className="w-14 h-14 bg-rose-200 rounded-2xl items-center justify-center overflow-hidden">
              {talent.profiles?.avatar_url ? (
                <Image source={{ uri: talent.profiles.avatar_url }} className="w-full h-full" />
              ) : (
                <Text className="text-rose-700 font-bold text-xl">
                  {talent.profiles?.full_name?.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-bold text-slate-800 text-lg leading-6">{talent.profiles?.full_name}</Text>
              <View className="flex-row items-center">
                <Ionicons name="checkmark" size={14} color="#64748b" />
                <Text className="text-slate-500 text-xs ml-1 font-medium italic">Vizinho Verificado</Text>
              </View>
            </View>
          </View>

          <View className="mb-10">
             <ButtomForm 
                label="Conversar agora" 
                onPress={handleWhatsApp} 
             />
             <Text className="text-center text-slate-400 text-xs mt-4">
               Ao chamar, diga que viu no Mural do Bairro!
             </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}