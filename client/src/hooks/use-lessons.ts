import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GenerateLessonInput, type LessonResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useLessons() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: [api.lessons.list.path],
    queryFn: async () => {
      const res = await fetch(api.lessons.list.path, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error("Failed to fetch lessons");
      }
      return api.lessons.list.responses[200].parse(await res.json());
    },
  });
}

export function useLesson(id: number) {
  return useQuery({
    queryKey: [api.lessons.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.lessons.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch lesson");
      return api.lessons.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useGenerateLesson() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: GenerateLessonInput) => {
      const res = await fetch(api.lessons.generate.path, {
        method: api.lessons.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate lesson");
      }

      return api.lessons.generate.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.lessons.list.path] });
      toast({
        title: "Lesson Generated!",
        description: `Successfully created "${data.topic}" lesson.`,
      });
      setLocation(`/lesson/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.lessons.delete.path, { id });
      const res = await fetch(url, { 
        method: api.lessons.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete lesson");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.lessons.list.path] });
      toast({
        title: "Lesson Deleted",
        description: "The lesson has been removed from your library.",
      });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
