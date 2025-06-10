import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { CircleCheck as CheckCircle2, Circle, Calendar, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Task {
  goalId: string;
  category: string;
  task: {
    day: number;
    goal: string;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    completed: boolean;
  };
}

const TODAY_TASKS_URL = 'http://128.61.142.123:3001/api/today-tasks/user123';
const COMPLETE_TASK_URL = (goalId: string, day: number) => `http://128.61.142.123:3001/api/complete-task/${goalId}/${day}`;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayTasks = async () => {
    try {
      console.log('Attempting to fetch tasks from:', TODAY_TASKS_URL);
      const response = await fetch(TODAY_TASKS_URL);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tasks');
      }
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid response format');
      }
      setTasks(data.tasks);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      Alert.alert('Error', `Failed to fetch today's tasks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (goalId: string, day: number, currentCompleted: boolean) => {
    try {
      const response = await fetch(COMPLETE_TASK_URL(goalId, day), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompleted }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }
      fetchTodayTasks();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to update task');
    }
  };

  useEffect(() => {
    fetchTodayTasks();
  }, []);

  const completedCount = tasks.filter(t => t.task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4A9B8E';
      case 'medium': return '#E07B39';
      case 'hard': return '#D4622A';
      default: return '#8B7355';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A9B8E" />
      </View>
    );
  }

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
            {tasks.length === 0 ? (
              <Text style={styles.emptyStateText}>No tasks for today</Text>
            ) : (
              tasks.map((task, idx) => (
                <TouchableOpacity
                  key={task.goalId + '-' + task.task.day}
                  style={[
                    styles.goalCard,
                    task.task.completed && styles.goalCardCompleted
                  ]}
                  onPress={() => handleToggleTask(task.goalId, task.task.day, task.task.completed)}
                  activeOpacity={0.7}
                >
                  <View style={styles.goalIcon}>
                    {task.task.completed ? (
                      <CheckCircle2 color="#4A9B8E" size={24} strokeWidth={1.5} />
                    ) : (
                      <Circle color="#C4B5A0" size={24} strokeWidth={1.5} />
                    )}
                  </View>
                  <View style={styles.goalContent}>
                    <Text style={[
                      styles.goalTitle,
                      task.task.completed && styles.goalTitleCompleted
                    ]}>
                      {task.task.goal}
                    </Text>
                    <Text style={[
                      styles.goalDescription,
                      task.task.completed && styles.goalDescriptionCompleted
                    ]}>
                      {task.task.explanation}
                    </Text>
                  </View>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: getDifficultyColor(task.task.difficulty) + '20' }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(task.task.difficulty) }
                    ]}>
                      {getDifficultyLabel(task.task.difficulty)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7355',
    textAlign: 'center',
    marginTop: 20,
  },
});