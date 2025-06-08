import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, User, Target, Calendar } from 'lucide-react-native';

export default function Setup() {
  const [currentCondition, setCurrentCondition] = useState('');
  const [desiredAchievement, setDesiredAchievement] = useState('');
  const [timeframe, setTimeframe] = useState('');
  
  const handleContinue = () => {
    if (!currentCondition.trim() || !desiredAchievement.trim() || !timeframe.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }
    
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#2D2A26" size={24} strokeWidth={1.5} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          We'll create personalized daily goals based on your information
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.labelIcon, { backgroundColor: '#FDF4F0' }]}>
                <User color="#E07B39" size={20} strokeWidth={1.5} />
              </View>
              <Text style={styles.label}>Current Condition</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., I exercise once a week"
              placeholderTextColor="#A69B87"
              value={currentCondition}
              onChangeText={setCurrentCondition}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.labelIcon, { backgroundColor: '#F0F7F6' }]}>
                <Target color="#4A9B8E" size={20} strokeWidth={1.5} />
              </View>
              <Text style={styles.label}>What do you want to achieve?</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., Exercise daily and feel more energetic"
              placeholderTextColor="#A69B87"
              value={desiredAchievement}
              onChangeText={setDesiredAchievement}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <View style={[styles.labelIcon, { backgroundColor: '#FDF4F0' }]}>
                <Calendar color="#E07B39" size={20} strokeWidth={1.5} />
              </View>
              <Text style={styles.label}>Timeframe (in days)</Text>
            </View>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="e.g., 30"
              placeholderTextColor="#A69B87"
              value={timeframe}
              onChangeText={setTimeframe}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleContinue}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Create My Plan</Text>
        <ArrowRight color="#fff" size={20} strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EB',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2A26',
    marginBottom: 8,
    letterSpacing: -0.5,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B7355',
    lineHeight: 26,
    marginBottom: 40,
  },
  form: {
    gap: 32,
  },
  inputGroup: {
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2A26',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#2D2A26',
    minHeight: 80,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  smallInput: {
    minHeight: 60,
  },
  button: {
    backgroundColor: '#4A9B8E',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 40,
    shadowColor: '#4A9B8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});