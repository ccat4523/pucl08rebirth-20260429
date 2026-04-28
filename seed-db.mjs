/**
 * Database seeding script
 * 初始化 17 個作品和 2 個宣傳片記錄
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // 初始化 17 個作品
    console.log('Seeding works table...');
    for (let i = 1; i <= 17; i++) {
      await connection.execute(
        `INSERT INTO works (workNumber, title, author, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        [i, `作品 ${i}`, `創作者 ${i}`]
      );
    }
    console.log('✓ Works table seeded with 17 records');

    // 初始化 2 個宣傳片
    console.log('Seeding promotionalVideos table...');
    for (let i = 1; i <= 2; i++) {
      await connection.execute(
        `INSERT INTO promotionalVideos (videoNumber, title, createdAt, updatedAt) 
         VALUES (?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
        [i, `宣傳片 ${i}`]
      );
    }
    console.log('✓ Promotional videos table seeded with 2 records');

    console.log('✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

seedDatabase().catch(console.error);
