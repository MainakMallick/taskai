import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { TrendingUp, Calendar, Target, Award, Zap } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProgressData {
  day: string;
  completion: number;
  streak: number;
}

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  const weeklyData: ProgressData[] = [
    { day: 'Mon', completion: 80, streak: 5 },
    { day: 'Tue', completion: 100, streak: 6 },
    { day: 'Wed', completion: 60, streak: 0 },
    { day: 'Thu', completion: 90, streak: 1 },
    { day: 'Fri', completion: 100, streak: 2 },
    { day: 'Sat', completion: 70, streak: 0 },
    { day: 'Sun', completion: 85, streak: 1 },
  ];

  const currentStreak = 7;
  const totalHabits = 3;
  const overallCompletion = 85;

  const renderChart = () => {
    const maxHeight = 80;
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {weeklyData.map((data, index) => (
            <View key={data.day} style={styles.chartBar}>
              <View 
                style={[
                  styles.bar,
                  { 
                    height: (data.completion / 100) * maxHeight,
                    backgroundColor: data.completion === 100 ? '#4A9B8E' : '#E8DDD4'
                  }
                ]} 
              />
              <Text style={styles.chartLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          
          <View style={styles.periodSelector}>
            {(['daily', 'weekly', 'monthly'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F0F7F6' }]}>
              <Target color="#4A9B8E" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.statValue}>{overallCompletion}%</Text>
            <Text style={styles.statLabel}>Goals Completed</Text>
            <Text style={styles.statChange}>+5% from last week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FDF4F0' }]}>
              <Award color="#E07B39" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statChange}>+2 days</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#F0F7F6' }]}>
              <TrendingUp color="#4A9B8E" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>Weekly Overview</Text>
          </View>
          
          {renderChart()}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIconContainer, { backgroundColor: '#FDF4F0' }]}>
              <Calendar color="#E07B39" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          </View>

          <View style={styles.habitsList}>
            <View style={styles.habitItem}>
              <Text style={styles.habitName}>Exercise</Text>
              <View style={styles.habitProgress}>
                <View style={[styles.habitBar, { width: '90%', backgroundColor: '#4A9B8E' }]} />
              </View>
              <Text style={styles.habitPercentage}>90%</Text>
            </View>

            <View style={styles.habitItem}>
              <Text style={styles.habitName}>Hydration</Text>
              <View style={styles.habitProgress}>
                <View style={[styles.habitBar, { width: '85%', backgroundColor: '#E07B39' }]} />
              </View>
              <Text style={styles.habitPercentage}>85%</Text>
            </View>

            <View style={styles.habitItem}>
              <Text style={styles.habitName}>Mindfulness</Text>
              <View style={styles.habitProgress}>
                <View style={[styles.habitBar, { width: '75%', backgroundColor: '#D4622A' }]} />
              </View>
              <Text style={styles.habitPercentage}>75%</Text>
            </View>
          </View>
        </View>

        <View style={styles.insights}>
          <View style={styles.insightsHeader}>
            <View style={[styles.insightsIcon, { backgroundColor: '#FDF4F0' }]}>
              <Zap color="#E07B39" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.insightsTitle}>Insights</Text>
          </View>
          <Text style={styles.insightsText}>
            You're doing great! Your consistency has improved by 20% this week. 
            Keep focusing on your exercise routine to maintain momentum.
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
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#2D2A26',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#4A9B8E',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2D2A26',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  statChange: {
    fontSize: 11,
    color: '#4A9B8E',
    marginTop: 4,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D2A26',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '500',
  },
  habitsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    gap: 20,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  habitName: {
    fontSize: 16,
    color: '#2D2A26',
    fontWeight: '600',
    width: 80,
  },
  habitProgress: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F7F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  habitBar: {
    height: '100%',
    borderRadius: 4,
  },
  habitPercentage: {
    fontSize: 14,
    color: '#2D2A26',
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  insights: {
    marginHorizontal: 24,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  insightsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
  },
  insightsText: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 100,
  },
});