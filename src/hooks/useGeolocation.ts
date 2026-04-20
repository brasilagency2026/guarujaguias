"use client";
import { useState, useCallback } from "react";

interface GeoState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null, lng: null, error: null, loading: false,
  });

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: "Geolocalização não suportada neste navegador" }));
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({ lat: pos.coords.latitude, lng: pos.coords.longitude, error: null, loading: false });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Permissão de localização negada",
          2: "Localização indisponível",
          3: "Tempo esgotado ao obter localização",
        };
        setState((s) => ({ ...s, error: messages[err.code] ?? "Erro ao obter localização", loading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, locate };
}
