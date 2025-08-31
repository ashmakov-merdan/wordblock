import { NavigationContainer } from "@react-navigation/native";

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  return <NavigationContainer>{children}</NavigationContainer>
};

export default NavigationProvider;