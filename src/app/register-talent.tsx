import React, { useState, useMemo, useEffect } from 'react';
import {
  Alert, FlatList, KeyboardAvoidingView, Platform,
  Text, View, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

import ImagePickerForm from '../components/ImagePickerForm';
import ButtomForm from '../components/buttom/ButtomForm';
import CategoryItem from '../components/CategoryBar/CategoryItens';
import HeaderForm from '../components/Header/HeaderForm';
import InputForm from '../components/input/Form';
import Selected from '../components/input/Selected';

import { CATEGORIAS } from '../constants/categories';
import { supabase } from '../lib/supabase';

export default function RegisterTalent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { talentId } = useLocalSearchParams();

  const isEditing = !!talentId;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState(''); 
  const [state, setState] = useState(''); 
  const [showOptions, setShowOptions] = useState(false);

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  useEffect(() => {
    if (isEditing) {
      async function loadTalentData() {
        try {
          setFetching(true);
          const { data, error } = await supabase
            .from('services')
            .select('*, profiles(phone)')
            .eq('id', String(talentId))
            .single();

          if (error) throw error;
          if (data) {
            setServiceTitle(data.title);
            setDescription(data.description);
            setImages(data.photos || []);
            setCategory(data.category);
            setCep(data.cep || '');
            setNeighborhood(data.neighborhood || '');
            setCity(data.city || '');
            setState(data.state || '');
            if (data.profiles?.phone) setPhone(formatWhatsApp(data.profiles.phone));
          }
        } catch (error: any) {
          Alert.alert("Erro", "Não encontramos este anúncio.");
          router.back();
        } finally {
          setFetching(false);
        }
      }
      loadTalentData();
    }
  }, [talentId]);

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "");
    setCep(cleanCep);
    
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
        } else {
          Alert.alert("Erro", "CEP não encontrado.");
        }
      } catch (e) { 
        console.log("Erro CEP:", e); 
      }
    }
  };

  const processImages = async (userId: string) => {
    const finalUrls: string[] = [];
    for (const uri of images) {
      if (uri.startsWith('http')) {
        finalUrls.push(uri);
        continue;
      }
      try {
        const response = await fetch(uri);
        const arrayBuffer = await response.arrayBuffer();
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('images').upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
          upsert: true,
        });

        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        if (data?.publicUrl) finalUrls.push(data.publicUrl);
      } catch (err) { console.log("Erro imagem:", err); }
    }
    return finalUrls;
  };

  async function handleSave() {
    if (!serviceTitle || !description || !category || !cep) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado.");

      const photoUrls = await processImages(user.id);

      await supabase.from('profiles').update({ phone: phone.replace(/\D/g, "") }).eq('id', user.id);

      const serviceData = {
        talent_id: user.id,
        title: serviceTitle,
        description,
        category,
        cep,
        neighborhood,
        city,
        state,
        photos: photoUrls,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', String(talentId).trim())
          .eq('talent_id', user.id);

        if (updateError) throw updateError;
        Alert.alert("Sucesso", "Anúncio atualizado! ✨");
      } else {
        const { error: insertError } = await supabase.from('services').insert([serviceData]);
        if (insertError) throw insertError;
        Alert.alert("Sucesso", "Anúncio publicado! ✨");
      }

      router.replace('/home');
    } catch (e: any) {
      Alert.alert("Erro ao salvar", e.message || "Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert("Excluir", "Deseja apagar este anúncio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive", onPress: async () => {
          setLoading(true);
          const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', String(talentId).trim());

          if (!error) {
            Alert.alert("Pronto", "Anúncio removido.");
            router.replace('/home');
          } else {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
          setLoading(false);
        }
      }
    ]);
  }

  const selectedColor = useMemo(() => CATEGORIAS.find(c => c.name === category)?.color || '#E2E8F0', [category]);

  if (fetching) return (
    <View className="flex-1 justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color="#FF5A5F" />
    </View>
  );

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1 bg-white dark:bg-slate-950" 
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {showOptions ? (
        <View className="flex-1 px-8 mb-6">
          <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-10 mb-6">
            Escolha a Categoria
          </Text>
          <FlatList 
            data={CATEGORIAS} 
            keyExtractor={(i) => i.id.toString()} 
            renderItem={({ item }) => (
              <CategoryItem categoria={item} onPress={() => { setCategory(item.name); setShowOptions(false); }} />
            )} 
          />
          <View className="py-4">
            <ButtomForm label="Voltar" onPress={() => setShowOptions(false)} />
          </View>
        </View>
      ) : (
        <FlatList 
          data={[]} 
          renderItem={null} 
          showsVerticalScrollIndicator={false}
          // ESSENCIAL: Permite que cliques nos inputs e botões funcionem com teclado aberto
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingTop: insets.top + 8,
            paddingBottom: Platform.OS === 'ios' ? 120 : 60 // Espaço extra para o teclado não cobrir o rodapé
          }}
          ListHeaderComponent={
            <View className="px-8">
              <HeaderForm title={isEditing ? "Editar Serviço" : "Novo Serviço"} subtitle="Preencha os dados abaixo." />
              <View className="mt-8 mb-6">
                <InputForm label="Título" value={serviceTitle} onChangeText={setServiceTitle} />
                <Selected category={category} setShowOptions={setShowOptions} color={selectedColor} />
                <InputForm label="CEP" value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={8} />
                
                {city ? (
                  <View className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl mt-2 border border-slate-100 dark:border-slate-800">
                    <Text className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Localização Identificada</Text>
                    <Text className="text-slate-800 dark:text-slate-200 font-medium">{neighborhood} - {city}, {state}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          } 
          ListFooterComponent={
            <View className="px-8">
              <View className="mb-4">
                <InputForm 
                  label="Descrição" 
                  value={description} 
                  onChangeText={setDescription} 
                  multiline 
                  numberOfLines={4} 
                  textAlignVertical="top"
                />
              </View>

              <InputForm 
                label="WhatsApp" 
                value={phone} 
                onChangeText={(t: any) => setPhone(formatWhatsApp(t))} 
                keyboardType="phone-pad" 
                maxLength={15} 
              />
              
              <View className="mt-6">
                <ImagePickerForm label="Fotos" images={images} onChangeImages={setImages} limit={5} />
              </View>

              <View className="mt-10">
                <ButtomForm 
                  label={loading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Publicar")} 
                  onPress={handleSave} 
                  disabled={loading} 
                />
              </View>

              {isEditing && (
                <TouchableOpacity 
                    className="mt-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 items-center flex-row justify-center" 
                    onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  <Text className="text-red-500 font-bold ml-2">Excluir Anúncio</Text>
                </TouchableOpacity>
              )}
            </View>
          } 
        />
      )}
    </KeyboardAvoidingView>
  );
}