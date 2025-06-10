import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

interface DailyGoal {
  day: number;
  goal: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const AI_GOAL_URL = 'http://128.61.142.123:3001/api/generate-plan';

export default function CreatePlan() {
  const [currentCondition, setCurrentCondition] = useState('');
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<DailyGoal[]>([]);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    if (!currentCondition || !goal || !timeframe) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(AI_GOAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCondition,
          goal,
          timeframe: parseInt(timeframe),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setPlan(data.plan);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Plan</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Current Condition</Text>
          <TextInput
            style={styles.input}
            value={currentCondition}
            onChangeText={setCurrentCondition}
            placeholder="Describe your current situation"
            multiline
          />

          <Text style={styles.label}>Your Goal</Text>
          <TextInput
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
            placeholder="What do you want to achieve?"
            multiline
          />

          <Text style={styles.label}>Timeframe (days)</Text>
          <TextInput
            style={styles.input}
            value={timeframe}
            onChangeText={setTimeframe}
            placeholder="How many days to achieve your goal?"
            keyboardType="numeric"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity 
            style={styles.button}
            onPress={generatePlan}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Generate Plan</Text>
            )}
          </TouchableOpacity>
        </View>

        {plan.length > 0 && (
          <View style={styles.planContainer}>
            <Text style={styles.planTitle}>Your Personalized Plan</Text>
            {plan.map((day) => (
              <View key={day.day} style={styles.dayContainer}>
                <Text style={styles.dayTitle}>Day {day.day}</Text>
                <Text style={styles.goalText}>{day.goal}</Text>
                <Text style={styles.explanationText}>{day.explanation}</Text>
                <View style={[styles.difficultyBadge, styles[`${day.difficulty}Badge`]]}>
                  <Text style={styles.difficultyText}>{day.difficulty}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EB',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D2A26',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  button: {
    backgroundColor: '#4A9B8E',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#E07B39',
    fontSize: 14,
  },
  planContainer: {
    marginTop: 32,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 16,
  },
  dayContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    color: '#2D2A26',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: '#E8F5E9',
  },
  mediumBadge: {
    backgroundColor: '#FFF3E0',
  },
  hardBadge: {
    backgroundColor: '#FFEBEE',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
}); 