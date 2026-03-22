'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useLocation(active: boolean) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendLocation = useCallback(async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (position) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('technicians')
        .update({
          current_lat: position.coords.latitude,
          current_lng: position.coords.longitude,
        })
        .eq('profile_id', user.id);
    });
  }, []);

  useEffect(() => {
    if (active) {
      sendLocation();
      intervalRef.current = setInterval(sendLocation, 2 * 60 * 1000); // Every 2 minutes
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, sendLocation]);

  return { sendLocation };
}
