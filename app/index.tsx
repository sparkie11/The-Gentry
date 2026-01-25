import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Platform, StatusBar as RNStatusBar, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../src/constants/Colors';
import { addToHistory, getHistory, searchWord } from '../src/services/db';

// Debounce helper
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export default function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const loadHistory = async () => {
        const hist = await getHistory();
        setHistory(hist);
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const performSearch = async (text: string) => {
        if (!text.trim()) {
            setResults([]);
            return;
        }
        try {
            const data = await searchWord(text);
            setResults(data);
        } catch (e) {
            console.error(e);
        }
    };

    const debouncedSearch = useCallback(debounce((text: string) => performSearch(text), 300), []);

    const handleTextChange = (text: string) => {
        setQuery(text);
        debouncedSearch(text);
        setIsSearching(!!text);
    };

    const handleSelectWord = async (item: any) => {
        await addToHistory(item.word);
        router.push({
            pathname: '/details/[word]',
            params: { word: item.word, definition: item.definition }
        });
        // Refresh history when coming back? 
        // Usually handled by focus effect, but for simplicity we reload next time or optimize later.
        loadHistory();
    };

    const handleSelectHistory = (item: any) => {
        // Search again for the definition as history might not have it or just navigate
        // Since history items are just { term, timestamp }, we need to find definition or just pass term and let details load it.
        // Let's pass term and let details page handle loading if definition is missing.
        router.push({
            pathname: '/details/[word]',
            params: { word: item.term }
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleSelectWord(item)}
        >
            <Text style={styles.resultWord}>{item.word}</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
        </TouchableOpacity>
    );

    const renderHistoryItem = ({ item }: { item: any }) => {
        const date = new Date(item.timestamp).toLocaleDateString();
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
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.title}>Dictionary</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a word..."
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={query}
                    onChangeText={handleTextChange}
                    autoCapitalize="none"
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => handleTextChange('')}>
                        <Ionicons name="close-circle" size={20} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.content}>
                {query.length > 0 ? (
                    <FlatList
                        data={results}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No definitions found.</Text>
                        }
                    />
                ) : (
                    <View style={{ flex: 1 }}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            {/* <TouchableOpacity onPress={() => router.push('/history')}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity> */}
                        </View>
                        <FlatList
                            data={history}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderHistoryItem}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Ionicons name="book-outline" size={48} color={Colors.dark.surfaceLight} />
                                    <Text style={styles.emptyText}>Start searching to build your dictionary.</Text>
                                </View>
                            }
                        />
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.dark.text,
        letterSpacing: -1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.surface,
        marginHorizontal: 20,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.dark.surfaceLight,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
        height: '100%',
    },
    content: {
        flex: 1,
        marginTop: 20,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.surfaceLight,
    },
    resultWord: {
        fontSize: 18,
        color: Colors.dark.text,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.dark.secondary,
    },
    seeAll: {
        color: Colors.dark.accent,
        fontSize: 14,
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
        opacity: 0.7,
    },
    emptyText: {
        color: Colors.dark.textSecondary,
        marginTop: 10,
        fontSize: 14,
    }
});
