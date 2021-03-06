export default {
  up: async queryInterface => queryInterface.bulkInsert(
    'Categories',
    [
      {
        id: '842b0c1e-bd2b-4a4a-82e9-610869f02fd4',
        category: 'travel',
        description: 'travel the world and get one free'
      },
      {
        id: '842b0c1e-bd2b-4a4a-82e9-610869f02fd5',
        category: 'religion',
        description: 'we are great, we are awesome'
      },
      {
        id: '842b0c1e-bd2b-4a4a-82e9-610869f02fd6',
        category: 'politics',
        description: 'Political things are what we discuss'
      }
    ],
    {}
  ),

  down: async queryInterface => queryInterface.bulkDelete('Users', null, {})
};
