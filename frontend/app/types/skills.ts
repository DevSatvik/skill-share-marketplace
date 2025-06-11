/**
 * Payload for POST /api/skills
 */
export interface CreateSkillPayload {
  category: string;
  experienceYears: number;
  workNature: string;
  hourlyRate: number;
  currency: string;
}

/**
 * Response shape for POST /api/skills (201)
 */
export type CreateSkillResponse = void;

/**
 * Represents a Skill as returned by your API endpoints
 */
export interface Skill {
  id: number;
  category: string;
  experienceYears: number;
  workNature: string;
  hourlyRate: number;
  currency: string;
  // TODO: add other fields returned by GET /api/skills or /api/skills/my
}

/**
 * Response shape for GET /api/skills/my
 */
export interface GetMySkillsResponse {
  skills: Skill[];
}
