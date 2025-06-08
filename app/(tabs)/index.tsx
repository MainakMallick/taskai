import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { CircleCheck as CheckCircle2, Circle, Calendar, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  difficulty: number;
}

export default function Home() {
  const [todayGoals, setTodayGoals] = useState<Goal[]>([
    {
      id: '1',
      title: '5-minute walk',
      description: 'Take a short walk around your neighborhood',
      completed: false,
      difficulty: 1,
    },
    {
      id: '2',
      title: 'Drink 2 glasses of water',
      description: 'Stay hydrated throughout the morning',
      completed: true,
      difficulty: 1,
    },
    {
      id: '3',
      title: 'Do 3 push-ups',
      description: 'Start building upper body strength',
      completed: false,
      difficulty: 2,
    },
  ]);

  const completedCount = todayGoals.filter(goal => goal.completed).length;
  const totalCount = todayGoals.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const toggleGoal = (goalId: string) => {
    setTodayGoals(prev => 
      prev.map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#4A9B8E';
      case 2: return '#E07B39';
      case 3: return '#D4622A';
      default: return '#8B7355';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressIconContainer}>
              <Target color="#4A9B8E" size={24} strokeWidth={1.5} />
            </View>
            <Text style={styles.progressTitle}>Today's Progress</Text>
          </View>
          
          <View style={styles.progressStats}>
            <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            <Text style={styles.progressSubtext}>
              {completedCount} of {totalCount} goals completed
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionPercentage}%` }
              ]} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Calendar color="#E07B39" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
          </View>

          <View style={styles.goalsList}>
            {todayGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  goal.completed && styles.goalCardCompleted
                ]}
                onPress={() => toggleGoal(goal.id)}
                activeOpacity={0.7}
              >
                <View style={styles.goalIcon}>
                  {goal.completed ? (
                    <CheckCircle2 color="#4A9B8E\" size={24} strokeWidth={1.5} />
                  ) : (
                    <Circle color="#C4B5A0" size={24} strokeWidth={1.5} />
                  )}
                </View>
                
                <View style={styles.goalContent}>
                  <Text style={[
                    styles.goalTitle,
                    goal.completed && styles.goalTitleCompleted
                  ]}>
                    {goal.title}
                  </Text>
                  <Text style={[
                    styles.goalDescription,
                    goal.completed && styles.goalDescriptionCompleted
                  ]}>
                    {goal.description}
                  </Text>
                </View>

                <View style={[
                  styles.difficultyBadge,
                  { backgroundColor: getDifficultyColor(goal.difficulty) + '20' }
                ]}>
                  <Text style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(goal.difficulty) }
                  ]}>
                    {getDifficultyLabel(goal.difficulty)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.nextDay}>
          <Text style={styles.nextDayTitle}>Tomorrow's Preview</Text>
          <Text style={styles.nextDayText}>
            Based on today's progress, tomorrow's goals will be slightly more challenging to help you grow.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EB',
  },
  headerContainer: {
    backgroundColor: '#F5F1EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DDD4',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2A26',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
  },
  progressCard: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  progressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2A26',
  },
  progressStats: {
    marginBottom: 16,
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '300',
    color: '#4A9B8E',
    letterSpacing: -1,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#8B7355',
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F7F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A9B8E',
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF4F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2A26',
  },
  goalsList: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  goalCardCompleted: {
    backgroundColor: '#F0F7F6',
  },
  goalIcon: {
    width: 24,
    height: 24,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 4,
  },
  goalTitleCompleted: {
    color: '#8B7355',
    textDecorationLine: 'line-through',
  },
  goalDescription: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  goalDescriptionCompleted: {
    color: '#A69B87',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextDay: {
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  nextDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 8,
  },
  nextDayText: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});