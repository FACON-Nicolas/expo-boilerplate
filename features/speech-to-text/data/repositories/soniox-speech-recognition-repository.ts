import type { TranscriptResult, TranscriptToken } from "@/features/speech-to-text/domain/entities/transcript-result";
import type { TranscriptionJob } from "@/features/speech-to-text/domain/entities/transcription-job";
import type { SpeechRecognitionRepository } from "@/features/speech-to-text/domain/repositories/speech-recognition-repository";

const SONIOX_API_BASE_URL = "https://api.soniox.com/v1";

type SonioxApiKeyProvider = () => Promise<string | null>;

export const createSonioxSpeechRecognitionRepository = (
  getApiKey: SonioxApiKeyProvider,
): SpeechRecognitionRepository => {
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const apiKey = await getApiKey();
    if (!apiKey) {
      throw new Error("speechToText.errors.apiKeyMissing");
    }

    return {
      Authorization: `Bearer ${apiKey}`,
    };
  };

  return {
    uploadAudioFile: async (fileUri: string): Promise<string> => {
      const headers = await getAuthHeaders();

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "audio/m4a",
        name: "recording.m4a",
      } as unknown as Blob);

      console.log("[Soniox] Uploading file:", fileUri);

      const response = await fetch(`${SONIOX_API_BASE_URL}/files`, {
        method: "POST",
        headers,
        body: formData,
      });

      const responseText = await response.text();
      console.log("[Soniox] Upload response status:", response.status);
      console.log("[Soniox] Upload response body:", responseText);

      if (!response.ok) {
        throw new Error("speechToText.errors.uploadFailed");
      }

      const data = JSON.parse(responseText);
      return data.id;
    },

    createTranscriptionJob: async (fileId: string): Promise<string> => {
      const headers = await getAuthHeaders();

      const requestBody = {
        model: "stt-async-preview",
        file_id: fileId,
        enable_language_identification: true,
      };
      console.log("[Soniox] Create job request:", JSON.stringify(requestBody));

      const response = await fetch(`${SONIOX_API_BASE_URL}/transcriptions`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("[Soniox] Create job status:", response.status);
      console.log("[Soniox] Create job body:", responseText);

      if (!response.ok) {
        throw new Error("speechToText.errors.transcriptionFailed");
      }

      const data = JSON.parse(responseText);
      return data.id;
    },

    getTranscriptionJobStatus: async (
      transcriptionId: string,
    ): Promise<TranscriptionJob> => {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SONIOX_API_BASE_URL}/transcriptions/${transcriptionId}`,
        { headers },
      );

      const data = await response.json();
      console.log("[Soniox] Poll status:", data.status, "error:", data.error_type, data.error_message);

      if (!response.ok) {
        throw new Error("speechToText.errors.transcriptionFailed");
      }

      return {
        id: data.id,
        status: data.status,
      };
    },

    getTranscript: async (
      transcriptionId: string,
    ): Promise<TranscriptResult> => {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SONIOX_API_BASE_URL}/transcriptions/${transcriptionId}/transcript`,
        { headers },
      );

      const responseText = await response.text();
      console.log("[Soniox] Transcript response status:", response.status);
      console.log("[Soniox] Transcript response body:", responseText);

      if (!response.ok) {
        throw new Error("speechToText.errors.transcriptionFailed");
      }

      const data = JSON.parse(responseText);
      const tokens: TranscriptToken[] = data.tokens.map(
        (token: {
          text: string;
          start_ms: number;
          end_ms: number;
          confidence: number;
        }) => ({
          text: token.text,
          startTime: token.start_ms,
          endTime: token.end_ms,
          confidence: token.confidence,
        }),
      );

      return {
        text: data.text,
        tokens,
      };
    },

    deleteTranscriptionJob: async (transcriptionId: string): Promise<void> => {
      const headers = await getAuthHeaders();

      await fetch(`${SONIOX_API_BASE_URL}/transcriptions/${transcriptionId}`, {
        method: "DELETE",
        headers,
      });
    },

    deleteAudioFile: async (fileId: string): Promise<void> => {
      const headers = await getAuthHeaders();

      await fetch(`${SONIOX_API_BASE_URL}/files/${fileId}`, {
        method: "DELETE",
        headers,
      });
    },
  };
};
