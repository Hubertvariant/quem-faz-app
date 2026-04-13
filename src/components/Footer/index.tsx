import React from 'react';
import { View, Text } from 'react-native';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    /* Adicionamos uma margem extra e garantimos que o fundo não 'quebre' o scroll */
    <View className="py-8 items-center justify-center mt-4">
      {/* AJUSTADO: dark:text-slate-500 (um cinza médio para o copyright) */}
      <Text className="text-slate-400 dark:text-slate-500 text-xs font-medium">
        © {year} Mural do Bairro
      </Text>
      
      {/* AJUSTADO: dark:text-slate-600 (bem discreto para os direitos) */}
      <Text className="text-slate-300 dark:text-slate-600 text-[10px] mt-1 uppercase tracking-widest text-center px-6">
        Todos os direitos reservados a Hubert Prado Ramos
      </Text>
    </View>
  );
}