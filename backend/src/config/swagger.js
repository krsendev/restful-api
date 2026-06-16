const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "RESTful API for TaskFlow — a minimalist task management application. Provides authentication (register, login, profile) and full CRUD operations for tasks.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from the login endpoint",
        },
      },
      schemas: {
        // ── Auth Schemas ──
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "secret123",
            },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "User created" },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "uuid-here" },
                name: { type: "string", example: "John Doe" },
                email: { type: "string", example: "john@example.com" },
              },
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "secret123",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        MeResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            user: {
              type: "object",
              properties: {
                id: { type: "string", example: "uuid-here" },
                email: { type: "string", example: "john@example.com" },
              },
            },
          },
        },

        // ── Task Schemas ──
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-here" },
            title: { type: "string", example: "Buy groceries" },
            description: {
              type: "string",
              example: "Milk, eggs, bread",
              nullable: true,
            },
            completed: { type: "boolean", example: false },
            user_id: { type: "string", example: "user-uuid-here" },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2026-06-16T10:30:00.000Z",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Buy groceries" },
            description: {
              type: "string",
              example: "Milk, eggs, bread",
            },
          },
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", example: "Buy groceries (updated)" },
            description: { type: "string", example: "Updated description" },
            completed: { type: "boolean", example: true },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Task" },
          },
        },
        TaskListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" },
            },
          },
        },

        // ── Common Error Schemas ──
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation error details" },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints — register, login, and get current user",
      },
      {
        name: "Tasks",
        description: "CRUD operations for user tasks (requires authentication)",
      },
    ],

    // ── Path definitions ──
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          description:
            "Create a new user account with name, email, and password. The password must be at least 6 characters.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RegisterResponse" },
                },
              },
            },
            400: {
              description: "Email already exists or validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          description:
            "Authenticate with email and password to receive a JWT token for accessing protected endpoints.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful — returns JWT token",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user profile",
          description:
            "Retrieve the authenticated user's profile information from the JWT token.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Current user profile",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MeResponse" },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/api/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks",
          description:
            "Retrieve all tasks belonging to the authenticated user, ordered by creation date (newest first).",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List of tasks",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaskListResponse" },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a new task",
          description:
            "Create a new task for the authenticated user. Title is required, description is optional.",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CreateTaskRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaskResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/api/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get a single task",
          description:
            "Retrieve a specific task by its ID. Only the task owner can access it.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Task ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Task details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaskResponse" },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Forbidden — not the task owner",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        patch: {
          tags: ["Tasks"],
          summary: "Update a task",
          description:
            "Update a task's title, description, or completed status. At least one field must be provided. Only the task owner can update it.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Task ID",
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaskResponse" },
                },
              },
            },
            400: {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Forbidden — not the task owner",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          description:
            "Permanently delete a task by its ID. Only the task owner can delete it.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Task ID",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Task deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Task deleted" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Token required or invalid",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            403: {
              description: "Forbidden — not the task owner",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            404: {
              description: "Task not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            500: {
              description: "Internal server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // We define everything inline above, no JSDoc annotations needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
