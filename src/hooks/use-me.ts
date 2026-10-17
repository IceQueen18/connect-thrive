import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Role = "admin" | "organization" | "business";

export const meQuery = queryOptions({
  queryKey: ["me"],
  queryFn: async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return { user: null, roles: [] as Role[] };
    const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    return { user, roles: (rows ?? []).map((r) => r.role as Role) };
  },
});

export function useMe() {
  const q = useQuery(meQuery);
  const roles = q.data?.roles ?? [];
  const role: Role | null = roles.includes("admin") ? "admin" : roles.includes("organization") ? "organization" : roles.includes("business") ? "business" : null;
  return { ...q, user: q.data?.user ?? null, role, roles };
}
