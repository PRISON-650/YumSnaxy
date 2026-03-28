import { collection, getDocs, addDoc, writeBatch, doc, serverTimestamp, query, limit } from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES = [
  { name: 'Burgers', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', order: 1 },
  { name: 'Fries', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046786.png', order: 2 },
  { name: 'Drinks', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', order: 3 },
  { name: 'Combos', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075929.png', order: 4 },
  { name: 'Desserts', image: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png', order: 5 },
];

const MENU_ITEMS = [
  {
    name: 'Yum Snaxy Classic Burger',
    description: 'Double beef patty, cheddar cheese, secret sauce, and fresh lettuce on a brioche bun.',
    price: 12.99,
    categoryId: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isFeatured: true,
    isWeeklySpecial: true,
    calories: 850
  },
  {
    name: 'Spicy Chicken Deluxe',
    description: 'Crispy spicy chicken breast, jalapeños, pepper jack cheese, and chipotle mayo.',
    price: 11.49,
    dealPrice: 9.99,
    categoryId: 'Burgers',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isFeatured: true,
    calories: 720
  },
  {
    name: 'Truffle Parmesan Fries',
    description: 'Hand-cut fries tossed in truffle oil and aged parmesan cheese.',
    price: 6.99,
    categoryId: 'Fries',
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isFeatured: false,
    calories: 450
  },
  {
    name: 'Classic Vanilla Shake',
    description: 'Creamy Madagascar vanilla bean ice cream blended with fresh milk.',
    price: 5.49,
    categoryId: 'Drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isFeatured: false,
    calories: 580
  },
  {
    name: 'The Ultimate Combo',
    description: 'Classic Burger, Large Fries, and a Shake of your choice.',
    price: 22.99,
    dealPrice: 19.99,
    categoryId: 'Combos',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
    isAvailable: true,
    isFeatured: true,
    calories: 1800
  }
];

export async function seedDatabase() {
  try {
    const catsSnap = await getDocs(collection(db, 'categories'));
    if (!catsSnap.empty) {
      console.log('Database already has categories, skipping categories seeding.');
    } else {
      console.log('Seeding categories and menu items...');
      const categoryIds: Record<string, string> = {};

      for (const cat of CATEGORIES) {
        const docRef = await addDoc(collection(db, 'categories'), cat);
        categoryIds[cat.name] = docRef.id;
      }

      for (const item of MENU_ITEMS) {
        await addDoc(collection(db, 'menuItems'), {
          ...item,
          categoryId: categoryIds[item.categoryId]
        });
      }
    }

    // Seed some orders for reports
    const ordersSnap = await getDocs(query(collection(db, 'orders'), limit(1)));
    if (ordersSnap.empty) {
      console.log('Seeding sample orders...');
      const sampleOrders = [
        {
          customerName: 'Test Customer 1',
          items: [{ itemId: '1', name: 'Yum Snaxy Classic Burger', price: 12.99, quantity: 2 }],
          total: 25.98,
          status: 'completed',
          type: 'online',
          createdAt: serverTimestamp(),
          paymentMethod: 'online'
        },
        {
          customerName: 'Walk-in Customer',
          items: [{ itemId: '2', name: 'Spicy Chicken Deluxe', price: 11.49, quantity: 1 }],
          total: 11.49,
          status: 'completed',
          type: 'walk-in',
          createdAt: serverTimestamp(),
          paymentMethod: 'cash'
        }
      ];

      for (const order of sampleOrders) {
        await addDoc(collection(db, 'orders'), order);
      }
    }

    // Seed some expenses
    const expensesSnap = await getDocs(query(collection(db, 'expenses'), limit(1)));
    if (expensesSnap.empty) {
      console.log('Seeding sample expenses...');
      const sampleExpenses = [
        {
          type: 'Supplies',
          amount: 50.00,
          note: 'Buns and vegetables',
          timestamp: serverTimestamp(),
          cashierId: 'system',
          sessionId: 'seed-session'
        },
        {
          type: 'Utility',
          amount: 120.00,
          note: 'Electricity bill',
          timestamp: serverTimestamp(),
          cashierId: 'system',
          sessionId: 'seed-session'
        }
      ];

      for (const expense of sampleExpenses) {
        await addDoc(collection(db, 'expenses'), expense);
      }
    }

    console.log('Seeding complete!');
    return true;
  } catch (error) {
    console.warn('Seeding failed:', error);
    return false;
  }
}
