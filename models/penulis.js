module.exports = (sequelize, DataTypes) => {
    const Penulis = sequelize.define("Penulis", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        