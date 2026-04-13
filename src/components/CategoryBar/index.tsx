import { ScrollView } from 'react-native';
import { CATEGORIAS } from '../../constants/categories';
import CategoryItem from './CategoryItens';

export default function CategoryBar({ selectedCategory, onSelectCategory }: any) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className='mt-4' 
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: 8 }} // Espaço extra para a sombra/borda ativa
    >
      {CATEGORIAS.map(item => (
        <CategoryItem 
          key={item.id} 
          categoria={item} 
          variant="horizontal" 
          active={selectedCategory === item.name}
          onPress={() => {
            const newValue = selectedCategory === item.name ? '' : item.name;
            onSelectCategory(newValue);
          }} 
        />
      ))}
    </ScrollView>
  );
}