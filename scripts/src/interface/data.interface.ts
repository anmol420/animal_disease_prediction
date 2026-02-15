export interface InterventionFlags {
  quarantine_applied: number;
  movement_control_applied: number;
  stamping_out_applied: number;
  disinfection_applied: number;
  surveillance_applied: number;
  screening_applied: number;
  disposal_applied: number;

  vaccination_applied: number;
  zoning_applied: number;
  vector_control_applied: number;
  wildlife_control_applied: number;
  traceability_applied: number;
  treatment_applied: number;
  slaughter_applied: number;

  intervention_count: number;
  all_intervention: string[];
}

export interface Data {
  event_id: number;

  country_name: string;
  iso_code: string;
  admin_division: string;

  disease_name: string;
  disease_subtype: string | null;
  disease_group: string | null;
  causal_agent_type: string | null;

  species_name: string;
  is_wild: boolean | null;
  epi_unit_type: boolean | null;
  is_domestic: boolean | null;
  is_aquatic: boolean | null;

  latitude: number | null;
  longitude: number | null;
  location_approx: boolean | null;

  event_started_on: string | null;
  event_confirmed_on: string | null;
  event_ended_on: string | null;
  outbreak_start_date: string | null;
  outbreak_end_date: string | null;
  last_occurrence: string | null;
  reported_on: string | null;

  susceptible: number | null;
  cases: number | null;
  deaths: number | null;
  killed: number | null;
  slaughtered: number | null;
  vaccinated: number | null;

  interventions: InterventionFlags;

  lab_test_performed: number;
  diagnostic_method_types: string[];

  event_status: string | null;
  reason_type: string | null;
}
