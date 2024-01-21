import Users from "./models/Users";
import Schedules from "./models/Scheduling";
import Sessions from "./models/Sessions";
import Faculties from "./models/Faculties";
import SchedDetails from "./models/SchedDetails";
import FooterDetails from "./models/FooterDetails";
import ScheduleState from "./models/ScheduleState";

const initialize = async function() {
  await Users.sync();
  await Schedules.sync();
  await Sessions.sync();
  await Faculties.sync();
  await SchedDetails.sync();
  await FooterDetails.sync();
  await ScheduleState.sync();
};

initialize();