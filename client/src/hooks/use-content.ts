import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GenerateContentInput, type ContentResponse, type ContentListResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// POST /api/content/generate
export function useGenerateContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: GenerateContentInput) => {
      // Validate client-side before sending
      const validated = api.content.generate.input.parse(data);
      
      const res = await fetch(api.content.generate.path, {
        method: api.content.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        // Try to parse the error message from standard error schemas
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 400 && errorData.message) {
           throw new Error(errorData.message);
        }
        throw new Error("Failed to generate content. Please try again.");
      }

      return api.content.generate.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.content.list.path] });
      toast({
        title: "Content Generated Successfully",
        description: `Generated content for "${data.topic}"`,
      });
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

// GET /api/content/history
export function useContentHistory() {
  return useQuery({
    queryKey: [api.content.list.path],
    queryFn: async () => {
      const res = await fetch(api.content.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.content.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/content/:id
export function useContent(id: number) {
  return useQuery({
    queryKey: [api.content.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.content.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch content details");
      
      return api.content.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
