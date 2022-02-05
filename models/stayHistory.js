const Sequelize = require('sequelize');

module.exports = class StayHistory extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            hostUser: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            guestUser: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fromDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            toDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            underscored: false,      // 컬럼 명이 Cammel 형이냐 underscored 형이냐
            tableName: 'stayHistory',
            modelName: 'StayHistory',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            paranoid: true,          // deleted At 컬럼 추가. 상태 값으로 삭제 여부 판단
        });
    }
    
    static association(db) {
        db.StayHistory.belongsToMany(db.User,{
            foreignKey:'hostUser'
        });
    }
}