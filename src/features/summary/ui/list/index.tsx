import { StyleSheet, View } from "react-native";
import SummaryCard from "../card";
import { BookOpenUserIcon, SealCheckIcon } from "phosphor-react-native";
import { colors } from "shared/theme/colors";

const SummaryList = () => {
  return (
    <View style={styles.container}>
      <SummaryCard
        title="Total Words"
        value={'100'}
        icon={BookOpenUserIcon}
        color={colors.primary[500]}
      />
      <SummaryCard
        title="Learned Words"
        value={'56'}
        icon={SealCheckIcon}
        color={colors.success[500]}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    gap: 10
  }
});

SummaryList.displayName = 'SummaryList';

export default SummaryList;