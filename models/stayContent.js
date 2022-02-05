const Sequelize = require('sequelize');

module.exports = class StayContent extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            HostUser: {
                type: Sequelize.INTEGER,
                unique: true,
                allowNull: false,
            },
            Title:{
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            Content: {
                type: Sequelize.STRING(500),
                allowNull: false,
            }
        }, {
            sequelize,
            underscored: false,      // 컬럼 명이 Cammel 형이냐 underscored 형이냐
            tableName: 'stayContent',
            modelName: 'StayContent',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            paranoid: true,          // deleted At 컬럼 추가. 상태 값으로 삭제 여부 판단
        });
    }

    static association(db) {
        db.StayContent.belongsTo(db.User);
    }
}