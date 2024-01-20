import Users from "./models/Users";
import Schedules from "./models/Scheduling";
import Sessions from "./models/Sessions";
import Faculties from "./models/Faculties";
import SchedDetails from "./models/SchedDetails";

const initialize = async function() {
  await Users.sync();
  await Schedules.sync();
  await Sessions.sync();
  await Faculties.sync();
  await SchedDetails.sync();
};

initialize();