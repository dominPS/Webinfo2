import { getVacationData } from '../api/vacation';
import type { VacationModel } from '../schemas/VacationModel';

export const vacationService = {
  /**
   * Fetches vacation data from the backend
   * Endpoint: /Vacancy/VacancyJson
   */
  async getVacationData(code?: string): Promise<VacationModel> {
    return getVacationData(code);
  }
};