import Faculties from "../../db/models/Faculties";
import FooterDetails, { FooterDetailsInterface, IOverallSummary, ITotal } from "../../db/models/FooterDetails";

export const getFooterDetailById = async (facultyid: number) => {
  const facultydata = await Faculties.findByPk(facultyid);
  if (!facultydata) throw ['FacultyID provided does not exist', 404];

  const details = await FooterDetails.findAndCountAll({
    where: { initials: facultydata.initials },
    raw: true
  });

  const formatted = details.rows.map(detail => {
    return {
      initials: facultydata.initials,
      academic_rank: detail.academic_rank,
      consultation_hours: detail.consultation_hours,
      designation: detail.designation,
      hours_per_week: detail.hours_per_week,
      official_time: detail.official_time.split(','),
      overload: detail.overload,
      overtimeOutside: detail.overtimeOutside.split(','),
      overtimeWithin: detail.overtimeWithin.split(','),
      preparations: detail.preparations,
      regular_load: detail.regular_load,
      teaching_hours: detail.teaching_hours.split(',')
    }
  });

  return formatted;
};

export const createFooterDetail = async (facultyid: number, total: ITotal, overallSummary: IOverallSummary) => {
  const facultydata = await Faculties.findByPk(facultyid);
  if (!facultydata) throw ['FacultyID provided does not exist', 404];

  const formatted: FooterDetailsInterface = {
    initials: facultydata.initials,
    academic_rank: overallSummary.academicRank,
    consultation_hours: overallSummary.consultationHours,
    designation: overallSummary.designation,
    hours_per_week: overallSummary.hoursPerWeek,
    official_time: total.officialTime.join(','),
    overload: overallSummary.overload,
    overtimeOutside: total.overtimeOutside.join(','),
    overtimeWithin: total.overtimeWithin.join(','),
    preparations: overallSummary.preparations,
    regular_load: overallSummary.regularLoad,
    teaching_hours: total.teachingHours.join(',')
  }

  await FooterDetails.create(formatted);
  return getFooterDetailById(facultyid);
};