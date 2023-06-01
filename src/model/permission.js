module.exports = (sequelize, Sequelize) => {
	const permission = sequelize.define('permission', {
		permissionId: {
			type: Sequelize.STRING,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
			allowNull: false,
			unique: true
		},
		role: {
			type: Sequelize.STRING
		},
		route: {
			type: Sequelize.STRING
		},
		addPermission: {
			type: Sequelize.STRING
		}
	},
	{
		deletedAt: 'deletedAt',
		timestamps: true,
		paranoid: true
	}
	);
	return permission;
};
