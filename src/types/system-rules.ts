export interface SystemRules {
  readonly version: string;
  readonly tone: string;
  readonly guardrails: readonly string[];
  readonly outputFormatDefault: string;
}
