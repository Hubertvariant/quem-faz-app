import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

export default function TalentList() {
    const [myTalents, setMyTalents] = useState<any[]>([]);
    const router = useRouter();

    async function getMyTalents() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('talent_id', user.id);

        if (!error && data) {
            setMyTalents(data);
        }
    }

    useEffect(() => {
        getMyTalents();
    }, []);

    return (
        <View className="w-full mt-6">
            {/* Label: Seguindo o padrão slate-500/400 */}
            <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs mt-2 mb-3">
                Meus Serviços Postados
            </Text>
            
            {myTalents.length === 0 ? (
                /* Estado Vazio: AJUSTADO para dark:bg-slate-900/50 e borda tracejada discreta */
                <View className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 items-center">
                    <Text className="text-slate-400 dark:text-slate-500 text-sm">
                        Você ainda não postou nenhum talento.
                    </Text>
                </View>
            ) : (
                myTalents.map((servico) => (
                    /* Card de Serviço: AJUSTADO para dark:bg-slate-800 */
                    <View 
                        key={servico.id} 
                        className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 mb-3 flex-row items-center shadow-sm"
                    >
                        {/* Ícone de Categoria: Ajustado tom de cinza para o Dark Mode */}
                        <View className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl items-center justify-center">
                            <Ionicons name="construct-outline" size={24} color="#64748b" />
                        </View>
                        
                        <View className="ml-4 flex-1">
                            {/* Título: Slate-800 -> Slate-100 */}
                            <Text className="font-bold text-slate-800 dark:text-slate-100 text-base" numberOfLines={1}>
                                {servico.title}
                            </Text>
                            {/* Status: Texto mais suave no escuro */}
                            <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                Ativo no Mural
                            </Text>
                        </View>

                        {/* Botão de Edição: Blue -> Sky-400 para melhor contraste no escuro */}
                        <TouchableOpacity 
                            className="p-3 bg-slate-50 dark:bg-slate-700 rounded-full" 
                            activeOpacity={0.8} 
                            onPress={() => router.push({ 
                                pathname: '/register-talent', 
                                params: { talentId: servico.id } 
                            })}
                        >
                            <Ionicons name="create-outline" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                ))
            )}
        </View>
    );
}