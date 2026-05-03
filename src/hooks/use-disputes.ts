'use client';

import { useState, useEffect, useCallback } from 'react';
import { disputeService } from '@/services/admin/dispute.service';
import type {
  Dispute,
  DisputeKPIs,
  DisputeReply,
  DisputeStatus,
  DisputeTab,
  DisputeTabCounts,
} from '@/services/admin/dispute.types';

export function useDisputes(tab: DisputeTab, search: string) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await disputeService.listDisputes(tab, search || undefined);
      setDisputes(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const updateStatus = useCallback(
    async (id: string, status: DisputeStatus) => {
      try {
        await disputeService.updateDisputeStatus(id, status);
        await fetch();
        return true;
      } catch {
        return false;
      }
    },
    [fetch],
  );

  const addReply = useCallback(
    async (id: string, message: string): Promise<DisputeReply | null> => {
      try {
        const reply = await disputeService.replyToDispute(id, message);
        await fetch();
        return reply;
      } catch {
        return null;
      }
    },
    [fetch],
  );

  return { disputes, loading, updateStatus, addReply, refetch: fetch };
}

export function useDisputeKPIs() {
  const [kpis, setKpis] = useState<DisputeKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await disputeService.getDisputeStats();
        setKpis(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { kpis, loading };
}

export function useDisputeTabCounts() {
  const [counts, setCounts] = useState<DisputeTabCounts | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await disputeService.getTabCounts();
        setCounts(data);
      } catch {
        // silent
      }
    })();
  }, []);

  return counts;
}
