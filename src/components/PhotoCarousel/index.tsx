import React, { useState } from 'react';
import { View, ScrollView, Image, Dimensions, Text } from 'react-native';
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
          <View style={{ width, height: 350 }} className="bg-slate-200 items-center justify-center">
            <Ionicons name="image-outline" size={60} color="#94a3b8" />
          </View>
        )}
      </ScrollView>

      {/* Indicador de Bolinhas */}
      {photos?.length > 1 && (
        <View className="flex-row absolute bottom-4 w-full justify-center space-x-2">
          {photos.map((_, i) => (
            <View 
              key={i} 
              className={`h-2 w-2 rounded-full ${activeImage === i ? 'bg-white w-4' : 'bg-white/50'}`} 
            />
          ))}
        </View>
      )}
    </View>
  );
}