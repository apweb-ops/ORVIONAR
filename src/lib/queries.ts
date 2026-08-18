import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Program = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  skills: string[];
  duration: string;
  sort_order: number;
  active: boolean;
};

export type JoiningMonth = {
  id: string;
  month: string;
  month_index: number;
  active: boolean;
  available_seats: number;
};

export type Testimonial = {
  id: string;
  student_name: string;
  program: string | null;
  excerpt: string;
  linkedin_url: string | null;
  published: boolean;
  sort_order: number;
};

export const programsQuery = queryOptions({
  queryKey: ["programs"],
  queryFn: async (): Promise<Program[]> => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Program[];
  },
  staleTime: 5 * 60 * 1000,
});

export const allProgramsQuery = queryOptions({
  queryKey: ["programs", "all"],
  queryFn: async (): Promise<Program[]> => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Program[];
  },
});

export const joiningMonthsQuery = queryOptions({
  queryKey: ["joining_months"],
  queryFn: async (): Promise<JoiningMonth[]> => {
    const { data, error } = await supabase
      .from("joining_months")
      .select("*")
      .order("month_index", { ascending: true });
    if (error) throw error;
    return (data ?? []) as JoiningMonth[];
  },
  staleTime: 5 * 60 * 1000,
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async (): Promise<Testimonial[]> => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  },
  staleTime: 5 * 60 * 1000,
});

export const siteConfigQuery = queryOptions({
  queryKey: ["site_config"],
  queryFn: async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase.from("site_config").select("key, value");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  },
  staleTime: 5 * 60 * 1000,
});
