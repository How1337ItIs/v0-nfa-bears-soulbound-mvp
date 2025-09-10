// Centralized error handling and logging utility

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION', 
  AUTHORIZATION = 'AUTHORIZATION',
  RATE_LIMIT = 'RATE_LIMIT',
  BLOCKCHAIN = 'BLOCKCHAIN',
  DATABASE = 'DATABASE',
  EXTERNAL_API = 'EXTERNAL_API',
  INTERNAL = 'INTERNAL'
}

export interface ErrorContext {
  userId?: string;
  address?: string;
  endpoint?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: number;
  requestId?: string;
  [key: string]: any; // Allow additional context properties
}

export class APIError extends Error {
  public readonly type: ErrorType;
  public statusCode: number;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    type: ErrorType,
    statusCode: number,
    context: ErrorContext = {},
    isOperational: boolean = true
  ) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.context = { ...context, timestamp: Date.now() };
    this.isOperational = isOperational;
    this.name = 'APIError';

    // Capture stack trace
    Error.captureStackTrace(this, APIError);
  }
}

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static isProduction = process.env.NODE_ENV === 'production';

  static info(message: string, data?: any, context?: ErrorContext) {
    const logEntry = {
      level: 'INFO',
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };

    if (this.isDevelopment) {
      console.log('ℹ️', message, data ? JSON.stringify(data, null, 2) : '');
    }

    if (this.isProduction) {
      // In production, send to logging service (Sentry, LogRocket, etc.)
      console.log(JSON.stringify(logEntry));
    }
  }

  static warn(message: string, data?: any, context?: ErrorContext) {
    const logEntry = {
      level: 'WARN',
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };

    if (this.isDevelopment) {
      console.warn('⚠️', message, data ? JSON.stringify(data, null, 2) : '');
    }

    if (this.isProduction) {
      console.warn(JSON.stringify(logEntry));
    }
  }

  static error(message: string, error?: unknown, context?: ErrorContext) {
    const logEntry = {
      level: 'ERROR',
      message,
      error: error ? {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: error instanceof APIError ? error.type : 'UNKNOWN',
        statusCode: error instanceof APIError ? error.statusCode : 500,
        context: error instanceof APIError ? error.context : undefined
      } : undefined,
      context,
      timestamp: new Date().toISOString()
    };

    if (this.isDevelopment) {
      console.error('🚨', message);
      if (error) {
        if (error instanceof Error) {
          console.error('Stack trace:', error.stack);
        }
        if (error instanceof APIError) {
          console.error('Error context:', JSON.stringify(error.context, null, 2));
        }
      }
    }

    if (this.isProduction) {
      console.error(JSON.stringify(logEntry));
      // In production, also send to error tracking service
    }
  }

  static security(message: string, data?: any, context?: ErrorContext) {
    const logEntry = {
      level: 'SECURITY',
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };

    // Security events should always be logged, regardless of environment
    console.warn('🛡️ SECURITY:', message, data ? JSON.stringify(data) : '');
    
    if (this.isProduction) {
      // Send to security monitoring service
      console.warn(JSON.stringify(logEntry));
    }
  }
}

// Error factory functions for common cases
export const createValidationError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.VALIDATION, 400, context);

export const createAuthenticationError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.AUTHENTICATION, 401, context);

export const createAuthorizationError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.AUTHORIZATION, 403, context);

export const createRateLimitError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.RATE_LIMIT, 429, context);

export const createBlockchainError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.BLOCKCHAIN, 502, context);

export const createDatabaseError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.DATABASE, 503, context);

export const createInternalError = (message: string, context?: ErrorContext) =>
  new APIError(message, ErrorType.INTERNAL, 500, context, false);

// Utility to extract context from Next.js request
export const extractRequestContext = (request: Request): ErrorContext => {
  const url = new URL(request.url);
  return {
    endpoint: url.pathname,
    method: request.method,
    ip: request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    timestamp: Date.now()
  };
};

// Async error wrapper for API routes
export const withErrorHandling = (handler: Function) => {
  return async (request: Request, ...args: any[]) => {
    try {
      return await handler(request, ...args);
    } catch (error) {
      const context = extractRequestContext(request);
      
      if (error instanceof APIError) {
        Logger.error(`API Error: ${error.message}`, error, context);
        return new Response(
          JSON.stringify({
            error: error.message,
            type: error.type,
            timestamp: new Date().toISOString()
          }),
          {
            status: error.statusCode,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store'
            }
          }
        );
      }

      // Unexpected error
      const unexpectedError = new APIError(
        'Internal server error',
        ErrorType.INTERNAL,
        500,
        context,
        false
      );

      Logger.error('Unexpected error in API route', error instanceof Error ? error : new Error(String(error)), context);
      
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          type: ErrorType.INTERNAL,
          timestamp: new Date().toISOString()
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          }
        }
      );
    }
  };
};
