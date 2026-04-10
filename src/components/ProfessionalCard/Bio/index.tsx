import { TouchableOpacity, Text } from 'react-native';

import { useState } from 'react';

interface BioProps {
    bio: string;
}
export default function Bios({ bio }: BioProps) {
    const [expandido, setExpandido] = useState(false);
    return (
        <>
            <Text className="text-slate-500 font-bold uppercase text-xs mt-2">Sobre mim</Text>

            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setExpandido(!expandido)}
            >
                <Text
                    numberOfLines={expandido ? undefined : 3}
                    className="text-slate-700 mt-1 leading-5"
                >
                    {bio || "Nenhuma biografia disponível."}
                </Text>

                {bio && bio.length > 100 && (
                    <Text className="text-rose-600 font-bold text-xs mt-1">
                        {expandido ? "Ver menos" : "Ler mais..."}
                    </Text>
                )}
            </TouchableOpacity>
        </>
    );
}