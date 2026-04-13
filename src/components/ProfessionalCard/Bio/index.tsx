import { TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

interface BioProps {
    bio: string;
}

export default function Bios({ bio }: BioProps) {
    const [expandido, setExpandido] = useState(false);

    return (
        <>
            {/* Label: Slate-500 no light, Slate-400 no dark para manter a hierarquia */}
            <Text className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs mt-4">
                Sobre mim
            </Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpandido(!expandido)}
                className="mt-1"
            >
                {/* Texto da Bio: Slate-700 no light, Slate-300 no dark */}
                <Text
                    numberOfLines={expandido ? undefined : 3}
                    className="text-slate-700 dark:text-slate-300 leading-5 text-sm"
                >
                    {bio || "Nenhuma biografia disponível."}
                </Text>

                {/* Botão de expansão: Rose-600 no light, Rose-400 no dark para brilhar no escuro */}
                {bio && bio.length > 100 && (
                    <Text className="text-rose-600 dark:text-rose-400 font-bold text-xs mt-1">
                        {expandido ? "Ver menos" : "Ler mais..."}
                    </Text>
                )}
            </TouchableOpacity>
        </>
    );
}