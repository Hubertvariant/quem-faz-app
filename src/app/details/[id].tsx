import { View, Text, ScrollView, Linking, ActivityIndicator, Share, Alert} from 'react-native';
import ButtomForm from '../../components/buttom/ButtomForm';
import PhotoCarousel from '@/src/components/PhotoCarousel';
import HeaderService from '@/src/components/Header/HeaderService';
import Locate from '@/src/components/Locate';
import ProfessionalCard from '@/src/components/ProfessionalCard';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TalentDetails() {
  const insets = useSafeAreaInsets();
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


  if (loading || !talent) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  console.log("Dados do Perfil:", talent.profiles);
  return (
    <View className="flex-1 bg-white " style={{ paddingTop: insets.top + 8}}>
      <ScrollView showsVerticalScrollIndicator={false}>

          <HeaderService talent={talent} buttom icon="arrow-back" onPress={() => router.back()}/>

          <PhotoCarousel photos={talent.photos} />

        <View className="p-6 -mt-6 bg-white rounded-t-[32px]">

          {talent.profiles?.neighborhood && (
            <Locate local={talent.profiles.neighborhood} color='border-slate-50'/>
          )}

          <View className="mb-8">
            <Text className="text-lg font-bold text-slate-800 mb-2">Sobre o serviço</Text>
            <Text className="text-slate-600 leading-6 text-base">
              {talent.description || "Sem descrição disponível."}
            </Text>
          </View>

          {talent.profiles && (
            <ProfessionalCard 
              fullName={talent.profiles.full_name} 
              avatar={talent.profiles.avatar_url} 
              bio={talent.profiles.bio}
            />
          )}

          <View className="mb-10">
            <ButtomForm label="Conversar agora" onPress={handleWhatsApp} icon iconName="logo-whatsapp"/>
            <Text className="text-center text-slate-400 text-xs mt-4">
              Ao chamar, diga que viu no Mural do Bairro!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}