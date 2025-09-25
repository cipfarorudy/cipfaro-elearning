export type CommitPayload = {
  lesson_status?: string;
  score_raw?: number;
  total_time?: string;
  suspend_data?: string;
};

export class SCORM12API {
  private cache: Record<string, string> = {};
  private initialized = false;
  constructor(private moduleId: string, private token: string) {}

  LMSInitialize(_arg: string) {
    this.initialized = true;
    return "true";
  }
  LMSGetValue(element: string) {
    return this.cache[element] ?? "";
  }
  LMSSetValue(element: string, value: string) {
    this.cache[element] = String(value ?? "");
    return "true";
  }

  async LMSCommit(_arg: string) {
    const payload: CommitPayload = {
      lesson_status: this.cache["cmi.core.lesson_status"],
      score_raw: Number(this.cache["cmi.core.score.raw"] ?? 0),
      total_time: this.cache["cmi.core.total_time"] ?? "00:00:00",
      suspend_data: this.cache["cmi.suspend_data"] ?? "",
    };
    const base =
      (typeof window !== "undefined" && (window as any).__API_BASE__) || "";
    await fetch(`${base}/scorm/${this.moduleId}/commit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(payload),
    });
    return "true";
  }

  LMSFinish(_arg: string) {
    this.initialized = false;
    return "true";
  }
  LMSGetLastError() {
    return "0";
  }
  LMSGetErrorString(_code: string) {
    return "No error";
  }
  LMSGetDiagnostic(_code: string) {
    return "";
  }
}
