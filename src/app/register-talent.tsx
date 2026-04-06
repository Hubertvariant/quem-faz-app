import Constant from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import ButtomForm from '../components/buttom/ButtomForm';
import CategoryItem from '../components/CategoryBar/CategoryItens';
import HeaderForm from '../components/Header/HeaderForm';
import InputForm from '../components/input/Form';
import { CATEGORIAS } from '../constants/categories';
import { supabase } from '../lib/supabase';

const statusBarHeight = Constant.statusBarHeight + 8;

export default function RegisterTalent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  // --- 1. FUNÇÃO DE UPLOAD (CORRIGIDA) ---
  const uploadImages = async (userId: string) => {
    const uploadedUrls: string[] = [];

    for (const uri of images) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${userId}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const filePath = `talents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, blob, {
            contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      } catch (err) {
        console.error("Erro no upload de imagem:", err);
      }
    }
    return uploadedUrls;
  };

  // --- 2. LÓGICA DE SELEÇÃO DE IMAGENS ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Atualizado para evitar Warning
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...selectedUris].slice(0, 5));
    }
  };

  const removeImage = (uri: string) => {
    setImages(images.filter(img => img !== uri));
  };

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const limited = digits.slice(0, 11);
    if (limited.length <= 2) return limited;
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  };

  // --- 3. REGISTRO FINAL ---
  async function handleRegister() {
    if (!name || !bio || !category || !phone || !neighborhood) {
      Alert.alert("Atenção", "Preencha todos os campos corretamente!");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // A) Upload das fotos primeiro
      let photoUrls: string[] = [];
      if (images.length > 0) {
        photoUrls = await uploadImages(user.id);
      }

      // B) Atualiza Perfil (Tabela: profiles)
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: name,
        phone: phone.replace(/\D/g, ""),
        neighborhood: neighborhood,
        is_talent: true,
        updated_at: new Date(),
      });

      if (profileError) throw profileError;

      // C) Cria o Serviço (Tabela: services)
      const { error: serviceError } = await supabase.from('services').insert({
        talent_id: user.id,
        title: name,
        description: bio,
        category: category,
        photos: photoUrls, // Enviando o array de URLs públicas
      });

      if (serviceError) throw serviceError;

      Alert.alert("Sucesso!", "Seu talento foi publicado com sucesso! ✨");
      router.replace('/');
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível publicar seu talento agora.");
    } finally {
      setLoading(false);
    }
  }

  const selectedCategoryColor = useMemo(() =>
    CATEGORIAS.find(c => c.name === category)?.color || '#E2E8F0',
    [category]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
      style={{ paddingTop: statusBarHeight }}
    >
      {showOptions ? (
        <View className="flex-1 px-8 mb-6">
          <Text className="text-2xl font-bold text-slate-800 mt-10 mb-6">Escolha a Categoria</Text>
          <FlatList
            data={CATEGORIAS}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryItem
                categoria={item}
                onPress={() => {
                  setCategory(item.name);
                  setShowOptions(false);
                }}
              />
            )}
          />
          <ButtomForm label="Voltar" onPress={() => setShowOptions(false)} />
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={null}
          keyboardShouldPersistTaps="always"
          ListHeaderComponent={
            <View className="px-8">
              <View className="mt-10 mb-8">
                <HeaderForm title="Seu Talento" subtitle="Mostre o que você faz de melhor." />
              </View>
              <View className="space-y-4">
                <InputForm label="Nome do Serviço" placeholder="Ex: Programador Freelance" value={name} onChangeText={setName} />
                
                <Text className="text-slate-600 mb-2 ml-1 font-medium">Categoria</Text>
                <TouchableOpacity
                  onPress={() => setShowOptions(true)}
                  style={{ borderLeftWidth: 6, borderLeftColor: selectedCategoryColor }}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row justify-between items-center mb-4"
                >
                  <Text className={category ? "text-slate-800 font-bold" : "text-slate-400"}>
                    {category ? category : "Selecione..."}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#FF5A5F" />
                </TouchableOpacity>

                <InputForm label="Bairro" placeholder="Onde você atende?" value={neighborhood} onChangeText={setNeighborhood} />
              </View>
            </View>
          }
          ListFooterComponent={
            <View className="px-8 pb-10">
              <View className="space-y-4">
                <InputForm label="Descrição" placeholder="Conte um pouco sobre seu trabalho..." value={bio} onChangeText={setBio} multiline numberOfLines={4} />
                <InputForm
                  label="WhatsApp"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChangeText={(text: string) => setPhone(formatWhatsApp(text))}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
                
                <View className="mt-4">
                  <Text className="text-slate-600 mb-2 ml-1 font-medium">Fotos ({images.length}/5)</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {images.length < 5 && (
                      <TouchableOpacity
                        onPress={pickImage}
                        className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 items-center justify-center mr-3 mt-2"
                      >
                        <Ionicons name="camera" size={28} color="#94a3b8" />
                      </TouchableOpacity>
                    )}
                    {images.map((uri) => (
                      <View key={uri} className="relative mr-3 mt-2">
                        <Image source={{ uri }} className="w-24 h-24 rounded-2xl" />
                        <TouchableOpacity
                          onPress={() => removeImage(uri)}
                          className="absolute -top-1 -right-1 bg-rose-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white"
                        >
                          <Ionicons name="close" size={14} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <View className="mt-8">
                <ButtomForm label={loading ? "Publicando..." : "Publicar"} onPress={handleRegister} disabled={loading} />
              </View>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
}