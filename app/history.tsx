import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../src/constants/Colors';
import { clearHistory, getHistory } from '../src/services/db';

export default function HistoryScreen() {
    const [history, setHistory] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const hist = await getHistory();
        setHistory(hist);
    };

    const handleClearHistory = async () => {
        await clearHistory();
        loadHistory();
    };

    const handleSelectHistory = (item: any) => {
        router.push({
            pathname: '/details/[word]',
            params: { word: item.term }
        });
    };

    const renderHistoryItem = ({ item }: { item: any }) => {
        const date = new Date(item.timestamp).toLocaleDateString() + ' ' + new Date(item.timestamp).toLocaleTimeString();
        return (
            <TouchableOpacity
                style={styles.historyItem}
                onPress={() => handleSelectHistory(item)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="time-outline" size={16} color={Colors.dark.accent} style={{ marginRight: 8 }} />
                    <Text style={styles.historyWord}>{item.term}</Text>
                </View>
                <Text style={styles.historyDate}>{date}</Text>
            </TouchableOpacity>
        )
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>All Searched Words</Text>
                <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderHistoryItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No history found.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.textSecondary,
    },
    clearButton: {
        padding: 8,
    },
    clearButtonText: {
        color: Colors.dark.error,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    historyWord: {
        fontSize: 16,
        color: Colors.dark.text,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    historyDate: {
        fontSize: 12,
        color: Colors.dark.textSecondary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
    }
});
