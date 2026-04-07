import { FlatList, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import CategoryBar from '../components/CategoryBar';
import HeaderPage from '../components/Header/HeaderPage';
import SearchBar from '../components/input/SearchBar';
import TalentCard from '../components/TalentCard';
import AdCard from '../components/TalentCard/AdCard';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Constant from 'expo-constants';
import { useRouter } from 'expo-router';


const statusBarHeight = Constant.statusBarHeight + 8;

export default function Home() {
  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();


  // --- BUSCA OS DADOS NO SUPABASE ---
  async function fetchTalents() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url,
            rating_avg,
            neighborhood
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTalents(data || []);
    } catch (error) {
      console.error("Erro ao buscar talentos:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchTalents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTalents();
  };

  // --- RENDERIZAÇÃO DOS ITENS ---
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Se for o terceiro item, mostramos o AdCard antes do TalentCard
    if (index === 2) {
      return (
        <View>
          <AdCard />
          <TalentCard talent={item} />
        </View>
      );
    }

    return <TalentCard talent={item} />;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: statusBarHeight }}>
      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
      ) : (
        <FlatList
          className='mt-4'
          data={talents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem} 
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={() => (
            <View>
              <HeaderPage 
                text="Olá, vizinho!"
                title="O que você precisa hoje?"
                icon="menu"
                buttom={true}
                onPress={() => router.push('/register-talent')}
              />
              <SearchBar />
              <CategoryBar />
              
              <View className="px-6 py-4 mt-2">
                <Text className="text-xl font-bold text-slate-800">Talentos da vizinhança</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center mt-10">
              <Text className="text-slate-400">Nenhum talento encontrado por aqui... 🏡</Text>
            </View>
          )}
          ListFooterComponent={() => <View className="h-10" />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}