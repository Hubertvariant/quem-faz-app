import { View, Text, ScrollView, Linking, ActivityIndicator, Modal, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import ButtomForm from '../../components/buttom/ButtomForm';
import PhotoCarousel from '@/src/components/PhotoCarousel';
import HeaderService from '@/src/components/Header/HeaderService';
import Locate from '@/src/components/Locate';
import ProfessionalCard from '@/src/components/ProfessionalCard';

import { REASONS } from '../../constants/reasons';
import { supabase } from '../../lib/supabase';

export default function TalentDetails() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  
  const [talent, setTalent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

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
    const cleanPhone = phone.replace(/\D/g, "");
    Linking.openURL(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`);
  };

  const handleSendReport = async () => {
    if (!selectedReason) return Alert.alert("Atenção", "Selecione um motivo.");
    
    setSendingReport(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('reports')
        .insert([{
          reporter_id: user?.id,
          service_id: talent.id,
          reason: selectedReason,
          description: reportDescription
        }]);

      if (error) throw error;

      Alert.alert("Denúncia enviada", "Recebemos sua denúncia e vamos analisar em breve.");
      setReportModalVisible(false);
      setSelectedReason('');
      setReportDescription('');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível enviar a denúncia.");
    } finally {
      setSendingReport(false);
    }
  };

  if (loading || !talent) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color="#FF5A5F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-slate-950" style={{ paddingTop: insets.top + 8}}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderService talent={talent} buttom icon="arrow-back" onPress={() => router.back()}/>
        <PhotoCarousel photos={talent.photos} />

        {/* AJUSTADO: bg-white -> dark:bg-slate-900 para o corpo do anúncio */}
        <View className="p-6 -mt-8 bg-white dark:bg-slate-900 rounded-t-[32px] shadow-2xl">
          
          {talent.profiles?.neighborhood && (
            <Locate 
                local={talent.profiles.neighborhood} 
                color={colorScheme === 'dark' ? 'border-slate-800' : 'border-slate-50'}
            />
          )}

          <View className="mb-8 mt-2">
            <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                Sobre o serviço
            </Text>
            <Text className="text-slate-600 dark:text-slate-300 leading-6 text-base">
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

          <View className="mb-10 mt-8">
            <ButtomForm label="Conversar agora" onPress={handleWhatsApp} icon iconName="logo-whatsapp"/>
            
            <Text className="text-center text-slate-400 dark:text-slate-500 text-xs mt-4">
              Ao chamar, diga que viu no Mural do Bairro!
            </Text>

            <TouchableOpacity 
              onPress={() => setReportModalVisible(true)}
              className="mt-12 flex-row justify-center items-center opacity-60"
            >
              <Ionicons name="flag-outline" size={14} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
              <Text className="text-slate-500 dark:text-slate-400 text-xs ml-2 underline">
                Denunciar este anúncio
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- MODAL DE DENÚNCIA ADAPTADO --- */}
      <Modal visible={reportModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white dark:bg-slate-900 rounded-t-[32px] p-6 h-[75%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">Denunciar Anúncio</Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Ionicons name="close-circle" size={32} color={colorScheme === 'dark' ? '#334155' : '#cbd5e1'} />
              </TouchableOpacity>
            </View>

            <Text className="text-slate-500 dark:text-slate-400 mb-4 font-medium">Qual o motivo da denúncia?</Text>
            
            <View className="flex-1">
              <FlatList 
                data={REASONS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    onPress={() => setSelectedReason(item)}
                    className={`p-4 rounded-2xl mb-2 border ${
                        selectedReason === item 
                        ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/40' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <Text className={
                        selectedReason === item 
                        ? "text-rose-600 dark:text-rose-400 font-bold" 
                        : "text-slate-600 dark:text-slate-300"
                    }>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            <TextInput 
              placeholder="Conte mais detalhes (opcional)"
              placeholderTextColor={colorScheme === 'dark' ? '#64748b' : '#94a3b8'}
              multiline
              numberOfLines={3}
              className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 mb-6 text-slate-700 dark:text-slate-200"
              value={reportDescription}
              onChangeText={setReportDescription}
            />

            <TouchableOpacity 
              disabled={sendingReport}
              onPress={handleSendReport}
              className="bg-slate-800 dark:bg-rose-600 p-5 rounded-2xl items-center shadow-lg"
            >
              {sendingReport ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">Enviar Denúncia</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}