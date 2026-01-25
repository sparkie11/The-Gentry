import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../src/constants/Colors';
import { searchWord } from '../../src/services/db';

export default function WordDetail() {
    const { word, definition: initialDefinition } = useLocalSearchParams();
    const [definition, setDefinition] = useState<string>(initialDefinition as string || '');
    const router = useRouter();

    useEffect(() => {
        if (!definition && word) {
            // Fetch if missing
            searchWord(word as string).then(results => {
                const exactMatch = results.find((r: any) => r.word.toLowerCase() === (word as string).toLowerCase());
                if (exactMatch) {
                    setDefinition(exactMatch.definition);
                } else if (results.length > 0) {
                    setDefinition(results[0].definition);
                } else {
                    setDefinition("Definition not found.");
                }
            });
        }
    }, [word, definition]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${word}: ${definition}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={Colors.dark.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare}>
                    <Ionicons name="share-outline" size={24} color={Colors.dark.accent} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.word}>{word}</Text>

                <View style={styles.divider} />

                <View style={styles.definitionContainer}>
                    <Text style={styles.label}>Definition</Text>
                    <Text style={styles.definition}>{definition || "Loading..."}</Text>
                </View>
            </ScrollView>
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
    backButton: {
        padding: 8,
        backgroundColor: Colors.dark.surface,
        borderRadius: 20,
    },
    content: {
        padding: 24,
    },
    word: {
        fontSize: 42,
        fontWeight: '800',
        color: Colors.dark.text,
        letterSpacing: -0.5,
        marginBottom: 20,
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.dark.surfaceLight,
        marginBottom: 24,
    },
    definitionContainer: {
        backgroundColor: Colors.dark.surface,
        padding: 24,
        borderRadius: 20,
        borderLeftWidth: 4,
        borderLeftColor: Colors.dark.primary,
    },
    label: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        fontWeight: '700',
    },
    definition: {
        fontSize: 18,
        color: Colors.dark.text,
        lineHeight: 28,
        fontWeight: '400',
    },
});
