import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function TalentList() {
    const [myTalents, setMyTalents] = useState<any[]>([]);

    async function getMyTalents() {

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('services')
            .select('*, profiles(*)')
            .eq('profiles.id', user.id)

        if (!error) setMyTalents(data);
    }

    useEffect(() => {
        getMyTalents();
    }, []);

    return (
        <View className="w-full mt-6">
            <Text className="text-slate-500 font-bold uppercase text-xs mt-2 mb-2">Meus Serviços Postados</Text>
            {myTalents.length === 0 ? (
                <View className="bg-white p-6 rounded-3xl border border-dashed border-slate-300 items-center">
                    <Text className="text-slate-400">Você ainda não postou nenhum talento.</Text>
                </View>
            ) : (
                myTalents.map((servico) => (
                    <View key={servico.id} className="bg-white p-4 rounded-3xl border border-slate-200 mb-3 flex-row items-center">
                        <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center">
                            <Ionicons name="construct-outline" size={24} color="#64748b" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="font-bold text-slate-800" numberOfLines={1}>{servico.title}</Text>
                            <Text className="text-slate-500 text-xs">Ativo no Mural</Text>
                        </View>
                        <TouchableOpacity className="p-2 bg-slate-50 rounded-full">
                            <Ionicons name="create-outline" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </View>
    );
}