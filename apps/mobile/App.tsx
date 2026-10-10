import { StatusBar } from "expo-status-bar";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
// The same catalogue the website renders from. One source of truth.
import { TOOLS, type TileHue, type ToolStatus } from "@aio/core";

// The dusk theme's tokens, mirrored here because React Native has no CSS.
const T = {
  surface0: "#171A21",
  surface1: "#1F232B",
  surface2: "#282D37",
  line: "#333946",
  ink: "#EEF0F4",
  inkMuted: "#A3A9B6",
  inkFaint: "#8A90A0",
  brand: "#F4B740",
  accent: "#4CC9B0",
};

const HUE: Record<TileHue, string> = {
  pdf: "#FF8A7A",
  career: "#4CC9B0",
  ai: "#8AB8FF",
  tax: "#B9D667",
};

const STATUS: Record<ToolStatus, string> = {
  live: "Live",
  new: "New",
  soon: "Coming soon",
};

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View style={styles.wordmarkRow}>
          <View style={styles.mark}>
            <View style={[styles.markCell, { backgroundColor: T.brand }]} />
            <View style={styles.markCell} />
            <View style={styles.markCell} />
            <View style={styles.markCell} />
          </View>
          <Text style={styles.wordmark}>
            AllIn<Text style={{ color: T.brand }}>One</Text>
          </Text>
        </View>
        <Text style={styles.tagline}>Your paperwork, in one app.</Text>
      </View>

      <FlatList
        data={TOOLS}
        keyExtractor={(tool) => tool.slug}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const soon = item.status === "soon";
          return (
            <View style={[styles.card, soon && styles.cardSoon]}>
              <View style={styles.cardTop}>
                <View style={styles.tile}>
                  <View style={[styles.dot, { backgroundColor: HUE[item.hue] }]} />
                </View>
                <Text style={[styles.badge, soon && styles.badgeSoon]}>
                  {STATUS[item.status]}
                </Text>
              </View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.blurb}>{item.blurb}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.surface0 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: T.line,
  },
  wordmarkRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  mark: { width: 21, flexDirection: "row", flexWrap: "wrap", gap: 3 },
  markCell: { width: 9, height: 9, borderRadius: 3, backgroundColor: "#6E7688" },
  wordmark: { fontSize: 20, fontWeight: "700", color: T.ink },
  tagline: { fontSize: 13, color: T.inkMuted, marginTop: 6 },
  list: { padding: 16, gap: 12 },
  card: {
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: T.surface1,
    borderWidth: 1,
    borderColor: T.line,
  },
  cardSoon: { opacity: 0.7 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  badge: {
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#1C3532",
    color: T.accent,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  badgeSoon: { backgroundColor: T.surface2, color: T.inkFaint },
  title: { fontSize: 16, fontWeight: "700", color: T.ink },
  blurb: { fontSize: 13, lineHeight: 19, color: T.inkMuted },
});
