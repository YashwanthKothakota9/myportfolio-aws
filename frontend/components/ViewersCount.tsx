'use client';

import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewersCount() {
  const [viewersCount, setViewersCount] = useState(null);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchViewersCount() {
      try {
        const response = await fetch(
          'https://nwl36ysqi7.execute-api.us-east-1.amazonaws.com/visitor-count',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          }
        );
        const data = await response.json();
        setViewersCount(data.visitor_count);
      } catch (error) {
        console.error('Error fetching visitor count:', error);
        setError(true);
      }
    }

    fetchViewersCount();

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  if (error) {
    return (
      <>
        <Eye size={18} />
        <p suppressHydrationWarning>Failed to load viewers count</p>
      </>
    );
  }

  return (
    <>
      <Eye size={18} />
      <p suppressHydrationWarning>
        {viewersCount !== null ? `Viewers: ${viewersCount}` : 'Loading...'}
      </p>
    </>
  );
}
