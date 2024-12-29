'use strict';
const  bcrypt = require("bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try{
        let hashedPassword = await bcrypt.hash("123456", 8);
        await queryInterface.bulkInsert('Users', [{
          name: 'Shesh Yadav',
          email: 'sheshy181@gmail.com',
          password: hashedPassword,
          role: '0',
          status: 1,
          verifiedAt: new Date(),
          createdAt: new Date(),
          updatedAt:new Date(),
        }],{});
      }catch(error){
        console.log(error.message);
      }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
