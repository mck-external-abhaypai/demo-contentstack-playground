import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const envConfig = typeof window === 'undefined' && process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

type PublishResponse = {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PublishResponse>
) {
  //  Basic Auth check
  const authHeader = req.headers.authorization;
  const expectedAuth =
    "Basic " + Buffer.from(`${envConfig.CONTENTSTACK_CONTENT_PUBLISH_WEBHOOK_USERNAME}:${envConfig.CONTENTSTACK_CONTENT_PUBLISH_WEBHOOK_PASSWORD}`).toString("base64");

  if (authHeader !== expectedAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid credentials",
    });
  }

  //  Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST.",
    });
  }

  try {
    // Validate environment variables
    const apiKey = envConfig.CONTENTSTACK_API_KEY;
    const managementToken = envConfig.CONTENTSTACK_MANAGEMENT_TOKEN;

    if (!apiKey || !managementToken) {
      return res.status(500).json({
        success: false,
        message:
          "Missing required environment variables: CONTENTSTACK_API_KEY or CONTENTSTACK_MANAGEMENT_TOKEN",
      });
    }

    //  Extract from webhook payload
    const { data, event, triggered_at } = req.body;

    if (!data || !data.entry || !data.content_type) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: missing entry or content_type",
      });
    }

    const contentTypeUid = data.content_type.uid;
    const entryUid = data.entry.uid;
    const environments = [envConfig.CONTENTSTACK_ENVIRONMENT || "development"];
    const locales = ["en-us"];
    const branch = envConfig.CONTENTSTACK_BRANCH || "main";

    // Prepare the publish request payload
    const publishPayload = {
      entry: {
        environments,
        locales,
      },
    };

    // Make API call to Contentstack Management API to publish the entry
    const publishUrl = `https://api.contentstack.io/v3/content_types/${contentTypeUid}/entries/${entryUid}/publish`;

    const headers: Record<string, string> = {
      api_key: apiKey,
      authorization: managementToken,
      "Content-Type": "application/json",
    };

    if (branch && branch !== "main") {
      headers["branch"] = branch;
    }

    const response = await fetch(publishUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(publishPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Failed to publish content",
        error:
          responseData.error_message ||
          responseData.errors ||
          "Unknown error",
      });
    }

    //  Success response
    return res.status(200).json({
      success: true,
      message: "Content published successfully",
      data: {
        contentTypeUid,
        entryUid,
        event,
        triggered_at,
        environments,
        locales,
        publishedAt: responseData.notice || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Publish error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
