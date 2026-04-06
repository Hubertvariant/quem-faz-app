import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import HeaderForm from '../components/Header/HeaderForm';
import InputForm from '../components/input/Form';
import ButtomForm from '../components/buttom/ButtomForm';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import Constant from 'expo-constants';

// Corrigido: statusBarHeight (com 'B' maiúsculo)
const statusBarHeight = Constant.statusBarHeight + 8;

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Novo estado para o nome
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Atenção", "Digite seu e-mail primeiro para recuperar a senha.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert("Sucesso", "Enviamos um link de recuperação para o seu e-mail!");
    }
  }

  async function handleAuth() {
    if (!email || !password || (!isLogin && !fullName)) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        Alert.alert("Erro no Login", error.message);
      } else if (data.session) {
        router.replace('/home'); 
      }
    } else {
      // Cadastro com metadados (fullName)
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName, // Isso vai para auth.users.raw_user_meta_data
          }
        }
      });

      if (error) {
        Alert.alert("Erro no Cadastro", error.message);
      } else {
        Alert.alert('Sucesso!', 'Conta criada! Verifique seu e-mail para confirmar vizinho.');
        setIsLogin(true); // Manda para o login após cadastrar
      }
    }

    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white px-8 justify-center"
      style={{paddingTop: statusBarHeight}}
    >
      <View>
        <HeaderForm
          title={isLogin ? 'Bem-vindo!' : 'Criar Conta'}
          subtitle={isLogin ? 'Sentimos sua falta, vizinho.' : 'Junte-se à nossa comunidade.'}
        />

        <View className="space-y-4">
          {/* Campo de Nome: Só aparece se NÃO for login */}
          {!isLogin && (
            <View className="mb-4">
              <InputForm
                label="Nome Completo"
                placeholder="Como quer ser chamado?"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          )}

          <InputForm
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            autocapitalize="none"
            keyboardType='email-address' // Melhorado para teclados de e-mail
          />

          <View className="mt-4">
            <InputForm
              label="Senha"
              placeholder="Sua senha secreta"
              value={password}
              onChangeText={setPassword}
              autocapitalize="none"
              secureTextEntry
            />
            
            {isLogin && (
              <TouchableOpacity 
                onPress={handleForgotPassword}
                className="mt-2 items-end"
              >
                <Text className="text-rose-500 text-xs font-medium">Esqueceu a senha?</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="mt-8">
          <ButtomForm
            label={loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            onPress={handleAuth}
            disabled={loading}
          />
        </View>

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          className="mt-6 items-center"
        >
          <Text className="text-slate-500">
            {isLogin ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
            <Text className="text-rose-500 font-bold">
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}