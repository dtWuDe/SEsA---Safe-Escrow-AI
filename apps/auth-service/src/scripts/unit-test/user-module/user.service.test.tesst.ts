// import { UserService } from "src/modules/user/user.service";
// import { UserRepository } from "src/modules/user/user.repository.interface";
// import { User } from '../../modules/user/user.types'


// export class InMemoryUserRepository implements UserRepository {
//     private users = new Map<string, User>();

//     async create(email: string, password: string): Promise<User> {
//         const user: User = {
//             id: crypto.randomUUID(),
//             email,
//             passwordHash: password,
//             status: 'ACTIVE',
//             role: 'USER',
//             isVerified: false,
//             lastLoginAt: null
//         };
//         this.users.set(user.id, user);
//         return user;
//     }

//     async findByEmail(email: string): Promise<User | null> { 
//         return [...this.users.values()].find(user => user.email === email) ?? null;
//     }

//     async findById(id: string): Promise<User | null> {
//         return this.users.get(id) ?? null;
//     }

//     async updatePassword(id: string, newHashPassword: string): Promise<void> {
//         const user = await this.findById(id);
//         if (!user) throw new Error('USER_NOT_FOUND');
//     }

//     async verifyEmail(id: string): Promise<void> {
//         const u = this.users.get(id);
//         if (!u) throw new Error('USER_NOT_FOUND');
        
//         u.isVerified = true;
//     }

//     async softDelete(id: string): Promise<void> {
//         const user = this.users.get(id);
//         if (!user) throw new Error('USER_NOT_FOUND');

//         user.status = 'DELETED';
//     }   
// }

// async function main() {
//     console.log('Test UserService');

//     const repo = new InMemoryUserRepository();
//     const service = new UserService(repo);

//     const user = await service.createUser('a@b.com', '123456');
//     console.log('User created:', user);

//     const user2 = await service.getById(user.id);
//     console.log('User found:', user2);

//     await service.markEmailVerified(user.id);
//     const user3 = await service.getById(user.id);
//     console.log('User found:', user3);

//     await service.changePassword(user.id, '654321');
//     await service.deactivateUser(user.id);
//     const user4 = await service.getById(user.id);
//     console.log('User found:', user4);

//     console.log('Done.');
// }

// main().catch(console.error);