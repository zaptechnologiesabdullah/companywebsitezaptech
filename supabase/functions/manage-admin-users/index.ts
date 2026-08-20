import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller is an admin using their JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("Not authenticated");

    // Check caller is admin
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!callerRole) throw new Error("Unauthorized: admin role required");

    const { action, email, password, userId } = await req.json();

    // LIST: Get all admin users with their emails
    if (action === "list") {
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("user_id, role, created_at")
        .order("created_at", { ascending: true });

      if (!roles || roles.length === 0) {
        return new Response(JSON.stringify({ success: true, users: [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get user emails from auth.users
      const userIds = roles.map((r) => r.user_id);
      const usersWithEmails = [];

      for (const uid of userIds) {
        const { data: { user } } = await adminClient.auth.admin.getUserById(uid);
        if (user) {
          const role = roles.find((r) => r.user_id === uid);
          usersWithEmails.push({
            id: uid,
            email: user.email,
            role: role?.role,
            created_at: role?.created_at,
          });
        }
      }

      return new Response(JSON.stringify({ success: true, users: usersWithEmails }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ADD: Create a new admin user
    if (action === "add") {
      if (!email || !password) throw new Error("Email and password required");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");

      // Check if user already exists
      const { data: { users: existingUsers } } = await adminClient.auth.admin.listUsers();
      const existingUser = existingUsers?.find((u) => u.email === email);

      let userId: string;

      if (existingUser) {
        // Check if already admin
        const { data: existingRole } = await adminClient
          .from("user_roles")
          .select("id")
          .eq("user_id", existingUser.id)
          .eq("role", "admin")
          .maybeSingle();

        if (existingRole) throw new Error("This user is already an admin");
        userId = existingUser.id;
      } else {
        // Create new user
        const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });
        if (createError) throw createError;
        userId = newUser.user.id;
      }

      // Assign admin role
      const { error: roleError } = await adminClient
        .from("user_roles")
        .insert({ user_id: userId, role: "admin" });
      if (roleError) throw roleError;

      return new Response(JSON.stringify({ success: true, message: "Admin user added" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // REMOVE: Remove admin access (but keep user)
    if (action === "remove") {
      if (!userId) throw new Error("User ID required");
      if (userId === caller.id) throw new Error("Cannot remove your own admin access");

      const { error } = await adminClient
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "admin");
      if (error) throw error;

      return new Response(JSON.stringify({ success: true, message: "Admin access removed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
