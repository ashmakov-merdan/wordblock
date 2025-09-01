import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { CaretLeftIcon } from "phosphor-react-native";
import { FC, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "shared/theme";

const Header: FC<NativeStackHeaderProps> = ({ navigation, options }) => {
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('/');
    }
  }, [navigation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.wrapper]}>
        {navigation.canGoBack() && (
          <View style={styles.button}>
            <TouchableOpacity activeOpacity={0.7} style={styles.backButton} onPress={handleBack}>
              <CaretLeftIcon size={14} color={theme.colors.neutral[600]} />
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.label}>{options.title}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white'
  },
  wrapper: {
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    width: '100%'
  },
  label: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: theme.colors.neutral[900],
  },
  button: {
    position: 'absolute',
    left: 16,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 100,
    zIndex: 20
  }
})

Header.displayName = 'Header';

export default Header;