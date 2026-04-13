import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../lib/supabase';
import { useColorScheme } from 'nativewind';

export default function SearchBar({ value, onChangeText, filters, setFilters }: any) {
  const { colorScheme } = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selecting, setSelecting] = useState<'state' | 'city' | 'zone' | 'neighborhood' | null>(null);
  const [listData, setListData] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Funções de busca (Mantidas originais)
  const openStatePicker = async () => {
    setSelecting('state');
    setLoadingList(true);
    try {
      const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
      const data = await response.json();
      setListData(data.map((i: any) => ({ label: i.nome, value: i.sigla })));
    } finally { setLoadingList(false); }
  };

  const openCityPicker = async () => {
    if (!filters.state) return alert("Selecione um estado primeiro");
    setSelecting('city');
    setLoadingList(true);
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${filters.state}/municipios`);
      const data = await response.json();
      setListData(data.map((i: any) => ({ label: i.nome, value: i.nome })));
    } finally { setLoadingList(false); }
  };

  const openNeighborhoodPicker = async () => {
    if (!filters.city) return alert("Selecione uma cidade primeiro");
    setSelecting('neighborhood');
    setLoadingList(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('neighborhood')
        .eq('city', filters.city)
        .not('neighborhood', 'is', null);
      
      const uniqueNeighborhoods = Array.from(new Set(data?.map(i => i.neighborhood)));
      setListData(uniqueNeighborhoods.map(n => ({ label: n, value: n })));
    } finally { setLoadingList(false); }
  };

  const handleSelect = (item: any) => {
    if (selecting === 'state') {
      setFilters({ ...filters, state: item.value, city: '', neighborhood: '' });
    } else {
      setFilters({ ...filters, [selecting!]: item.value });
    }
    setSelecting(null);
  };

  return (
    <View>
      {/* Input Principal - Ajustado para dark:bg-slate-800 */}
      <View className='flex-row bg-slate-100 dark:bg-slate-800 items-center mx-4 rounded-full px-4 py-1 mt-4 border border-slate-200 dark:border-slate-700'>
        <Ionicons name="search" size={20} color={colorScheme === 'dark' ? '#64748b' : '#94a3b8'} />
        <TextInput 
          placeholder='Busque por talento...' 
          placeholderTextColor={colorScheme === 'dark' ? '#64748b' : '#94a3b8'}
          className='flex-1 px-3 py-3 text-slate-800 dark:text-slate-100' 
          value={value} 
          onChangeText={onChangeText}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="options-outline" size={24} color={filters.city ? "#FF5A5F" : "#94a3b8"} />
        </TouchableOpacity>
      </View>

      {/* Modal de Filtros */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-950">
          <View className="p-6">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-bold dark:text-slate-100">Localização</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colorScheme === 'dark' ? '#f1f5f9' : '#0f172a'} />
              </TouchableOpacity>
            </View>

            <FilterOption label="Estado" value={filters.state} onPress={openStatePicker} />
            <FilterOption label="Cidade" value={filters.city} onPress={openCityPicker} disabled={!filters.state} />
            <FilterOption label="Bairro" value={filters.neighborhood} onPress={openNeighborhoodPicker} disabled={!filters.city} />

            <TouchableOpacity 
              className="bg-rose-500 p-5 rounded-2xl mt-10 items-center shadow-lg shadow-rose-200 dark:shadow-none"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white font-bold text-lg">Aplicar Filtros</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="mt-4 items-center"
              onPress={() => setFilters({ state: '', city: '', neighborhood: '', zone: '' })}
            >
              <Text className="text-slate-400 dark:text-slate-500">Limpar tudo</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* List Picker Modal (O popup interno) */}
        <Modal visible={!!selecting} transparent animationType="fade">
          <View className="flex-1 bg-black/60 justify-center p-6">
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-h-[80%] border dark:border-slate-800">
              <Text className="text-xl font-bold mb-4 text-center dark:text-slate-100">Selecione</Text>
              
              {loadingList ? (
                <ActivityIndicator color="#FF5A5F" size="large" className="my-10" />
              ) : (
                <FlatList
                  data={listData}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      className="py-4 border-b border-slate-50 dark:border-slate-800" 
                      onPress={() => handleSelect(item)}
                    >
                      <Text className="text-slate-700 dark:text-slate-300 text-center text-lg">{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              
              <TouchableOpacity onPress={() => setSelecting(null)} className="mt-4 p-2">
                <Text className="text-rose-500 text-center font-bold text-lg">Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
}

// Sub-componente de Opção de Filtro ajustado
function FilterOption({ label, value, onPress, disabled }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled}
      /* Ajustado: bg-slate-50 -> dark:bg-slate-900 | border-slate-200 -> dark:border-slate-800 */
      className={`flex-row justify-between p-5 rounded-2xl mb-4 border ${
        disabled 
        ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-900' 
        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <Text className={`font-medium ${disabled ? 'text-slate-300 dark:text-slate-700' : 'text-slate-500 dark:text-slate-400'}`}>
        {label}
      </Text>
      <View className="flex-row items-center">
        <Text className={`font-bold mr-2 ${disabled ? 'text-slate-300 dark:text-slate-700' : 'text-slate-800 dark:text-slate-200'}`}>
            {value || 'Selecionar'}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={disabled ? "#e2e8f0" : "#64748b"} />
      </View>
    </TouchableOpacity>
  );
}