import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'ChatAppDB',
    location: 'default',
  },
  () => console.log('Database connected'),
  error => console.error('Database error', error)
);

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          messageID TEXT UNIQUE,
          chatID TEXT,
          senderID TEXT,
          receiverID TEXT,
          message TEXT,
          messageType TEXT,
          timestamp TEXT,
          isRead INTEGER,
          senderName TEXT,
          localStatus TEXT DEFAULT 'synced'
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

// Save messages to local DB
export const saveMessages = (messages) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      messages.forEach(message => {
        tx.executeSql(
          `INSERT OR REPLACE INTO messages 
          (messageID, chatID, senderID, receiverID, message, messageType, timestamp, isRead, senderName) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            message.messageID,
            message.chatID,
            message.senderID,
            message.receiverID,
            message.message,
            message.messageType,
            message.timestamp,
            message.isRead,
            message.senderName
          ],
          () => {},
          (_, error) => console.error('Error saving message', error)
        );
      });
      resolve();
    });
  });
};

// Get messages from local DB
export const getLocalMessages = (chatID) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM messages WHERE chatID = ? ORDER BY timestamp ASC',
        [chatID],
        (_, { rows }) => {
          const messages = [];
          for (let i = 0; i < rows.length; i++) {
            messages.push(rows.item(i));
          }
          resolve(messages);
        },
        (_, error) => reject(error)
      );
    });
  });
};

// Save a single message
export const saveSingleMessage = (message) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO messages 
        (messageID, chatID, senderID, receiverID, message, messageType, timestamp, isRead, senderName, localStatus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          message.messageID,
          message.chatID,
          message.senderID,
          message.receiverID,
          message.message,
          message.messageType,
          message.timestamp,
          message.isRead,
          message.senderName,
          message.localStatus || 'synced'
        ],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

export default db;