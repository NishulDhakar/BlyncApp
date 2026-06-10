import { StyleSheet, Text, View } from "react-native";
import { BackButton } from '../shared/components/BackButton';

export default function MemoryGameScreen() {

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Memory Game</Text>
            <View style={styles.board}>
                <Text style={styles.subtitle}>Game board will go here</Text>
                <Text style={styles.note}>(Architecture phase - no gameplay logic yet)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        color: '#FF6B00',
    },
    board: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#eee',
        borderStyle: 'dashed',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        fontWeight: '600',
    },
    note: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    }
});
