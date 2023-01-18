import {DataTypes, Sequelize} from "sequelize";


const model = (sequelize:Sequelize) =>{
        return sequelize.define("wallets", {
            userId:{
                type: DataTypes.CHAR(25),
            },

            wallet:{
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
        }, {
            indexes: [{
                fields: ['userId'],
                unique: true
            }]
        })
}

module.exports = model; 