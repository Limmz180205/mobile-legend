import { Alert, Platform } from 'react-native';

export const dialogService = {
  alert: (title: string, message?: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') {
        window.alert(`${title}: ${message || ''}`);
      }
    } else {
      Alert.alert(title, message);
    }
  },
};

