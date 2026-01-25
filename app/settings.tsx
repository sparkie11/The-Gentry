import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../src/constants/Colors';

export default function SettingsScreen() {
    const router = useRouter();

    const menuItems = [
        { title: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/privacy' },
        { title: 'Terms and Conditions', icon: 'document-text-outline', route: '/terms' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Legal</Text>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route as any)}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name={item.icon as any} size={24} color={Colors.dark.text} style={styles.menuIcon} />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.dark.textSecondary,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.dark.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 15,
        color: Colors.dark.primary,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.dark.text,
        fontWeight: '500',
    },
});
