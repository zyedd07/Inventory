require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: false }); 
      console.log('✅ Database synchronized.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  await db.sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  await db.sequelize.close();
  process.exit(0);
});

startServer();