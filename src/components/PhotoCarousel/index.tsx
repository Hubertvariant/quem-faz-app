import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface PhotoCarouselProps {
  photos: string[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <View className="relative">
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveImage(slide);
        }}
        scrollEventThrottle={16}
      >
        {photos && photos.length > 0 ? (
          photos.map((uri, index) => (
            <Image 
              key={index} 
              source={{ uri }} 
              style={{ width, height: 350 }} 
              resizeMode="cover" 
            />
          ))
        ) : (
          /* AJUSTADO: bg-slate-200 -> dark:bg-slate-800 */
          <View 
            style={{ width, height: 350 }} 
            className="bg-slate-200 dark:bg-slate-800 items-center justify-center"
          >
            <Ionicons 
              name="image-outline" 
              size={64} 
              color={activeImage === 0 ? "#94a3b8" : "#475569"} 
            />
          </View>
        )}
      </ScrollView>

      {/* Indicador de Bolinhas (Paginação) */}
      {photos?.length > 1 && (
        <View className="flex-row absolute bottom-12 w-full justify-center space-x-2">
          {photos.map((_, i) => (
            <View 
              key={i} 
              /* O indicador branco com opacidade funciona bem em ambos os temas 
                 pois as fotos costumam ser o fundo aqui */
              className={`h-2 rounded-full ${
                activeImage === i 
                ? 'bg-white w-5' // Bolinha ativa um pouco mais larga para estilo moderno
                : 'bg-white/40'
              }`} 
            />
          ))}
        </View>
      )}
    </View>
  );
}