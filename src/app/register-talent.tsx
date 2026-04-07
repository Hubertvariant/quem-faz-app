import React, { useState, useMemo, useEffect } from 'react';
import { 
  Alert, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  Text, 
  TouchableOpacity, 
  View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constant from 'expo-constants';
import { useRouter } from 'expo-router';
// Componentes Personalizados
import ImagePickerForm from '../components/ImagePickerForm';
import ButtomForm from '../components/buttom/ButtomForm';
import CategoryItem from '../components/CategoryBar/CategoryItens';
import HeaderForm from '../components/Header/HeaderForm';
import InputForm from '../components/input/Form';
import Selected from '../components/input/Selected';

// Configurações e Libs
import { CATEGORIAS } from '../constants/categories';
import { supabase } from '../lib/supabase';

const statusBarHeight = Constant.statusBarHeight + 8;

export default function RegisterTalent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // --- ESTADOS DOS DADOS ---
  const [userName, setUserName] = useState('');
  const [serviceTitle, setServiceTitle] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [neighborhood, setNeighborhood] = useState(''); 
  const [showOptions, setShowOptions] = useState(false);

  // 1. Busca nome do perfil (Cadastro Inicial)
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();

          if (error) throw error;
          if (data?.full_name) setUserName(data.full_name);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }
    loadUserProfile();
  }, []);

  // 2. Busca de CEP e preenchimento de Bairro
  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "");
    setCep(cleanCep);

    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (data.erro) {
          Alert.alert("Atenção", "CEP não encontrado.");
          setNeighborhood('');
          return;
        }

        setNeighborhood(data.bairro || data.localidade || '');
      } catch (error) {
        console.error("Erro viaCEP:", error);
      }
    } else {
      setNeighborhood(''); 
    }
  };

  // 3. Upload de Imagens para o Storage
  const uploadImages = async (userId: string) => {
    const uploadedUrls: string[] = [];
    for (const uri of images) {
      try {
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
      } catch (err) {
        console.error("Erro no upload:", err);
        throw new Error("Falha ao enviar fotos.");
      }
    }
    return uploadedUrls;
  };

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  // 4. Registro Final (Perfil + Serviço)
  async function handleRegister() {
    if (!serviceTitle || !bio || !category || !phone || !cep || !neighborhood) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente!");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let photoUrls: string[] = [];
      if (images.length > 0) {
        photoUrls = await uploadImages(user.id);
      }

      // Atualiza Perfil com Localização
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: userName,
        phone: phone.replace(/\D/g, ""),
        neighborhood,
        cep,
        is_talent: true,
        updated_at: new Date(),
      });

      if (profileError) throw profileError;

      // Cria o Serviço/Anúncio
      const { error: serviceError } = await supabase.from('services').insert({
        talent_id: user.id,
        title: serviceTitle,
        description: bio,
        category,
        photos: photoUrls,
      });

      if (serviceError) throw serviceError;

      Alert.alert("Sucesso!", "Seu talento foi publicado! ✨");
      router.replace('/');

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível completar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCategoryColor = useMemo(() =>
    CATEGORIAS.find(c => c.name === category)?.color || '#E2E8F0',
    [category]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white" style={{ paddingTop: statusBarHeight }}>
      {showOptions ? (
        <View className="flex-1 px-8 mb-6">
          <Text className="text-2xl font-bold text-slate-800 mt-10 mb-6">Escolha a Categoria</Text>
          <FlatList data={CATEGORIAS} showsVerticalScrollIndicator={false} keyExtractor={(item) => item.id} renderItem={({ item }) => (
              <CategoryItem categoria={item} onPress={() => { setCategory(item.name); setShowOptions(false); }}/>
            )}
          />
          <ButtomForm label="Voltar" onPress={() => setShowOptions(false)} />
        </View>
      ) : (
        <FlatList data={[]} renderItem={null} keyboardShouldPersistTaps="always" ListHeaderComponent={
            <View className="px-8">
              <View className="mt-10 mb-8">
                <HeaderForm title="Seu Talento" subtitle={`Olá, ${userName || 'vizinho'}! Vamos configurar seu anúncio.`}/>
              </View>

              <View className="mb-6">
                <InputForm label="Título do Serviço" placeholder="Ex: Marmitas Fitness" value={serviceTitle} onChangeText={setServiceTitle}/>
              

              <Selected category={category} setShowOptions={setShowOptions} color={selectedCategoryColor}/>

              
                <InputForm label="Seu CEP" placeholder="Ex: 86700000" value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={8}/>
                
                {neighborhood ? (
                  <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex-row items-center mt-3">
                    <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                    <Text className="text-emerald-700 ml-2 font-medium">Localizado em: {neighborhood}</Text>
                  </View>
                ) : (
                  cep.length === 8 && (
                    <View className="mt-3">
                      <InputForm label="Bairro" placeholder="Digite o bairro manualmente" value={neighborhood} onChangeText={setNeighborhood}/>
                    </View>
                  )
                )}
              </View>
            </View>
          }
          ListFooterComponent={
            <View className="px-8 pb-10">
              <View className="mb-6">
                <InputForm label="Descrição" placeholder="Detalhes sobre seu serviço..." value={bio} onChangeText={setBio} multiline numberOfLines={4}/>
              </View>

              <View className="mb-6">
                <InputForm label="WhatsApp para Contato" placeholder="(00) 00000-0000" value={phone} onChangeText={(text: string) => setPhone(formatWhatsApp(text))} keyboardType="phone-pad" maxLength={15}/>
              </View>

              <View className="mb-10">
                <ImagePickerForm label="Fotos do Trabalho" images={images} onChangeImages={setImages} limit={5}/>
              </View>

              <ButtomForm label={loading ? "Publicando..." : "Publicar Talento"} onPress={handleRegister} disabled={loading} />
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}