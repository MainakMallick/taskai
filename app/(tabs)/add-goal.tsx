import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Target, Clock, Zap, Heart, Dumbbell, Book, Coffee, CircleCheck as CheckCircle, User, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GoalCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  backgroundColor: string;
}

const categories: GoalCategory[] = [
  { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: '#4A9B8E', backgroundColor: '#F0F7F6' },
  { id: 'health', name: 'Health', icon: Heart, color: '#E07B39', backgroundColor: '#FDF4F0' },
  { id: 'learning', name: 'Learning', icon: Book, color: '#D4622A', backgroundColor: '#FDF0ED' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Coffee, color: '#8B7355', backgroundColor: '#F7F5F3' },
];

const difficultyLevels = [
  { id: 1, name: 'Easy', description: 'Simple daily actions', color: '#4A9B8E' },
  { id: 2, name: 'Medium', description: 'Moderate effort required', color: '#E07B39' },
  { id: 3, name: 'Hard', description: 'Challenging commitment', color: '#D4622A' },
];

interface DailyGoal {
  day: number;
  goal: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Replace all API URLs
const MANUAL_GOAL_URL = 'http://128.61.142.123:3001/api/manual-goal';
const AI_GOAL_URL = 'http://128.61.142.123:3001/api/generate-plan';
const TODAY_TASKS_URL = 'http://128.61.142.123:3001/api/today-tasks/user123';
const COMPLETE_TASK_URL = (goalId: string, day: number) => `http://128.61.142.123:3001/api/complete-task/${goalId}/${day}`;

export default function AddGoal() {
  const [mode, setMode] = useState<'manual' | 'ai'>('ai');
  // Manual form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualDate, setManualDate] = useState<Date | null>(null);
  const [manualDateString, setManualDateString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [manualDifficulty, setManualDifficulty] = useState<number>(1);
  const [manualCategory, setManualCategory] = useState<string>('');
  const [manualLoading, setManualLoading] = useState(false);

  // AI form state
  const [currentCondition, setCurrentCondition] = useState('');
  const [desiredAchievement, setDesiredAchievement] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DailyGoal[]>([]);

  const handleCreateGoal = async () => {
    if (!currentCondition.trim() || !desiredAchievement.trim() || !timeframe.trim() || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all fields to create your goal.');
      return;
    }

    setLoading(true);
    const requestData = {
      currentCondition,
      goal: desiredAchievement,
      timeframe: parseInt(timeframe),
      category: selectedCategory,
      difficulty: difficultyLevels.find(d => d.id === selectedDifficulty)?.name.toLowerCase(),
      userId: 'user123' // TODO: Replace with actual user ID from authentication
    };

    console.log('Making API call with data:', requestData);

    try {
      const response = await fetch(AI_GOAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      if (!data.goal || !data.goal.dailyTasks) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format');
      }

      setGeneratedPlan(data.goal.dailyTasks);
      Alert.alert(
        'Plan Generated!',
        `Your ${difficultyLevels.find(d => d.id === selectedDifficulty)?.name.toLowerCase()} goal has been added to your plan.`,
        [{ text: 'OK', onPress: () => {
          resetForm();
          // Navigate to Today tab after creating goal
          // TODO: Implement navigation
        }}]
      );
    } catch (error: any) {
      console.error('Error details:', error);
      Alert.alert('Error', error?.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentCondition('');
    setDesiredAchievement('');
    setTimeframe('');
    setSelectedCategory('');
    setSelectedDifficulty(1);
  };

  // Manual goal creation handler
  const handleManualGoal = async () => {
    if (!manualTitle.trim() || !manualDescription.trim() || !manualDateString || !manualCategory) {
      Alert.alert('Missing Information', 'Please fill in all fields to create your goal.');
      return;
    }
    setManualLoading(true);
    try {
      const response = await fetch(MANUAL_GOAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: manualTitle,
          description: manualDescription,
          date: manualDateString,
          category: manualCategory,
          difficulty: difficultyLevels.find(d => d.id === manualDifficulty)?.name.toLowerCase(),
          userId: 'user123',
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create manual goal');
      Alert.alert('Goal Created!', 'Your manual goal has been added.', [{ text: 'OK', onPress: () => {
        setManualTitle(''); setManualDescription(''); setManualDate(null); setManualDateString(''); setManualCategory(''); setManualDifficulty(1);
      }}]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create manual goal');
    } finally {
      setManualLoading(false);
    }
  };

  // Date picker handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setManualDate(selectedDate);
      setManualDateString(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Goal</Text>
          <Text style={styles.subtitle}>Create a personalized habit to build</Text>
        </View>
      </SafeAreaView>

      {/* Segmented toggle UI (identical to Progress tab) */}
      <View style={styles.segmentedControlContainer}>
        <View style={styles.segmentedControlPill}>
          {(['manual', 'ai'] as const).map((option, idx) => (
            <TouchableOpacity
              key={option}
              style={[styles.segmentedControlOption, mode === option && styles.segmentedControlOptionActive, idx === 0 && styles.segmentedControlLeft, idx === 1 && styles.segmentedControlRight]}
              onPress={() => setMode(option)}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentedControlText, mode === option && styles.segmentedControlTextActive]}>
                {option === 'manual' ? 'Manual' : 'AI Custom'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {mode === 'manual' ? (
          <View style={styles.form}>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={manualTitle}
                onChangeText={setManualTitle}
                placeholder="Enter goal title"
              />
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={manualDescription}
                onChangeText={setManualDescription}
                placeholder="Enter goal description"
                multiline
              />
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Date</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="date"
                  style={{
                    ...styles.input,
                    fontFamily: 'inherit',
                    fontSize: 16,
                    padding: 16,
                    borderRadius: 12,
                    border: '1px solid #E5E5E5',
                    width: '100%',
                  }}
                  value={manualDateString}
                  onChange={e => {
                    setManualDateString(e.target.value);
                    setManualDate(new Date(e.target.value));
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: manualDateString ? '#2D2A26' : '#A69B87' }}>
                      {manualDateString || 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={manualDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </>
              )}
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        manualCategory === category.id && styles.categoryCardSelected
                      ]}
                      onPress={() => setManualCategory(category.id)}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: category.backgroundColor }]}> 
                        <IconComponent color={category.color} size={24} strokeWidth={1.5} />
                      </View>
                      <Text style={[
                        styles.categoryName,
                        manualCategory === category.id && styles.categoryNameSelected
                      ]}>
                        {category.name}
                      </Text>
                      {manualCategory === category.id && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle color="#4A9B8E" size={16} strokeWidth={1.5} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <View style={styles.inputSection}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyList}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.difficultyCard,
                      manualDifficulty === level.id && styles.difficultyCardSelected
                    ]}
                    onPress={() => setManualDifficulty(level.id)}
                  >
                    <View style={styles.difficultyContent}>
                      <Text style={[
                        styles.difficultyName,
                        manualDifficulty === level.id && styles.difficultyNameSelected
                      ]}>
                        {level.name}
                      </Text>
                      <Text style={[
                        styles.difficultyDescription,
                        manualDifficulty === level.id && styles.difficultyDescriptionSelected
                      ]}>
                        {level.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.difficultyIndicator,
                      { backgroundColor: level.color + '20' }
                    ]}>
                      <View style={[
                        styles.difficultyDot,
                        { backgroundColor: level.color }
                      ]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={[styles.createButton, manualLoading && styles.createButtonDisabled]}
              onPress={handleManualGoal}
              disabled={manualLoading}
            >
              {manualLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Create Goal</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.inputSection}>
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

            <View style={styles.inputSection}>
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

            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <View style={[styles.labelIcon, { backgroundColor: '#FDF4F0' }]}>
                  <Calendar color="#E07B39" size={20} strokeWidth={1.5} />
                </View>
                <Text style={styles.label}>Timeframe (days)</Text>
              </View>
              <TextInput
                style={[styles.input, styles.durationInput]}
                placeholder="e.g., 30"
                placeholderTextColor="#A69B87"
                value={timeframe}
                onChangeText={setTimeframe}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <View style={[styles.labelIcon, { backgroundColor: '#F7F5F3' }]}>
                  <Coffee color="#8B7355" size={20} strokeWidth={1.5} />
                </View>
                <Text style={styles.label}>Category</Text>
              </View>
              <View style={styles.categoryGrid}>
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryCard,
                        selectedCategory === category.id && styles.categoryCardSelected
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: category.backgroundColor }]}>
                        <IconComponent color={category.color} size={24} strokeWidth={1.5} />
                      </View>
                      <Text style={[
                        styles.categoryName,
                        selectedCategory === category.id && styles.categoryNameSelected
                      ]}>
                        {category.name}
                      </Text>
                      {selectedCategory === category.id && (
                        <View style={styles.selectedIndicator}>
                          <CheckCircle color="#4A9B8E" size={16} strokeWidth={1.5} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <View style={[styles.labelIcon, { backgroundColor: '#FDF4F0' }]}>
                  <Zap color="#E07B39" size={20} strokeWidth={1.5} />
                </View>
                <Text style={styles.label}>Difficulty Level</Text>
              </View>
              <View style={styles.difficultyList}>
                {difficultyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.difficultyCard,
                      selectedDifficulty === level.id && styles.difficultyCardSelected
                    ]}
                    onPress={() => setSelectedDifficulty(level.id)}
                  >
                    <View style={styles.difficultyContent}>
                      <Text style={[
                        styles.difficultyName,
                        selectedDifficulty === level.id && styles.difficultyNameSelected
                      ]}>
                        {level.name}
                      </Text>
                      <Text style={[
                        styles.difficultyDescription,
                        selectedDifficulty === level.id && styles.difficultyDescriptionSelected
                      ]}>
                        {level.description}
                      </Text>
                    </View>
                    <View style={[
                      styles.difficultyIndicator,
                      { backgroundColor: level.color + '20' }
                    ]}>
                      <View style={[
                        styles.difficultyDot,
                        { backgroundColor: level.color }
                      ]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.bottomPadding} />

            <TouchableOpacity 
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleCreateGoal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createButtonText}>Create Goal</Text>
              )}
            </TouchableOpacity>

            {generatedPlan.length > 0 && (
              <View style={styles.planContainer}>
                <Text style={styles.planTitle}>Your Personalized Plan</Text>
                {generatedPlan.map((day) => (
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
        )}
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
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2A26',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 32,
  },
  inputSection: {
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
    borderRadius: 12,
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
  durationInput: {
    minHeight: 60,
    width: 120,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    width: '47%',
    position: 'relative',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryCardSelected: {
    backgroundColor: '#F0F7F6',
    borderWidth: 2,
    borderColor: '#4A9B8E',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D2A26',
  },
  categoryNameSelected: {
    color: '#4A9B8E',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  difficultyList: {
    gap: 12,
  },
  difficultyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  difficultyCardSelected: {
    backgroundColor: '#F0F7F6',
    borderWidth: 2,
    borderColor: '#4A9B8E',
  },
  difficultyContent: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 4,
  },
  difficultyNameSelected: {
    color: '#4A9B8E',
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#8B7355',
  },
  difficultyDescriptionSelected: {
    color: '#4A9B8E',
  },
  difficultyIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  difficultyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  createButton: {
    backgroundColor: '#4A9B8E',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  planContainer: {
    marginTop: 24,
    marginBottom: 32,
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
  bottomPadding: {
    height: 40,
  },
  segmentedControlContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  segmentedControlPill: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 4,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  segmentedControlOption: {
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControlOptionActive: {
    backgroundColor: '#E07B39',
  },
  segmentedControlText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B7355',
  },
  segmentedControlTextActive: {
    color: '#fff',
  },
  segmentedControlLeft: {
    marginRight: 2,
  },
  segmentedControlRight: {
    marginLeft: 2,
  },
});