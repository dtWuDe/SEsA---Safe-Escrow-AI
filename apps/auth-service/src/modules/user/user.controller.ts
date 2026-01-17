import { Router, type Router as ExpressRouter } from 'express';
import { asyncHandler } from '../../lib/asyncHandler';
import { UserService } from './user.service';
import { CreateUserDto, UserIdDto, ChangePasswordDto } from './user.dto';
// import { authMiddleware } from '../../middleware/auth.middleware';

export function createUserController(UserService: UserService): ExpressRouter {
    const router = Router();

    // router.use(authMiddleware);

    // GET /users/:id
    router.get('/:id', asyncHandler(async(req, res) => {
        const id = UserIdDto.parse(req.params.id);
        const user = await UserService.getById(id);
        res.json(user);
    }));

    // POST /users
    router.post('/', asyncHandler(async(req, res) => {
        const body = CreateUserDto.parse(req.body);
        const user = await UserService.createUser(body.email, body.password);

        res.status(201).json(user);
    }));

    // PATCH /users/:id/verify
    router.post('/:id/verify', asyncHandler(async(req, res) => {
        const id = UserIdDto.parse(req.params.id);

        await UserService.markEmailVerified(id);
        res.json({ success: true });
    } ))

    // PATCH /users/:id/password
    router.patch('/:id/password', asyncHandler(async(req, res) => {
        const id = UserIdDto.parse(req.params.id);
        const { password } = ChangePasswordDto.parse(req.body);

        await UserService.changePassword(id, password);
        res.json({ success: true });
    }))

    // DELETE /users/:id (soft delete)
    router.delete('/:id', asyncHandler(async(req, res) => {
        const id = UserIdDto.parse(req.params.id);
        await UserService.deactivateUser(id);
        res.json({ success: true });
    }))

    return router;
}