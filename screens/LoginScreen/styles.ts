import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    fontFamily: "Helvetica-Regular",
    marginBottom: 8,
  },
  themeToggle: {
    position: "absolute",
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  themeToggleText: {
    fontSize: 18,
  },
});
