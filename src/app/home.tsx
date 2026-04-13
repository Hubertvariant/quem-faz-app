import { FlatList, Text, View, ActivityIndicator, RefreshControl } from 'react-native';
import CategoryBar from '../components/CategoryBar';
import HeaderPage from '../components/Header/HeaderPage';
import SearchBar from '../components/input/SearchBar';
import TalentCard from '../components/TalentCard';
import AdCard from '../components/TalentCard/AdCard';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Importamos o hook para controlar o status bar dinamicamente
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme(); // Pega o tema atual (dark ou light)

  const [talents, setTalents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [filters, setFilters] = useState({
    city: '',
    zone: '',
    neighborhood: ''
  });

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

  const filteredTalents = useMemo(() => {
    return talents.filter((item) => {
      const title = item.title?.toLowerCase() || '';
      const description = item.description?.toLowerCase() || '';
      const search = searchQuery.toLowerCase();
      const matchesSearch = title.includes(search) || description.includes(search);

      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

      const matchesCity = filters.city 
        ? item.city?.toLowerCase().includes(filters.city.toLowerCase()) 
        : true;
        
      const matchesZone = filters.zone 
        ? item.zone?.toLowerCase().includes(filters.zone.toLowerCase()) 
        : true;
        
      const matchesNeighborhood = filters.neighborhood 
        ? item.neighborhood?.toLowerCase().includes(filters.neighborhood.toLowerCase()) 
        : true;

      return matchesSearch && matchesCategory && matchesCity && matchesZone && matchesNeighborhood;
    });
  }, [searchQuery, selectedCategory, filters, talents]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
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
    /* AJUSTE: bg-white -> dark:bg-slate-950 */
    <View 
      className="flex-1 bg-white dark:bg-slate-950" 
      style={{ paddingTop: insets.top + 8}}
    >
      {/* Dynamic StatusBar based on theme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <HeaderPage 
        text="Olá, vizinho!"
        title="O que você precisa hoje?"
        icon="person"
        buttom={true}
        onPress={() => router.push('/profile')}
      />
      
      <SearchBar 
        value={searchQuery} 
        onChangeText={setSearchQuery} 
        filters={filters}
        setFilters={setFilters}
      />

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF5A5F" />
        </View>
      ) : (
        <FlatList
          className='mt-2'
          data={filteredTalents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem} 
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor={colorScheme === 'dark' ? '#fff' : '#FF5A5F'} // Cor do spinner de refresh
            />
          }
          ListHeaderComponent={() => (
            <View>
              <CategoryBar 
                selectedCategory={selectedCategory} 
                onSelectCategory={setSelectedCategory} 
              />
              
              <View className="px-6 py-4 mt-2">
                {/* AJUSTE: text-slate-800 -> dark:text-slate-100 */}
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {searchQuery || selectedCategory || filters.city || filters.zone || filters.neighborhood 
                    ? "Resultados da sua busca" 
                    : "Talentos da vizinhança"}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View className="items-center mt-10 px-10">
              <Ionicons 
                name="search-outline" 
                size={48} 
                color={colorScheme === 'dark' ? '#475569' : '#cbd5e1'} 
              />
              <Text className="text-slate-400 dark:text-slate-500 text-center mt-4">
                Não encontramos talentos com esses filtros. Tente remover alguns critérios. 🏡
              </Text>
            </View>
          )}
          ListFooterComponent={() => 
          <View>
            <Footer />
            <View className="h-10" />
          </View>}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}