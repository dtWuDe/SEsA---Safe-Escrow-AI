// import { prisma } from "../../lib/prisma";
// import { PrismaUserRepository } from "src/modules/user/user.repository.prisma";

// const repo = new PrismaUserRepository();

// async function main() {
//     console.log('🚀 Testing PrismaUserRepository\n');

//     await prisma.user.deleteMany(); // clean

//     console.log('--- create ---');

//     const email = 'user' + Date.now() + '@test.com';
//     const passwordHash = '123456';
//     const user = await repo.create(email, passwordHash);
//     console.log(user);

//     console.log('--- find by email ---');
//     console.log(await repo.findByEmail(email));

//     console.log('--- find by id ---');
//     console.log(await repo.findById(user.id));

//     console.log('--- update password ---');
//     await repo.updatePassword(user.id, '654321');
//     console.log(await repo.findById(user.id));

//     console.log('--- verify email ---');
//     await repo.verifyEmail(user.id);
//     console.log(await repo.findById(user.id));

//     console.log('--- soft delete ---');
//     await repo.softDelete(user.id);
//     console.log(await repo.findById(user.id));

//     console.log('Done.');
// }

// main().catch(console.error);

