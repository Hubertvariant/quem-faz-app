import { ScrollView } from 'react-native';
import { CATEGORIAS } from '../../constants/categories';
import CategoryItem from './CategoryItens';

export default function CategoryBar() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-4 px-4' contentContainerStyle={{ paddingHorizontal: 16 }}>
      {CATEGORIAS.map(item => (
        <CategoryItem 
          key={item.id} 
          categoria={item} 
          variant="horizontal" 
          onPress={() => console.log(item.name)} 
        />
      ))}
    </ScrollView>
  );
}