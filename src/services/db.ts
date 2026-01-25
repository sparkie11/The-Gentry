import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'dictionary.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDb = async () => {
    if (dbInstance) return dbInstance;
    if (Platform.OS !== 'web') {
        dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
    } else {
        // Safe fallback for Web if called before initialization
        return {
            getAllAsync: async () => [],
            runAsync: async () => ({}),
            execAsync: async () => { },
            withTransactionAsync: async (cb: any) => cb(),
        } as unknown as SQLite.SQLiteDatabase;
    }
    return dbInstance!;
};


import { Platform } from 'react-native';

// Web data cache
let webData: any[] = [];

export const initDatabase = async () => {
    if (Platform.OS === 'web') {
        try {
            // Load the JSON file for web
            // In a real production app, you might want to fetch this lazily or chunk it
            const data = require('../../assets/dictionary.json');
            webData = data;
            console.log("Web dictionary loaded:", webData.length, "words");
        } catch (e) {
            console.warn("Error initializing web dictionary:", e);
        }
        return;
    }

    const dbPath = `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
    const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}SQLite`);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}SQLite`);
    }

    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (!fileInfo.exists) {
        console.log('Database file does not exist, copying from assets...');
        try {
            const asset = Asset.fromModule(require('../../assets/dictionary.db'));
            await asset.downloadAsync();

            // Copy using the uri from the asset
            if (asset.localUri) {
                await FileSystem.copyAsync({
                    from: asset.localUri,
                    to: dbPath,
                });
                console.log('Database copied successfully');
            } else {
                throw new Error("Asset localUri is null");
            }

        } catch (error) {
            console.error('Error copying database:', error);
            throw error;
        }
    } else {
        console.log('Database already exists at:', dbPath);
    }

    const db = await getDb();

    if (!db) {
        console.error("Failed to get DB instance.");
        return;
    }

    // Create History Table
    try {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          term TEXT NOT NULL,
          timestamp INTEGER NOT NULL
        );
      `);
    } catch (e) {
        console.warn("Failed to create history table:", e);
    }
};

export const searchWord = async (term: string) => {
    const searchTerm = term.trim().toLowerCase();

    if (Platform.OS === 'web') {
        if (!webData.length) return [];
        // Simple in-memory filter
        // Limit to 50
        const results = webData.filter(item =>
            item.word.toLowerCase() === searchTerm ||
            item.word.toLowerCase().startsWith(searchTerm)
        ).slice(0, 50);
        return results;
    }

    const db = await getDb();

    // Exact match first, then starts with
    const result = await db.getAllAsync(
        'SELECT * FROM dictionary WHERE word = ? OR word LIKE ? LIMIT 50',
        [searchTerm, `${searchTerm}%`]
    );
    return result;
};

export const addToHistory = async (term: string) => {
    const db = await getDb();
    const timestamp = Date.now();
    // Check if exists today to avoid duplicates on same day? Or just add all?
    // User asked: "store the searched term , on date basis in local"
    // Let's just store all for now.
    await db.runAsync(
        'INSERT INTO history (term, timestamp) VALUES (?, ?)',
        [term, timestamp]
    );
};

export const getHistory = async () => {
    const db = await getDb();
    // Group by date might be done in UI or here.
    // Let's get raw data first.
    const result = await db.getAllAsync(
        'SELECT * FROM history ORDER BY timestamp DESC LIMIT 100'
    );
    return result;
};

export const clearHistory = async () => {
    const db = await getDb();
    await db.runAsync('DELETE FROM history');
}
