import { http, HttpResponse } from "msw";

const SUPABASE_URL = "https://test.supabase.co";

export const authHandlers = [
  http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      refresh_token?: string;
      grant_type?: string;
    };

    if (body.grant_type === "refresh_token") {
      if (body.refresh_token === "valid-refresh-token") {
        return HttpResponse.json({
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_at: Date.now() + 3600000,
          user: { id: "user-123", email: "test@example.com" },
        });
      }
      return HttpResponse.json(
        { error: "invalid_grant", error_description: "Invalid refresh token" },
        { status: 400 },
      );
    }

    if (body.email === "test@example.com" && body.password === "password123") {
      return HttpResponse.json({
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_at: Date.now() + 3600000,
        user: { id: "user-123", email: "test@example.com" },
      });
    }

    return HttpResponse.json(
      { error: "invalid_grant", error_description: "Invalid credentials" },
      { status: 400 },
    );
  }),

  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (body.email === "existing@example.com") {
      return HttpResponse.json(
        {
          error: "user_already_exists",
          error_description: "User already exists",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_at: Date.now() + 3600000,
      user: { id: "new-user-123", email: body.email },
    });
  }),

  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return HttpResponse.json({});
  }),
];

export const profileHandlers = [
  http.get(`${SUPABASE_URL}/rest/v1/profiles`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    return HttpResponse.json([
      {
        id: 1,
        user_id: "user-123",
        firstname: "John",
        lastname: "Doe",
        age_range: "25-34",
        created_at: "2024-01-01T00:00:00Z",
      },
    ]);
  }),

  http.post(`${SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      firstname?: string;
      lastname?: string;
      age_range?: string;
      user_id?: string;
    };

    return HttpResponse.json(
      [
        {
          id: 1,
          user_id: body.user_id,
          firstname: body.firstname,
          lastname: body.lastname,
          age_range: body.age_range,
          created_at: new Date().toISOString(),
        },
      ],
      { status: 201 },
    );
  }),
];

export const handlers = [...authHandlers, ...profileHandlers];
