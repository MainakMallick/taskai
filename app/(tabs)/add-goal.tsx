import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { Target, Clock, Zap, Heart, Dumbbell, Book, Coffee, CircleCheck as CheckCircle, User, Calendar } from 'lucide-react-native';

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

export default function AddGoal() {
  const [currentCondition, setCurrentCondition] = useState('');
  const [desiredAchievement, setDesiredAchievement] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(1);

  const handleCreateGoal = () => {
    if (!currentCondition.trim() || !desiredAchievement.trim() || !timeframe.trim() || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all fields to create your goal.');
      return;
    }

    Alert.alert(
      'Goal Created!',
      `Your ${difficultyLevels.find(d => d.id === selectedDifficulty)?.name.toLowerCase()} goal has been added to your plan.`,
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const resetForm = () => {
    setCurrentCondition('');
    setDesiredAchievement('');
    setTimeframe('');
    setSelectedCategory('');
    setSelectedDifficulty(1);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Goal</Text>
          <Text style={styles.subtitle}>Create a personalized habit to build</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleCreateGoal}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Goal</Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#F5F1EB',
  },
  button: {
    backgroundColor: '#4A9B8E',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
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
  bottomPadding: {
    height: 40,
  },
});