import { Inject, Injectable } from '@nestjs/common';
import { DI } from '@/di-symbols.js';
import type { UserGroupJoiningsRepository, UserGroupsRepository } from '@/models/_.js';
import { awaitAll } from '@/misc/prelude/await-all.js';
import type { Packed } from '@/misc/json-schema.js';
import type { } from '@/models/Blocking.js';
import type { MiUser } from '@/models/User.js';
import type { MiUserGroup } from '@/models/UserGroup.js';
import { UserEntityService } from './UserEntityService.js';
import { bindThis } from '@/decorators.js';

@Injectable()
export class UserGroupEntityService {
	constructor(
		@Inject(DI.userGroupsRepository)
		private userGroupsRepository: UserGroupsRepository,

		@Inject(DI.userGroupJoiningsRepository)
		private userGroupJoiningsRepository: UserGroupJoiningsRepository,

		private userEntityService: UserEntityService,
	) {
	}

	@bindThis
	public async pack(
		src: MiUserGroup['id'] | MiUserGroup,
	): Promise<Packed<'UserGroup'>> {
		const userGroup = typeof src === 'object' ? src : await this.userGroupsRepository.findOneByOrFail({ id: src });

		const users = await this.userGroupJoiningsRepository.findBy({
			userGroupId: userGroup.id,
		});

		return {
			id: userGroup.id,
			createdAt: userGroup.createdAt.toISOString(),
			name: userGroup.name,
			ownerId: userGroup.userId,
			userIds: users.map(x => x.userId),
		};
	}
}

