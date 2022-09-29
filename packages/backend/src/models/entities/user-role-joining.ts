import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.js';
import { UserRole } from './user-role.js';
import { id } from '../id.js';

@Entity()
@Index(['userId', 'userRoleId'], { unique: true })
export class UserRoleJoining {
	@PrimaryColumn(id())
	public id: string;

	@Column('timestamp with time zone', {
		comment: 'The created date of the UserRoleJoining.',
	})
	public createdAt: Date;

	@Index()
	@Column({
		...id(),
		comment: 'The user ID.',
	})
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Index()
	@Column({
		...id(),
		comment: 'The role ID.',
	})
	public userRoleId: UserRole['id'];

	@ManyToOne(type => UserRole, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public userRole: UserRole | null;
}
