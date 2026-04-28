/**
 * Update works with group information from the document
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const worksData = [
  {
    workNumber: 1,
    title: "拉麵的城市地圖",
    author: "第一組",
    description: "透過拉麵的味道，重新看見城市。本書結合了對拉麵文化的深度探索與城市地理的創意詮釋，透過拉麵品嚐記錄與城市地圖的結合，呈現不同地區的飲食特色與文化風貌。"
  },
  {
    workNumber: 2,
    title: "軌跡 Traces",
    author: "第二組",
    description: "結合文學感性敘事與數學理性邏輯的跨領域自傳體散文集。以「生命座標」為核心，透過幾何術語轉化為富有溫度的生命隱喻，探索人生的五個心境轉折。"
  },
  {
    workNumber: 3,
    title: "殺夫",
    author: "第三組",
    description: "跨域轉譯李昂的同名小說，以漫畫形式重新改編經典之作。透過細膩的圖像語言與分鏡設計，深入探討女性在父權壓迫下的困境與掙脫。"
  },
  {
    workNumber: 4,
    title: "子恩大魔王",
    author: "第四組",
    description: "一部溫暖的繪本故事，講述橘貓老師用傾聽與陪伴療癒學生。透過「心情紙飛機」的設置，呈現理解與陪伴如何能幫助迷失的孩子重新綻放光芒。"
  },
  {
    workNumber: 5,
    title: "走進張愛玲──我們心中的紅與白",
    author: "第五組",
    description: "以《紅玫瑰與白玫瑰》為核心的共同閱讀與集體詮釋實踐。結合專書撰寫、Podcast節目與文創設計，使張愛玲的文學在當代持續發聲。"
  },
  {
    workNumber: 6,
    title: "四季的觸感",
    author: "第六組",
    description: "在看不見光的泥土裡，聽見種子裂開的聲音。透過高品質人造花材與文字的結合，呈現視障創作者對生命四季的感受與記憶。"
  },
  {
    workNumber: 7,
    title: "後西遊 憤怒篇",
    author: "第七組",
    description: "一款結合劇情、機關與西遊記知識的RPG遊戲。透過寓教於樂、文化轉譯與應用學習，使古典文學知識在遊戲中生動呈現。"
  },
  {
    workNumber: 8,
    title: "尋幽敘事：台灣中部靈異傳說筆記與〈夜路〉大富翁桌遊設計",
    author: "第八組",
    description: "蒐集台灣中部地區的鄉野奇譚與奇聞軼事的短篇故事集。以文言文與白話文對照呈現，並設計大富翁遊戲〈夜路〉，讓故事在遊戲中延續。"
  },
  {
    workNumber: 9,
    title: "咄咄怪事",
    author: "第九組",
    description: "一部收錄14篇的妖怪短篇小說集。透過改編地方妖怪經典傳說與創意想像，探索人與妖怪間的奇緣，呈現溫馨、懸疑、奇幻等多元故事類別。"
  },
  {
    workNumber: 10,
    title: "主角奇遇記",
    author: "第十組",
    description: "以網路成癮與短影音文化為主題的兒童繪本。透過「主角」、「馬桶人」與「眼睛們」的視角，呈現個體在群體氛圍中的心境轉變。"
  },
  {
    workNumber: 11,
    title: "古文字之「旅」",
    author: "第十一組",
    description: "結合教育與趣味的古文字學習卡牌。以甲骨文為核心，融入臺灣代表性景觀，使使用者在辨識古文字的同時連結在地文化意象。"
  },
  {
    workNumber: 12,
    title: "嚥下危機",
    author: "第十二組",
    description: "以《史記》〈鴻門宴〉為核心改編的RPG情境選擇遊戲。透過「抉擇」機制與三種結局分支，讓玩家體驗古文本的戲劇張力與人性衝突。"
  },
  {
    workNumber: 13,
    title: "金門僑鄉的散與聚—洋樓的故事",
    author: "第十三組",
    description: "透過洋樓介紹金門的時代記憶與僑鄉文化。結合三位不同背景創作者的視角，並設計花磚橡皮章、洋樓明信片等文創小物。"
  },
  {
    workNumber: 14,
    title: "奇廟人間——與神同行",
    author: "第十四組",
    description: "結合地方踏查與人文觀察的廟宇導覽遊記類書籍。聚焦於台灣各地形態獨特的信仰空間，描繪人與神之間細膩而真實的情感交流。"
  },
  {
    workNumber: 15,
    title: "美麗花園中的倩影與馨香一《紅樓夢》金釵香包",
    author: "第十五組",
    description: "以香為引，如入紅樓之境。從《紅樓夢》人物性格出發，透過調配專屬香氣、花卉繪製與判詞書法，創造多重感官的敘事方式。"
  },
  {
    workNumber: 16,
    title: "第十六組作品",
    author: "第十六組",
    description: "敬請期待"
  },
  {
    workNumber: 17,
    title: "第十七組作品",
    author: "第十七組",
    description: "敬請期待"
  }
];

async function updateWorks() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    for (const work of worksData) {
      await connection.execute(
        `UPDATE works 
         SET title = ?, author = ? 
         WHERE workNumber = ?`,
        [work.title, work.author, work.workNumber]
      );
    }
    console.log('✓ All 17 works updated successfully!');
  } catch (error) {
    console.error('Error updating works:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

updateWorks().catch(console.error);
