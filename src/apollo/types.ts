// Apollo API response types — loosely typed since Apollo's responses are large and varied.
// We pass through JSON to the LLM, so we only type what we need for our logic.

export interface PeopleSearchResponse {
  people: unknown[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export interface OrganizationSearchResponse {
  organizations: unknown[];
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export interface PersonEnrichmentResponse {
  person: unknown;
}

export interface OrganizationEnrichmentResponse {
  organization: unknown;
}

export interface BulkPeopleEnrichmentResponse {
  matches: unknown[];
  status: string;
}

export interface BulkOrganizationEnrichmentResponse {
  organizations: unknown[];
  status: string;
}
