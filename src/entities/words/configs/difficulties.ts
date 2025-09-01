import { theme } from "shared/theme";
import { WORD_DIFFICULTY, WordDifficulties } from "../model";

const difficulties: WordDifficulties[] = [
  { value: WORD_DIFFICULTY.EASY, label: 'Easy', color: theme.semanticColors.success },
  { value: WORD_DIFFICULTY.MEDIUM, label: 'Medium', color: theme.semanticColors.warning },
  { value: WORD_DIFFICULTY.HARD, label: 'Hard', color: theme.semanticColors.error },
];

export default difficulties;