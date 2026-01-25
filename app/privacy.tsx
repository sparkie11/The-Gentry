import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../src/constants/Colors';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.date}>Last updated: January 25, 2026</Text>

            <Text style={styles.paragraph}>
                At The Gentry, we prioritize your privacy. This Privacy Policy describes how we handle your information when you use our mobile application.
            </Text>

            <Text style={styles.sectionTitle}>1. Data Collection</Text>
            <Text style={styles.paragraph}>
                The Gentry is an offline-first dictionary application. We do not collect, store, or transmit any personal data to external servers. All search history and application data are stored locally on your device.
            </Text>

            <Text style={styles.sectionTitle}>2. Local Storage</Text>
            <Text style={styles.paragraph}>
                We use local storage technologies (SQLite and local storage) to save your search history and preferences solely for the purpose of enhancing your user experience. You have full control over this data and can clear your history at any time within the app settings.
            </Text>

            <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
            <Text style={styles.paragraph}>
                The app does not integrate with third-party analytics or advertising services that track user behavior.
            </Text>

            <Text style={styles.sectionTitle}>4. Changes to This Policy</Text>
            <Text style={styles.paragraph}>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </Text>

            <Text style={styles.sectionTitle}>5. Contact Us</Text>
            <Text style={styles.paragraph}>
                If you have any questions about this Privacy Policy, please contact us at gautamwise.s@gmail.com.
            </Text>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.dark.text,
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 16,
        color: Colors.dark.text,
        lineHeight: 24,
    },
});
