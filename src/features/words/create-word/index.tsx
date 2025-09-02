import { BookOpenIcon, PlusIcon } from "phosphor-react-native";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "shared/theme";
import { Button, Input, Sheet, useToggleSheet } from "shared/ui";

const CreateWord: FC = () => {
  const { bottomSheetRef, onOpenSheet, onCloseSheet } = useToggleSheet();
  const [ word, setWord ] = useState<string>('');
  const [ definition, setDefinition ] = useState<string>('');

  return (
    <>
      <Button
        icon={PlusIcon}
        isIconOnly
        variant={'solid'}
        color={'primary'}
        size={'sm'}
        shape='rounded'
        onPress={onOpenSheet}
      />
      <Sheet ref={bottomSheetRef} display="Create new word" onClose={onCloseSheet}>
        <View style={styles.content}>
          <Input
            type={'bottomSheet'}
            startIcon={BookOpenIcon}
            placeholder={'Enter word'}
            value={word}
            onChange={(value) => setWord(value)}
            keyboardType='default'
          />
          <Input
            type="bottomSheet"
            placeholder="Definition"
            value={definition}
            onChange={(value) => setDefinition(value)}
            keyboardType='default'
            multiline
            numberOfLines={5}
          />
          <Button 
            title="Create"
            color={'success'}
          />
        </View>
      </Sheet>
    </>
  )
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
    paddingTop: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[4]
  }
})

export default CreateWord;