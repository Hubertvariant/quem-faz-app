import { View, ActivityIndicator, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, Keyboard, TouchableOpacity } from 'react-native';
import Avatar from '../components/Avatar';
import HeaderPage from '../components/Header/HeaderPage';
import Locate from '../components/Locate';
import Bios from '../components/ProfessionalCard/Bio';
import ButtomForm from '../components/buttom/ButtomForm';
import { Ionicons } from '@expo/vector-icons';
import TalentList from '../components/TalentCard/TalentList';
import ImagePickerForm from '../components/ImagePickerForm';
import EditingInput from '../components/input/EditingInput';

import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

export default function Profile() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    
    const [perfil, setPerfil] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editNome, setEditNome] = useState('');
    const [editImage, setEditImage] = useState<any[]>([]);
    const [editBio, setEditBio] = useState('');
    const [editCep, setEditCep] = useState('');
    const [editNeighborhood, setEditNeighborhood] = useState('');

    // Sincroniza dados do perfil para edição
    useEffect(() => {
        if (perfil) {
            setEditNome(perfil.full_name || '');
            setEditImage(perfil.avatar_url ? [perfil.avatar_url] : []);
            setEditBio(perfil.bio || '');
            setEditCep(perfil.cep || '');
            setEditNeighborhood(perfil.neighborhood || '');
        }
    }, [perfil]);

    useEffect(() => {
        async function getProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setPerfil(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        getProfile();
    }, []);

    useEffect(() => {
        async function getCep() {
            if (editCep?.length === 8) {
                try {
                    const resposta = await fetch(`https://viacep.com.br/ws/${editCep}/json/`);
                    const data = await resposta.json();
                    if (!data.erro) {
                        setEditNeighborhood(data.bairro);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }
        getCep();
    }, [editCep]);

    const handleBackAccount = () => {
        Alert.alert("Tem certeza?", "Sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: () => {
                supabase.auth.signOut();
                router.replace('/');
            }}
        ]);
    };

    const handleDeleteAccount = () => {
        Alert.alert("CUIDADO!", "Esta ação é permanente.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: async () => {
                try {
                    setLoading(true);
                    const { error } = await supabase.rpc('delete_user');
                    if (error) throw error;
                    await supabase.auth.signOut();
                    router.replace('/');
                } catch (error: any) {
                    Alert.alert("Erro", error.message);
                } finally {
                    setLoading(false);
                }
            }}
        ]);
    };

    async function SaveProfile() {
        try {
            Keyboard.dismiss(); // Fecha o teclado antes de salvar para evitar glitches
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let avatarUrl = perfil.avatar_url;

            if (editImage && editImage.length > 0 && editImage[0].startsWith('file://')) {
                const imageUri = editImage[0];
                const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
                const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;

                const response = await fetch(imageUri);
                const blob = await response.blob();
                const arrayBuffer = await new Response(blob).arrayBuffer();

                const { error: uploadError } = await supabase.storage
                    .from('avatar')
                    .upload(filePath, arrayBuffer, { 
                        contentType: `image/${fileExt}`,
                        upsert: true 
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('avatar')
                    .getPublicUrl(filePath);

                avatarUrl = publicUrlData.publicUrl;
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    full_name: editNome,
                    bio: editBio,
                    neighborhood: editNeighborhood,
                    cep: editCep,
                    avatar_url: avatarUrl,
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setPerfil({
                ...perfil,
                full_name: editNome,
                bio: editBio,
                neighborhood: editNeighborhood,
                cep: editCep,
                avatar_url: avatarUrl
            });

            setIsEditing(false);
            Alert.alert('Sucesso', 'Perfil atualizado!');
        } catch (error: any) {
            Alert.alert('Erro ao salvar', error.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View className='flex-1 bg-white dark:bg-slate-950 items-center justify-center'>
                <ActivityIndicator size="large" color="#FF5A5F" />
            </View>
        );
    }

    return (
        // SOLUÇÃO: View externa com cor de fundo fixa evita o espaço branco do sistema
        <View className="flex-1 bg-white dark:bg-slate-950">
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                className="flex-1"
            >
                <ScrollView 
                    contentContainerStyle={{ 
                        flexGrow: 1, 
                        paddingTop: insets.top + 8, 
                        paddingBottom: insets.bottom + 40 
                    }} 
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View className='items-center flex-1'>
                        {/* Header Dinâmico */}
                        {isEditing ? (
                            <View className='w-full p-6'>
                                <EditingInput label="NOME DO USUÁRIO" value={editNome} onChangeText={setEditNome} />
                            </View>
                        ) : (
                            <HeaderPage title={perfil?.full_name} text="Seu perfil" icon="arrow-back" buttom onPress={router.back} />
                        )}

                        {/* Foto de Perfil / Picker */}
                        <View className='w-full items-center justify-center py-4'>
                            {isEditing ? (
                                <ImagePickerForm label="FOTO DE PERFIL" limit={1} images={editImage} onChangeImages={setEditImage} />
                            ) : (
                                <Avatar fullName={perfil?.full_name} avatar={perfil?.avatar_url} button onPress={() => setIsEditing(true)} />
                            )}
                        </View>

                        {/* Bloco de Informações Profissionais */}
                        <View className='w-11/12 p-6 mt-4 bg-slate-100 dark:bg-slate-900 border-t-4 border-slate-300 dark:border-rose-500 rounded-2xl'>
                            {isEditing ? (
                                <View>
                                    <EditingInput label="CEP" value={editCep} onChangeText={setEditCep} keyboardType="numeric" maxLength={8} />
                                    {editNeighborhood && (
                                        <View className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex-row items-center mt-1 mb-2">
                                            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                            <Text className="text-emerald-700 dark:text-emerald-400 ml-2 text-xs font-medium">
                                                {editNeighborhood}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ) : (
                                <Locate local={perfil?.neighborhood} color='border-slate-200 dark:border-slate-800' />
                            )}

                            <View className='border-b border-slate-200 dark:border-slate-800 pb-6'>
                                {isEditing ? (
                                    <EditingInput label="BIO" value={editBio} onChangeText={setEditBio} multiline textAlignVertical="top" />
                                ) : (
                                    <Bios bio={perfil?.bio} />
                                )}

                                {isEditing && (
                                    <View className="mt-4">
                                        <ButtomForm label="Salvar Alterações" onPress={SaveProfile} icon iconName="save-outline" />
                                        <TouchableOpacity onPress={() => setIsEditing(false)} className="mt-4 items-center">
                                            <Text className="text-slate-500 font-medium">Cancelar Edição</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>

                            {/* Lista de Talentos */}
                            <View className='w-full items-center border-b border-slate-200 dark:border-slate-800 py-6'>
                                <TalentList />
                                <View className="mt-4 w-full">
                                    <ButtomForm label="Postar novo talento" onPress={() => router.push('/register-talent')} icon iconName="add-circle-outline" />
                                </View>
                            </View>
                        </View>

                        {/* Controle de Conta */}
                        <Text className='font-bold text-xl text-slate-600 dark:text-slate-400 mt-8 mb-2 uppercase tracking-tight'>
                            Controle de Conta
                        </Text>

                        <View className='w-11/12 p-6 mb-10 bg-slate-100 dark:bg-slate-900 border-t-4 border-slate-300 dark:border-slate-800 rounded-2xl'>
                            <View className='w-full border-b border-slate-200 dark:border-slate-800 pb-6 mb-6'>
                                <ButtomForm label="Sair da Conta" onPress={handleBackAccount} icon iconName="log-out-outline" />
                            </View>

                            <View className='w-full items-center'>
                                <View className='flex-row items-center justify-center w-full p-2 mb-4'>
                                    <Text className='font-bold text-xl dark:text-slate-100 mr-2'>ÁREA DE PERIGO</Text>
                                    <Ionicons name="warning" size={24} color="#ef4444" />
                                </View>
                                <ButtomForm label="Deletar Conta" onPress={handleDeleteAccount} icon iconName="trash-outline" color='#ef4444' />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}