import { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { supabase } from '../services/auth/supabaseClient';
import { dialogService } from '../services/dialogService';

export default function NotesScreen() {
    const [text, setText] = useState('');

    const handleSimpan = async () => {
        // Coba insert ke kolom 'content' (default modul), fallback ke 'text' jika nama kolom berbeda
        let { error } = await supabase.from('notes').insert([{ content: text }]);
        if (error && (error.code === 'PGRST204' || error.message.includes('column'))) {
            const fallback = await supabase.from('notes').insert([{ text }]);
            error = fallback.error;
        }

        if (error) {
            dialogService.alert('Gagal', error.message);
        } else {
            dialogService.alert('Berhasil', 'Data berhasil disimpan!');
            setText('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="input"
                placeholderTextColor="#64748b"
                value={text}
                onChangeText={setText}
            />
            <Button title="simpan" onPress={handleSimpan} color="green" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        gap: 16,
        backgroundColor: '#0b1020',
    },
    input: {
        borderWidth: 1,
        borderColor: '#243055',
        padding: 12,
        borderRadius: 6,
        fontSize: 16,
        backgroundColor: '#151c34',
        color: '#ffffff',
    },
});