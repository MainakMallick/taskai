import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Chrome as Home, TrendingUp, Settings, Plus } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8DDD4',
          height: 80,
          paddingBottom: 20,
          paddingTop: 12,
          shadowColor: '#E07B39',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarActiveTintColor: '#4A9B8E',
        tabBarInactiveTintColor: '#A69B87',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: focused ? '#F0F7F6' : 'transparent',
            }}>
              <Home size={size} color={color} strokeWidth={1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add-goal"
        options={{
          title: 'Add Goal',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: focused ? '#FDF4F0' : 'transparent',
            }}>
              <Plus size={size} color={color} strokeWidth={1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: focused ? '#F0F7F6' : 'transparent',
            }}>
              <TrendingUp size={size} color={color} strokeWidth={1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              padding: 8,
              borderRadius: 12,
              backgroundColor: focused ? '#F0F7F6' : 'transparent',
            }}>
              <Settings size={size} color={color} strokeWidth={1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}