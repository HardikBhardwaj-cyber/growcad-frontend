// modules/billing/hooks/useAI.ts
'use client';
// ─────────────────────────────────────────────────────────────────────────────
// AI hooks — Gemini Flash quota management + Guided AI content.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { geminiApi, guidedAiApi } from '../api';
import { useToast } from '@/components/ui/Toast';
import { analytics } from '@/lib/analytics';
import { BILLING_KEYS } from './useBilling';
import { useFeatureGate } from './useFeatureGate';
import { FEATURE } from '../types';

// ─── useGeminiFlash ───────────────────────────────────────────────────────────
// Wraps Gemini Flash queries with quota checking + error handling.
// Advanced plan only — gated by FEATURE.AI_GEMINI_FLASH.

interface UseGeminiFlash {
  query:      (prompt: string, context?: string) => Promise<string | null>;
  isLoading:  boolean;
  quotaStatus:{ used: number; limit: number; resetAt: string } | undefined;
  isAllowed:  boolean;  // false if not on Advanced plan
}

export function useGeminiFlash(): UseGeminiFlash {
  const qc = useQueryClient();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { allowed } = useFeatureGate(FEATURE.AI_GEMINI_FLASH);

  const { data: quotaStatus } = useQuery({
    queryKey: ['ai', 'gemini', 'quota'],
    queryFn: geminiApi.quotaStatus,
    enabled: allowed,
    staleTime: 30_000,
  });

  // ✅ TYPE GUARD (NO any)
  const isApiError = (err: unknown): err is { response?: { status?: number } } => {
    return typeof err === 'object' && err !== null && 'response' in err;
  };

  const query = useCallback(
    async (prompt: string, context?: string): Promise<string | null> => {
      if (!allowed) {
        toast.warning(
          'Advanced plan required',
          'AI Doubt Solving is available on the Advanced plan.',
        );
        return null;
      }

      // Pre-check quota
      if (quotaStatus && quotaStatus.used >= quotaStatus.limit) {
        toast.error(
          'Daily AI limit reached',
          `Your institute has used all ${quotaStatus.limit} AI queries for today. Resets at midnight.`,
        );
        return null;
      }

      setLoading(true);

      try {
        const result = await geminiApi.query(prompt, context);

        analytics.event('ai_query', {
          feature: 'gemini_flash',
          tokensUsed: result.tokensUsed,
        });

        qc.invalidateQueries({ queryKey: ['ai', 'gemini', 'quota'] });
        qc.invalidateQueries({ queryKey: BILLING_KEYS.usage });

        return result.answer;
      } catch (err: unknown) {
        // ✅ CLEAN SAFE CHECK (NO any)
        if (isApiError(err) && err.response?.status === 429) {
          toast.error(
            'Daily AI limit reached',
            'Your institute has reached today\'s AI query limit. It resets at midnight.',
          );
        } else {
          toast.error('AI query failed', 'Please try again in a moment.');
        }

        analytics.error('gemini_query', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [allowed, quotaStatus, qc, toast]
  );

  return {
    query,
    isLoading: loading,
    quotaStatus,
    isAllowed: allowed,
  };

}

// ─── useGuidedAIContent ───────────────────────────────────────────────────────
// Teacher-facing: create/edit guided AI content stored in DB.
// Student-facing: semantic search against stored content.

export function useGuidedAIContent(filters?: { subject?: string; topic?: string }) {
  const { allowed } = useFeatureGate(FEATURE.GUIDED_AI_CONTENT);

  return useQuery({
    queryKey:  ['ai', 'guided-content', filters],
    queryFn:   () => guidedAiApi.list(filters),
    enabled:   allowed,
    staleTime: 2 * 60_000,
  });
}

export function useUpsertGuidedContent(onSuccess?: () => void) {
  const qc    = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: guidedAiApi.upsert,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ai', 'guided-content'] });
      toast.success('Content saved', 'Students can now find this in AI search.');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Save failed', 'Could not save AI content. Please try again.');
    },
  });
}

// ─── useAISearch ──────────────────────────────────────────────────────────────
// Student-facing: semantic search against teacher-generated content.
// Returns the best match, or { found: false } when nothing is close enough.

interface UseAISearch {
  search:    (query: string) => Promise<void>;
  result:    { found: boolean; content?: { subject: string; topic: string; answer: string } } | null;
  isLoading: boolean;
}

export function useAISearch(): UseAISearch {
  const [result, setResult] = useState<UseAISearch['result']>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await guidedAiApi.search(query);

      if (!res.found || !res.result) {
        setResult({ found: false });
        return;
      }

      setResult({
        found:   true,
        content: {
          subject: res.result.content.subject,
          topic:   res.result.content.topic,
          answer:  res.result.content.content,
        },
      });

      analytics.event('ai_query', {
        feature:    'guided_search',
        found:      true,
        similarity: res.result.similarity,
      });
    } catch {
      toast.error('Search failed', 'AI search is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { search, result, isLoading: loading };
}
