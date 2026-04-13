import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  label: string;
  images: string[];
  onChangeImages: (uris: string[]) => void;
  limit?: number;
}

export default function ImagePickerForm({ label, images, onChangeImages, limit = 5 }: ImagePickerProps) {
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: limit > 1,
      selectionLimit: limit,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map(asset => asset.uri);
      
      if (limit === 1) {
        onChangeImages([selectedUris[0]]);
      } else {
        const newImages = [...images, ...selectedUris].slice(0, limit);
        onChangeImages(newImages);
      }
    }
  };

  const removeImage = (uri: string) => {
    onChangeImages(images.filter(img => img !== uri));
  };

  const isSingleImage = limit === 1;
  const ContentWrapper = isSingleImage ? View : ScrollView;
  const styleCenter = isSingleImage ? ' flex-row items-center justify-center' : 'flex-row';

  return (
    <View className="mt-4">
      {/* Label: dark:text-slate-400 */}
      <Text className="text-slate-600 dark:text-slate-400 mb-2 ml-1 font-medium text-center">
        {label} {limit > 1 && `(${images.length}/${limit})`}
      </Text>

      <ContentWrapper horizontal showsHorizontalScrollIndicator={false} className={styleCenter}>
        {/* Botão de Adicionar: AJUSTADO dark:bg-slate-900 e dark:border-slate-700 */}
        {images.length < limit && (
          <TouchableOpacity 
            onPress={pickImage} 
            className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 items-center justify-center mr-3 mt-2 shadow-sm"
          >
            <Ionicons name="camera" size={28} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {/* Lista de Imagens Selecionadas */}
        {images.map((uri) => (
          <View key={uri} className="relative mr-3 mt-2">
            <Image source={{ uri }} className="w-24 h-24 rounded-2xl border border-slate-100 dark:border-slate-800" />
            
            {/* Botão Remover: dark:border-slate-900 para destacar no fundo escuro */}
            <TouchableOpacity 
              onPress={() => removeImage(uri)} 
              className="absolute -top-1 -right-1 bg-rose-500 rounded-full w-7 h-7 items-center justify-center border-2 border-white dark:border-slate-900 shadow-md"
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ContentWrapper>
    </View>
  );
}