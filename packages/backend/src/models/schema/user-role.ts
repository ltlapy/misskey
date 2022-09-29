export const packedUserRoleSchema = {
	type: 'object',
	properties: {
		id: {
			type: 'string',
			nullable: false, optional: false,
			format: 'id',
			example: 'xxxxxxxxxx',
		},
		createdAt: {
			type: 'string',
			nullable: false, optional: false,
			format: 'date-time',
		},
		name: {
			type: 'string',
			nullable: false, optional: false,
		},
		description: {
			type: 'string',
			nullable: false, optional: false,
		},
		iconUrl: {
			type: 'string',
			nullable: true, optional: false,
		},
		themeColor: {
			type: 'string',
			nullable: true, optional: false,
		},
		// permission: {
		// 	type: 'array',
		// 	nullable: false, optional: false,
		// 	items: {
		// 		type: 'string',
		// 		nullable: false, optional: false,
		// 	},
		// },
		user: {
			type: 'array',
			nullable: false, optional: true,
			items: {
				type: 'string',
				nullable: false, optional: false,
				format: 'id',
			},
		},
		visibility: {
			type: 'object',
			nullable: false, optional: true,
			properties: {
				icon: {
					type: 'array',
					nullable: false, optional: false,
					items: {
						type: 'string',
						nullable: false, optional: false,
						description: 'Roles to display members with icon.',
						// ['all', 'moderator', roleId]
					},
				},
				color: {
					type: 'array',
					nullable: false, optional: false,
					description: 'Roles to display members colored.',
				},
				userlist: {
					type: 'array',
					nullable: false, optional: false,
					description: 'Roles to see list of members.',
				},
				hidden: {
					type: 'array',
					nullable: false, optional: false,
					description: 'Roles to hide the role.',
				}
			}
		},
		iconEnabled: {
			type: 'boolean',
			nullable: false, optional: false,
		},
		colorEnabled: {
			type: 'boolean',
			nullable: false, optional: false,
		},
	}
} as const;
