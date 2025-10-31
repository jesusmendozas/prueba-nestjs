import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { plans } from '../mysql/schemas/plan.schema';

dotenv.config();

async function seed() {
  const pool = createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'subscriptions_db',
  });

  const db = drizzle(pool);


  try {
    // inserta los planes iniciales
    await db.insert(plans).values([
      {
        name: 'Basic Plan',
        description: 'Perfect for beginners',
        price: '9.99',
        durationInDays: 30,
        features: [
          'Access to basic courses',
          'Community support',
          'Monthly newsletter',
        ],
        isActive: true,
      },
      {
        name: 'Pro Plan',
        description: 'For professionals looking to advance',
        price: '29.99',
        durationInDays: 30,
        features: [
          'Access to all courses',
          'Priority support',
          'Downloadable resources',
          'Certificate of completion',
          'Monthly webinars',
        ],
        isActive: true,
      },
      {
        name: 'Enterprise Plan',
        description: 'Complete solution for teams',
        price: '99.99',
        durationInDays: 30,
        features: [
          'Everything in Pro',
          'Team management dashboard',
          'Custom learning paths',
          'Dedicated account manager',
          'API access',
          'Advanced analytics',
        ],
        isActive: true,
      },
      {
        name: 'Annual Basic',
        description: 'Basic plan with annual discount',
        price: '99.99',
        durationInDays: 365,
        features: [
          'Access to basic courses',
          'Community support',
          'Monthly newsletter',
          'Save 17% with annual billing',
        ],
        isActive: true,
      },
    ]);

    console.log('✅ Seeder ejecutado exitosamente!');
  } catch (error) {
    console.error('❌ Error ejecutar al seeder :', error);
  } finally {
    await pool.end();
  }
}

seed();

