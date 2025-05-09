// src/seeders/user.seeder.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export class UserSeeder {
  private readonly prisma = new PrismaClient();
  private readonly saltRounds = 10;

  async seed() {
    try {
      console.log('Starting seeding process...');

      //clear data
      // await this.prisma.permissions.deleteMany({});
      // await this.prisma.menus.deleteMany({});
      // await this.prisma.roles.deleteMany({});
      // await this.prisma.users.deleteMany({});

      // Create default menu
      console.log('Creating default menu...');
      const defaultMenu = await this.prisma.menus.findUnique({
        where: { path: '/master' },
      });

      if (!defaultMenu) {
        const menu = await this.prisma.menus.create({
          data: {
            name: 'Master',
            path: '/master',
            order: 0,
          },
        });
        await this.prisma.menus.create({
          data: {
            name: 'Menu',
            path: '/master_menu',
            icon: 'menu',
            parent_id: menu.id,
            order: 1,
          },
        });
        console.log('Default menu created with ID:', menu);
      }

      // Create SuperAdmin role
      console.log('Checking for SuperAdmin role...');
      const superAdminRole = await this.prisma.roles.findUnique({
        where: { name: 'SUPERADMIN' },
      });

      if (!superAdminRole) {
        console.log('Creating SuperAdmin role...');
        const role = await this.prisma.roles.create({
          data: {
            name: 'SUPERADMIN',
            description: 'System super administrator with full access',
          },
        });
        console.log('SuperAdmin role created with ID:', role.id);

        // Create permissions for SuperAdmin role
        console.log('Creating permissions...');
        const defaultMenu = await this.prisma.menus.findUnique({
          where: { path: '/master_menu' },
        });

        const permissions = await this.prisma.permissions.createMany({
          data: [
            {
              role_id: role.id,
              menu_id: defaultMenu.id,
              permission_type: 'Manage',
            },
          ],
        });
        console.log('Permissions created:', permissions);
      }

      // Create SuperAdmin user
      console.log('Checking for SuperAdmin user...');
      const superAdmin = await this.prisma.users.findUnique({
        where: { email: 'superadmin@example.com' },
      });
      console.log('SuperAdmin user found:', superAdmin ? 'Yes' : 'No');

      if (!superAdmin) {
        console.log('Creating SuperAdmin user...');
        const hashedPassword = await bcrypt.hash(
          'superadmin123',
          this.saltRounds,
        );
        console.log('Password hashed successfully');

        const user = await this.prisma.users.create({
          data: {
            email: 'superadmin@example.com',
            password: hashedPassword,
            username: 'superadmin',
            role: {
              connect: { name: 'SUPERADMIN' },
            },
            is_active: true,
            employee_id: 'superadmin',
            picture: 'https://example.com/superadmin.png',
            valid_from: new Date(),
            created_by: 'superadmin',
            updated_by: 'superadmin',
          },
        });
        console.log('SuperAdmin user created with ID:', user.id);
      }

      console.log('Seeding completed successfully');
    } catch (error) {
      console.error('Failed to seed user data:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
