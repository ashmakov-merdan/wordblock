import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

const useToggleSheet = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const onOpenSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const onCloseSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return { bottomSheetRef, onOpenSheet, onCloseSheet };
};

export default useToggleSheet;