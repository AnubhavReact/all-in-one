import { StatusBar } from "expo-status-bar";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
// The same tool list the website renders from. One source of truth.
import { CATEGORIES, TOOLS, type CategoryId } from "@aio/core";

const CHIP: Record<CategoryId, string> = {
  pdf: "#C8102E",
  jobs: "#10243E",
  resume: "#0F6E5C",
  ats: "#A35709",
  ai: "#4C1D95",
  tax: "#1D4ED8",
};

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.wordmark}>All In One</Text>
        <Text style={styles.tagline}>Your paperwork, in one app.</Text>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const tools = TOOLS.filter((t) => t.category === item.id);
          const ready = tools.filter((t) => t.ready).length;
          return (
            <View style={styles.row}>
              <View style={[styles.chip, { backgroundColor: CHIP[item.id] }]} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{item.name}</Text>
                <Text style={styles.rowBlurb}>{item.blurb}</Text>
                <Text style={styles.rowMeta}>
                  {ready > 0
                    ? `${ready} of ${tools.length} ready`
                    : "Not built yet"}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6F8" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#10243E",
    backgroundColor: "#FFFFFF",
  },
  wordmark: { fontSize: 22, fontWeight: "800", color: "#10243E" },
  tagline: { fontSize: 13, color: "#4A5C74", marginTop: 4 },
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#CCD3DC",
    borderRadius: 4,
    padding: 14,
  },
  chip: { width: 10, height: 10, marginTop: 5 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: "700", color: "#10243E" },
  rowBlurb: {
    fontSize: 13,
    color: "#4A5C74",
    marginTop: 3,
    lineHeight: 18,
  },
  rowMeta: { fontSize: 12, color: "#8D99AA", marginTop: 6 },
});
