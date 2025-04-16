// src/seeders/seeder.ts
import { UserSeeder } from './user.seeder';

async function main() {
  console.log('Starting seeder...');
  const seeder = new UserSeeder();

  try {
    await seeder.seed();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Failed to seed:', error);
    throw error;
  } finally {
    console.log('Closing database connection...');
    await seeder.disconnect();
  }
}

main().catch(console.error);
