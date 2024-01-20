import { SchedDetailsInterface } from "../../db/models/SchedDetails";
import { TIME_TYPE } from "../utils";
import SchedDetails from "../../db/models/SchedDetails";
import Faculties from "../../db/models/Faculties";

// separates the even and odd schedules
const formatSchedDetail = (initials: string, schedDetails: SchedDetailsInterface[]) => {
  const evenSchedules = schedDetails.filter(sched => sched.type === 'even');
  const oddSchedules  = schedDetails.filter(sched => sched.type === 'odd');

  // for pushing the empty schedules
  // no optimal, but for code simplicity
  const unknownEvenTime = TIME_TYPE.filter(time => evenSchedules.filter(sched => sched.time === time).length === 0);
  const unknownOddTime = TIME_TYPE.filter(time => oddSchedules.filter(sched => sched.time === time).length === 0);

  unknownEvenTime.forEach(time => {
    evenSchedules.push({
      section: '',
      student_count: 0,
      subject: '',
      type: 'even',
      initials,
      time,
    });
  })

  unknownOddTime.forEach(time => {
    oddSchedules.push({
      section: '',
      student_count: 0,
      subject: '',
      type: 'odd',
      initials,
      time,
    })
  });

  evenSchedules.sort((a, b) => {
    return (TIME_TYPE.indexOf(a.time) - TIME_TYPE.indexOf(b.time));
  });

  oddSchedules.sort((a, b) => {
    return (TIME_TYPE.indexOf(a.time) - TIME_TYPE.indexOf(b.time));
  });

  return {
    even: evenSchedules,
    odd: oddSchedules
  }
};

export const createBulkScheduleDetail = async (scheduleDetails: SchedDetailsInterface[]) => {
  if (scheduleDetails.length == 0)
    throw ['Empty schedule Details added', 400];

  await SchedDetails.bulkCreate(scheduleDetails);
  return await SchedDetails.findAndCountAll({
    where: { initials: scheduleDetails[0].initials }
  });
};

export const getUserScheduleDetail = async (initials: string) => {
  return await SchedDetails.findAll({
    where: { initials },
    raw: true
  });
};

export const getFormattedUserScheduleDetail = async (id: number) => {
  const userdata = await Faculties.findByPk(id);
  if (userdata) {
    const userschedDetails = await getUserScheduleDetail(userdata.initials);
    return formatSchedDetail(userdata.initials, userschedDetails);
  }

  return formatSchedDetail('', []);
};