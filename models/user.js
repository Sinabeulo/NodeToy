const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            // 이메일 (로그인 아이디)
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            // 비밀번호
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            // 로그인 제공자
            provider: {
                type: Sequelize.STRING(40),
                allowNull: false,
                defaultValue: 'local',
            },
            // 닉네임
            nick: {
                type: Sequelize.STRING(100),
                allowNull: true,
                defaultValue: 'user',
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,      // 컬럼 명이 Cammel 형이냐 underscored 형이냐
            tableName: 'users',
            modelName: 'User',
            charset: 'utf8',
            collate: 'utf8_general_ci',
            paranoid: true,          // deleted At 컬럼 추가. 상태 값으로 삭제 여부 판단
        })
    }

    static associate(db) {
        
    }
};