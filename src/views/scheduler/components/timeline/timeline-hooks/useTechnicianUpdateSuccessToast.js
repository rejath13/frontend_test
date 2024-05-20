import { useEffect } from "react";
import { showToast } from "../../../helpers/schedule-update-schedule-data-helpers";
import { useToasts } from "react-toast-notifications";

const useTechnicianUpdateSuccessToast = (isTechnicianUpdateSuccess) => {
  //
  const { addToast } = useToasts();

  useEffect(() => {
    if (isTechnicianUpdateSuccess) {
      const toastMessage = "Technicain updated Succesfully !";
      console.log("ToastMessage: ", toastMessage);
      showToast(toastMessage, "success", addToast);
    }
  }, [isTechnicianUpdateSuccess]);
};

export default useTechnicianUpdateSuccessToast;
