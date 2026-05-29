import type {
  BranchFormData,
  CreateStoreApplicationFormData,
  LocationFormData,
  WorkingHoursFormData
} from '../constants'

export function mergeStoreApplicationValues(
  location: LocationFormData,
  branch: BranchFormData,
  workingHours: WorkingHoursFormData
): CreateStoreApplicationFormData {
  return {
    ...location,
    ...branch,
    ...workingHours
  }
}
