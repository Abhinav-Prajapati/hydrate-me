import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Tab() {
  const weeks = [
    { day: 'S', value: 80, active: false },
    { day: 'M', value: 73, active: false },
    { day: 'T', value: 63, active: false },
    { day: 'W', value: 80, active: false },
    { day: 'T', value: 90, active: false },
    { day: 'F', value: 69, active: true },
    { day: 'S', value: 90, active: false },]
  return (
    <LinearGradient
      colors={['#1A5C87', '#19233e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={styles.topBar}>
        </View>
        <View style={styles.weeks}>
          {
            weeks.map(
              (item, key) => (
                <View key={key}>
                  <AnimatedCircularProgress
                    size={40}
                    width={4}
                    fill={item.value}
                    tintColor="#1fadff"
                    backgroundColor="#1f2b3b"
                    rotation={0} // Start from the top
                    lineCap="round"
                  >
                    {() => (
                      <View style={{
                        backgroundColor: item.active ? '#1fadff' : 'transparent',
                        width: 27,
                        height: 27,
                        borderRadius: '100%',
                        margin: 10,
                        justifyContent: 'center'
                      }}>
                        <Text style={{
                          textAlign: 'center',
                          fontSize: 16,
                          color: '#eef5ff',
                        }}>{item.day}</Text>
                      </View>
                    )}
                  </AnimatedCircularProgress>
                </View>
              )
            )
          }
        </View>

        <View style={styles.piChart}>
          <AnimatedCircularProgress
            size={280}
            width={20}
            fill={25} // Value to fill (0-100)
            tintColor="#1fadff"
            backgroundColor="#1f2b3b"
            rotation={0} // Start from the top
            lineCap="round"
          >
            {() => (
              <View style={styles.center}>
                <Text style={styles.value}>{500}</Text>
                <Text style={{
                  fontSize: 18,
                  color: '#eef5ff'
                }}>{`Goal ${2000}ml`}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        <View style={styles.highlightsContainer}>
          <Text style={styles.text}>Highlights</Text>

          <View style={styles.highlights}>
            <View style={styles.highlightsChild}>
              <Text style={{ fontSize: 19, color: '#eef5ff', paddingBottom: 2, fontWeight: 500 }}>
                {2}
              </Text>
              <Text style={{ fontSize: 12, color: '#eef5ff', fontWeight: 200 }}>
                Day Streak
              </Text>
            </View>
            <View style={styles.middleChild}>
              <Text style={{ fontSize: 19, color: '#eef5ff', paddingBottom: 2, fontWeight: 500 }}>
                {`${25}%`}
              </Text>
              <Text style={{ fontSize: 12, color: '#eef5ff', fontWeight: 200 }}>
                Of Goal
              </Text>
            </View>
            <View style={styles.highlightsChild}>
              <Text style={{ fontSize: 19, color: '#eef5ff', paddingBottom: 2, fontWeight: 500 }}>
                {2}
              </Text>
              <Text style={{ fontSize: 12, color: '#eef5ff', fontWeight: 200 }}>
                Bottles to Go
              </Text>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Ensure space between sections
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 100, // Width of the loader
    height: 100, // Height of the loader
    borderRadius: 50, // Make it rounded
    backgroundColor: 'transparent', // Ensure the background is transparent
  },
  center: {
    position: 'absolute', // Position in the center of the donut
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 55,
    fontWeight: 'light',
    color: '#eef5ff'
  }
});
