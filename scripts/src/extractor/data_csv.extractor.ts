import * as fs from "fs";
import * as path from "path";

const INPUT_PATH = path.resolve(process.cwd(), "src/data/data.json");
const OUTPUT_PATH = path.resolve(
  process.cwd(),
  "src/data/dataset.csv",
);

const raw = fs.readFileSync(INPUT_PATH, "utf-8");
const rawData = JSON.parse(raw);

function formatValue(value: any): string {
  if (value === null || value === undefined) return "null";

  if (typeof value === "boolean") return value ? "1" : "0";

  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return "null";
    return `"${value.join("|").replace(/"/g, '""')}"`;
  }

  if (typeof value === "string" && value.trim() === "") return "null";

  return `"${String(value).replace(/"/g, '""')}"`;
}

function extractInterventions(measures: any[]) {
  const names =
    measures?.map((m) => m.measure?.name?.toLowerCase() || "") || [];

  const has = (keyword: string) =>
    names.some((n) => n.includes(keyword)) ? 1 : 0;

  return {
    quarantine_applied: has("quarantine"),
    movement_control_applied: has("movement control"),
    stamping_out_applied: has("stamping out"),
    disinfection_applied: has("disinfection"),
    surveillance_applied: has("surveillance"),
    screening_applied: has("screening"),
    disposal_applied: has("disposal") || has("carcasses") || has("waste"),
    vaccination_applied: has("vaccination"),
    zoning_applied: has("zoning"),
    vector_control_applied: has("vector"),
    wildlife_control_applied: has("wildlife"),
    traceability_applied: has("traceability"),
    treatment_applied: has("treatment"),
    slaughter_applied: has("slaughter"),

    intervention_count: names.length,
    all_intervention: names,
  };
}

function transform(item: any) {
  const outbreak = item.outbreaks?.[0] || {};
  const totals = item.quantitativeData?.totals?.[0] || {};
  const interventions = extractInterventions(item.measures);
  const diagnosticMethods =
    item.methods?.map((m: any) => m.nature?.keyValue) || [];

  return [
    item.event?.eventId ?? null,
    item.event?.country?.name ?? null,
    item.event?.country?.isoCode ?? null,
    outbreak.adminDivision ?? null,

    item.event?.disease?.name ?? null,
    item.event?.subType?.disease?.name ?? null,
    item.event?.disease?.group ?? null,
    item.event?.causalAgent?.type ?? null,

    totals.speciesName ?? null,
    totals.isWild ?? null,
    outbreak.epiUnitType ?? null,
    item.event?.disease?.isDomestic ?? null,
    item.event?.disease?.isAquatic ?? null,

    outbreak.latitude ?? null,
    outbreak.longitude ?? null,
    outbreak.locationApprox ?? null,

    item.event?.startedOn ?? null,
    item.event?.confirmOn ?? null,
    item.event?.endedOn ?? null,
    outbreak.startDate ?? null,
    outbreak.endDate ?? null,
    item.event?.lastOccurrence ?? null,
    item.report?.reportedOn ?? null,

    totals.susceptible ?? 0,
    totals.cases ?? 0,
    totals.deaths ?? 0,
    totals.killed ?? 0,
    totals.slaughtered ?? 0,
    totals.vaccinated ?? 0,

    interventions.quarantine_applied,
    interventions.movement_control_applied,
    interventions.stamping_out_applied,
    interventions.disinfection_applied,
    interventions.surveillance_applied,
    interventions.screening_applied,
    interventions.disposal_applied,
    interventions.vaccination_applied,
    interventions.zoning_applied,
    interventions.vector_control_applied,
    interventions.wildlife_control_applied,
    interventions.traceability_applied,
    interventions.treatment_applied,
    interventions.slaughter_applied,
    interventions.intervention_count,

    item.laboratoryTests?.length ?? 0,
    diagnosticMethods,

    item.event?.eventStatus?.translation ?? null,
    item.event?.reason?.translation ?? null,
  ];
}

const headers = [
  "event_id",
  "country_name",
  "iso_code",
  "admin_division",
  "disease_name",
  "disease_subtype",
  "disease_group",
  "causal_agent_type",
  "species_name",
  "is_wild",
  "epi_unit_type",
  "is_domestic",
  "is_aquatic",
  "latitude",
  "longitude",
  "location_approx",
  "event_started_on",
  "event_confirmed_on",
  "event_ended_on",
  "outbreak_start_date",
  "outbreak_end_date",
  "last_occurrence",
  "reported_on",
  "susceptible",
  "cases",
  "deaths",
  "killed",
  "slaughtered",
  "vaccinated",

  "intervention_quarantine_applied",
  "intervention_movement_control_applied",
  "intervention_stamping_out_applied",
  "intervention_disinfection_applied",
  "intervention_surveillance_applied",
  "intervention_screening_applied",
  "intervention_disposal_applied",
  "intervention_vaccination_applied",
  "intervention_zoning_applied",
  "intervention_vector_control_applied",
  "intervention_wildlife_control_applied",
  "intervention_traceability_applied",
  "intervention_treatment_applied",
  "intervention_slaughter_applied",
  "intervention_count",

  "lab_test_performed",
  "diagnostic_method_types",
  "event_status",
  "reason_type",
];

const rows = rawData.map(transform);

const csvRows = rows.map((row: any[]) => row.map(formatValue).join(","));

const csv = [headers.join(","), ...csvRows].join("\n");

fs.writeFileSync(OUTPUT_PATH, csv);

console.log("CSV Generated:", OUTPUT_PATH);
