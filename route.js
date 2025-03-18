// const express = require('express');
// const router = express.Router();
// const { startPool, testConnection, closePool } = require('./db_connection');

// router.get('/index', async (req, res) => {
//   try {
//     connection = await startPool();
//     const ids = await testConnection(connection);
//     await closePool();
//     res.json({
//       test: "Hello World!",
//       message: "Connection successful!",
//       results: ids
//     });
//   } catch (error) {
//     res.status(500).send('Error testing connection');
//   }
// });


// module.exports = router;