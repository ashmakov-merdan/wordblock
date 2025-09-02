import { StyleSheet, TouchableOpacity } from "react-native";
import { SpeakerHighIcon } from 'phosphor-react-native';
import { FC, useCallback, useEffect, useState } from "react";
import { TextToSpeech } from "shared/utils";
import { theme } from "shared/theme";

interface SpeakerProps {
  word: string;
};

const Speaker: FC<SpeakerProps> = ({ word }) => {
  const [isPlaying, setPlay] = useState<boolean>(false);

  const handleTTSStateChange = useCallback((speaking: boolean) => {
    setPlay(speaking);
  }, []);

  useEffect(() => {
    TextToSpeech.addStateChangeCallback(handleTTSStateChange);

    return () => TextToSpeech.removeStateChangeCallback(handleTTSStateChange);
  }, [handleTTSStateChange]);

  const handleAudioPlay = useCallback(async () => {
    if (isPlaying) {
      await TextToSpeech.stop();
      return;
    };

    try {
      await TextToSpeech.speak(word);
      setPlay(false);
    } catch {
      setPlay(false);
    }
  }, [isPlaying, word]);

  return (
    <TouchableOpacity onPress={handleAudioPlay} activeOpacity={0.8} style={styles.button}>
      <SpeakerHighIcon
        size={20}
        color={isPlaying ? theme.colors.primary[500] : theme.colors.primary[300]}
        weight={isPlaying ? 'fill' : 'regular'}
      />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  button: {
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
  }
})

Speaker.displayName = 'Speaker';

export default Speaker;