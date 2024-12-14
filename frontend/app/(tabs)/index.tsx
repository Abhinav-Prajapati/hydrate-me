import { useAuth } from '@/context/authContext';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface WeekItem {
  day: string;
  value: number;
  active: boolean;
}

interface WeeksProps {
  weeks: WeekItem[];
}

interface PiChartProps {
  fillPercentage: number;
  goal: number;
  current: number;
}

interface HighlightItem {
  label: string;
  value: number | string;
  description: string;
}

interface HighlightsProps {
  highlights: HighlightItem[];
}

export default function Tab() {
  const weeks: WeekItem[] = [
    { day: 'S', value: 80, active: false },
    { day: 'M', value: 73, active: false },
    { day: 'T', value: 63, active: false },
    { day: 'W', value: 80, active: false },
    { day: 'T', value: 90, active: false },
    { day: 'F', value: 69, active: true },
    { day: 'S', value: 90, active: false }
  ];

  const highlights: HighlightItem[] = [
    { label: 'Day Streak', value: 4, description: 'Days streak' },
    { label: 'Of Goal', value: '25%', description: 'Percentage of goal completed' },
    { label: 'Bottles to Go', value: 2, description: 'Remaining bottles' }
  ];

  return (
    <LinearGradient
      colors={['#1A5C87', '#19233e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <TopBar />
        <Weeks weeks={weeks} />
        <PiChart fillPercentage={25} goal={2000} current={500} />
        <Highlights highlights={highlights} />
      </View>
    </LinearGradient>
  );
}

const TopBar = () => {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.topBar}>
      <Text>
        {user?.email}
      </Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      {/* Top bar content can be added here */}
    </View>
  );
};

// 2. Weeks Component
const Weeks = ({ weeks }: WeeksProps) => {
  return (
    <View style={styles.weeks}>
      {weeks.map((item, key) => (
        <View key={key}>
          <AnimatedCircularProgress
            size={40}
            width={3}
            fill={item.value}
            tintColor="#1fadff"
            backgroundColor="#1f2b3b"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View
                style={{
                  backgroundColor: item.active ? '#1fadff' : 'transparent',
                  width: 27,
                  height: 27,
                  borderRadius: '100%',
                  margin: 10,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    color: '#eef5ff',
                  }}
                >
                  {item.day}
                </Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>
      ))}
    </View>
  );
};

const PiChart = ({ fillPercentage, goal, current }: PiChartProps) => {
  return (
    <View style={styles.piChart}>
      <AnimatedCircularProgress
        size={280}
        width={20}
        fill={fillPercentage}
        tintColor="#1fadff"
        backgroundColor="#1f2b3b"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.center}>
            <Text style={styles.value}>{current}</Text>
            <Text style={{ fontSize: 18, color: '#eef5ff' }}>
              Goal {goal}ml
            </Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const Highlights = ({ highlights }: HighlightsProps) => {
  return (
    <View style={styles.highlightsContainer}>
      <Text style={styles.text}>Highlights</Text>

      <View style={styles.highlights}>
        {highlights.map((highlight, index) => (
          <View key={index} style={index === 1 ? styles.middleChild : styles.highlightsChild}>
            <Text style={{ fontSize: 19, color: '#eef5ff', paddingBottom: 2, fontWeight: 500 }}>
              {highlight.value}
            </Text>
            <Text style={{ fontSize: 12, color: '#eef5ff', fontWeight: 200 }}>
              {highlight.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  topBar: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  weeks: {
    gap: 4,
    flexDirection: 'row',
    height: 70,
    marginHorizontal: 15,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  piChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    height: 320,
    margin: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  highlightsContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  highlights: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 76,
    width: '100%',
  },
  highlightsChild: {
    flex: 1,
    borderRadius: 15,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  middleChild: {
    width: '32%',
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    paddingVertical: 10,
  },
  center: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 55,
    fontWeight: 'light',
    color: '#eef5ff',
  }
});
