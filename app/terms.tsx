import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../src/constants/Colors';

export default function TermsScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Terms and Conditions</Text>
            <Text style={styles.date}>Last updated: January 25, 2026</Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
                By downloading or using the app, these terms will automatically apply to you. You should make sure therefore that you read them carefully before using the app.
            </Text>

            <Text style={styles.sectionTitle}>2. Intellectual Property</Text>
            <Text style={styles.paragraph}>
                Great care has been taken to compile the dictionary data. However, The Gentry application itself, and all the trade marks, copyright, database rights and other intellectual property rights related to it, still belong to the developer.
            </Text>

            <Text style={styles.sectionTitle}>3. Use of the App</Text>
            <Text style={styles.paragraph}>
                You are not allowed to copy, or modify the app, any part of the app, or our trademarks in any way. You are not allowed to attempt to extract the source code of the app, and you also shouldn't try to translate the app into other languages, or make derivative versions.
            </Text>

            <Text style={styles.sectionTitle}>4. Changes to This Terms</Text>
            <Text style={styles.paragraph}>
                We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes.
            </Text>

            <Text style={styles.sectionTitle}>5. Contact Us</Text>
            <Text style={styles.paragraph}>
                If you have any questions or suggestions about our Terms and Conditions, do not hesitate to contact us at gautamwise.s@gmail.com.
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
