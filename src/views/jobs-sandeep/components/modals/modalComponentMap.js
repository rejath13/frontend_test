import AdditionalFilters from "../filtersection/AdditionalFilters";
import DeleteStatusContent from "./modal-contents/DeleteStatusContent";
import EditJobContent from "./modal-contents/EditJobContent";
import SendMailContent from "./modal-contents/SendMailContent";
import CreateTraccarUserContent from "./modal-contents/CreateTraccarUserContent";
import ExpectedCompletionDateContent from "./modal-contents/ExpectedCompletionDateContent";
import StatusNoteContent from "./modal-contents/StatusNoteContent";
import ScheduleJobContent from "./modal-contents/ScheduleJobContent";

// Schedules Modules Imports
import TogglePriorityContent from "../../../scheduler/components/modals/modal-contents/TogglePriorityContent";
import UpdateScheduleDataContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleDataContent";
import UpdateScheduleLocationContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleLocationContent";
import UpdateScheduleQuantitiesContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleQuantitiesContent";
import UpdateScheduleStatusContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleStatusContent";
import UpdateScheduleTrainedStatusContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleTrainedStatusContent";
import UpdateSchedulePaymentStatusContent from "../../../scheduler/components/modals/modal-contents/UpdateSchedulePaymentStatusContent";
import UpdateScheduleAdminCommentContent from "../../../scheduler/components/modals/modal-contents/UpdateScheduleAdminCommentContent";
import UpdateScheduleContactInfoContent from "../../../scheduler/components/modals/modal-contents/UpdateSchedulContactInfoContent";
import RepeatScheduleContent from "../../../scheduler/components/modals/modal-contents/RepeatScheduleContent";
import SendToTechnicianContent from "../../../scheduler/components/modals/modal-contents/SendToTechnicianContent";

const componentMap = {
  additionalFilters: <AdditionalFilters />,
  deleteStatusContent: <DeleteStatusContent />,
  editJobContent: <EditJobContent />,
  sendMailContent: <SendMailContent />,
  createTraccarUserContent: <CreateTraccarUserContent />,
  expectedCompletionDateContent: <ExpectedCompletionDateContent />,
  statusNoteContent: <StatusNoteContent />,
  scheduleJobContent: <ScheduleJobContent />,

  // Schedule Modules Part
  togglePriorityContent: <TogglePriorityContent />,
  updateScheduleDataContent: <UpdateScheduleDataContent />,
  updateScheduleStatusContent: <UpdateScheduleStatusContent />,
  updateScheduleLocationContent: <UpdateScheduleLocationContent />,
  updateScheduleQuantitiesContent: <UpdateScheduleQuantitiesContent />,
  updateScheduleTrainedStatusContent: <UpdateScheduleTrainedStatusContent />,
  updateSchedulePaymentStatusContent: <UpdateSchedulePaymentStatusContent />,
  updateScheduleAdminCommentContent: <UpdateScheduleAdminCommentContent />,
  updateScheduleContactInfoContent: <UpdateScheduleContactInfoContent />,
  repeatScheduleContent: <RepeatScheduleContent />,
  sendToTechnicianContent: <SendToTechnicianContent />,
};

export default componentMap;
