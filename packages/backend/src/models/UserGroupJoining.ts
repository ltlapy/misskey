import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { id } from './util/id.js';
import { MiUser } from './User.js';
import { MiUserGroup } from './UserGroup.js';

@Entity('user_group_joining')
@Index(['userId', 'userGroupId'], { unique: true })
export class MiUserGroupJoining {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the UserGroupJoining.',
	})
	public createdAt: Date;

	@Index()
	@Column({
		...id(),
		comment: 'The user ID.',
	})
	public userId: MiUser['id'];

	@ManyToOne(type => MiUser, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: MiUser | null;

	@Index()
	@Column({
		...id(),
		comment: 'The group ID.',
	})
	public userGroupId: MiUserGroup['id'];

	@ManyToOne(type => MiUserGroup, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public userGroup: MiUserGroup | null;
}
