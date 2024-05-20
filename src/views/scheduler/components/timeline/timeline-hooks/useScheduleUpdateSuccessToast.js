import { useEffect } from "react";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";

const useScheduleUpdateSuccessToast = (isScheduleUpdateSuccess) => {
  //
  const { addToast } = useToasts();

  useEffect(() => {
    if (isScheduleUpdateSuccess) {
      const toastMessage = "Schedule Timing updated Succesfully !";
      console.log("ToastMessage: ", toastMessage);
      showToast(toastMessage, "success", addToast);
    }
  }, [isScheduleUpdateSuccess]);
};

export default useScheduleUpdateSuccessToast;
