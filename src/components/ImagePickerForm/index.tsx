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
        // Se o limite for 1, substitui a foto atual
        onChangeImages([selectedUris[0]]);
      } else {
        // Se for vários, adiciona à lista respeitando o limite
        const newImages = [...images, ...selectedUris].slice(0, limit);
        onChangeImages(newImages);
      }
    }
  };

  const removeImage = (uri: string) => {
    onChangeImages(images.filter(img => img !== uri));
  };

  return (
    <View className="mt-4">
      <Text className="text-slate-600 mb-2 ml-1 font-medium">
        {label} {limit > 1 && `(${images.length}/${limit})`}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {/* Botão de Adicionar: Só aparece se não atingiu o limite */}
        {images.length < limit && (
          <TouchableOpacity 
            onPress={pickImage} 
            className="w-24 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 items-center justify-center mr-3 mt-2"
          >
            <Ionicons name="camera" size={28} color="#94a3b8" />
          </TouchableOpacity>
        )}

        {/* Lista de Imagens Selecionadas */}
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
  );
}