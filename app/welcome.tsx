import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Target, TrendingUp, Zap } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle1} />
            <View style={styles.logoCircle2} />
            <View style={styles.logoCircle3} />
          </View>
          
          <Text style={styles.title}>Welcome to Habitual</Text>
          <Text style={styles.subtitle}>
            Build lasting habits with personalized daily goals, tailored to your pace and progress.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#F0F7F6' }]}>
              <TrendingUp color="#4A9B8E" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.featureText}>Incremental Progress</Text>
          </View>
          <View style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: '#FDF4F0' }]}>
              <Zap color="#E07B39" size={20} strokeWidth={1.5} />
            </View>
            <Text style={styles.featureText}>Smart Goal Setting</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/setup')}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <ArrowRight color="#fff" size={20} strokeWidth={1.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EB',
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle1: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E07B39',
    opacity: 0.8,
    top: 0,
    left: 10,
  },
  logoCircle2: {
    position: 'absolute',
    width: 70,
    height: 90,
    borderRadius: 35,
    backgroundColor: '#F5E6D3',
    opacity: 0.9,
    top: 15,
    right: 0,
  },
  logoCircle3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A9B8E',
    bottom: 0,
    right: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#2D2A26',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
  },
  features: {
    gap: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 18,
    color: '#2D2A26',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4A9B8E',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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