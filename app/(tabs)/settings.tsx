import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { User, Bell, Info, LogOut, ChevronRight, CreditCard as Edit3, Palette } from 'lucide-react-native';

export default function Settings() {
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality would be implemented here.');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings would be implemented here.');
  };

  const handleTheme = () => {
    Alert.alert('Theme', 'Theme customization would be implemented here.');
  };

  const handleAbout = () => {
    Alert.alert('About', 'This is a minimal AI habit building app designed to help you achieve your goals through incremental progress.');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <User color="#8B7355" size={32} strokeWidth={1.5} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
              <Edit3 color="#4A9B8E" size={20} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={handleNotifications}>
              <View style={[styles.settingIcon, { backgroundColor: '#FDF4F0' }]}>
                <Bell color="#E07B39" size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Manage your notification preferences
                </Text>
              </View>
              <ChevronRight color="#C4B5A0" size={20} strokeWidth={1.5} />
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity style={styles.settingItem} onPress={handleTheme}>
              <View style={[styles.settingIcon, { backgroundColor: '#F0F7F6' }]}>
                <Palette color="#4A9B8E" size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingDescription}>
                  Customize your app appearance
                </Text>
              </View>
              <ChevronRight color="#C4B5A0" size={20} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
              <View style={[styles.settingIcon, { backgroundColor: '#F0F7F6' }]}>
                <Info color="#4A9B8E" size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About</Text>
                <Text style={styles.settingDescription}>
                  Learn more about this app
                </Text>
              </View>
              <ChevronRight color="#C4B5A0" size={20} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={handleSignOut}>
              <View style={[styles.settingIcon, { backgroundColor: '#FDF0F0' }]}>
                <LogOut color="#D4622A" size={20} strokeWidth={1.5} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: '#D4622A' }]}>Sign Out</Text>
                <Text style={styles.settingDescription}>
                  Sign out of your account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for better habits</Text>
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
  },
  scrollContent: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 32,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#8B7355',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#E07B39',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2A26',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8B7355',
    lineHeight: 18,
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F1EB',
    marginLeft: 72,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#A69B87',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 100,
  },
});