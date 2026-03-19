import { getAccessToken } from "./auth.js";

const BASE_URL = "https://api.prod.whoop.com/developer/v2";

export interface PaginationParams {
  limit?: number;
  nextToken?: string;
  start?: string; // ISO 8601
  end?: string;   // ISO 8601
}

export interface PaginatedResponse<T> {
  records: T[];
  next_token?: string;
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const token = await getAccessToken();

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whoop API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// --- User ---

export interface UserProfile {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface BodyMeasurement {
  height_meter: number;
  weight_kilogram: number;
  max_heart_rate: number;
}

export function getProfile(): Promise<UserProfile> {
  return request<UserProfile>("/user/profile/basic");
}

export function getBodyMeasurements(): Promise<BodyMeasurement> {
  return request<BodyMeasurement>("/user/measurement/body");
}

// --- Cycles ---

export interface Cycle {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end?: string;
  timezone_offset: string;
  score_state: string;
  score?: {
    strain: number;
    kilojoule: number;
    average_heart_rate: number;
    max_heart_rate: number;
  };
}

export function getCycles(params?: PaginationParams): Promise<PaginatedResponse<Cycle>> {
  return request<PaginatedResponse<Cycle>>("/cycle", params as Record<string, string | number | undefined>);
}

export function getCycle(cycleId: number): Promise<Cycle> {
  return request<Cycle>(`/cycle/${cycleId}`);
}

// --- Recovery ---

export interface Recovery {
  cycle_id: number;
  sleep_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  score_state: string;
  score?: {
    user_calibrating: boolean;
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
    spo2_percentage: number;
    skin_temp_celsius: number;
  };
}

export function getRecoveries(params?: PaginationParams): Promise<PaginatedResponse<Recovery>> {
  return request<PaginatedResponse<Recovery>>("/recovery", params as Record<string, string | number | undefined>);
}

export function getRecovery(recoveryId: number): Promise<Recovery> {
  return request<Recovery>(`/recovery/${recoveryId}`);
}

// --- Sleep ---

export interface Sleep {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: string;
  score?: {
    stage_summary: {
      total_in_bed_time_milli: number;
      total_awake_time_milli: number;
      total_no_data_time_milli: number;
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
      sleep_cycle_count: number;
      disturbance_count: number;
    };
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
      need_from_recent_strain_milli: number;
      need_from_recent_nap_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  };
}

export function getSleepCollection(params?: PaginationParams): Promise<PaginatedResponse<Sleep>> {
  return request<PaginatedResponse<Sleep>>("/activity/sleep", params as Record<string, string | number | undefined>);
}

export function getSleep(sleepId: number): Promise<Sleep> {
  return request<Sleep>(`/activity/sleep/${sleepId}`);
}

// --- Workouts ---

export interface Workout {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_id: number;
  score_state: string;
  score?: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
    distance_meter: number;
    altitude_gain_meter: number;
    altitude_change_meter: number;
    zone_duration: {
      zone_zero_milli: number;
      zone_one_milli: number;
      zone_two_milli: number;
      zone_three_milli: number;
      zone_four_milli: number;
      zone_five_milli: number;
    };
  };
}

export function getWorkouts(params?: PaginationParams): Promise<PaginatedResponse<Workout>> {
  return request<PaginatedResponse<Workout>>("/activity/workout", params as Record<string, string | number | undefined>);
}

export function getWorkout(workoutId: number): Promise<Workout> {
  return request<Workout>(`/activity/workout/${workoutId}`);
}
