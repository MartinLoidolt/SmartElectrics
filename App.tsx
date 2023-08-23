import { SafeAreaProvider } from "react-native-safe-area-context";

import ScreenChart from "./screens/ScreenChart";

export default function App() {
  return (
    <SafeAreaProvider>
      <ScreenChart />
    </SafeAreaProvider>
  );
}
