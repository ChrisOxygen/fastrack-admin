import { NextApiRequest, NextApiResponse } from "next";

// Define custom error classes using ES6+ syntax
class ValidationError extends Error {
  details: string;

  constructor(details: string) {
    super(`Validation Error: ${details}`);
    this.name = "ValidationError";
    this.details = details;
  }
}

class DatabaseError extends Error {
  query: string;

  constructor(query: string, message: string) {
    super(`Database Error: ${message}`);
    this.name = "DatabaseError";
    this.query = query;
  }
}

class NotFoundError extends Error {
  resource: string;

  constructor(resource: string) {
    super(`Not Found: ${resource} was not found`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

// General error handler function compatible with Next.js
export const handleError = (
  error: unknown,
  context?: string,
  res?: NextApiResponse
): never | void => {
  const errorMessage = (msg: string) => (context ? `[${context}] ${msg}` : msg);

  if (error instanceof Error) {
    const formattedMessage = errorMessage(error.message);

    // Differentiating custom error types
    if (error instanceof ValidationError) {
      console.error("Validation Error:", formattedMessage);
    } else if (error instanceof DatabaseError) {
      console.error("Database Error:", formattedMessage, "Query:", error.query);
    } else if (error instanceof NotFoundError) {
      console.error("Not Found:", formattedMessage);
    } else {
      console.error("General Error:", formattedMessage);
    }

    console.error("Stack Trace:", error.stack);

    // If the response object is provided, send a JSON response for API routes
    if (res) {
      return res.status(500).json({ error: formattedMessage });
    }

    // Throw a new error with more context
    throw new Error(`Error: ${formattedMessage}`);
  } else if (typeof error === "string") {
    const formattedMessage = errorMessage(error);
    console.error("Error:", formattedMessage);

    if (res) {
      return res.status(500).json({ error: formattedMessage });
    }

    throw new Error(`Error: ${formattedMessage}`);
  } else if (typeof error === "object" && error !== null) {
    try {
      const errorString = JSON.stringify(error);
      const formattedMessage = errorMessage(`Unknown error: ${errorString}`);
      console.error("Unknown object error:", formattedMessage);

      if (res) {
        return res.status(500).json({ error: formattedMessage });
      }

      throw new Error(formattedMessage);
    } catch (stringifyError) {
      console.error("Failed to stringify the error object:", error);
      throw new Error("Unknown error: Unable to process error object.");
    }
  } else {
    const formattedMessage = errorMessage("An unexpected error occurred.");
    console.error("Unexpected error type:", error);

    if (res) {
      return res.status(500).json({ error: formattedMessage });
    }

    throw new Error(formattedMessage);
  }
};
