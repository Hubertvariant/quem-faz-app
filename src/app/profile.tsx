import { View, ActivityIndicator, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Avatar from '../components/Avatar';
import HeaderPage from '../components/Header/HeaderPage';
import Locate from '../components/Locate';
import Bios from '../components/ProfessionalCard/Bio';
import ButtomForm from '../components/buttom/ButtomForm';
import { Ionicons } from '@expo/vector-icons';
import TalentList from '../components/TalentCard/TalentList';
import ImagePickerForm from '../components/ImagePickerForm';
import EditingInput from '../components/input/EditingInput';

import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

export default function Profile() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [perfil, setPerfil] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editNome, setEditNome] = useState(perfil?.full_name);
    const [editImage, setEditImage] = useState(perfil?.avatar_url);
    const [editBio, setEditBio] = useState(perfil?.bio);
    const [editCep, setEditCep] = useState(perfil?.cep);
    const [editNeighborhood, setEditNeighborhood] = useState(perfil?.neighborhood);

    useEffect(() => {
        if (perfil) {
            setEditNome(perfil.full_name);
            setEditImage(perfil.avatar_url ? [perfil.avatar_url] : []);
            setEditBio(perfil.bio);
            setEditCep(perfil.cep);
            setEditNeighborhood(perfil.neighborhood);
        }
    }, [perfil])

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
        } getProfile();
    }, [])

    useEffect(() => {
        async function getCep() {
            if (editCep?.length == 8) {
                try {
                    const resposta = await fetch(`https://viacep.com.br/ws/${editCep}/json/`);
                    const data = await resposta.json();
                    if (!data.erro) {
                        setEditNeighborhood(data.bairro)
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } getCep();
    }, [editCep])

    const handleBackAccount = () => {
        Alert.alert(
            "Tem certeza?",
            "Esta ação te redirecionará para a tela de login e sair da sua conta.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair", style: "destructive", onPress: () => {
                        supabase.auth.signOut();
                        router.replace('/');
                    }
                }
            ]
        );
    };

const handleDeleteAccount = () => {
    Alert.alert(
        "Tem certeza?",
        "Esta ação excluirá sua conta e todos os seus dados permanentemente.",
        [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir", style: "destructive", onPress: async () => {
                    try {
                        setLoading(true);

                        const { error } = await supabase.rpc('delete_user');

                        if (error) throw error;

                        await supabase.auth.signOut();
                        
                        router.replace('/');

                    } catch (error: any) {
                        console.error(error);
                        Alert.alert("Erro", "Não foi possível excluir a conta: " + error.message);
                    } finally {
                        setLoading(false);
                    }
                }
            }
        ]
    );
};

async function SaveProfile() {
    try {
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
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');

    } catch (error: any) {
        console.error("Erro detalhado:", error);
        Alert.alert('Erro ao salvar', error.message || 'Ocorreu um erro inesperado.');
    } finally {
        setLoading(false);
    }
}
    if (loading) {
        return (
            <View className='flex-1 bg-slate-50 items-center justify-center'>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} className="bg-slate-50">
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 }} keyboardShouldPersistTaps="handled">
                <View className='items-center'>
                    {isEditing ? (
                        <View className='w-full p-6'>
                            <EditingInput label="NOME DO USUARIO" value={editNome} onChangeText={setEditNome} />
                        </View>
                    ) : (
                        <HeaderPage title={perfil?.full_name} text="Seu perfil" icon="arrow-back" buttom onPress={router.back} />
                    )}
                    <View className='w-full items-center justify-center py-4'>
                        {isEditing ? (
                            <ImagePickerForm label="FOTO DE PERFIL" limit={1} images={editImage} onChangeImages={setEditImage} />
                        ) : (
                            <Avatar fullName={perfil?.full_name} avatar={perfil?.avatar_url} button onPress={() => setIsEditing(true)} />
                        )}
                    </View>
                    <View className='w-11/12 p-6 mt-4 bg-slate-100 border-t-4 border-slate-300 rounded-2xl'>
                        {isEditing ? (
                            <View>
                                <EditingInput label="CEP" value={editCep} onChangeText={setEditCep} />
                                {editNeighborhood && (
                                    <View className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 flex-row items-center mt-1 mb-2 ">
                                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                        <Text className="text-emerald-700 ml-2 text-xs font-medium">
                                            {editNeighborhood}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <Locate local={perfil?.neighborhood} color='border-slate-200' />
                        )}
                        <View className='border-b border-slate-200 pb-6'>
                            {isEditing ? (
                                <EditingInput label="BIO" value={editBio} onChangeText={setEditBio} multiline />
                            ) : (
                                <Bios bio={perfil?.bio} />
                            )}

                            {isEditing ? (
                                <ButtomForm label="Salvar" onPress={() => { SaveProfile() }} icon iconName="save-outline" />
                            ) : (
                                <></>
                            )}

                        </View>
                        <View className='w-full items-center border-b border-slate-200 pb-6'>
                            <TalentList />
                            <ButtomForm label="Postar novo talento" onPress={() => { router.push('/register-talent') }} icon iconName="add-circle-outline" width='' />
                        </View>
                    </View>
                    <Text className='font-bold text-2xl text-slate-600 mt-2'>CONTROLE DE CONTA</Text>
                    <View className='w-11/12 p-6 mt-4 bg-slate-100 border-t-4 border-slate-300 rounded-2xl'>
                        <View className='w-full border-b border-slate-200 pb-6 mb-6'>
                            <ButtomForm label="Sair da Conta" onPress={() => { handleBackAccount() }} icon iconName="log-out-outline" />
                        </View>
                        <View className='w-full items-center border-b border-slate-200 pb-6 '>
                            <View className='flex-row items-center justify-center w-full p-2'>
                                <Text className='font-bold text-2xl'>AREA DE PERIGO</Text>
                                <Ionicons name="warning" size={28} color="red" />
                            </View>
                            <ButtomForm label="Deletar Conta" onPress={() => { handleDeleteAccount() }} icon iconName="trash-outline" color='#ff0000' />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}