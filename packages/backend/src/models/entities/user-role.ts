import { Entity, Index, JoinColumn, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user.js';
import { id } from '../id.js';

@Entity()
export class UserRole {
	@PrimaryColumn(id())
	public id: string;

	@Index()
	@Column('timestamp with time zone', {
		comment: 'The created date of the UserRole.',
	})
	public createdAt: Date;

	@Index()
	@Column('varchar', {
		length: 256,
		comment: 'The name of the Role.',
	})
	public name: string;

	@Column('varchar', {
		length: 2048,
		comment: 'The description of the Role.',
	})
	public description: string;

	@Column('varchar', {
		length: 256, nullable: false,
	})
	public iconUrl: string;

	@Column('varchar', {
		length: 64, nullable: true,
	})
	public themeColor: string | null;

	// @Index()
	// @Column({
	// 	...id(),
	// 	comment: 'The ID of owner.',
	// })
	// public userId: User['id'];
	@Column('varchar', {
		length: 64, array: true,
		comment: 'The permission of the Role.',
	})
	public permission: string[];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE',
	})
	@JoinColumn()
	public user: User | null;

	@Index
	@Column('boolean', {
		default: false,
	})
	public iconVisible: boolean;

	@Index
	@Column('boolean', {
		default: false,
	})
	public colorVisible: boolean;

	@Column('boolean', {
		default: false,
	})
	public isPrivate: boolean;

	constructor(data: Partial<UserGroup>) {
		if (data == null) return;

		for (const [k, v] of Object.entries(data)) {
			(this as any)[k] = v;
		}
	}
}

/* scheme & entities -> repositories
TODO: Denormalized fields?
- [x] id
- [x] 소속 (멤버?)  :user
- [x] 아이콘 url  :iconUrl
- [x] 색상  :themeColor(nullable)
- [x] 표시 여부
  - [x] 아이콘  :iconVisible
  - [x] 닉네임 컬러  :colorVisible
	- [ ] {public,members,moderator,admin}으로? (모더레이션 활용에서 마피아게임까지)
- [ ] 권한
  - [ ] 주체
	  - [ ] 소속되지 않은 사람
		- [ ] 소속된 사람
		- [ ] 모더레이터
	- [ ] 대상
		- [ ] 표시  :roleVisibility{public,members,moderator,admin}
	  - [ ] 명부 조회  :memberVisibility
		- [x] 소속여부 조회  - Visibility members/moderator의 경계로 구분하면 되는데 굳이?
		- [ ] 모더레이터 역할
			- [ ] (isModerator와 별개: 직접지정 moderator와 group에 의한 moderator를 구분하기 위함)
			- [ ] affected: api (legacy를 위해 둘 다 true로 반환하되 추가 뭐시기를 넣는다던가)
			- [ ] affected: user info (기존 버튼은 냅두되 gruop에 의한 override가 있을 경우 텍스트 표시)
				- [ ] 단, 그 group이 모더레이터에게 접근 권한이 없는 경우 상세 정보는 숨길 것
		- [ ] todo: 모더레이더 권한 세부화
			- 구현은 ./app.ts 을 참고
			- moderation: [silence, suspend, meta, emoji, instance_ban, role, drive_override]
- [ ] todo: 자동 할당?
  - [ ] 특정 도메인의 유저
  - [ ] 특정 그룹의 유저
- [ ] todo: role 채팅?
*/
