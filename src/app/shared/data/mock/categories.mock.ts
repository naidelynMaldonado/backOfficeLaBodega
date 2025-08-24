import { Category } from '../../components/categories-section/categories-section.component';

/**
 * Mock data for product categories
 */
export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Promociones',
    imageUrl: './assets/images/cat3.png',
    backgroundColor: '#dd9e9b'
  },
  {
    id: '2',
    name: 'Cuidado facial',
    imageUrl: './assets/images/cat2.png',
    backgroundColor: '#FBE4DA' // using alert-yellow-50 color
  },
  {
    id: '3',
    name: 'Cuidado del cuerpo',
    imageUrl: './assets/images/cat1.png',
    backgroundColor: '#D4EDD6'
  },
  {
    id: '4',
    name: 'Belleza',
    imageUrl: './assets/images/cat2.png',
    backgroundColor: '#DF88FF80'
  }
];
