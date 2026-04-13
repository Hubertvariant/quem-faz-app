import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  Alert, 
  ScrollView, 
  TouchableWithoutFeedback, 
  Keyboard,
  Dimensions
} from 'react-native';
import HeaderForm from '../components/Header/HeaderForm';
import InputForm from '../components/input/Form';
import ButtomForm from '../components/buttom/ButtomForm';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Auth() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });

      if (error) {
        Alert.alert("Erro no Cadastro", error.message);
      } else if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { id: data.user.id, full_name: fullName, email: email }
          ]);

        if (profileError) console.error("Erro ao criar perfil:", profileError);

        Alert.alert('Sucesso!', 'Verifique seu e-mail para confirmar vizinho.');
        setIsLogin(true);
      }
    }

    setLoading(false);
  }

return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <KeyboardAvoidingView
        // A SOLUÇÃO REAL: No iOS usamos padding, no Android deixamos o SO gerenciar via softwareKeyboardLayoutMode
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        // No iOS, se houver tab bar ou header, ajuste o offset. 0 geralmente funciona para telas cheias.
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            // Permite que o conteúdo role para cima do teclado
            contentContainerStyle={{ 
              flexGrow: 1, 
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 40,
              paddingHorizontal: 32,
              justifyContent: 'center' 
            }}
            // Fecha o teclado ao arrastar
            keyboardDismissMode="on-drag"
            // Mantém o clique nos botões mesmo com teclado aberto
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <View className="w-full">
              <HeaderForm
                title={isLogin ? 'Bem-vindo!' : 'Criar Conta'}
                subtitle={isLogin ? 'Sentimos sua falta, vizinho.' : 'Junte-se à nossa comunidade.'}
              />

              <View className="space-y-4">
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
                  autoCapitalize="none"
                  keyboardType='email-address'
                />

                <View className="mt-4">
                  <InputForm
                    label="Senha"
                    placeholder="Sua senha secreta"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry
                  />

                  {isLogin && (
                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      className="mt-2 items-end"
                    >
                      <Text className="text-rose-500 dark:text-rose-400 text-xs font-medium">
                        Esqueceu a senha?
                      </Text>
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
                className="mt-6 mb-4 items-center"
              >
                <Text className="text-slate-500 dark:text-slate-400">
                  {isLogin ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
                  <Text className="text-rose-500 dark:text-rose-400 font-bold">
                    {isLogin ? 'Cadastre-se' : 'Faça Login'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}