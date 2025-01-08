'use client';

import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewersCount() {
  const [viewersCount, setViewersCount] = useState(null);

  useEffect(() => {
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
      }
    }

    fetchViewersCount();
  }, []);

  return (
    <>
      <Eye size={18} />
      <p>{viewersCount !== null ? `Viewers: ${viewersCount}` : 'Loading...'}</p>
    </>
  );
}
