import { db } from '@/db/postgre.js';
import { UserRole } from '@/models/entities/user-role.js';
import { UserRoleJoinings } from '../index.js';
import { Packed } from '@/misc/schema.js';

export const UserRoleRepository = db.getRepository(UserRole).extend({
	async visibility( src: UserRole['id'] | UserRole, me: { id: User['id'] }) {
		// ['icon','color','userlist'] or (if hidden) null
		const userRole = typeof src === 'object' ? src : await this.findOneByOrFail({ id: src });
		const isAdmin = me.isAdmin;
		const isModerator = me.isModerator;
		const myRoles = user.

		if (
			isAdmin ||
			userRole.visibility.hidden.includes(me.id)
		){
			
		} 
	}


	async pack(
		src: UserRole['id'] | UserRole,
		me?: { id: User['id'] } | null | undefined,
	): Promise<Packed<'UserRole'>> {
		const userRole = typeof src === 'object' ? src : await this.findOneByOrFail({ id: src });
		const meId = me ? me.id : null;
		const visibility = userRole.

		// Visibility에 따른 권한 검증


		const users = await UserRoleJoinings.findBy({
			userRoleId: userRole.id,
		});

		return {
			id: userRole.id,
			createdAt: userRole.createdAt.toISOString(),
			name: userRole.name,
			ownerId: userRole.userId,
			userIds: users.map(x => x.userId),
		};
	},
});
